import React, { useState } from 'react';
import { FileText, AlertCircle } from 'lucide-react';

type RequirementFormProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (requirement: {
    purpose: string;
    target: string;
    goal: string;
    concern: string;
  }) => void;
};

export function RequirementForm({ isOpen, onClose, onSubmit }: RequirementFormProps) {
  const [requirement, setRequirement] = useState({
    purpose: '',
    target: '',
    goal: '',
    concern: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(requirement);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-5 h-5" />
            需求描述
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-900">填写说明</h3>
                <p className="text-sm text-blue-800 mt-1">
                  请按照以下格式描述您的需求，这将帮助 AI 更好地理解和满足您的要求。
                </p>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              我要做什么？
            </label>
            <textarea
              value={requirement.purpose}
              onChange={(e) => setRequirement(prev => ({ ...prev, purpose: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              placeholder="例如：我要做一个在线教育平台"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              要给谁用？
            </label>
            <textarea
              value={requirement.target}
              onChange={(e) => setRequirement(prev => ({ ...prev, target: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              placeholder="例如：主要面向中小学生和他们的家长"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              希望达到什么效果？
            </label>
            <textarea
              value={requirement.goal}
              onChange={(e) => setRequirement(prev => ({ ...prev, goal: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              placeholder="例如：让学生能够在线学习，家长可以监督学习进度"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              担心什么问题？
            </label>
            <textarea
              value={requirement.concern}
              onChange={(e) => setRequirement(prev => ({ ...prev, concern: e.target.value }))}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[80px]"
              placeholder="例如：担心平台性能不够好，学生使用不方便"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              提交需求
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}