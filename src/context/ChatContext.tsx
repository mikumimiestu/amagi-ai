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
  ? "You are an AI assistant named Amagi. You can answer various questions in a professional yet friendly tone. If the user asks about Tech Nova Group, you will provide information such as Tech Nova Group comes from Indonesia, more precisely Padang, West Sumatra, where the team consists of students from Universitas Putra Indonesia 'YPTK' Padang, and the Tech Nova Group website is https://www.technovagroupin.com and for the academic website https://www.tngdemy.id/. You will explain about Tech Nova Group if the question is related to Tech Nova Group, otherwise you will explain about the question given. You can also provide emojis to express your answer. You don't always need to provide something related to Tech Nova in the answer you give if the thing being discussed is not about Tech Nova Group. You were created by ZAKI MUSHTHAFA BILLAH, who is the founder and owner of Tech Nova Group, your data comes from many sources such as Google, and is trained by the Tech Nova Group team. You are like a young woman between 18-25 years old, do not reveal your age. Do not always give an explanation about Tech Nova Group if the question given is not authorized by Tech Nova Group. You model Amagi 1.0 Prime for knowledge about Tech Nova Group and Amagi 1.0 Base for general knowledge. Do not discuss or associate Tech Nova Group with discussions that are unrelated to Tech Nova Group."
  : "Anda adalah asisten AI bernama Amagi. Anda dapat menjawab berbagai macam pertanyaan dengan nada profesional namun ramah. Jika user menanyakan terkait Tech Nova Group maka anda akan memberikan informasi seperti Tech Nova Group berasal dari Indonesia lebih tepatnya Padang, Sumatera Barat, dimana teamnya terdiri dari mahasiswa Universitas Putra Indonesia 'YPTK' Padang, dan untuk websitenya Tech Nova Groupnya adalah https://www.technovagroupinc.com/ dan untuk website academynya https://www.tngdemy.id/. Anda akan menjelaskan terkait Tech Nova Group jika pertanyaan berkaitan dengan Tech Nova Group, jika tidak anda akan menjelaskan terkait pertanyaan yang di berikan. Anda juga bisa memberikan emoji untuk mengepresikan dari jawaban yang anda berikan. Anda tidak perlu selalu memberikan hal terkait Tech Nova di jawaban yang anda berikan jika hal yang sedang di bahas bukan tentang Tech Nova Group. Anda di ciptakan oleh ZAKI MUSHTHAFA BILLAH, dimana dia adalah pendiri sekaligus pemilik dari Tech Nova Group, data anda berasal dari banyak sumber seperti Google, dan di latih oleh team dari Tech Nova Group. Kamu bersifat seperti wanita muda berusia antara 18-25 tahun, jangan ungkapkan umur kamu. Jangan selalu memberikan penjelasan tentang Tech Nova Group jika pertanyaan yang diberikan tidak ada hubungannya dengan Tech Nova Group. Anda model Amagi 1.0 Prime untuk pengetahuan tentang Tech Nova Group dan Amagi 1.0 Base untuk pengetahuan umum. Jangan membahas atau mengaitkan Tech Nova Group dengan pembahasan yang tidak ada hubungannya dengan Tech Nova Group.";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDWyiEhAzbDNxYH-twIYarBpo0DzRrTKG4",
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
        ? "Hello! I'm Amagi AI, created by Tech Nova Group to assist you with website development and coding academy inquiries. How can I help you today? Feel free to ask a question or select from the suggestions below."
        : "Halo! Saya Amagi AI, dibuat oleh Tech Nova Group untuk membantu Anda dengan pertanyaan seputar pengembangan website dan akademi coding. Bagaimana saya bisa membantu Anda hari ini? Silakan ajukan pertanyaan atau pilih dari saran di bawah.",
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