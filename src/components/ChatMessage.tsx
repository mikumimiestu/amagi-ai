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
  const [showThinkingMessage, setShowThinkingMessage] = useState(false); // State for "Think..." message
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

  // Formatting function for bold, italic, underline, strikethrough, inline code, and lists
  const parseFormatting = (text: string) => {
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
    text = text.replace(/__(.*?)__/g, '<u>$1</u>');
    text = text.replace(/~~(.*?)~~/g, '<s>$1</s>');
    text = text.replace(/`(.*?)`/g, '<code>$1</code>');
    
    // Unordered List (bullet points)
    text = text.replace(/^(\*|\-)\s(.*)/gm, '<ul><li>$2</li></ul>');
    
    // Ordered List (numbered points)
    text = text.replace(/^(\d+)\.\s(.*)/gm, '<ol><li>$2</li></ol>');
    
    return text;
  };

  // Type animation effect for bot messages
  useEffect(() => {
    if (isBot) {
      // Show "Think..." when the bot starts processing the message
      setShowThinkingMessage(true);

      // Simulate thinking process, show "Think..." for a while before typing the answer
      const thinkingTimer = setTimeout(() => {
        setShowThinkingMessage(false); // Hide "Think..." message after 2 seconds
      }, 1000); // Adjust duration for how long "Think..." is displayed

      if (typingIndex < message.content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(message.content.substring(0, typingIndex + 1));
          setTypingIndex(typingIndex + 1);
        }, 10); // Typing speed can be adjusted here

        return () => {
          clearTimeout(timer);
          clearTimeout(thinkingTimer);
        };
      }
    }
  }, [isBot, message.content, typingIndex]);

  // Reset typing state when message changes
  useEffect(() => {
    if (isBot) {
      setDisplayedContent('');
      setTypingIndex(0);
      setShowThinkingMessage(true); // Show "Think..." when a new message is received
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isBot]);
  
  const contentToRender = isBot ? displayedContent : message.content;
  const parts = message.isCode ? [] : extractCodeBlocks(contentToRender);
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        <span dangerouslySetInnerHTML={{ __html: parseFormatting(line) }} />
        {i < text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div className={`flex items-start gap-3 ${isBot ? 'bg-slate-200' : ''} px-4 py-6 animate-fadeIn md:px-6 lg:px-8`}>
      <div className={`
        ${isBot ? 'bg-gradient-to-r from-blue-300 to-purple-200 animate-pulse-slow text-white' : 'bg-gray-300 text-gray-800'} 
        w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0
      `}>
        {isBot ? 'Ly' : 'U'}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="font-medium">
          {isBot ? 'Lyra' : 'You'}
        </div>
        
        <div className={`prose prose-sm max-w-none ${isBot ? 'prose-blue' : 'prose-gray'}`}>
          {/* Display the "Think..." message */}
          {showThinkingMessage && isBot && (
            <div className="italic text-gray-500">Typing...</div>
          )}

          {message.isCode ? (
            <div>
              <p>{message.content.split('```')[0]}</p>
              <CodeBlock 
                code={message.content.split('```')[1].split('```')[0]} 
                language={message.language || 'javascript' || 'html' || 'python' || 'dart' || 'react' || 'jsx' || 'css' || 'tsx' || null} 
              />
            </div>
          ) : (
            parts.length > 0 ? (
              parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part.type === 'text' ? (
                    <div>{formatContent(part.content)}</div>
                  ) : (
                    <CodeBlock code={part.content} language={part.language} />
                  )}
                </React.Fragment>
              ))
            ) : (
              formatContent(contentToRender)
            )
          )}
        </div>
        
        {isBot && isTyping && typingIndex < message.content.length && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0s' }}></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
