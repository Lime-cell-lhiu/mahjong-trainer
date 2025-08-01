import React, { useState, useEffect } from 'react';
import { AppState, Problem } from './types';
import { loadProblems, deleteProblem } from './utils/storage';
import { Header } from './components/Header';
import { HomeView } from './components/HomeView';
import { AddProblemForm } from './components/AddProblemForm';
import { PracticeView } from './components/PracticeView';
import { StatsView } from './components/StatsView';
import { ReviewView } from './components/ReviewView';

function App() {
  const [appState, setAppState] = useState<AppState>({
    problems: [],
    currentView: 'home',
    currentProblem: null,
    showingAnswer: false,
    reviewProblems: [],
    reviewIndex: 0
  });

  useEffect(() => {
    const problems = loadProblems();
    setAppState(prev => ({ ...prev, problems }));
  }, []);

  const handleViewChange = (view: AppState['currentView']) => {
    setAppState(prev => ({ 
      ...prev, 
      currentView: view,
      currentProblem: view === 'home' ? null : prev.currentProblem
    }));
  };

  const handlePractice = (problem: Problem) => {
    setAppState(prev => ({
      ...prev,
      currentView: 'practice',
      currentProblem: problem,
      showingAnswer: false
    }));
  };

  const handleDelete = (id: string) => {
    if (window.confirm('この問題を削除しますか？')) {
      deleteProblem(id);
      const updatedProblems = loadProblems();
      setAppState(prev => ({ ...prev, problems: updatedProblems }));
    }
  };

  const handleAddSuccess = () => {
    const problems = loadProblems();
    setAppState(prev => ({ 
      ...prev, 
      problems, 
      currentView: 'home' 
    }));
  };

  const handleProblemUpdate = (updatedProblem: Problem) => {
    const updatedProblems = appState.problems.map(p => 
      p.id === updatedProblem.id ? updatedProblem : p
    );
    setAppState(prev => ({ 
      ...prev, 
      problems: updatedProblems,
      currentProblem: updatedProblem
    }));
  };

  const handleStartReview = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'review'
    }));
  };

  const handleReviewComplete = () => {
    setAppState(prev => ({
      ...prev,
      currentView: 'home'
    }));
  };

  const renderCurrentView = () => {
    switch (appState.currentView) {
      case 'home':
        return (
          <HomeView
            problems={appState.problems}
            onPractice={handlePractice}
            onDelete={handleDelete}
            onAddProblem={() => handleViewChange('add')}
            onStartReview={handleStartReview}
          />
        );
      case 'add':
        return <AddProblemForm onSuccess={handleAddSuccess} />;
      case 'practice':
        return appState.currentProblem ? (
          <PracticeView
            problem={appState.currentProblem}
            onUpdate={handleProblemUpdate}
          />
        ) : null;
      case 'stats':
        return <StatsView problems={appState.problems} />;
      case 'review':
        return (
          <ReviewView
            problems={appState.problems}
            onUpdate={handleProblemUpdate}
            onComplete={handleReviewComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header appState={appState} onViewChange={handleViewChange} />
      <main className="py-8 px-4">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;