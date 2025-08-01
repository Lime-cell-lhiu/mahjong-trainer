import React from 'react';
import { Problem } from '../types';
import { Play, Trash2, BarChart3 } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  onPractice: (problem: Problem) => void;
  onDelete: (id: string) => void;
}

export const ProblemCard: React.FC<ProblemCardProps> = ({ problem, onPractice, onDelete }) => {
  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-100';
    if (accuracy >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{problem.title}</h3>
          <span className="inline-block px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
            {problem.category}
          </span>
        </div>
        <button
          onClick={() => onDelete(problem.id)}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="flex items-center space-x-4 mb-4">
        <div className="flex items-center space-x-2">
          <BarChart3 size={16} className="text-gray-500" />
          <span className="text-sm text-gray-600">
            {problem.stats.attempts}回実施
          </span>
        </div>
        <div className={`px-2 py-1 rounded-full text-sm font-medium ${getAccuracyColor(problem.stats.accuracy)}`}>
          {problem.stats.accuracy}% 正答率
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          正解: {problem.stats.correct}/{problem.stats.attempts}
        </div>
        <button
          onClick={() => onPractice(problem)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Play size={16} />
          <span>練習開始</span>
        </button>
      </div>
    </div>
  );
};