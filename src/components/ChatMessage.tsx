import React, { useState, useEffect } from 'react';
import { Message } from '../types';
import CodeBlock from './CodeBlock';
import { Copy, Check, ThumbsUp, ThumbsDown, MoreVertical, Sparkles, Bot as BotIcon, User } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  isTyping: boolean;
  theme?: 'light' | 'dark';
  onLike?: () => void;
  onDislike?: () => void;
  onCopy?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ 
  message, 
  isTyping, 
  theme = 'light',
  onLike,
  onDislike,
  onCopy
}) => {
  const [displayedContent, setDisplayedContent] = useState('');
  const [typingIndex, setTypingIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isBot = message.sender === 'bot';
  
  // WhatsApp-like bubble colors
  const bubbleColors = {
    bot: {
      light: 'bg-[#e5e5ea]',
      dark: 'bg-[#2a3942]'
    },
    user: {
      light: 'bg-[#d9fdd3]',
      dark: 'bg-[#005c4b]'
    }
  };

  const textColors = {
    light: 'text-black',
    dark: 'text-white'
  };

  const timestampColors = {
    light: 'text-[#667781]',
    dark: 'text-[#a3b3bc]'
  };

  const extractCodeBlocks = (content: string) => {
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
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
        language: match[1] || 'javascript',
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
    text = text.replace(/`(.*?)`/g, '<code class="font-mono bg-black/10 px-1 py-0.5 rounded text-sm">$1</code>');
    
    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
    
    return text;
  };

  // Smooth typing animation effect
  useEffect(() => {
    if (isBot) {
      if (typingIndex < message.content.length) {
        const timer = setTimeout(() => {
          setDisplayedContent(message.content.substring(0, typingIndex + 1));
          setTypingIndex(typingIndex + 1);
        }, isTyping ? Math.random() * 20 + 10 : 0);

        return () => clearTimeout(timer);
      }
    }
  }, [isBot, message.content, typingIndex, isTyping]);

  useEffect(() => {
    if (isBot) {
      setDisplayedContent('');
      setTypingIndex(0);
    } else {
      setDisplayedContent(message.content);
    }
  }, [message.content, isBot]);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    if (onCopy) onCopy();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    const newReaction = reaction === 'like' ? null : 'like';
    setReaction(newReaction);
    if (onLike) onLike();
  };

  const handleDislike = () => {
    const newReaction = reaction === 'dislike' ? null : 'dislike';
    setReaction(newReaction);
    if (onDislike) onDislike();
  };

  const contentToRender = isBot ? displayedContent : message.content;
  const parts = message.isCode ? [] : extractCodeBlocks(contentToRender);
  
  const formatContent = (text: string) => {
    return text.split('\n').map((line, i) => (
      <React.Fragment key={i}>
        {line.trim() ? (
          <span 
            className={textColors[theme]}
            dangerouslySetInnerHTML={{ __html: parseFormatting(line) }} 
          />
        ) : (
          <br />
        )}
      </React.Fragment>
    ));
  };

  return (
    <div 
      className={`flex ${isBot ? 'justify-start' : 'justify-end'} px-4 py-1`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className={`relative max-w-[80%] rounded-lg p-3 ${isBot ? bubbleColors.bot[theme] : bubbleColors.user[theme]} ${isBot ? 'rounded-tl-none' : 'rounded-tr-none'}`}
      >
        {/* WhatsApp-style message tail */}
        <div className={`absolute top-0 ${isBot ? '-left-1.5' : '-right-1.5'} w-3 h-3 overflow-hidden`}>
          <div className={`absolute w-4 h-4 rotate-45 transform ${isBot ? bubbleColors.bot[theme] : bubbleColors.user[theme]} ${isBot ? 'left-0 -top-1' : 'right-0 -top-1'}`}></div>
        </div>

        {/* Sender name for group chats - removed for simplicity */}
        
        {/* Message content */}
        <div className={`whitespace-pre-wrap ${textColors[theme]} space-y-2`}>
          {message.isCode ? (
            <div className="space-y-2">
              <p>{message.content.split('```')[0]}</p>
              <CodeBlock 
                code={message.content.split('```')[1].split('```')[0]} 
                language={message.language || 'javascript'} 
                theme={theme}
              />
            </div>
          ) : (
            parts.length > 0 ? (
              parts.map((part, index) => (
                <React.Fragment key={index}>
                  {part.type === 'text' ? (
                    <div>{formatContent(part.content)}</div>
                  ) : (
                    <CodeBlock 
                      code={part.content} 
                      language={part.language} 
                      theme={theme}
                    />
                  )}
                </React.Fragment>
              ))
            ) : (
              <div>{formatContent(contentToRender)}</div>
            )
          )}
        </div>

        {/* Message footer with timestamp and status */}
        <div className={`flex justify-end items-center mt-1 space-x-1 ${timestampColors[theme]} text-xs`}>
          <span>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          
          {/* WhatsApp-style read receipts and message actions */}
          {!isBot && (
            <span className="flex items-center">
              {copied ? (
                <Check className="w-3 h-3 text-blue-500" />
              ) : (
                <span className="opacity-70">✓✓</span>
              )}
            </span>
          )}
          
          {/* Message actions */}
          {isHovered && (
            <div className="flex items-center gap-1 ml-2">
              {isBot && (
                <>
                  <button 
                    onClick={handleLike}
                    className={`p-1 rounded-full ${reaction === 'like' ? 
                      'text-blue-500' : 
                      'opacity-70 hover:opacity-100'}`}
                    aria-label="Like this response"
                  >
                    <ThumbsUp size={14} />
                  </button>
                  <button 
                    onClick={handleDislike}
                    className={`p-1 rounded-full ${reaction === 'dislike' ? 
                      'text-red-500' : 
                      'opacity-70 hover:opacity-100'}`}
                    aria-label="Dislike this response"
                  >
                    <ThumbsDown size={14} />
                  </button>
                </>
              )}
              <button 
                onClick={handleCopy}
                className="p-1 rounded-full opacity-70 hover:opacity-100"
                aria-label="Copy message"
              >
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            </div>
          )}
        </div>

        {/* Typing indicator */}
        {isBot && isTyping && typingIndex < message.content.length && (
          <div className="flex items-center gap-1 mt-2">
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;