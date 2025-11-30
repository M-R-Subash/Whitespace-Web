import React, { createContext, useContext, useReducer } from 'react';

const WhiteboardContext = createContext();

const initialState = {
  tool: 'pen',
  color: '#3b82f6',
  brushSize: 3,
  users: [],
  drawings: [],
  isDrawing: false,
  roomId: null,
  currentUser: {
    id: Math.random().toString(36).substr(2, 9),
    name: `User${Math.floor(Math.random() * 1000)}`,
    color: `#${Math.floor(Math.random()*16777215).toString(16)}`
  },
  // Undo/Redo states
  history: [],
  future: [],
  maxHistorySize: 50 // Limit history to prevent memory issues
};

function whiteboardReducer(state, action) {
  switch (action.type) {
    case 'SET_TOOL':
      return { ...state, tool: action.payload };
    case 'SET_COLOR':
      return { ...state, color: action.payload };
    case 'SET_BRUSH_SIZE':
      return { ...state, brushSize: action.payload };
    case 'ADD_DRAWING':
      const newDrawings = Array.isArray(action.payload) 
        ? action.payload 
        : [action.payload];
      return { 
        ...state, 
        drawings: [...state.drawings, ...newDrawings],
        // When adding new drawings, clear redo future and save to history
        future: [],
        history: [
          ...state.history.slice(-state.maxHistorySize + 1),
          state.drawings
        ]
      };
    case 'SET_DRAWINGS':
      return { 
        ...state, 
        drawings: action.payload,
        // When setting drawings directly, update history
        future: [],
        history: [
          ...state.history.slice(-state.maxHistorySize + 1),
          state.drawings
        ]
      };
    case 'CLEAR_CANVAS':
      return {
        ...state,
        drawings: [],
        future: [],
        history: [
          ...state.history.slice(-state.maxHistorySize + 1),
          state.drawings
        ]
      };
    case 'UNDO':
      if (state.history.length === 0) return state;
      
      const previous = state.history[state.history.length - 1];
      const newHistory = state.history.slice(0, -1);
      
      return {
        ...state,
        drawings: previous,
        history: newHistory,
        future: [state.drawings, ...state.future]
      };
    case 'REDO':
      if (state.future.length === 0) return state;
      
      const next = state.future[0];
      const newFuture = state.future.slice(1);
      
      return {
        ...state,
        drawings: next,
        history: [...state.history, state.drawings],
        future: newFuture
      };
    case 'ADD_USER':
      return { 
        ...state, 
        users: [...state.users.filter(u => u.id !== action.payload.id), action.payload]
      };
    case 'REMOVE_USER':
      return { 
        ...state, 
        users: state.users.filter(user => user.id !== action.payload) 
      };
    case 'SET_ROOM_ID':
      return { ...state, roomId: action.payload };
    case 'SET_DRAWING':
      return { ...state, isDrawing: action.payload };
    default:
      return state;
  }
}

export function WhiteboardProvider({ children }) {
  const [state, dispatch] = useReducer(whiteboardReducer, initialState);

  return (
    <WhiteboardContext.Provider value={{ state, dispatch }}>
      {children}
    </WhiteboardContext.Provider>
  );
}

export function useWhiteboard() {
  const context = useContext(WhiteboardContext);
  if (!context) {
    throw new Error('useWhiteboard must be used within a WhiteboardProvider');
  }
  return context;
}