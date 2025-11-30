import React from 'react';
import { Pen, Square, Circle, Eraser, Minus, Type } from 'lucide-react';
import { Button } from '../Shared/Button';

const tools = [
  {
    id: 'pen',
    icon: Pen,
    label: 'Pen',
    description: 'Freehand drawing'
  },
  {
    id: 'rectangle',
    icon: Square,
    label: 'Rectangle',
    description: 'Draw rectangles'
  },
  {
    id: 'circle',
    icon: Circle,
    label: 'Circle',
    description: 'Draw circles and ellipses'
  },
  {
    id: 'line',
    icon: Minus,
    label: 'Line',
    description: 'Draw straight lines'
  },
  {
    id: 'text',
    icon: Type,
    label: 'Text',
    description: 'Add text to canvas'
  },
  {
    id: 'eraser',
    icon: Eraser,
    label: 'Eraser',
    description: 'Erase parts of the drawing'
  }
];

export function DrawingTools({ currentTool, onToolChange, className = '' }) {
  return (
    <div className={`flex flex-col space-y-2 ${className}`}>
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentTool === tool.id;
        
        return (
          <Button
            key={tool.id}
            variant={isActive ? 'primary' : 'ghost'}
            onClick={() => onToolChange(tool.id)}
            className="justify-start p-3"
            title={tool.description}
            icon={Icon}
          >
            <span className="ml-2">{tool.label}</span>
          </Button>
        );
      })}
    </div>
  );
}

// Compact horizontal version
export function DrawingToolsCompact({ currentTool, onToolChange, className = '' }) {
  return (
    <div className={`flex space-x-1 p-2 bg-white rounded-lg border border-gray-200 ${className}`}>
      {tools.map((tool) => {
        const Icon = tool.icon;
        const isActive = currentTool === tool.id;
        
        return (
          <Button
            key={tool.id}
            variant={isActive ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onToolChange(tool.id)}
            className="p-2"
            title={tool.label}
            icon={Icon}
          />
        );
      })}
    </div>
  );
}