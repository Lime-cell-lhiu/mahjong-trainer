import React, { useState } from 'react';
import { Problem } from '../types';
import { ProblemCard } from './ProblemCard';
import { Plus, Search, Filter, RotateCcw } from 'lucide-react';

interface HomeViewProps {
  problems: Problem[];
  onPractice: (problem: Problem) => void;
  onDelete: (id: string) => void;
  onAddProblem: () => void;
  onStartReview: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ problems, onPractice, onDelete, onAddProblem, onStartReview }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = Array.from(new Set(problems.map(p => p.category)));
  const reviewProblems = problems.filter(p => p.stats.attempts > 0 && p.stats.accuracy < 80);

  const filteredProblems = problems.filter(problem => {
    const matchesSearch = problem.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || problem.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (problems.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-24 h-24 mx-auto mb-8 bg-blue-100 rounded-full flex items-center justify-center">
            <Plus size={32} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">問題がまだありません</h3>
          <p className="text-gray-600 mb-8">
            最初の問題を追加して、麻雀の実力向上を始めましょう。
          </p>
          <button
            onClick={onAddProblem}
            className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} />
            <span>問題を追加</span>
          </button>
          {reviewProblems.length > 0 && (
            <button
              onClick={onStartReview}
              className="inline-flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
            >
              <RotateCcw size={20} />
              <span>復習開始 ({reviewProblems.length}問)</span>
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* 検索・フィルター */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="問題を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="">全カテゴリ</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 統計サマリー */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">{problems.length}</div>
            <div className="text-sm text-gray-600">総問題数</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {problems.reduce((sum, p) => sum + p.stats.attempts, 0)}
            </div>
            <div className="text-sm text-gray-600">総実施回数</div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {problems.length > 0 
                ? Math.round(problems.reduce((sum, p) => sum + p.stats.accuracy, 0) / problems.length)
                : 0}%
            </div>
            <div className="text-sm text-gray-600">平均正答率</div>
          </div>
        </div>
      </div>

      {/* 復習モードボタン */}
      {reviewProblems.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-amber-800 mb-2">復習が必要な問題があります</h3>
              <p className="text-amber-700">
                正答率が80%未満の問題が{reviewProblems.length}問あります。復習して理解を深めましょう。
              </p>
            </div>
            <button
              onClick={onStartReview}
              className="flex items-center space-x-2 px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors whitespace-nowrap"
            >
              <RotateCcw size={20} />
              <span>復習開始</span>
            </button>
          </div>
        </div>
      )}

      {/* 問題一覧 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProblems.map(problem => (
          <ProblemCard
            key={problem.id}
            problem={problem}
            onPractice={onPractice}
            onDelete={onDelete}
          />
        ))}
      </div>

      {filteredProblems.length === 0 && problems.length > 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600">検索条件に一致する問題が見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
};