import { useCallback, useRef } from 'react';
import { useWhiteboard } from '../contexts/WhiteboardContext';
import { DrawingUtils } from '../utils/drawingUtils';

export function useDrawing(canvasRef) {
  const { state, dispatch } = useWhiteboard();
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef(null);
  const startPointRef = useRef(null);
  const previewContextRef = useRef(null);
  const drawingBatchRef = useRef([]);
  const batchTimeoutRef = useRef(null);

  const getCanvasPoint = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }, [canvasRef]);

  const initializePreview = useCallback(() => {
    const canvas = canvasRef.current;
    if (!previewContextRef.current) {
      const previewCanvas = document.createElement('canvas');
      previewCanvas.width = canvas.width;
      previewCanvas.height = canvas.height;
      previewCanvas.style.position = 'absolute';
      previewCanvas.style.left = '0';
      previewCanvas.style.top = '0';
      previewCanvas.style.pointerEvents = 'none';
      canvas.parentElement.appendChild(previewCanvas);
      previewContextRef.current = previewCanvas.getContext('2d');
    }
  }, [canvasRef]);

  const clearPreview = useCallback(() => {
    if (previewContextRef.current) {
      const ctx = previewContextRef.current;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  }, []);

  const batchDrawings = useCallback(() => {
    if (drawingBatchRef.current.length > 0) {
      dispatch({ 
        type: 'ADD_DRAWING', 
        payload: drawingBatchRef.current 
      });
      drawingBatchRef.current = [];
    }
  }, [dispatch]);

  const addToBatch = useCallback((drawing) => {
    drawingBatchRef.current.push(drawing);
    
    // Clear existing timeout
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
    }
    
    // Batch drawings to reduce dispatches
    batchTimeoutRef.current = setTimeout(batchDrawings, 16); // ~60fps
  }, [batchDrawings]);

  const startDrawing = useCallback((clientX, clientY) => {
    isDrawingRef.current = true;
    const point = getCanvasPoint(clientX, clientY);
    lastPointRef.current = point;
    startPointRef.current = point;
    
    dispatch({ type: 'SET_DRAWING', payload: true });
    initializePreview();

    // For freehand tools, start with initial point
    if (state.tool === 'pen' || state.tool === 'eraser') {
      const drawing = DrawingUtils.createDrawingData(
        [point],
        state.tool,
        state.tool === 'eraser' ? '#ffffff' : state.color,
        state.brushSize,
        state.currentUser.id
      );
      addToBatch(drawing);
    }
  }, [getCanvasPoint, dispatch, initializePreview, state, addToBatch]);

  const draw = useCallback((clientX, clientY) => {
    if (!isDrawingRef.current) return;

    const currentPoint = getCanvasPoint(clientX, clientY);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (state.tool === 'pen') {
      // Freehand drawing - continuous lines
      DrawingUtils.drawLine(ctx, lastPointRef.current, currentPoint, state.color, state.brushSize);
      
      const drawing = DrawingUtils.createDrawingData(
        [lastPointRef.current, currentPoint],
        state.tool,
        state.color,
        state.brushSize,
        state.currentUser.id
      );
      
      addToBatch(drawing);
      lastPointRef.current = currentPoint;
    } 
    else if (state.tool === 'eraser') {
      // Eraser tool - continuous erasing
      DrawingUtils.erase(ctx, lastPointRef.current, currentPoint, state.brushSize);
      
      const drawing = DrawingUtils.createDrawingData(
        [lastPointRef.current, currentPoint],
        state.tool,
        '#ffffff',
        state.brushSize,
        state.currentUser.id
      );
      
      addToBatch(drawing);
      lastPointRef.current = currentPoint;
    }
    else if (['rectangle', 'circle', 'line'].includes(state.tool)) {
      // Shape tools - show preview only
      clearPreview();
      const previewCtx = previewContextRef.current;
      
      if (previewCtx) {
        previewCtx.clearRect(0, 0, previewCtx.canvas.width, previewCtx.canvas.height);
        
        // Draw preview with dashed lines
        previewCtx.setLineDash([5, 5]);
        previewCtx.strokeStyle = state.color;
        previewCtx.lineWidth = state.brushSize;
        
        if (state.tool === 'rectangle') {
          const width = currentPoint.x - startPointRef.current.x;
          const height = currentPoint.y - startPointRef.current.y;
          previewCtx.strokeRect(startPointRef.current.x, startPointRef.current.y, width, height);
        } 
        else if (state.tool === 'circle') {
          const radius = Math.sqrt(
            Math.pow(currentPoint.x - startPointRef.current.x, 2) + 
            Math.pow(currentPoint.y - startPointRef.current.y, 2)
          );
          previewCtx.beginPath();
          previewCtx.arc(startPointRef.current.x, startPointRef.current.y, radius, 0, 2 * Math.PI);
          previewCtx.stroke();
        }
        else if (state.tool === 'line') {
          previewCtx.beginPath();
          previewCtx.moveTo(startPointRef.current.x, startPointRef.current.y);
          previewCtx.lineTo(currentPoint.x, currentPoint.y);
          previewCtx.stroke();
        }
        
        previewCtx.setLineDash([]);
      }
    }
  }, [getCanvasPoint, state, canvasRef, clearPreview, addToBatch]);

  const stopDrawing = useCallback((clientX, clientY) => {
    if (!isDrawingRef.current) return;

    // Process any remaining batched drawings
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      batchDrawings();
    }

    const endPoint = clientX && clientY ? getCanvasPoint(clientX, clientY) : lastPointRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Finalize shape drawings
    if (['rectangle', 'circle', 'line'].includes(state.tool) && startPointRef.current) {
      clearPreview();
      
      // Draw the final shape
      if (state.tool === 'rectangle') {
        DrawingUtils.drawRectangle(ctx, startPointRef.current, endPoint, state.color, state.brushSize);
      } else if (state.tool === 'circle') {
        DrawingUtils.drawCircle(ctx, startPointRef.current, endPoint, state.color, state.brushSize);
      } else if (state.tool === 'line') {
        DrawingUtils.drawLineTool(ctx, startPointRef.current, endPoint, state.color, state.brushSize);
      }

      // Add to drawings
      const drawing = DrawingUtils.createDrawingData(
        [startPointRef.current, endPoint],
        state.tool,
        state.color,
        state.brushSize,
        state.currentUser.id
      );
      
      dispatch({ type: 'ADD_DRAWING', payload: [drawing] });
    }

    // Cleanup
    isDrawingRef.current = false;
    lastPointRef.current = null;
    startPointRef.current = null;
    dispatch({ type: 'SET_DRAWING', payload: false });
  }, [getCanvasPoint, state, dispatch, canvasRef, clearPreview, batchDrawings]);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    clearPreview();
    
    // Clear any pending batches
    if (batchTimeoutRef.current) {
      clearTimeout(batchTimeoutRef.current);
      drawingBatchRef.current = [];
    }
    
    dispatch({ type: 'SET_DRAWINGS', payload: [] });
  }, [canvasRef, dispatch, clearPreview]);

  return {
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    isDrawing: isDrawingRef.current
  };
}