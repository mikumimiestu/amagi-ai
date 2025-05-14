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
  const [showThinkingMessage, setShowThinkingMessage] = useState(false);
  const [copied, setCopied] = useState(false);
  const [reaction, setReaction] = useState<'like' | 'dislike' | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const isBot = message.sender === 'bot';
  
  // Enhanced code block extraction with better language detection
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

  // Advanced markdown parsing with better formatting
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
    text = text.replace(/^>\s(.*)/gm, '<blockquote class="border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-2 text-gray-600 dark:text-gray-300">$1</blockquote>');
    
    // Links
    text = text.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 dark:text-blue-400 hover:underline">$1</a>');
    
    // Horizontal rule
    text = text.replace(/^---/gm, '<hr class="my-3 border-gray-200 dark:border-gray-600" />');
    
    return text;
  };

  // Smooth typing animation effect
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
        }, isTyping ? Math.random() * 20 + 10 : 0); // Random delay for more natural typing

        return () => {
          clearTimeout(timer);
          clearTimeout(thinkingTimer);
        };
      }
    }
  }, [isBot, message.content, typingIndex, isTyping]);

  useEffect(() => {
    if (isBot) {
      setDisplayedContent('');
      setTypingIndex(0);
      setShowThinkingMessage(true);
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
    <div 
      className={`group relative flex items-start gap-4 ${isBot ? 'bg-gradient-to-r from-blue-50/20 to-purple-50/20 dark:from-gray-800/50 dark:to-gray-800/30' : 'bg-white dark:bg-gray-900'} px-4 py-6 md:px-6 lg:px-8 border-b border-gray-100 dark:border-gray-700/50 transition-all duration-200`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated gradient border */}
      {isBot && isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/30 via-purple-100/30 to-pink-100/30 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-pink-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
      )}
      
      {/* Avatar with pulse animation */}
      <div className={`
        ${isBot 
          ? 'bg-transparent text-white' 
          : 'bg-transparent dark:bg-transparent text-gray-800 dark:text-white'
        } 
        w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 
        transition-all duration-200 ${isHovered ? 'scale-105' : ''}
        ${isBot && isTyping ? 'animate-pulse' : ''}
      `}>
        {isBot ? (
          <div className="relative">
            <img 
              src="/icon2.png"
              alt="Bot Avatar"
              className="w-8 h-8 object-cover rounded-full"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '';
                target.className = 'hidden';
              }}
            />
            {/* {!isTyping && (
              <div className="absolute -bottom-1 -right-1 bg-green-400 rounded-full p-0.5 border-2 border-white dark:border-gray-800">
                <Sparkles className="w-2.5 h-2.5 text-white" />
              </div>
            )} */}
          </div>
        ) : (
          <User className="w-5 h-5" />
        )}
      </div>
      
      <div className="flex-1 space-y-2 overflow-hidden min-w-0">
        <div className="flex items-center justify-between">
          <div className="font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
            {isBot ? (
              <>
                <span>Amagi</span>
                <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  <span>AI Assistant</span>
                </span>
              </>
            ) : 'You'}
          </div>
          
          {/* Floating action buttons */}
          <div className={`flex items-center gap-1 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}>
            {isBot && (
              <>
                <button 
                  onClick={handleLike}
                  className={`p-1.5 rounded-full transition-all ${reaction === 'like' ? 
                    'text-blue-500 bg-blue-100 dark:bg-blue-900/30 shadow-sm' : 
                    'text-gray-400 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-label="Like this response"
                  data-tooltip={reaction === 'like' ? 'Liked' : 'Like'}
                >
                  <ThumbsUp size={16} />
                </button>
                <button 
                  onClick={handleDislike}
                  className={`p-1.5 rounded-full transition-all ${reaction === 'dislike' ? 
                    'text-red-500 bg-red-100 dark:bg-red-900/30 shadow-sm' : 
                    'text-gray-400 hover:text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                  aria-label="Dislike this response"
                  data-tooltip={reaction === 'dislike' ? 'Disliked' : 'Dislike'}
                >
                  <ThumbsDown size={16} />
                </button>
              </>
            )}
            <button 
              onClick={handleCopy}
              className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Copy message"
              data-tooltip={copied ? 'Copied!' : 'Copy'}
            >
              {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        
        <div className={`text-gray-700 dark:text-gray-300 max-w-none space-y-3 transition-all duration-150`}>
          {/* Thinking indicator with better animation */}
          {showThinkingMessage && isBot && (
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 italic">
              <div className="flex space-x-1.5">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              Crafting response...
            </div>
          )}

          {message.isCode ? (
            <div className="space-y-2">
              <p className="text-gray-600 dark:text-gray-400">{message.content.split('```')[0]}</p>
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
                    <div className="whitespace-pre-wrap">{formatContent(part.content)}</div>
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
              <div className="whitespace-pre-wrap">{formatContent(contentToRender)}</div>
            )
          )}
        </div>
        
        {/* Enhanced typing indicator */}
        {isBot && isTyping && typingIndex < message.content.length && (
          <div className="flex items-center gap-1.5 mt-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">Typing...</span>
          </div>
        )}
        
        {/* Footer with timestamp and feedback */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100 dark:border-gray-700/30">
          <div className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1">
            <span>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
            {isBot && (
              <span className="text-[10px] px-1 py-0.5 bg-gray-100 dark:bg-gray-700 rounded">
                Lyra 1.0 Base
              </span>
            )}
          </div>
          
          {isBot && !isTyping && reaction && (
            <div className={`text-xs px-2 py-0.5 rounded-full ${
              reaction === 'like' ? 
                'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300' : 
                'text-red-600 bg-red-100 dark:bg-red-900/30 dark:text-red-300'
            }`}>
              {reaction === 'like' ? '👍 Helpful' : '👎 Needs improvement'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;