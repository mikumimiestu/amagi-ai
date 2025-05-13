export type Language = 'en' | 'id';

export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  isCode?: boolean;
  language?: 'javascript' | 'html' | 'python' | 'dart' | 'css' | 'tailwind' | 'typescript' | 'java' | 'csharp' | 'php' | 'ruby' | 'go' | 'swift' | 'kotlin' | 'rust' | 'sql' | 'bash' | 'r' | 'matlab' | 'dart' | 'c' | 'cpp' | 'objective-c' | 'assembly' | 'fortran' | 'pascal' | 'lisp' | 'elixir' | 'haskell' | 'clojure' | 'scala' | 'groovy' | 'perl' | 'lua' | 'vba' | 'dart' | 'f#' | 'ocaml' | 'd' | 'nim' | 'crystal' | 'smalltalk' | 'prolog' | 'solidity' | 'verilog' | 'vhdl' | 'ada' | 'actionscript' | 'apex' | 'awk' | 'bcpl' | 'bourne shell' | 'cobol' | 'coldfusion' | 'dylan' | 'eiffel' | 'elixir' | 'erlang' | 'factor' | 'foxpro' | 'frege' | 'groff' | 'hack' | 'icon' | 'idl' | 'inform 7' | null;
}

export interface SuggestedQuestion {
  id: string;
  text: {
    en: string;
    id: string;
  };
  category: 'website' | 'academy' | 'coding';
}

// Algoritma
// 1. Levenshtein Distance (untuk typo tolerant)
// 2. Jaro-Winkler Distance (untuk berperasaan ke inputan pesan)
// 3. Keyword-based Matching (pencocokan kata kunci di bagian Suggested Questions)
// 4. NLP Utility: Language Detection (settings basic di english dan indonesia)
// 5. Prompt Engineering untuk LLM (Prompt-based interaction dengan Google Gemini API)
