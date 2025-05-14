import React, { useState } from 'react';
import { ClipboardCopy, Check } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  return (
    <div className="relative my-6 rounded-lg overflow-hidden bg-gray-900 group shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between px-4 py-3 bg-gray-800 text-gray-200 text-sm font-mono border-b border-gray-700">
        <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
          {language}
        </span>
        <button 
          onClick={copyToClipboard}
          className={`flex items-center gap-2 px-3 py-1 rounded-md transition-all duration-200 ${
            copied 
              ? 'text-green-400 bg-green-900/20'
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          aria-label="Copy code to clipboard"
          disabled={copied}
        >
          {copied ? (
            <>
              <Check size={16} className="shrink-0" />
              <span className="text-xs font-medium">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardCopy size={16} className="shrink-0" />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-100 font-mono leading-relaxed">
        <code className="block whitespace-pre overflow-x-auto">
          {code}
        </code>
      </pre>
      
      {/* Fade effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-gray-900/70 to-transparent pointer-events-none" />
    </div>
  );
};

export default CodeBlock;