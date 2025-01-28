import React, { useState, useEffect } from 'react';
import { Send, Loader2, Image as ImageIcon, Settings as SettingsIcon, FileText } from 'lucide-react';
import { useOpenAI } from './hooks/useOpenAI';
import { Settings } from './components/Settings';
import { RequirementForm } from './components/RequirementForm';

type Message = {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
};

function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'chat' | 'image'>('chat');
  const [showSettings, setShowSettings] = useState(false);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const { loading, error, sendMessage, generateImage } = useOpenAI();

  // 检查是否已设置 API Key
  useEffect(() => {
    const apiKey = localStorage.getItem('openai_api_key');
    if (!apiKey) {
      setShowSettings(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const newMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    try {
      if (mode === 'chat') {
        const response = await sendMessage([...messages, newMessage]);
        if (response) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: response.content || '',
            timestamp: new Date(),
          }]);
        }
      } else {
        const images = await generateImage(input);
        if (images && images.length > 0) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: images[0].url || '图片生成失败',
            timestamp: new Date(),
          }]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const handleRequirementSubmit = async (requirement: {
    purpose: string;
    target: string;
    goal: string;
    concern: string;
  }) => {
    const prompt = `
我要${requirement.purpose}，
要给${requirement.target}用，
希望达到${requirement.goal}效果，
但担心${requirement.concern}问题。

请给出专业的建议和解决方案。
    `.trim();

    setInput(prompt);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header */}
          <div className="p-4 bg-indigo-600 text-white flex justify-between items-center">
            <h1 className="text-xl font-bold">AI 助手</h1>
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setMode('chat')}
                className={`px-3 py-1 rounded ${mode === 'chat' ? 'bg-white text-indigo-600' : 'text-white'}`}
              >
                对话
              </button>
              <button
                onClick={() => setMode('image')}
                className={`px-3 py-1 rounded ${mode === 'image' ? 'bg-white text-indigo-600' : 'text-white'}`}
              >
                图片
              </button>
              <button
                onClick={() => setShowRequirementForm(true)}
                className="ml-2 p-1 hover:bg-indigo-700 rounded"
                title="需求描述"
              >
                <FileText className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="ml-2 p-1 hover:bg-indigo-700 rounded"
                title="设置"
              >
                <SettingsIcon className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {message.content.startsWith('http') ? (
                    <img src={message.content} alt="AI Generated" className="rounded-lg max-w-full" />
                  ) : (
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  )}
                  <div className={`text-xs mt-1 ${message.role === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
              </div>
            )}
            {error && (
              <div className="text-center text-red-500 bg-red-50 p-2 rounded">
                发生错误: {error.message}
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={mode === 'chat' ? '输入你的问题...' : '描述你想要生成的图片...'}
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : mode === 'chat' ? (
                  <Send className="w-6 h-6" />
                ) : (
                  <ImageIcon className="w-6 h-6" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      <Settings isOpen={showSettings} onClose={() => setShowSettings(false)} />
      <RequirementForm 
        isOpen={showRequirementForm} 
        onClose={() => setShowRequirementForm(false)}
        onSubmit={handleRequirementSubmit}
      />
    </div>
  );
}

export default App;