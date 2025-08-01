import React from 'react';
import { Problem } from '../types';
import { BarChart3, Target, TrendingUp, Award } from 'lucide-react';

interface StatsViewProps {
  problems: Problem[];
}

export const StatsView: React.FC<StatsViewProps> = ({ problems }) => {
  const totalAttempts = problems.reduce((sum, p) => sum + p.stats.attempts, 0);
  const totalCorrect = problems.reduce((sum, p) => sum + p.stats.correct, 0);
  const overallAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  const categoryStats = problems.reduce((acc, problem) => {
    if (!acc[problem.category]) {
      acc[problem.category] = { correct: 0, attempts: 0, accuracy: 0 };
    }
    acc[problem.category].correct += problem.stats.correct;
    acc[problem.category].attempts += problem.stats.attempts;
    acc[problem.category].accuracy = acc[problem.category].attempts > 0 
      ? Math.round((acc[problem.category].correct / acc[problem.category].attempts) * 100)
      : 0;
    return acc;
  }, {} as Record<string, { correct: number; attempts: number; accuracy: number }>);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return 'text-green-600 bg-green-100';
    if (accuracy >= 60) return 'text-amber-600 bg-amber-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* 全体統計 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総問題数</p>
              <p className="text-2xl font-bold text-gray-900">{problems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Target className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総実施回数</p>
              <p className="text-2xl font-bold text-gray-900">{totalAttempts}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">総正解数</p>
              <p className="text-2xl font-bold text-gray-900">{totalCorrect}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Award className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">全体正答率</p>
              <p className="text-2xl font-bold text-gray-900">{overallAccuracy}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* カテゴリ別統計 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">カテゴリ別成績</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(categoryStats).map(([category, stats]) => (
            <div key={category} className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">実施回数</span>
                  <span className="font-medium">{stats.attempts}回</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">正解数</span>
                  <span className="font-medium">{stats.correct}回</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">正答率</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${getAccuracyColor(stats.accuracy)}`}>
                    {stats.accuracy}%
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 問題別詳細統計 */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">問題別成績</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  問題名
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  カテゴリ
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  実施回数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  正解数
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  正答率
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {problems.map((problem) => (
                <tr key={problem.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {problem.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                      {problem.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.stats.attempts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {problem.stats.correct}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getAccuracyColor(problem.stats.accuracy)}`}>
                      {problem.stats.accuracy}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};