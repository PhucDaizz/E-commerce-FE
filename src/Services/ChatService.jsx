// services/ChatService.js
import * as signalR from '@microsoft/signalr';

class ChatService {
  constructor() {
    this.connection = null;
    this.isConnected = false;
    this.callbacks = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  async startConnection(token) {
    if (this.connection && this.isConnected) {
      console.log('Already connected to SignalR');
      return;
    }

    if (this.connection) {
      await this.stopConnection();
    }

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(`${import.meta.env.VITE_BASE_API_URL}/chatHub`, {
        accessTokenFactory: () => token,
        withCredentials: false
      })
      .withAutomaticReconnect([0, 2000, 10000, 30000]) // Custom reconnect delays
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.setupConnectionEventHandlers();

    try {
      await this.connection.start();
      this.isConnected = true;
      this.reconnectAttempts = 0;
      console.log('SignalR connected successfully');
      
      // Notify listeners about successful connection
      this.triggerCallback('ConnectionEstablished');
      
    } catch (error) {
      console.error('SignalR connection failed:', error);
      this.isConnected = false;
      throw error;
    }
  }

  setupConnectionEventHandlers() {
    this.connection.onreconnecting((error) => {
      console.log('SignalR reconnecting...', error);
      this.isConnected = false;
      this.triggerCallback('ConnectionReconnecting');
    });

    this.connection.onreconnected((connectionId) => {
      console.log('SignalR reconnected with connection ID:', connectionId);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      this.triggerCallback('ConnectionReconnected');
    });

    this.connection.onclose((error) => {
      console.log('SignalR connection closed', error);
      this.isConnected = false;
      
      if (error) {
        this.reconnectAttempts++;
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
          this.triggerCallback('ConnectionError', error.toString());
        } else {
          console.error('Max reconnection attempts reached');
          this.triggerCallback('ConnectionFailed', 'Maximum reconnection attempts reached');
        }
      }
      
      this.triggerCallback('ConnectionClosed', error?.toString());
    });
  }

  async stopConnection() {
    if (this.connection) {
      try {
        await this.connection.stop();
      } catch (error) {
        console.error('Error stopping connection:', error);
      } finally {
        this.connection = null;
        this.isConnected = false;
        this.callbacks.clear();
      }
    }
  }

  // Enhanced event registration with error handling
  on(methodName, callback) {
    if (!this.connection) {
      console.warn(`Cannot register ${methodName} - no connection available`);
      return;
    }

    try {
      this.connection.on(methodName, (...args) => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in ${methodName} callback:`, error);
        }
      });
      
      // Store callback for cleanup
      if (!this.callbacks.has(methodName)) {
        this.callbacks.set(methodName, []);
      }
      this.callbacks.get(methodName).push(callback);
      
    } catch (error) {
      console.error(`Error registering ${methodName}:`, error);
    }
  }

  // Enhanced event removal
  off(methodName, callback = null) {
    if (this.connection) {
      try {
        if (callback) {
          this.connection.off(methodName, callback);
        } else {
          this.connection.off(methodName);
        }
      } catch (error) {
        console.error(`Error removing ${methodName} listener:`, error);
      }
    }
    
    if (this.callbacks.has(methodName)) {
      if (callback) {
        const callbacks = this.callbacks.get(methodName);
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      } else {
        this.callbacks.delete(methodName);
      }
    }
  }

  // Helper method to trigger internal callbacks
  triggerCallback(eventName, ...args) {
    if (this.callbacks.has(eventName)) {
      this.callbacks.get(eventName).forEach(callback => {
        try {
          callback(...args);
        } catch (error) {
          console.error(`Error in ${eventName} internal callback:`, error);
        }
      });
    }
  }

  // Enhanced invoke with retry mechanism
  async invoke(methodName, ...args) {
    if (!this.connection || !this.isConnected) {
      throw new Error('SignalR connection not available');
    }

    try {
      return await this.connection.invoke(methodName, ...args);
    } catch (error) {
      console.error(`Error invoking ${methodName}:`, error);
      
      // If connection error, try to reconnect once
      if (error.message.includes('connection') && !this.isConnected) {
        console.log('Attempting to reconnect before retry...');
        try {
          await this.connection.start();
          this.isConnected = true;
          return await this.connection.invoke(methodName, ...args);
        } catch (retryError) {
          console.error('Retry after reconnect failed:', retryError);
          throw retryError;
        }
      }
      
      throw error;
    }
  }

  // Client methods with enhanced error handling
  async clientRequestChat(initialMessage) {
    if (!initialMessage?.trim()) {
      throw new Error('Initial message cannot be empty');
    }
    
    return await this.invoke('ClientRequestChat', initialMessage.trim());
  }

  async sendMessage(conversationId, messageContent) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    if (!messageContent?.trim()) {
      throw new Error('Message content cannot be empty');
    }
    
    return await this.invoke('SendMessage', conversationId, messageContent.trim());
  }

  // Admin methods with enhanced error handling
  async adminAcceptChat(conversationId) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    return await this.invoke('AdminAcceptChat', conversationId);
  }

  async adminCloseChat(conversationId) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    return await this.invoke('AdminCloseChat', conversationId);
  }

  // New method to request chat history (if backend supports it)
  async requestChatHistory(conversationId) {
    if (!conversationId) {
      throw new Error('Conversation ID is required');
    }
    
    return await this.invoke('RequestChatHistory', conversationId);
  }

  async adminRequestChatHistory (conversationId)  {
    if (!conversationId) {
      throw new Error('ChatService: AdminRequestChatHistory - Conversation ID is required');
    }
    await this.invoke('AdminRequestChatHistory', conversationId);
  }

  // Connection state helpers
  getConnectionState() {
    return this.connection ? this.connection.state : 'Disconnected';
  }

  isConnectionActive() {
    return this.isConnected && this.connection?.state === signalR.HubConnectionState.Connected;
  }

  // Method to manually trigger reconnection
  async reconnect(token) {
    console.log('Manual reconnection requested');
    await this.stopConnection();
    await this.startConnection(token);
  }

  // Cleanup method
  dispose() {
    this.callbacks.clear();
    if (this.connection) {
      this.stopConnection();
    }
  }
}

// Create singleton instance
export const chatService = new ChatService();

// Export class for testing or multiple instances if needed
export { ChatService };