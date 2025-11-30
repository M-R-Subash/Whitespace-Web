import { useEffect, useRef } from 'react';
import { useWhiteboard } from '../contexts/WhiteboardContext';

export function useWebSocket() {
  const { dispatch } = useWhiteboard();
  const isInitializedRef = useRef(false);
  const mockUsersRef = useRef([
    {
      id: 'user2',
      name: 'Designer',
      color: '#ef4444',
      isOnline: true
    },
    {
      id: 'user3', 
      name: 'Developer',
      color: '#10b981',
      isOnline: true
    }
  ]);

  useEffect(() => {
    // Prevent multiple initializations
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    console.log('Connecting to collaborative server...');
    
    // Add mock users after a delay
    const userTimer = setTimeout(() => {
      mockUsersRef.current.forEach(user => {
        dispatch({ type: 'ADD_USER', payload: user });
      });
    }, 1000);

    // Simulate receiving drawings from other users (less frequent)
    const drawingInterval = setInterval(() => {
      // This would normally check for new drawings from server
      // For now, we'll just keep it minimal
    }, 5000); // Reduced frequency

    // Simulate user activity (less frequent)
    const activityInterval = setInterval(() => {
      mockUsersRef.current.forEach(user => {
        dispatch({ 
          type: 'ADD_USER', 
          payload: { 
            ...user, 
            lastActive: Date.now() 
          } 
        });
      });
    }, 10000); // Reduced frequency

    return () => {
      clearTimeout(userTimer);
      clearInterval(drawingInterval);
      clearInterval(activityInterval);
    };
  }, [dispatch]); // Only depend on dispatch

  const sendDrawing = (drawing) => {
    // In real implementation, send via WebSocket
    console.log('Sending drawing:', drawing);
  };

  const joinRoom = (roomId) => {
    console.log('Joining room:', roomId);
    dispatch({ type: 'SET_ROOM_ID', payload: roomId });
  };

  const leaveRoom = () => {
    console.log('Leaving room');
    dispatch({ type: 'SET_ROOM_ID', payload: null });
  };

  return { 
    sendDrawing, 
    joinRoom, 
    leaveRoom,
    isConnected: true 
  };
}