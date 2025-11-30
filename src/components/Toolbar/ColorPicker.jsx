import React, { useState } from 'react';
import { Palette, Check } from 'lucide-react';
import { Modal } from '../Shared/Modal';
import { Button } from '../Shared/Button';

export function ColorPicker({ color, onChange, className = '' }) {
  const [isOpen, setIsOpen] = useState(false);

  const predefinedColors = [
    // Reds
    '#dc2626', '#ef4444', '#f87171', '#fca5a5',
    // Blues
    '#1d4ed8', '#3b82f6', '#60a5fa', '#93c5fd',
    // Greens
    '#059669', '#10b981', '#34d399', '#6ee7b7',
    // Yellows/Oranges
    '#d97706', '#f59e0b', '#fbbf24', '#fcd34d',
    // Purples
    '#7c3aed', '#8b5cf6', '#a78bfa', '#c4b5fd',
    // Pinks
    '#db2777', '#ec4899', '#f472b6', '#f9a8d4',
    // Grays & Black
    '#000000', '#374151', '#6b7280', '#d1d5db', '#ffffff'
  ];

  const handleColorSelect = (selectedColor) => {
    onChange(selectedColor);
    setIsOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 p-2 border-2 border-gray-200 rounded-lg hover:border-gray-300 transition-colors ${className}`}
      >
        <Palette size={18} className="text-gray-600" />
        <div 
          className="w-6 h-6 rounded-full border border-gray-300"
          style={{ backgroundColor: color }}
        />
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Choose Color"
        size="sm"
      >
        <div className="p-6">
          {/* Current Color Preview */}
          <div className="flex items-center justify-center mb-6 p-4 bg-gray-50 rounded-lg">
            <div 
              className="w-16 h-16 rounded-full border-4 border-gray-300 shadow-lg"
              style={{ backgroundColor: color }}
            />
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-8 gap-2">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                onClick={() => handleColorSelect(presetColor)}
                className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 ${
                  color === presetColor ? 'border-gray-800 scale-110' : 'border-gray-300'
                }`}
                style={{ backgroundColor: presetColor }}
                title={presetColor}
              >
                {color === presetColor && (
                  <Check size={14} className="text-white m-auto" />
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Custom Color
            </label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="w-12 h-12 rounded-lg border-0 cursor-pointer"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => onChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="#000000"
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}