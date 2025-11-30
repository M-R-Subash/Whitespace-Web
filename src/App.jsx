import React, { useEffect } from 'react';
import { WhiteboardProvider } from './contexts/WhiteboardContext';
import { Whiteboard } from './components/Whiteboard/Whiteboard';
import { Toolbar } from './components/Toolbar/Toolbar';
import { UsersPanel } from './components/UsersPanel/UsersPanel';
import { useWebSocket } from './hooks/useWebSocket';
import { useUndoRedo } from './hooks/useUndoRedo';

function AppContent() {
  useWebSocket();
  const { undo, redo } = useUndoRedo();

  // Add keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Collaborative Whiteboard</h1>
            <p className="text-sm text-gray-600">Real-time drawing with multiple users</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Connected</span>
            </div>
            <div className="text-xs text-gray-500">
              Undo: Ctrl+Z • Redo: Ctrl+Y
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Whiteboard Area */}
        <div className="flex-1 flex flex-col">
          <Toolbar />
          <Whiteboard />
        </div>

        {/* Users Panel */}
        <UsersPanel />
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div>
            Draw together in real-time. Changes are synchronized across all users.
          </div>
          <div className="flex items-center space-x-4">
            <span>Tools: Pen, Shapes, Eraser</span>
            <span>•</span>
            <span>Undo/Redo: Ctrl+Z/Y</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <WhiteboardProvider>
      <AppContent />
    </WhiteboardProvider>
  );
}

export default App;