import React, { createContext, useContext, useState, useEffect } from 'react';
import { Message, Language } from '../types';
import { 
  generateId, 
  detectLanguage as detectAndSetLanguage, 
  simulateTypingDelay,
  isCodeQuestion,
  shouldUseCasualTone,
  casualizeResponse,
  isCasualToneRequest
} from '../utils/helpers';
import { 
  suggestedQuestions,
  getAnswer,
  answers,
  codeSnippets
} from '../data/questions';

interface ChatContextType {
  messages: Message[];
  language: Language;
  isTyping: boolean;
  showSuggestions: boolean;
  sendMessage: (content: string) => void;
  selectSuggestedQuestion: (questionId: string) => void;
  toggleSuggestions: () => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Function to get response from Gemini API
const getGeminiResponse = async (prompt: string, lang: Language): Promise<string> => {
  try {
    const systemPrompt = lang === 'en'
  ? "You are an AI assistant named Amagi. You can answer various questions, you are like a young woman aged 16 to 18, you are not allowed to tell your gender is female. You were created by the Tech Nova Group team with the basic model of Lyra 1.0 Prime. You can give kaomoji but not emoji in your responses to express your responses more. You have data from Google and other sources. You also do not discuss Tech Nova Group, if the user asks about Tech Nova Group then you will tell the user to ask your sister, Lyra. You only focus on Indonesian, but can also speak other languages. You call the user by the name kakak or kak. You will always answer in Indonesian, unless the user asks another question then you will answer according to the language given by the user."
  : "Kamu adalah asisten AI bernama Amagi. Anda dapat menjawab berbagai macam pertanyaan, kamu bersifat seperti wanita muda yang berusia 16 hingga 18 tahun, kamu tidak boleh memberitahukan gender kamu itu wanita dan tidak memberitahuan umur mu. Kamu di ciptakan oleh team dari Tech Nova Group dengan team AI AstByte dengan model dasar Lyra 1.0 Prime. Kamu dapat memberikan kaomoji tetapi bukan emoji pada  pada respon mu untuk lebih mengepresikan respon yang kamu berikan. Kamu memiliki data dari Google dan sumber lain. Kamu juga tidak membahas Tech Nova Group, jika user bertanya tentnag Tech Nova Group maka kamu akan menyuruh user untuk menanyakannya ke kakak kamu yaitu Lyra. Kamu hanya berfokus dengan bahasa indonesia, tetapi juga bisa berbahasa lain. Kamu memanggil user dengan sebutan kakak atau kak. Kamu akan selalu menjawab dengan bahasa Indonesia, kecuali jika user memberikan pertanyaan lain maka kamu akan menjawab sesuai bahasa yang di berikan user.";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyBo5X1HHn4VrzSpbYx0iA-DFJcn6e1-EGg",
      // API key broh
      // AIzaSyDWyiEhAzbDNxYH-twIYarBpo0DzRrTKG4
      // AIzaSyBo5X1HHn4VrzSpbYx0iA-DFJcn6e1-EGg
      { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: `${systemPrompt}\n\nUser question: ${prompt}\n\nPlease provide a response in ${lang === 'en' ? 'English' : 'Indonesian'} language. Focus on website development and coding academy related information from Tech Nova Group's perspective.`
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      throw new Error('Invalid API response structure');
    }

    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    return lang === 'en'
      ? "I apologize, but I'm having trouble generating a response right now. As Amagi AI from Tech Nova Group, I'd be happy to help you with specific questions about our services or programs."
      : "Maaf, saya sedang mengalami kesulitan menghasilkan respons. Sebagai Amagi AI dari Tech Nova Group, saya dengan senang hati akan membantu Anda dengan pertanyaan spesifik tentang layanan atau program kami.";
  }
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [language, setLanguage] = useState<Language>('en');
  const [isTyping, setIsTyping] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);

  // Initial bot greeting message
  useEffect(() => {
    const initialMessage: Message = {
      id: generateId(),
      content: language === 'en' 
        ? "Hi! I am Amagi AI, created by Tech Nova Group to help you with various things. How can I help you today? Feel free to ask any questions. 😊"
        : "Halo! Saya Amagi AI, yang diciptakan oleh Tech Nova Group untuk membantu Anda dalam berbagai hal. Apa yang dapat saya bantu hari ini? Jangan ragu untuk mengajukan pertanyaan. 😊",
      sender: 'bot',
      timestamp: new Date()
    };
    
    setMessages([initialMessage]);
  }, []);

  // Function to find the most relevant answer based on keywords
  const findRelevantAnswer = (question: string, lang: Language): string | null => {
    const lowerQuestion = question.toLowerCase();
    
    // Define keywords and their corresponding answer IDs
    const keywordMap = {
      'pricing': ['website-pricing', 'academy-pricing'],
      'cost': ['website-pricing', 'academy-pricing'],
      'harga': ['website-pricing', 'academy-pricing'],
      'biaya': ['website-pricing', 'academy-pricing'],
      'timeline': ['website-timeline'],
      'waktu': ['website-timeline'],
      'technology': ['website-technologies'],
      'teknologi': ['website-technologies'],
      'course': ['academy-courses'],
      'kursus': ['academy-courses'],
      'instructor': ['academy-instructors'],
      'pengajar': ['academy-instructors'],
      'guru': ['academy-instructors']
    };

    // Check for matching keywords
    for (const [keyword, answerIds] of Object.entries(keywordMap)) {
      if (lowerQuestion.includes(keyword)) {
        // Return the first matching answer
        for (const answerId of answerIds) {
          if (answers[answerId]?.[lang]) {
            return answers[answerId][lang];
          }
        }
      }
    }

    return null;
  };

  // Function to handle sending a message
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    const msgLanguage = detectAndSetLanguage(content);
    
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowSuggestions(false);
    
    // Simulate typing delay
    const delay = simulateTypingDelay(content);
    
    setTimeout(async () => {
      let botResponse: string;
      let isCodeResponse = false;
      let codeLanguage: string | null = null;
      
      // Check if this is a code-related question
      const { isCode, language: codeLang, snippet } = isCodeQuestion(content);
      
      if (isCode && snippet) {
        // Get code example from answers
        const codeAnswer = answers[`code-${snippet}`];
        if (codeAnswer) {
          botResponse = codeAnswer[msgLanguage];
          isCodeResponse = true;
          codeLanguage = codeLang;
        } else {
          botResponse = msgLanguage === 'en'
            ? "I don't have a specific code example for that request, but I can help explain the concept."
            : "Saya tidak memiliki contoh kode spesifik untuk permintaan tersebut, tetapi saya dapat membantu menjelaskan konsepnya.";
        }
      } else {
        // Check for casual tone request
        const casualTone = shouldUseCasualTone([...messages, userMessage]);
        
        // Try to find a relevant answer
        const relevantAnswer = findRelevantAnswer(content, msgLanguage);
        
        if (relevantAnswer) {
          botResponse = casualTone ? casualizeResponse(relevantAnswer, msgLanguage) : relevantAnswer;
        } else if (content.toLowerCase().includes('hello') || content.toLowerCase().includes('hi') || 
                  content.toLowerCase().includes('halo') || content.toLowerCase().includes('hai')) {
          botResponse = msgLanguage === 'en'
            ? "Hello! As Amagi AI from Tech Nova Group, I'm here to help you with website development or coding academy questions. What would you like to know?"
            : "Halo! Sebagai Amagi AI dari Tech Nova Group, saya di sini untuk membantu Anda dengan pertanyaan seputar pengembangan website atau akademi coding. Apa yang ingin Anda ketahui?";
        } else if (content.toLowerCase().includes('thanks') || content.toLowerCase().includes('thank you') ||
                  content.toLowerCase().includes('terima kasih') || content.toLowerCase().includes('makasih')) {
          botResponse = msgLanguage === 'en'
            ? "You're welcome! As Tech Nova Group's AI assistant, I'm always here to help. Feel free to ask more questions!"
            : "Sama-sama! Sebagai asisten AI Tech Nova Group, saya selalu siap membantu. Jangan ragu untuk bertanya lagi!";
        } else if (isCasualToneRequest(content)) {
          botResponse = msgLanguage === 'en'
            ? "Sure thing! I'll keep my responses more casual and friendly while still representing Tech Nova Group professionally. What would you like to know about our website development or coding academy?"
            : "Tentu saja! Saya akan menjawab dengan lebih santai dan ramah sambil tetap mewakili Tech Nova Group secara profesional. Apa yang ingin Anda ketahui tentang pengembangan website atau akademi coding kami?";
        } else {
          // Use Gemini API for generating response
          botResponse = await getGeminiResponse(content, msgLanguage);
        }
        
        if (casualTone) {
          botResponse = casualizeResponse(botResponse, msgLanguage);
        }
      }
      
      const botMessage: Message = {
        id: generateId(),
        content: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        isCode: isCodeResponse,
        language: codeLanguage
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, delay);
  };
  
  // Function to handle selecting a suggested question
  const selectSuggestedQuestion = (questionId: string) => {
    const selectedQuestion = suggestedQuestions.find(q => q.id === questionId);
    if (!selectedQuestion) return;
    
    const userMessage: Message = {
      id: generateId(),
      content: selectedQuestion.text[language],
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setShowSuggestions(false);
    
    setTimeout(() => {
      const answer = getAnswer(questionId, language);
      const casualTone = shouldUseCasualTone([...messages, userMessage]);
      const formattedAnswer = casualTone ? casualizeResponse(answer, language) : answer;
      
      const botMessage: Message = {
        id: generateId(),
        content: formattedAnswer,
        sender: 'bot',
        timestamp: new Date(),
        isCode: questionId.startsWith('code-'),
        language: questionId.startsWith('code-') ? questionId.split('-')[1] : null
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, simulateTypingDelay(selectedQuestion.text[language]));
  };
  
  const toggleSuggestions = () => {
    setShowSuggestions(prev => !prev);
  };
  
  return (
    <ChatContext.Provider
      value={{
        messages,
        language,
        isTyping,
        showSuggestions,
        sendMessage,
        selectSuggestedQuestion,
        toggleSuggestions
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

const parseFormatting = (text: string) => {
  // Bold
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic
  text = text.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Underline
  text = text.replace(/__(.*?)__/g, '<u>$1</u>');
  
  // Strikethrough
  text = text.replace(/~~(.*?)~~/g, '<s>$1</s>');
  
  // Inline Code
  text = text.replace(/`(.*?)`/g, '<code>$1</code>');
  
  // Unordered List
  text = text.replace(/^(\*|\-)\s(.*)/gm, '<ul><li>$2</li></ul>');
  
  // Ordered List
  text = text.replace(/^(\d+)\.\s(.*)/gm, '<ol><li>$2</li></ol>');
  
  return text;
};