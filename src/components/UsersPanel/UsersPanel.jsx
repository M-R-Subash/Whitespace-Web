import React from 'react';
import { useWhiteboard } from '../../contexts/WhiteboardContext';
import { Users, Share2, Circle } from 'lucide-react';

export function UsersPanel() {
  const { state } = useWhiteboard();

  const shareRoom = async () => {
    const roomUrl = `${window.location.origin}?room=${state.roomId || 'default'}`;
    try {
      await navigator.clipboard.writeText(roomUrl);
      alert('Room link copied to clipboard!');
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textArea = document.createElement('textarea');
      textArea.value = roomUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('Room link copied to clipboard!');
    }
  };

  const allUsers = [state.currentUser, ...state.users];

  return (
    <div className="w-64 bg-white border-l border-gray-200 p-4 flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center space-x-2">
          <Users size={20} />
          <span>Collaborators</span>
        </h3>
        <button
          onClick={shareRoom}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Share room"
        >
          <Share2 size={16} />
        </button>
      </div>

      <div className="space-y-3 flex-1">
        {/* Current User */}
        <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg border border-primary-200">
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: state.currentUser.color }}
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-800">
              {state.currentUser.name} (You)
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <Circle size={8} className="fill-green-500 text-green-500 mr-1" />
              Online
            </p>
          </div>
        </div>

        {/* Other Users */}
        {state.users.map(user => (
          <div key={user.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: user.color }}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-800">{user.name}</p>
              <p className="text-xs text-gray-500 flex items-center">
                <Circle size={8} className="fill-green-500 text-green-500 mr-1" />
                Active
              </p>
            </div>
          </div>
        ))}

        {state.users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users size={32} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">No other users in room</p>
            <p className="text-xs mt-1">Share the room to collaborate</p>
          </div>
        )}
      </div>

      {/* Room Info */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-xs text-gray-500 mb-1">Room ID</p>
        <p className="text-sm font-mono text-gray-800 truncate">
          {state.roomId || 'default-room'}
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {allUsers.length} user{allUsers.length !== 1 ? 's' : ''} online
        </p>
      </div>
    </div>
  );
}