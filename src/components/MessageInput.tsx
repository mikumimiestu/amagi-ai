import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  placeholder: string;
  disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, placeholder, disabled = false }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
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
  
  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-2 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        placeholder={placeholder}
        rows={1}
        className="flex-1 resize-none border-0 bg-transparent p-2 focus:ring-0 focus:outline-none text-gray-700 placeholder-gray-400"
        disabled={disabled}
      />
      <button
        type="submit"
        disabled={!message.trim() || disabled}
        className={`p-2 rounded-full ${
          message.trim() && !disabled
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
        } transition-colors`}
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </form>
  );
};

export default MessageInput;