export interface Problem {
  id: string;
  title: string;
  category: string;
  questionImage: string;
  answerImage: string;
  stats: {
    correct: number;
    attempts: number;
    accuracy: number;
  };
  createdAt: string;
}

export interface AppState {
  problems: Problem[];
  currentView: 'home' | 'add' | 'practice' | 'stats' | 'review';
  currentProblem: Problem | null;
  showingAnswer: boolean;
  reviewProblems: Problem[];
  reviewIndex: number;
}