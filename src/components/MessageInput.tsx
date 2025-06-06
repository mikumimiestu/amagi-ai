import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Mic, MicOff } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder: string;
  disabled?: boolean;
  onAttach?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  onSendMessage, 
  placeholder, 
  disabled = false,
  onAttach,
}) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  
  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setMessage(prev => {
            // Remove interim results and add final transcript
            const cleanedPrev = prev.replace(interimTranscript, '');
            return cleanedPrev + finalTranscript;
          });
        };

        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
        };

        recognitionRef.current.onend = () => {
          if (isListening) {
            recognitionRef.current?.start();
          }
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Speech recognition start failed:', error);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };
  
  // Auto resize textarea as user types
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  };
  
  // Resize on message change
  useEffect(() => {
    handleInput();
  }, [message]);
  
  // Handle Ctrl+Enter or Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  // Focus effect
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <form 
      onSubmit={handleSubmit} 
      className={`
        relative flex items-center bg-white dark:bg-gray-800 p-1 rounded-full border-2
        ${isFocused ? 'border-blue-500 shadow-lg' : 'border-gray-200 dark:border-gray-700 shadow-sm'}
        transition-all duration-300 ease-in-out
        w-full max-w-md mx-auto
      `}
    >
      {/* Attachment button */}
      {onAttach && (
        <button
          type="button"
          onClick={onAttach}
          disabled={disabled}
          className="p-2 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>
      )}

      {/* Voice input button */}
      <button
        type="button"
        onClick={toggleSpeechRecognition}
        disabled={disabled}
        className={`p-2 rounded-full transition-colors ${
          isListening 
            ? 'text-red-500 bg-red-100 dark:bg-red-900/30 animate-pulse' 
            : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-700'
        }`}
        aria-label={isListening ? "Stop listening" : "Voice input"}
      >
        {isListening ? <MicOff size={20} /> : <Mic size={20} />}
      </button>

      <div className="flex-1 relative">
        <textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          rows={1}
          className={`
            w-full resize-none border-0 bg-transparent p-2 focus:ring-0 focus:outline-none 
            text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500
            scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600
          `}
          disabled={disabled}
        />
        {/* Character counter (optional) */}
        {message.length > 0 && (
          <div className="absolute bottom-1 right-2 text-xs text-gray-400 dark:text-gray-500">
            {message.length}/500
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`
          p-2 rounded-full mr-2 mb-1 transition-all duration-300 ease-in-out
          ${message.trim() && !disabled
            ? 'bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
          }
          transform ${message.trim() && !disabled ? 'hover:scale-105' : ''}
        `}
        aria-label="Send message"
      >
        <Send size={20} className="transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>

      {/* Micro animation when focused */}
      {isFocused && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <div className="flex space-x-1">
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </form>
  );
};

export default MessageInput;