import React, { useState, useEffect } from 'react';
import { Key, X } from 'lucide-react';

type SettingsProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function Settings({ isOpen, onClose }: SettingsProps) {
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const savedKey = localStorage.getItem('openai_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('openai_api_key', apiKey);
    onClose();
    window.location.reload(); // 重新加载页面以更新 API key
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Key className="w-5 h-5" />
            设置
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-1">
              OpenAI API Key
            </label>
            <input
              type="password"
              id="apiKey"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="sk-..."
            />
            <p className="mt-1 text-sm text-gray-500">
              在此输入您的 OpenAI API Key。您可以在 
              <a 
                href="https://platform.openai.com/api-keys" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800"
              >
                OpenAI 平台
              </a> 
              获取密钥。
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              取消
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}