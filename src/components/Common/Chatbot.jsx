import React, { useState, useRef, useEffect } from 'react';
import { BsChatDots, BsX, BsSend } from 'react-icons/bs';
import { FaRobot, FaUser } from 'react-icons/fa';
import { chatbotService } from '../../services/operations/chatbotService';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! 👋 I'm CourseBot, your Skillgrid assistant. I can help you find courses, answer questions about pricing and instructors. What would you like to know?",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickResponses = [
    "What courses?",
    "Programming courses",
    "Course prices?",
    "Instructors?",
    "Help choose course"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: messageText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const response = await chatbotService.chat(messageText);

      const botMessage = {
        id: Date.now() + 1,
        text: response,
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error. Please try again later.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
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

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleChatbot}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 transform hover:scale-105 group"
          aria-label="Open course assistant chat"
        >
          <BsChatDots className="w-5 h-5" />
          <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>

          {}
          <div className="absolute bottom-full right-0 mb-2 px-2.5 py-1 bg-gray-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            Ask me about courses! 💬
          </div>
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 h-[450px] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden">
      {}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <FaRobot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">CourseBot</h3>
            <p className="text-xs opacity-90">Skillgrid Assistant</p>
          </div>
        </div>
        <button
          onClick={toggleChatbot}
          className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-1.5 transition-colors duration-200"
          aria-label="Close chat"
        >
          <BsX className="w-4 h-4" />
        </button>
      </div>

      {}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50 chatbot-scrollbar">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`flex items-start space-x-2 max-w-[85%] ${message.isBot ? 'flex-row' : 'flex-row-reverse space-x-reverse'}`}>
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                message.isBot
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                  : 'bg-gray-300 text-gray-600'
              }`}>
                {message.isBot ? <FaRobot className="w-3 h-3" /> : <FaUser className="w-3 h-3" />}
              </div>
              <div className={`rounded-lg p-2.5 ${
                message.isBot
                  ? 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-sm'
              }`}>
                <p className="text-xs leading-relaxed whitespace-pre-wrap">{message.text}</p>
                <p className={`text-xs mt-1 ${
                  message.isBot ? 'text-gray-400' : 'text-blue-100 opacity-75'
                }`}>
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          </div>
        ))}

        {}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2 max-w-[85%]">
              <div className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-white flex items-center justify-center flex-shrink-0">
                <FaRobot className="w-3 h-3" />
              </div>
              <div className="bg-white border border-gray-200 rounded-lg p-2.5 shadow-sm">
                <div className="flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {}
      <div className="px-3 py-2 border-t border-gray-200 bg-white">
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {quickResponses.map((response, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(response)}
              className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded-full whitespace-nowrap transition-colors duration-200 flex-shrink-0"
            >
              {response}
            </button>
          ))}
        </div>
      </div>

      {}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about courses, pricing..."
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={isTyping}
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg p-2 transition-all duration-200 flex-shrink-0"
            aria-label="Send message"
          >
            <BsSend className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          Press Enter to send • Powered by Gemini AI
        </p>
      </div>
    </div>
  );
};

export default Chatbot;
