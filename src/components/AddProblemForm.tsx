import React, { useState } from 'react';
import { Problem } from '../types';
import { convertToBase64, generateId } from '../utils/imageUtils';
import { addProblem, loadCategories, addCategory, loadTitleHistory, addTitleToHistory } from '../utils/storage';
import { Upload, Plus, X } from 'lucide-react';

interface AddProblemFormProps {
  onSuccess: () => void;
}

export const AddProblemForm: React.FC<AddProblemFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '捨て牌',
    questionImage: '',
    answerImage: ''
  });
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [titleHistory, setTitleHistory] = useState<string[]>([]);
  const [showTitleDropdown, setShowTitleDropdown] = useState(false);

  React.useEffect(() => {
    setCategories(loadCategories());
    setTitleHistory(loadTitleHistory());
  }, []);

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      addCategory(newCategory.trim());
      setFormData(prev => ({ ...prev, category: newCategory.trim() }));
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const handleTitleSelect = (title: string) => {
    setFormData(prev => ({ ...prev, title }));
    setShowTitleDropdown(false);
  };

  const handleImageUpload = async (file: File, type: 'questionImage' | 'answerImage') => {
    try {
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, [type]: base64 }));
    } catch (error) {
      console.error('Error converting image:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.questionImage || !formData.answerImage) return;

    setLoading(true);
    try {
      const newProblem: Problem = {
        id: generateId(),
        title: formData.title,
        category: formData.category,
        questionImage: formData.questionImage,
        answerImage: formData.answerImage,
        stats: {
          correct: 0,
          attempts: 0,
          accuracy: 0
        },
        createdAt: new Date().toISOString()
      };

      addProblem(newProblem);
      addTitleToHistory(formData.title);
      setFormData({ title: '', category: '捨て牌', questionImage: '', answerImage: '' });
      onSuccess();
    } catch (error) {
      console.error('Error adding problem:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題タイトル
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                onFocus={() => setShowTitleDropdown(true)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="例：第3巡目の捨て牌選択"
                required
              />
              {showTitleDropdown && titleHistory.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  <div className="p-2 text-xs text-gray-500 border-b">過去のタイトル履歴</div>
                  {titleHistory.map((title, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTitleSelect(title)}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 text-sm"
                    >
                      {title}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              カテゴリ
            </label>
            <div className="space-y-2">
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              {!showCategoryInput ? (
                <button
                  type="button"
                  onClick={() => setShowCategoryInput(true)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  + 新しいカテゴリを追加
                </button>
              ) : (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="新しいカテゴリ名"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                  />
                  <button
                    type="button"
                    onClick={handleAddCategory}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    追加
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCategoryInput(false);
                      setNewCategory('');
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              問題画像
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {formData.questionImage ? (
                <div>
                  <img src={formData.questionImage} alt="問題画像" className="max-w-full h-48 object-contain mx-auto mb-4 rounded-lg" />
                  <p className="text-sm text-green-600">問題画像がアップロードされました</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">問題画像をアップロード</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'questionImage');
                }}
                className="mt-2"
                required={!formData.questionImage}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              解答画像
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
              {formData.answerImage ? (
                <div>
                  <img src={formData.answerImage} alt="解答画像" className="max-w-full h-48 object-contain mx-auto mb-4 rounded-lg" />
                  <p className="text-sm text-green-600">解答画像がアップロードされました</p>
                </div>
              ) : (
                <div>
                  <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600 mb-2">解答画像をアップロード</p>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file, 'answerImage');
                }}
                className="mt-2"
                required={!formData.answerImage}
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={loading || !formData.title || !formData.questionImage || !formData.answerImage}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Plus size={16} />
            <span>{loading ? '追加中...' : '問題を追加'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};