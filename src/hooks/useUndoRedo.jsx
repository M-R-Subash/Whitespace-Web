import { useCallback } from 'react';
import { useWhiteboard } from '../contexts/WhiteboardContext';

export function useUndoRedo() {
  const { state, dispatch } = useWhiteboard();

  const canUndo = state.history.length > 0;
  const canRedo = state.future.length > 0;

  const undo = useCallback(() => {
    if (canUndo) {
      dispatch({ type: 'UNDO' });
    }
  }, [canUndo, dispatch]);

  const redo = useCallback(() => {
    if (canRedo) {
      dispatch({ type: 'REDO' });
    }
  }, [canRedo, dispatch]);

  const clearHistory = useCallback(() => {
    // This will be handled by the CLEAR_CANVAS action
    dispatch({ type: 'CLEAR_CANVAS' });
  }, [dispatch]);

  return {
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    historySize: state.history.length,
    futureSize: state.future.length
  };
}