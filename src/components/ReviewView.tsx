import React, { useState, useEffect } from 'react';
import { Problem } from '../types';
import { updateProblem } from '../utils/storage';
import { Eye, EyeOff, CheckCircle, XCircle, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

interface ReviewViewProps {
  problems: Problem[];
  onUpdate: (updatedProblem: Problem) => void;
  onComplete: () => void;
}

export const ReviewView: React.FC<ReviewViewProps> = ({ problems, onUpdate, onComplete }) => {
  const [reviewProblems, setReviewProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showingAnswer, setShowingAnswer] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  useEffect(() => {
    // 正答率が80%未満の問題を復習対象とする
    const problemsToReview = problems.filter(p => p.stats.attempts > 0 && p.stats.accuracy < 80);
    setReviewProblems(problemsToReview);
    setCurrentIndex(0);
  }, [problems]);

  const currentProblem = reviewProblems[currentIndex];

  const handleAnswer = (isCorrect: boolean) => {
    if (!currentProblem) return;

    const updatedStats = {
      ...currentProblem.stats,
      attempts: currentProblem.stats.attempts + 1,
      correct: currentProblem.stats.correct + (isCorrect ? 1 : 0)
    };
    
    updatedStats.accuracy = Math.round((updatedStats.correct / updatedStats.attempts) * 100);

    const updatedProblem = {
      ...currentProblem,
      stats: updatedStats
    };

    updateProblem(updatedProblem);
    onUpdate(updatedProblem);
    setHasAnswered(true);
    
    setTimeout(() => {
      setHasAnswered(false);
      setShowingAnswer(false);
      
      if (currentIndex < reviewProblems.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        // 復習完了
        onComplete();
      }
    }, 1500);
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowingAnswer(false);
      setHasAnswered(false);
    }
  };

  const goToNext = () => {
    if (currentIndex < reviewProblems.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowingAnswer(false);
      setHasAnswered(false);
    }
  };

  if (reviewProblems.length === 0) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-24 h-24 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-4">復習する問題がありません</h3>
        <p className="text-gray-600 mb-8">
          正答率が80%未満の問題がないため、復習の必要がありません。<br />
          素晴らしい成績です！
        </p>
        <button
          onClick={onComplete}
          className="inline-flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <ArrowLeft size={20} />
          <span>ホームに戻る</span>
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <RotateCcw size={20} className="text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-900">復習モード</h2>
              </div>
              <div className="text-sm text-gray-500">
                {currentIndex + 1} / {reviewProblems.length}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={goToPrevious}
                disabled={currentIndex === 0}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={20} />
              </button>
              <button
                onClick={goToNext}
                disabled={currentIndex === reviewProblems.length - 1}
                className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{currentProblem.title}</h3>
              <span className="inline-block mt-2 px-3 py-1 text-sm font-medium bg-amber-100 text-amber-700 rounded-full">
                {currentProblem.category} • 正答率 {currentProblem.stats.accuracy}%
              </span>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">現在の成績</div>
              <div className="text-lg font-bold text-amber-600">{currentProblem.stats.accuracy}%</div>
              <div className="text-sm text-gray-500">({currentProblem.stats.correct}/{currentProblem.stats.attempts})</div>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium text-gray-900">
                {showingAnswer ? '解答' : '問題'}
              </h4>
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
                src={showingAnswer ? currentProblem.answerImage : currentProblem.questionImage}
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

      {/* 進捗バー */}
      <div className="mt-6 bg-white rounded-lg p-4 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">復習進捗</span>
          <span className="text-sm text-gray-500">{Math.round(((currentIndex + 1) / reviewProblems.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / reviewProblems.length) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};