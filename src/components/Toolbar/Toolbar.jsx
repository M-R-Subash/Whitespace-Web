import React from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';
import { useUndoRedo } from '../../hooks/useUndoRedo';
import { 
  Pen, 
  Square, 
  Circle, 
  Eraser, 
  Trash2, 
  Minus, 
  Plus, 
  Minus as LineIcon,
  Undo2,
  Redo2,
  Download,
  Upload
} from 'lucide-react';
import { ColorPicker } from './ColorPicker';

export function Toolbar() {
  const { state, dispatch } = useWhiteboard();
  const { undo, redo, canUndo, canRedo } = useUndoRedo();

  const tools = [
    { id: 'pen', icon: Pen, label: 'Pen' },
    { id: 'rectangle', icon: Square, label: 'Rectangle' },
    { id: 'circle', icon: Circle, label: 'Circle' },
    { id: 'line', icon: LineIcon, label: 'Line' },
    { id: 'eraser', icon: Eraser, label: 'Eraser' },
  ];

  const colors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#000000'
  ];

  const brushSizes = [1, 3, 5, 8, 12];

  const setTool = (tool) => {
    dispatch({ type: 'SET_TOOL', payload: tool });
  };

  const setColor = (color) => {
    dispatch({ type: 'SET_COLOR', payload: color });
  };

  const setBrushSize = (size) => {
    dispatch({ type: 'SET_BRUSH_SIZE', payload: size });
  };

  const clearCanvas = () => {
    const canvas = document.getElementById('whiteboard');
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    dispatch({ type: 'CLEAR_CANVAS' });
  };

  const exportDrawing = () => {
    const canvas = document.getElementById('whiteboard');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `whiteboard-${Date.now()}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const importDrawing = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.getElementById('whiteboard');
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          // Note: This doesn't add to drawings array, just displays the image
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left Section - Tools & Colors */}
        <div className="flex items-center space-x-4">
          {/* Tools */}
          <div className="flex items-center space-x-2">
            {tools.map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTool(id)}
                className={`p-2 rounded-lg border-2 transition-all ${
                  state.tool === id 
                    ? 'border-primary-500 bg-primary-50 text-primary-600' 
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
                title={label}
              >
                <Icon size={20} />
              </button>
            ))}
          </div>

          {/* Color Picker */}
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Color:</span>
            <ColorPicker color={state.color} onChange={setColor} />
            <div className="flex items-center space-x-1">
              {colors.map(color => (
                <button
                  key={color}
                  onClick={() => setColor(color)}
                  className={`w-6 h-6 rounded-full border-2 transition-transform ${
                    state.color === color ? 'border-gray-800 scale-110' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color }}
                  title={color}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Center Section - Brush Size */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setBrushSize(Math.max(1, state.brushSize - 1))}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800"
              disabled={state.brushSize <= 1}
            >
              <Minus size={16} />
            </button>
            <div className="flex items-center space-x-1">
              {brushSizes.map(size => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-4 h-4 rounded-full transition-transform ${
                    state.brushSize === size 
                      ? 'bg-primary-500 scale-125' 
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  title={`Size: ${size}px`}
                />
              ))}
            </div>
            <button
              onClick={() => setBrushSize(state.brushSize + 1)}
              className="p-1 rounded hover:bg-gray-100 text-gray-600 hover:text-gray-800"
            >
              <Plus size={16} />
            </button>
          </div>

          {/* Current brush preview */}
          <div 
            className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white"
          >
            <div
              className="rounded-full"
              style={{
                width: state.brushSize,
                height: state.brushSize,
                backgroundColor: state.tool === 'eraser' ? 'transparent' : state.color,
                border: state.tool === 'eraser' ? '2px solid #ef4444' : 'none'
              }}
            />
            {state.tool === 'eraser' && (
              <div className="absolute text-xs font-bold text-red-500">E</div>
            )}
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-2">
          {/* Undo/Redo */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className={`p-2 rounded-lg border-2 transition-all ${
                canUndo 
                  ? 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800' 
                  : 'border-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={18} />
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className={`p-2 rounded-lg border-2 transition-all ${
                canRedo 
                  ? 'border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800' 
                  : 'border-gray-100 text-gray-400 cursor-not-allowed'
              }`}
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={18} />
            </button>
          </div>

          {/* Import/Export */}
          <div className="flex items-center space-x-1 border-r border-gray-200 pr-3">
            <label className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 transition-all cursor-pointer">
              <Upload size={18} />
              <input
                type="file"
                accept="image/*"
                onChange={importDrawing}
                className="hidden"
              />
            </label>
            <button
              onClick={exportDrawing}
              className="p-2 rounded-lg border-2 border-gray-200 hover:border-gray-300 text-gray-600 hover:text-gray-800 transition-all"
              title="Export as PNG"
            >
              <Download size={18} />
            </button>
          </div>

          {/* Clear */}
          <button
            onClick={clearCanvas}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            title="Clear Canvas"
          >
            <Trash2 size={18} />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Current Tool Info */}
      <div className="mt-2 text-sm text-gray-500 flex items-center justify-between">
        <div>
          Current tool: <span className="font-medium capitalize">{state.tool}</span>
          {state.tool === 'eraser' && ' - Click and drag to erase'}
          {['rectangle', 'circle', 'line'].includes(state.tool) && ' - Click and drag to draw'}
        </div>
        <div className="text-xs text-gray-400">
          History: {state.history.length} steps • Redo: {state.future.length} steps
        </div>
      </div>
    </div>
  );
}