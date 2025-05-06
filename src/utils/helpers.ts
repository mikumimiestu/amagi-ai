// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Detect language based on text input
export const detectLanguage = (text: string): 'en' | 'id' => {
  // List of common Indonesian words for detection
  const indonesianWords = [
    'apa', 'bagaimana', 'berapa', 'mengapa', 'kapan', 'siapa', 'dimana',
    'yang', 'dan', 'atau', 'tetapi', 'untuk', 'dengan', 'dari', 'ini', 'itu',
    'saya', 'kami', 'kita', 'mereka', 'dia', 'ada', 'tidak', 'bisa',
    'akan', 'sudah', 'belum', 'harus', 'boleh', 'dalam', 'pada', 'jika',
    'ketika', 'karena', 'oleh', 'tentang', 'sejak', 'hingga', 'sampai'
  ];

  // Convert input to lowercase and split into words
  const words = text.toLowerCase().split(/\s+/);
  
  // Count indonesian words
  const indonesianWordCount = words.filter(word => 
    indonesianWords.includes(word.replace(/[.,?!;:]/g, ''))
  ).length;
  
  // If more than 15% of words are indonesian, assume the message is in indonesian
  return (indonesianWordCount / words.length > 0.15) ? 'id' : 'en';
};

// Simulate typing effect delay
export const simulateTypingDelay = (text: string): number => {
  // Calculate a typing speed of about 30-60 characters per second + 500ms base delay
  return Math.min(3000, 500 + text.length * (Math.random() * 30 + 30));
};

// Check if a question is about casual tone
export const isCasualToneRequest = (text: string): boolean => {
  const lowerText = text.toLowerCase();
  
  const casualPatterns = [
    /be more casual/i,
    /less formal/i,
    /talk casual/i,
    /speak casual/i,
    /be friendly/i,
    /lebih santai/i,
    /kurang formal/i,
    /bicara santai/i,
    /ngobrol santai/i
  ];
  
  return casualPatterns.some(pattern => pattern.test(lowerText));
};

// Generate a casual response for the same content
export const casualizeResponse = (text: string, lang: 'en' | 'id'): string => {
  if (lang === 'en') {
    // For English, add some casual elements
    return text
      .replace(/We offer/g, "We've got")
      .replace(/Please/g, "Feel free to")
      .replace(/contact us/g, "reach out")
      .replace(/\./g, "! ")
      .replace(/Our/g, "Our awesome")
      .replace(/is/g, "is totally")
      .replace(/\!  /g, "! ");
  } else {
    // For Indonesian, make it more casual
    return text
      .replace(/Kami menawarkan/g, "Kami punya")
      .replace(/Silakan/g, "Boleh banget")
      .replace(/hubungi kami/g, "kontak kami")
      .replace(/\./g, "! ")
      .replace(/website/g, "website keren")
      .replace(/adalah/g, "itu")
      .replace(/\!  /g, "! ");
  }
};

// Function to determine if we should use a casual tone
export const shouldUseCasualTone = (messages: any[]): boolean => {
  // Check the last 3 messages for casual tone requests
  return messages
    .slice(Math.max(0, messages.length - 3))
    .some(msg => msg.sender === 'user' && isCasualToneRequest(msg.content));
};

// Check if a message contains a code-related question
export const isCodeQuestion = (text: string): { isCode: boolean; language: string | null; snippet: string | null } => {
  const lowerText = text.toLowerCase();
  
  // Define code-related patterns and their corresponding snippets
  const codePatterns = [
    {
      keywords: ['react', 'component', 'counter', 'komponen', 'penghitung'],
      language: 'javascript',
      snippet: 'react-example'
    },
    {
      keywords: ['javascript', 'toggle', 'dark mode', 'theme', 'mode gelap', 'tema'],
      language: 'javascript',
      snippet: 'javascript-example'
    },
    {
      keywords: ['html', 'website', 'page', 'struktur', 'halaman'],
      language: 'html',
      snippet: 'html-example'
    },
    {
      keywords: ['python', 'flask', 'api', 'backend', 'todo', 'tugas'],
      language: 'python',
      snippet: 'python-example'
    }, 
    {
      keywords: ['dart', 'flutter', 'mobile', 'aplikasi', 'mobile app'],
      language: 'dart',
      snippet: 'dart-example'
    }
  ];
  
  // Check for code request patterns
  const codeRequestPatterns = [
    /how (to|do I|can I) (create|make|build|implement|code|write)/i,
    /show (me )?(a |an )?(example|code|snippet)/i,
    /give (me )?(a |an )?(example|code|snippet)/i,
    /sample (code|program|app)/i,
    /bagaimana (cara )?(membuat|mengimplementasikan|menulis|coding)/i,
    /berikan (contoh|kode|snippet)/i,
    /tunjukkan (contoh|kode|snippet)/i,
    /contoh (kode|program|aplikasi)/i
  ];
  
  const isCodeRequest = codeRequestPatterns.some(pattern => pattern.test(lowerText));
  
  if (isCodeRequest) {
    // Check each pattern for matching keywords
    for (const pattern of codePatterns) {
      if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
        return {
          isCode: true,
          language: pattern.language,
          snippet: pattern.snippet
        };
      }
    }
  }
  
  return {
    isCode: false,
    language: null,
    snippet: null
  };
};