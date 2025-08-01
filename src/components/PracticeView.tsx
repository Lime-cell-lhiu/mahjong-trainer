import React, { useState } from 'react';
import { Problem } from '../types';
import { updateProblem } from '../utils/storage';
import { Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';

interface PracticeViewProps {
  problem: Problem;
  onUpdate: (updatedProblem: Problem) => void;
}

export const PracticeView: React.FC<PracticeViewProps> = ({ problem, onUpdate }) => {
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const handleAnswer = (isCorrect: boolean) => {
    const updatedStats = {
      ...problem.stats,
      attempts: problem.stats.attempts + 1,
      correct: problem.stats.correct + (isCorrect ? 1 : 0)
    };
    
    updatedStats.accuracy = Math.round((updatedStats.correct / updatedStats.attempts) * 100);

    const updatedProblem = {
      ...problem,
      stats: updatedStats
    };

    updateProblem(updatedProblem);
    onUpdate(updatedProblem);
    setHasAnswered(true);
    
    setTimeout(() => {
      setHasAnswered(false);
      setShowingAnswer(false);
    }, 2000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{problem.title}</h2>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                {problem.category}
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">正答率</div>
              <div className="text-2xl font-bold text-blue-600">{problem.stats.accuracy}%</div>
              <div className="text-sm text-gray-500">({problem.stats.correct}/{problem.stats.attempts})</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {showingAnswer ? '解答' : '問題'}
              </h3>
              <button
                onClick={() => setShowingAnswer(!showingAnswer)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  showingAnswer
                    ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
                    : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                {showingAnswer ? <EyeOff size={16} /> : <Eye size={16} />}
                <span>{showingAnswer ? '問題に戻る' : '解答を表示'}</span>
              </button>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <img
                src={showingAnswer ? problem.answerImage : problem.questionImage}
                alt={showingAnswer ? '解答画像' : '問題画像'}
                className="max-w-full h-auto mx-auto rounded-lg shadow-sm"
              />
            </div>
          </div>

          {showingAnswer && !hasAnswered && (
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={() => handleAnswer(true)}
                className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <CheckCircle size={20} />
                <span>正解</span>
              </button>
              <button
                onClick={() => handleAnswer(false)}
                className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <XCircle size={20} />
                <span>不正解</span>
              </button>
            </div>
          )}

          {hasAnswered && (
            <div className="text-center">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg">
                <CheckCircle size={16} />
                <span>記録されました</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};