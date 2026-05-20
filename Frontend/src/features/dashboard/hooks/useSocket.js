import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { updateSingleWebsiteStatus } from '../state/dashboard.slice';

export const useSocket = (websiteId = null) => {
  const dispatch = useDispatch();
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  // Read logged in user from Redux store to identify private room
  const user = useSelector(state => state.auth.user);
  const userId = user?.id || user?._id || user?.userId;

  useEffect(() => {
    if (!userId) return;

    // Connect to Backend Socket.IO Server with credentials
    // Note: since cookies hold the JWT session, the browser automatically forwards it.
    const socket = io('/', {
      withCredentials: true,
      autoConnect: false,
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;
    socket.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      console.log(`🔌 [SOCKET] Securely connected to Socket.IO. Authenticated session.`);
      
      // Join the secure dashboard room private to this user
      socket.emit('join-dashboard', userId);

      // Optionally join a specific website details room if provided
      if (websiteId) {
        socket.emit('subscribe-website', websiteId);
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
      console.log('🔌 [SOCKET] Securely disconnected from Socket.IO.');
    });

    // Handle real-time user-isolated updates
    socket.on('website-status-changed', (eventData) => {
      console.log('🔌 [SOCKET-EVENT] website-status-changed:', eventData);
      
      // Dispatch synchronous action to update Redux store instantly
      dispatch(updateSingleWebsiteStatus({
        websiteId: eventData.websiteId,
        status: eventData.status,
        responseTime: eventData.responseTime,
        lastChecked: eventData.timestamp
      }));
    });

    // Cleanup listeners and close connection on component unmount
    return () => {
      if (socket) {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('website-status-changed');
        socket.disconnect();
      }
    };
  }, [userId, websiteId, dispatch]);

  return { isConnected };
};
