import React, { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  Input, 
  Button, 
  Avatar, 
  Chip,
  Divider,
  ScrollShadow
} from '@heroui/react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  type?: 'text' | 'code' | 'suggestion';
}

interface ChatInterfaceProps {
  isOpen: boolean;
  onClose?: () => void;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'list_customers erfolgreich ausgeführt',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 300000),
    type: 'suggestion'
  },
  {
    id: '2',
    content: '2 customers Einträge gefunden',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 240000),
  },
  {
    id: '3',
    content: 'what data do you have? please in english',
    sender: 'user',
    timestamp: new Date(Date.now() - 180000),
  },
  {
    id: '4',
    content: 'I have data about customers including their ID, name, company, customer number, email, phone, status, number of projects, revenue, and some additional details like address, portal link, and other metadata.\n\nFor example, I have customers with details such as:\n\n• Customer ID and name\n• Contact information (email, phone)\n• Status (e.g. active)\n• Number of projects associated\n• Revenue information\n• Portal access links\n• Addresses and additional contacts if available\n\nI also have data on projects, tasks, milestones, calendar events, workflows, team members, and many other related entities that help manage customer projects and interactions comprehensively.',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 120000),
  }
];

export function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: 'I understand your request. Let me help you with that information.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('de-DE', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 h-full w-96 bg-dark-bg-primary border-l border-dark-bg-tertiary flex flex-col z-50">
      {/* Chat Header */}
      <div className="p-4 border-b border-dark-bg-tertiary">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span className="text-dark-text-primary font-medium">Chats</span>
            </div>
            <Button
              isIconOnly
              variant="light"
              size="sm"
              className="text-dark-text-secondary hover:text-dark-text-primary"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </Button>
          </div>
          <Button
            isIconOnly
            variant="light"
            size="sm"
            onPress={onClose}
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </Button>
        </div>

        <div className="mt-3">
          <Button
            variant="light"
            size="sm"
            className="text-dark-text-secondary hover:text-dark-text-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            New Chat
          </Button>
        </div>
      </div>

      {/* Active Chat Indicator */}
      <div className="p-3 bg-dark-bg-secondary border-b border-dark-bg-tertiary">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span className="text-sm text-dark-text-primary">openai/gpt-4-turbo</span>
          <Chip size="sm" variant="flat" className="bg-green-100 text-green-800 text-xs">
            43 min
          </Chip>
        </div>
      </div>

      {/* Messages */}
      <ScrollShadow className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex items-start space-x-2 max-w-[80%] ${
                message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}>
                <Avatar
                  size="sm"
                  name={message.sender === 'user' ? 'DU' : 'KI'}
                  className={message.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'}
                />
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-600 text-white' 
                    : message.type === 'suggestion'
                    ? 'bg-green-600 text-white'
                    : 'bg-dark-bg-secondary text-dark-text-primary'
                }`}>
                  {message.type === 'suggestion' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-xs font-medium">Erfolgreich</span>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs opacity-70">
                      {message.sender === 'assistant' ? 'KI-Assistant' : 'DU'} · {formatTime(message.timestamp)}
                    </span>
                    {message.sender === 'assistant' && (
                      <div className="flex space-x-1">
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="w-6 h-6 min-w-6 opacity-70 hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </Button>
                        <Button
                          isIconOnly
                          variant="light"
                          size="sm"
                          className="w-6 h-6 min-w-6 opacity-70 hover:opacity-100"
                        >
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex justify-start">
            <div className="flex items-start space-x-2">
              <Avatar size="sm" name="KI" className="bg-purple-600" />
              <div className="bg-dark-bg-secondary text-dark-text-primary rounded-lg p-3">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-dark-text-tertiary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </ScrollShadow>

      {/* Input Area */}
      <div className="p-4 border-t border-dark-bg-tertiary">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            placeholder="Nachricht schreiben..."
            value={inputValue}
            onValueChange={setInputValue}
            onKeyPress={handleKeyPress}
            classNames={{
              input: "text-dark-text-primary placeholder:text-dark-text-tertiary",
              inputWrapper: "bg-dark-bg-secondary border-dark-bg-tertiary hover:border-dark-text-tertiary focus-within:border-blue-500"
            }}
            endContent={
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="text-dark-text-tertiary hover:text-dark-text-primary"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
              </Button>
            }
          />
          <Button
            isIconOnly
            color="primary"
            onPress={handleSendMessage}
            isDisabled={!inputValue.trim()}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-dark-text-tertiary">Enter zum Senden</span>
          <span className="text-xs text-dark-text-tertiary">Shift + Enter für neue Zeile</span>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
