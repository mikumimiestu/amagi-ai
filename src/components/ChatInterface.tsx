import React, { useRef, useEffect, useState } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from './ChatMessage';
import MessageInput from './MessageInput';
import { suggestedQuestions } from '../data/questions';
import { MessageSquarePlus, Bot, MessagesSquare } from 'lucide-react';

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
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);
  
  // Handle sending message and set waiting state
  const handleSendMessage = async (message: string) => {
    setIsWaitingForResponse(true);
    await sendMessage(message);
    setIsWaitingForResponse(false);
  };

  // Get placeholders based on language
  const placeholders = {
    input: {
      en: 'Type your question here...',
      id: 'Ketik pertanyaan Anda di sini...'
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
      en: '',
      id: ''
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b shadow-sm bg-white md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-600 text-white w-10 h-10 rounded-full flex items-center justify-center">
            <img src="/amagi2.png" alt="Bot Icon" className="w-full h-full object-cover rounded-full" />
          </div>
          <div>
            <h1 className="font-semibold text-xl text-gray-900">Amagi</h1>
            <p className="text-xs font-semibold text-gray-500">
              {language === 'en' ? 'Model Lyra 1.0 Prime' : 'Model Lyra 1.0 Prime'}
            </p>
          </div>
        </div>
      </header>
      
      {/* Chat area with grid layout */}
      <div className="flex-1 grid gap-0 overflow-hidden">
        {/* Messages section */}
        <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col overflow-hidden">
          {/* Message list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
            {messages.map(message => (
              <ChatMessage 
                key={message.id} 
                message={message}
                isTyping={isTyping && messages[messages.length - 1].id === message.id}
                isWaitingForResponse={false} // Tidak digunakan untuk pesan yang sudah ada
              />
            ))}
            
            {/* Thinking/Typing indicator */}
            {(isWaitingForResponse || isTyping) && (
              <div className="flex items-start gap-3 px-4 py-6 bg-gray-50 md:px-6 lg:px-8">
                <div className="bg-gradient-to-r from-blue-300 to-purple-200 text-white w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                  Ly
                </div>
                
                <div className="flex-1 space-y-2 overflow-hidden">
                  <div className="font-medium">Amagi</div>
                  
                  <div className="prose prose-sm max-w-none prose-blue">
                    {isWaitingForResponse && !isTyping ? (
                      <div className="italic text-gray-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </span>
                        {placeholders.thinkingText[language]}
                      </div>
                    ) : isTyping && !messages.some(m => m.sender === 'bot' && m.id === 'typing') ? (
                      <div className="text-gray-500 flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
                          <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></span>
                        </span>
                        {placeholders.typingText[language]}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            )}
            
            {messages.length === 0 && !isWaitingForResponse && !isTyping && (
              <div className="flex items-center justify-center h-full text-gray-400">
                {language === 'en' ? 'No messages yet' : 'Belum ada pesan'}
              </div>
            )}
            
            {/* Invisible div for auto-scrolling */}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Input section */}
          <div className="p-4 md:p-6">
            <MessageInput 
              onSendMessage={handleSendMessage}
              placeholder={placeholders.input[language]}
              disabled={isTyping || isWaitingForResponse}
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              {language === 'en' 
                ? 'AI-generated, for reference only' 
                : 'AI-generated, for reference only'}
            </p>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default ChatInterface;