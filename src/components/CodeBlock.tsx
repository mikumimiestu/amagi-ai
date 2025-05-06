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
    <div className="relative my-4 rounded-lg overflow-hidden bg-gray-900 group">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200 text-sm font-mono">
        <span>{language}</span>
        <button 
          onClick={copyToClipboard}
          className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          aria-label="Copy code to clipboard"
        >
          {copied ? (
            <>
              <Check size={16} className="text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardCopy size={16} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm text-gray-300 font-mono">
        <code>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;