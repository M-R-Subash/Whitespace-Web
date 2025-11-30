import React, { useEffect, useState } from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';

export function UserCursor({ user, position }) {
  const [isVisible, setIsVisible] = useState(true);
  const { state } = useWhiteboard();

  // Hide cursor after inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [position]);

  useEffect(() => {
    setIsVisible(true);
  }, [position]);

  if (!position || !isVisible) return null;

  const isCurrentUser = user.id === state.currentUser.id;

  return (
    <div
      className="absolute pointer-events-none transition-all duration-100 z-40"
      style={{
        left: position.x,
        top: position.y,
        opacity: isVisible ? 1 : 0
      }}
    >
      {/* Cursor */}
      <div
        className="w-3 h-3 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2"
        style={{ backgroundColor: user.color }}
      />
      
      {/* User label */}
      <div
        className="absolute top-0 left-0 transform -translate-y-full -translate-x-1/2 bg-white px-2 py-1 rounded-lg shadow-sm border border-gray-200 text-xs font-medium whitespace-nowrap"
        style={{ color: user.color }}
      >
        {user.name}
        {isCurrentUser && ' (You)'}
      </div>
      
      {/* Drawing preview */}
      {user.isDrawing && (
        <div
          className="absolute top-2 left-2 w-2 h-2 rounded-full animate-ping"
          style={{ backgroundColor: user.color }}
        />
      )}
    </div>
  );
}

// Container for all user cursors
export function UserCursors() {
  const { state } = useWhiteboard();
  const [cursorPositions, setCursorPositions] = useState({});

  // Simulate cursor movements for demo
  useEffect(() => {
    const interval = setInterval(() => {
      const newPositions = {};
      
      state.users.forEach(user => {
        if (user.id !== state.currentUser.id) {
          newPositions[user.id] = {
            x: 100 + Math.random() * 600,
            y: 100 + Math.random() * 400
          };
        }
      });

      setCursorPositions(newPositions);
    }, 1000);

    return () => clearInterval(interval);
  }, [state.users, state.currentUser.id]);

  // Track current user's cursor
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = document.getElementById('whiteboard');
      if (canvas) {
        const rect = canvas.getBoundingClientRect();
        setCursorPositions(prev => ({
          ...prev,
          [state.currentUser.id]: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          }
        }));
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.currentUser.id]);

  return (
    <div className="absolute inset-0 pointer-events-none z-30">
      {state.users.concat(state.currentUser).map(user => (
        <UserCursor
          key={user.id}
          user={user}
          position={cursorPositions[user.id]}
        />
      ))}
    </div>
  );
}