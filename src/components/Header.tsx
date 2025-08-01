import React from 'react';
import { AppState } from '../types';
import { Home, Plus, BarChart3, ArrowLeft, RotateCcw } from 'lucide-react';

interface HeaderProps {
  appState: AppState;
  onViewChange: (view: AppState['currentView']) => void;
}

export const Header: React.FC<HeaderProps> = ({ appState, onViewChange }) => {
  const getTitle = () => {
    switch (appState.currentView) {
      case 'home':
        return '麻雀誤り分析';
      case 'add':
        return '問題を追加';
      case 'practice':
        return appState.currentProblem?.title || '問題練習';
      case 'stats':
        return '成績統計';
      case 'review':
        return '復習モード';
      default:
        return '麻雀誤り分析';
    }
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {appState.currentView !== 'home' && (
              <button
                onClick={() => onViewChange('home')}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h1 className="text-2xl font-bold text-gray-900">{getTitle()}</h1>
          </div>
          
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => onViewChange('home')}
              className={`p-2 rounded-lg transition-colors ${
                appState.currentView === 'home'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Home size={20} />
            </button>
            <button
              onClick={() => onViewChange('add')}
              className={`p-2 rounded-lg transition-colors ${
                appState.currentView === 'add'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <Plus size={20} />
            </button>
            <button
              onClick={() => onViewChange('stats')}
              className={`p-2 rounded-lg transition-colors ${
                appState.currentView === 'stats'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <BarChart3 size={20} />
            </button>
            <button
              onClick={() => onViewChange('review')}
              className={`p-2 rounded-lg transition-colors ${
                appState.currentView === 'review'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              <RotateCcw size={20} />
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};