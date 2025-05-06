import React from 'react';
import { ChatProvider } from './context/ChatContext';
import ChatInterface from './components/ChatInterface';

function App() {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
}

export default App;