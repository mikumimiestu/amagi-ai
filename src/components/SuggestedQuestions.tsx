import React from 'react';
import { SuggestedQuestion, Language } from '../types';
import { ArrowRight } from 'lucide-react';

interface SuggestedQuestionsProps {
  questions: SuggestedQuestion[];
  language: Language;
  onSelectQuestion: (questionId: string) => void;
}

const SuggestedQuestions: React.FC<SuggestedQuestionsProps> = ({ 
  questions, 
  language, 
  onSelectQuestion 
}) => {
  // Separate questions by category
  const websiteQuestions = questions.filter(q => q.category === 'website');
  const academyQuestions = questions.filter(q => q.category === 'academy');
  
  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {language === 'en' ? 'Website Development' : 'Pengembangan Website'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {websiteQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center">
                <span className="flex-1 text-gray-700 group-hover:text-blue-600">
                  {question.text[language]}
                </span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-3 text-gray-800">
          {language === 'en' ? 'Coding Academy' : 'Akademi Coding'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {academyQuestions.map((question) => (
            <button
              key={question.id}
              onClick={() => onSelectQuestion(question.id)}
              className="text-left p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-colors group"
            >
              <div className="flex items-center">
                <span className="flex-1 text-gray-700 group-hover:text-blue-600">
                  {question.text[language]}
                </span>
                <ArrowRight size={16} className="text-gray-400 group-hover:text-blue-500 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SuggestedQuestions;