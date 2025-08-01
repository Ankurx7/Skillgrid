import React, { useState, useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaLightbulb,
  FaCalculator,
  FaFlask,
  FaBook,
} from 'react-icons/fa';
import { studyAssistantService } from '../../../services/operations/studyAssistantService';

const StudyAssistant = () => {

  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: courseEntireData?.courseName ?
        `Hello! I'm your Study Assistant for "${courseEntireData.courseName}"! 🤖 I can help you with questions about this course content, as well as general academic topics. What would you like to learn about today?` :
        "Hello! I'm your Study Assistant! 🤖 I can help you with academic questions on any subject - Science, Math, Literature, History, and more. What would you like to learn about today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '') return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await studyAssistantService.askQuestion(inputMessage, courseEntireData);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {

      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error while processing your question. Please try again or rephrase your question.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getQuickQuestions = () => {
    if (courseEntireData?.courseName) {
      return [
        { icon: <FaBook />, text: `Explain concepts from "${courseEntireData.courseName}"`, topic: 'course' },
        { icon: <FaLightbulb />, text: 'Help me understand this topic', topic: 'understanding' },
        { icon: <FaCalculator />, text: 'Solve a problem step-by-step', topic: 'problem' },
        { icon: <FaFlask />, text: 'Study tips for this course', topic: 'tips' },
      ];
    } else {
      return [
        { icon: <FaFlask />, text: 'Explain a chemistry concept', topic: 'chemistry' },
        { icon: <FaCalculator />, text: 'Help with math problem', topic: 'math' },
        { icon: <FaLightbulb />, text: 'Physics concepts', topic: 'physics' },
        { icon: <FaBook />, text: 'Literature analysis', topic: 'literature' },
      ];
    }
  };

  const quickQuestions = getQuickQuestions();

  const handleQuickQuestion = (question) => {
    setInputMessage(question.text);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 hover:scale-110 animate-pulse"
          title="Study Assistant - Ask me anything!"
        >
          <FaRobot size={24} />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaRobot size={20} />
          <div>
            <h3 className="font-semibold text-lg">Study Assistant</h3>
            <p className="text-xs opacity-90">
              {courseEntireData?.courseName ? `${courseEntireData.courseName} • Ask me anything!` : 'Ask me anything!'}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded-full transition-colors"
        >
          <FaTimes size={16} />
        </button>
      </div>

      {}
      {messages.length <= 1 && (
        <div className="p-4 bg-gray-50 border-b">
          <p className="text-sm text-gray-600 mb-3">Quick topics to get started:</p>
          <div className="grid grid-cols-2 gap-2">
            {quickQuestions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuickQuestion(question)}
                className="flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors text-sm"
              >
                <span className="text-blue-600">{question.icon}</span>
                <span className="text-gray-700">{question.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot
                  ? 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
              }`}
            >
              {message.isBot && (
                <div className="flex items-center gap-2 mb-2">
                  <FaRobot size={14} className="text-blue-600" />
                  <span className="text-xs font-medium text-blue-600">Study Assistant</span>
                </div>
              )}
              <div className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</div>
              <div
                className={`text-xs mt-2 ${
                  message.isBot ? 'text-gray-500' : 'text-blue-100'
                }`}
              >
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 border border-gray-200 shadow-sm p-3 rounded-lg max-w-[80%]">
              <div className="flex items-center gap-2 mb-2">
                <FaRobot size={14} className="text-blue-600" />
                <span className="text-xs font-medium text-blue-600">Study Assistant</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.1s' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                </div>
                <span className="text-sm text-gray-500 ml-2">Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything - science, math, history, literature..."
            className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            rows="2"
            disabled={isTyping}
          />
          <button
            onClick={handleSendMessage}
            disabled={inputMessage.trim() === '' || isTyping}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white p-3 rounded-lg transition-all duration-200 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
          Press Enter to send • Shift+Enter for new line
        </div>
      </div>
    </div>
  );
};

export default StudyAssistant;
