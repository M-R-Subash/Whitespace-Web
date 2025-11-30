import React, { useRef, useEffect } from 'react';
import { useDrawing } from '../../hooks/useDrawing';
import { useWhiteboard } from '../../contexts/WhiteboardContext';
import { DrawingUtils } from '../../utils/drawingUtils';

export function Whiteboard() {
  const canvasRef = useRef(null);
  const { state } = useWhiteboard();
  const { startDrawing, draw, stopDrawing } = useDrawing(canvasRef);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      redrawCanvas();
    };

    const redrawCanvas = () => {
      DrawingUtils.redrawCanvas(canvas, state.drawings);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Redraw when drawings change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas && state.drawings.length > 0) {
      DrawingUtils.redrawCanvas(canvas, state.drawings);
    }
  }, [state.drawings]);

  const handleMouseDown = (e) => {
    startDrawing(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (state.isDrawing) {
      draw(e.clientX, e.clientY);
    }
  };

  const handleMouseUp = (e) => {
    stopDrawing(e.clientX, e.clientY);
  };

  const handleMouseLeave = () => {
    if (state.isDrawing) {
      stopDrawing();
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing(touch.clientX, touch.clientY);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (state.isDrawing) {
      const touch = e.touches[0];
      draw(touch.clientX, touch.clientY);
    }
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (e.touches.length === 0) {
      const touch = e.changedTouches[0];
      stopDrawing(touch.clientX, touch.clientY);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 relative overflow-hidden">
      <canvas
        id="whiteboard"
        ref={canvasRef}
        className="absolute inset-0 w-full h-full drawing-cursor bg-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      />
    </div>
  );
}