import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import CodeBlock from './CodeBlock';

interface ChatMessageProps {
  message: Message;
  isTyping: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isTyping }) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [showThinkingMessage, setShowThinkingMessage] = useState(false);
  const isBot = message.sender === 'bot';
  
  // Function to extract code blocks from message content
  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(javascript|html|python|css|tailwind|java|sql|jsx|tsx|dart|php|ruby|kotlin|rush|r|c|cpp|fortran|typescript|json)\n([\s\S]*?)\n```/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      parts.push({
        type: 'code',
        language: match[1],
        content: match[2].trim()
      });
      lastIndex = match.index + match[0].length;
    }
    
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    return parts;
  };

  // Enhanced formatting function
  const parseFormatting = (text: string) => {
    // Bold
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>');
    // Italic
    text = text.replace(/\*(.*?)\*/g, '<em class="italic">$1</em>');
    // Underline
    text = text.replace(/__(.*?)__/g, '<u class="underline">$1</u>');
    // Strikethrough
    text = text.replace(/~~(.*?)~~/g, '<s class="line-through">$1</s>');
    // Inline code
    text = text.replace(/`(.*?)`/g, '<code class="font-mono bg-gray-100 dark:bg-gray-700 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Lists
    text = text.replace(/^(\*|\-)\s(.*)/gm, '<ul class="list-disc pl-5 my-1"><li>$2</li></ul>');
    text = text.replace(/^(\d+)\.\s(.*)/gm, '<ol class="list-decimal pl-5 my-1"><li>$2</li></ol>');
    
    // Headers
    text = text.replace(/^#\s(.*)/gm, '<h3 class="text-xl font-bold mt-4 mb-2">$1</h3>');
    text = text.replace(/^##\s(.*)/gm, '<h4 class="text-lg font-semibold mt-3 mb-1.5">$1</h4>');
    text = text.replace(/^###\s(.*)/gm, '<h5 class="text-base font-medium mt-2 mb-1">$1</h5>');
    
    // Blockquotes
    text = text.replace(/^>\s(.*)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 my-2 text-gray-600">$1</blockquote>');
    
    return text;
  };

  // Type animation effect for bot messages
  useEffect(() => {
    if (isBot) {
      setShowThinkingMessage(true);

      const thinkingTimer = setTimeout(() => {
        setShowThinkingMessage(false);
      }, 1000);

      if (typingIndex < message.content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(message.content.substring(0, typingIndex + 1));
          setTypingIndex(typingIndex + 1);
        }, isTyping ? 10 : 0);

        return () => {
          clearTimeout(timer);
          clearTimeout(thinkingTimer);
        };
      }
    }
  }, [isBot, message.content, typingIndex, isTyping]);

  // Reset typing state when message changes
  useEffect(() => {
    if (isBot) {
      setDisplayedContent('');
      setTypingIndex(0);
      setShowThinkingMessage(true);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isBot]);
  
  const contentToRender = isBot ? displayedContent : message.content;
  const parts = message.isCode ? [] : extractCodeBlocks(contentToRender);
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.trim() ? (
          <span 
            className="text-gray-800 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: parseFormatting(line) }} 
          />
        ) : (
          <br />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className={`group relative flex items-start gap-4 ${isBot ? 'bg-gray-50 dark:bg-gray-800' : 'bg-white dark:bg-gray-900'} px-4 py-6 md:px-6 lg:px-8`}>
      {/* Fancy gradient border for bot messages */}
      {isBot && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
      
      {/* Avatar with better styling */}
      <div className={`
        ${isBot 
          ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-md' 
          : 'bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white'
        } 
        w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 
        transition-all duration-200 group-hover:scale-105
      `}>
        {isBot ? (
    // Bot avatar image
    <img 
      src="/amagi2.png"  // Path to your bot image in public folder
      alt="Bot Avatar"
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = '/images/default-bot.png';
      }}
    />
  ) : (
    // User avatar image
    <img 
      src="https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE="  // Path to your user image in public folder
      alt="User Avatar"
      className="w-full h-full object-cover rounded-full"
      onError={(e) => {
        // Fallback if image fails to load
        const target = e.target as HTMLImageElement;
        target.src = 'https://media.istockphoto.com/id/1130884625/vector/user-member-vector-icon-for-ui-user-interface-or-profile-face-avatar-app-in-circle-design.jpg?s=612x612&w=0&k=20&c=1ky-gNHiS2iyLsUPQkxAtPBWH1BZt0PKBB1WBtxQJRE=';
      }}
    />
  )}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden min-w-0">
        <div className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
          {isBot ? 'Amagi' : 'You'}
          {isBot && (
            <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
              AI Assistant
            </span>
          )}
        </div>
        
        <div className={`text-gray-700 dark:text-gray-300 max-w-none space-y-3`}>
          {/* Thinking indicator */}
          {showThinkingMessage && isBot && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 italic">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Thinking...
            </div>
          )}

          {message.isCode ? (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">{message.content.split('```')[0]}</p>
              <CodeBlock 
                code={message.content.split('```')[1].split('```')[0]} 
                language={message.language || 'javascript'} 
              />
            </div>
          ) : (
            parts.length > 0 ? (
              parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part.type === 'text' ? (
                    <div className="whitespace-pre-wrap">{formatContent(part.content)}</div>
                  ) : (
                    <CodeBlock code={part.content} language={part.language} />
                  )}
                </React.Fragment>
              ))
            ) : (
              <div className="whitespace-pre-wrap">{formatContent(contentToRender)}</div>
            )
          )}
        </div>
        
        {isBot && isTyping && typingIndex < message.content.length && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        )}
        
        {/* Timestamp */}
        <div className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;