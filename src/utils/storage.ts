import { Problem } from '../types';

const STORAGE_KEY = 'mahjong_problems';
const CATEGORIES_KEY = 'mahjong_categories';
const TITLES_KEY = 'mahjong_titles';

export const loadProblems = (): Problem[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading problems:', error);
    return [];
  }
};

export const saveProblems = (problems: Problem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(problems));
  } catch (error) {
    console.error('Error saving problems:', error);
  }
};

export const addProblem = (problem: Problem): void => {
  const problems = loadProblems();
  problems.push(problem);
  saveProblems(problems);
};

export const updateProblem = (updatedProblem: Problem): void => {
  const problems = loadProblems();
  const index = problems.findIndex(p => p.id === updatedProblem.id);
  if (index !== -1) {
    problems[index] = updatedProblem;
    saveProblems(problems);
  }
};

export const deleteProblem = (id: string): void => {
  const problems = loadProblems();
  const filtered = problems.filter(p => p.id !== id);
  saveProblems(filtered);
};

export const loadCategories = (): string[] => {
  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    const defaultCategories = ['捨て牌', 'リーチ判断', '押し引き', 'テンパイ形', '鳴き判断', 'その他'];
    return stored ? [...defaultCategories, ...JSON.parse(stored)] : defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return ['捨て牌', 'リーチ判断', '押し引き', 'テンパイ形', '鳴き判断', 'その他'];
  }
};

export const saveCategories = (categories: string[]): void => {
  try {
    const defaultCategories = ['捨て牌', 'リーチ判断', '押し引き', 'テンパイ形', '鳴き判断', 'その他'];
    const customCategories = categories.filter(cat => !defaultCategories.includes(cat));
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(customCategories));
  } catch (error) {
    console.error('Error saving categories:', error);
  }
};

export const addCategory = (category: string): void => {
  const categories = loadCategories();
  if (!categories.includes(category)) {
    categories.push(category);
    saveCategories(categories);
  }
};

export const loadTitleHistory = (): string[] => {
  try {
    const stored = localStorage.getItem(TITLES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading title history:', error);
    return [];
  }
};

export const saveTitleHistory = (titles: string[]): void => {
  try {
    localStorage.setItem(TITLES_KEY, JSON.stringify(titles));
  } catch (error) {
    console.error('Error saving title history:', error);
  }
};

export const addTitleToHistory = (title: string): void => {
  const titles = loadTitleHistory();
  if (!titles.includes(title)) {
    titles.unshift(title);
    // 最大20件まで保持
    if (titles.length > 20) {
      titles.pop();
    }
    saveTitleHistory(titles);
  }
};