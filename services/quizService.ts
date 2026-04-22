import { Question, SubjectName } from '../types';
import { examsDatabase } from '../data/examsDatabase';

/**
 * Retrieves quizzes for a specific lesson title.
 * @param subject The name of the subject.
 * @param lessonTitle The title of the lesson.
 * @returns An array of quizzes (array of Question arrays) if found, otherwise undefined.
 */
export const getQuizzesForLesson = (subject: SubjectName, lessonTitle: string): Question[][] | undefined => {
  return examsDatabase[subject]?.[lessonTitle];
};
