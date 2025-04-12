'use client';

import { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function HealthChatbot() {
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi there! Im your health assistant.How are you feeling today? Please describe any symptoms youre experiencing.'
    }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmergency, setShowEmergency] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const router = useRouter();
    const pathname = usePathname();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Focus input on initial load
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = { role: 'user', content: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/health-chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMessage]
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                { role: 'assistant', content: data.message }
            ]);

            // If emergency was detected, show emergency UI
            if (data.emergency) {
                setShowEmergency(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setMessages((prev) => [
                ...prev,
                {
                    role: 'assistant',
                    content: 'I apologize, but Im having trouble processing your request right now.Please try again later.'
        }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-indigo-50 to-blue-50">
            {/* Header */}
            <header className="px-6 py-4 bg-white shadow-sm z-10">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <span className="flex h-10 w-10 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 items-center justify-center text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <h1 className="ml-3 text-xl font-bold text-gray-800">Health Assist AI</h1>
                    </div>
                    <div className="hidden md:flex space-x-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Powered by Groq</span>
                    </div>
                </div>
            </header>

            {/* Chat Container */}
            <main className="flex-1 overflow-hidden flex flex-col max-w-5xl w-full mx-auto px-4 pt-4 pb-20 relative">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto pr-4">
                    <div className="space-y-6">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${message.role === 'user'
                                            ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white rounded-tr-none'
                                            : 'bg-white shadow-md rounded-tl-none'
                                        }`}
                                >
                                    {message.role === 'assistant' && (
                                        <div className="w-full flex items-center mb-1">
                                            <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <span className="ml-2 text-sm font-medium text-blue-700">Health Assistant</span>
                                        </div>
                                    )}
                                    <div className={`prose ${message.role === 'user' ? 'text-white' : 'text-gray-800'} max-w-none`}>
                                        {message.role === 'assistant' ? (
                                            <div dangerouslySetInnerHTML={{ __html: message.content.replace(/\n/g, '<br />') }} />
                                        ) : (
                                            message.content
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="max-w-[80%] px-4 py-3 rounded-2xl bg-white shadow-md rounded-tl-none">
                                    <div className="flex space-x-2 items-center">
                                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse"></div>
                                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse delay-100"></div>
                                        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse delay-200"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Emergency Alert */}
                {showEmergency && (
                    <div className="absolute bottom-24 left-4 right-4 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-red-800">Emergency Services</h3>
                                <div className="mt-2 text-sm text-red-700 space-y-1">
                                    <p>Based on your symptoms, immediate medical attention may be needed.</p>
                                    <p className="font-bold">Emergency Phone: 911</p>
                                    <p className="font-medium mt-1">Nearby Emergency Facilities:</p>
                                    <ul className="list-disc pl-5 space-y-1">
                                        <li>City General Hospital: (555) 123-4567</li>
                                        <li>Mercy Medical Center: (555) 765-4321</li>
                                        <li>University Health Center: (555) 987-6543</li>
                                    </ul>
                                </div>
                                <div className="mt-3">
                                    <button
                                        type="button"
                                        className="bg-red-600 px-4 py-2 rounded-md text-white text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => window.open('tel:911')}
                                    >
                                        Call Emergency Services
                                    </button>
                                </div>
                            </div>
                            <div className="ml-auto pl-3">
                                <div className="-mx-1.5 -my-1.5">
                                    <button
                                        type="button"
                                        className="inline-flex bg-red-50 rounded-md p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                        onClick={() => setShowEmergency(false)}
                                    >
                                        <span className="sr-only">Dismiss</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="mt-4 sticky bottom-0 bg-gradient-to-br from-indigo-50 to-blue-50 p-4 rounded-xl shadow-lg border border-blue-100">
                    <div className="flex items-end space-x-2">
                        <div className="flex-1 min-h-[56px] bg-white overflow-hidden rounded-xl shadow-sm border border-gray-200 focus-within:border-blue-400 focus-within:ring-1 focus-within:ring-blue-400">
                            <textarea
                                ref={inputRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe your symptoms..."
                                className="block w-full resize-none border-0 bg-transparent py-3 px-4 placeholder-gray-500 focus:outline-none focus:ring-0 sm:text-sm"
                                rows={1}
                                style={{ height: 'auto', minHeight: '56px', maxHeight: '150px' }}
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !input.trim()}
                            className={`
                flex-shrink-0 p-2 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                ${isLoading || !input.trim()
                                    ? 'bg-gray-300 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700'}
              `}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex items-center justify-between">
                        <p>Type your health concerns or symptoms</p>
                        <div className="flex items-center text-xs">
                            <span className="text-xs text-blue-500">Press Enter to send</span>
                        </div>
                    </div>
                </form>

                {/* Disclaimer */}
                <div className="w-full text-center text-xs text-gray-500 mt-3 pb-4">
                    <p>This AI health assistant is not a substitute for professional medical advice, diagnosis, or treatment.</p>
                    <p>In case of emergency, please call your local emergency services immediately.</p>
                </div>
            </main>
        </div>
    );
}