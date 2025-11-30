// WebSocket utility functions
export class SocketManager {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.url);
        
        this.socket.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.socket.onmessage = (event) => {
          this.handleMessage(event);
        };

        this.socket.onclose = () => {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        };

        this.socket.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };

      } catch (error) {
        reject(error);
      }
    });
  }

  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      const listeners = this.listeners.get(data.type) || [];
      listeners.forEach(callback => callback(data.payload));
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  }

  on(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  off(eventType, callback) {
    const listeners = this.listeners.get(eventType);
    if (listeners) {
      const index = listeners.indexOf(callback);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    }
  }

  send(eventType, payload) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ type: eventType, payload }));
    } else {
      console.warn('WebSocket is not connected');
    }
  }

  handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = Math.min(1000 * this.reconnectAttempts, 5000);
      
      console.log(`Attempting to reconnect in ${delay}ms...`);
      setTimeout(() => this.connect(), delay);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.listeners.clear();
  }
}

// Mock WebSocket server for demonstration
export class MockSocketServer {
  constructor() {
    this.clients = new Set();
    this.messageHandlers = new Map();
  }

  connect(client) {
    this.clients.add(client);
    
    // Simulate connection established
    setTimeout(() => {
      client.onMessage({ data: JSON.stringify({ type: 'connection', payload: { status: 'connected' } }) });
    }, 100);

    // Simulate other users joining
    setTimeout(() => {
      client.onMessage({
        data: JSON.stringify({
          type: 'user_joined',
          payload: {
            id: 'mock-user-1',
            name: 'Designer',
            color: '#ef4444'
          }
        })
      });
    }, 500);
  }

  broadcast(message, excludeClient = null) {
    this.clients.forEach(client => {
      if (client !== excludeClient) {
        client.onMessage({ data: JSON.stringify(message) });
      }
    });
  }
}