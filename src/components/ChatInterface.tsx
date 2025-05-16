import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { suggestedQuestions } from '../data/questions';
import { Bot, Sparkles, Sun, Moon } from 'lucide-react';

interface Placeholders {
  input: Record<string, string>;
  suggestionsTitle: Record<string, string>;
  thinkingText: Record<string, string>;
  typingText: Record<string, string>;
}

const ChatInterface: React.FC = () => {
  const { 
    messages, 
    language, 
    isTyping, 
    showSuggestions, 
    sendMessage, 
    selectSuggestedQuestion, 
    toggleSuggestions 
  } = useChat();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  
  // Check user's preferred color scheme
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setDarkMode(mediaQuery.matches);
    
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  const placeholders: Placeholders = {
    input: {
      en: 'Ketik pesan kamu...',
      id: 'Ketik pesan kamu...'
    },
    suggestionsTitle: {
      en: 'Suggested Questions',
      id: 'Pertanyaan yang Disarankan'
    },
    thinkingText: {
      en: 'Thinking...',
      id: 'Memikirkan...'
    },
    typingText: {
      en: 'Thinking...',
      id: 'Memikirkan...'
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  const handleSendMessage = async (message: string) => {
    setIsWaitingForResponse(true);
    try {
      await sendMessage(message);
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const renderHeader = () => (
    <header className={`flex items-center justify-between p-4 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'} shadow-sm md:px-6 lg:px-8`}>
      <div className="flex items-center gap-3">
        <div>
          <h1 className={`font-semibold text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Amagi</h1>
          <p className={`text-xs font-semibold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            by AstByte
          </p>
        </div>
      </div>
    </header>
  );

  const renderTypingIndicator = () => {
    const dotAnimation = (
      <span className="flex items-center gap-1">
        {[0, 0.2, 0.4].map(delay => (
          <span 
            key={delay}
            className={`w-2 h-2 rounded-full animate-pulse ${
              isTyping ? (darkMode ? 'bg-purple-400' : 'bg-blue-500') : (darkMode ? 'bg-gray-500' : 'bg-gray-400')
            }`}
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </span>
    );

    return (
      <div className={`flex items-start gap-3 px-4 py-6 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'} md:px-6 lg:px-8`}>
        <div className={`${darkMode ? 'bg-purple-600' : 'bg-gradient-to-r from-blue-500 to-purple-600'} text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0`}>
          <Sparkles size={16} />
        </div>
        
        <div className="flex-1 space-y-2 overflow-hidden">
          <div className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>Amagi</div>
          
          <div className={`prose prose-sm max-w-none ${darkMode ? 'prose-invert' : 'prose-blue'}`}>
            <div className={`flex items-center gap-2 ${
              isWaitingForResponse ? 'italic' : ''
            } ${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              {dotAnimation}
              {isWaitingForResponse 
                ? placeholders.thinkingText[language] 
                : placeholders.typingText[language]}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderEmptyState = () => (
    <div className={`flex flex-col items-center justify-center h-full ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
      <Bot className="w-12 h-12 mb-4 opacity-30" />
      <p>{language === 'en' ? 'Start a conversation with Amagi' : 'Mulai percakapan dengan Amagi'}</p>
    </div>
  );

  const renderMessages = () => (
    <>
      {messages.map(message => (
        <ChatMessage 
          key={message.id} 
          message={message}
          isTyping={isTyping && messages[messages.length - 1].id === message.id}
          isWaitingForResponse={false}
          darkMode={darkMode}
        />
      ))}
      
      {(isWaitingForResponse || isTyping) && renderTypingIndicator()}
      
      {messages.length === 0 && !isWaitingForResponse && !isTyping && renderEmptyState()}
      
      <div ref={messagesEndRef} />
    </>
  );

  const renderInputSection = () => (
    <div className={`p-4 md:p-6 ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      <MessageInput 
        onSendMessage={handleSendMessage}
        placeholder={placeholders.input[language]}
        disabled={isTyping || isWaitingForResponse}
        darkMode={darkMode}
      />
      <p className={`text-xs mt-2 text-center ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
        {language === 'en' ? 'AI-powered responses for reference only' : 'Respon AI hanya untuk referensi'}
      </p>
    </div>
  );

  return (
    <div className={`flex flex-col h-screen ${darkMode ? 'bg-gray-900' : 'bg-white'}`}>
      {renderHeader()}
      
      <div className="flex-1 grid gap-0 overflow-hidden">
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden">
          <div className={`flex-1 overflow-y-auto ${darkMode ? 'divide-gray-700' : 'divide-gray-100'} divide-y`}>
            {renderMessages()}
          </div>
          
          {renderInputSection()}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;