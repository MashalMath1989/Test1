import { Question, SubjectName } from '../types';

export const examsDatabase: {
    [key in SubjectName]?: {
        [lessonTitle: string]: Question[][]
    }
} = {};

/**
 * تحديث قاعدة البيانات بأسئلة لدرس محدد
 */
export const updateDatabase = (subject: SubjectName, lessonTitle: string, questions: Question[]) => {
    try {
        if (!questions || !Array.isArray(questions)) return;

        if (!examsDatabase[subject]) {
            examsDatabase[subject] = {};
        }

        // بالنسبة للغة العربية، يتم تحميل الامتحان كاملاً كمجموعة واحدة (Chunk)
        // أما المواد الأخرى فيتم تقسيمها إلى مجموعات من 10 أسئلة
        const chunks: Question[][] = [];
        
        if (subject === SubjectName.Arabic) {
            chunks.push(questions);
        } else {
            for (let i = 0; i < questions.length; i += 10) {
                chunks.push(questions.slice(i, i + 10));
            }
        }

        examsDatabase[subject]![lessonTitle] = chunks;
        console.log(`[JoSchool DB] Loaded ${questions.length} questions for ${lessonTitle}`);
    } catch (e) {
        console.error("[JoSchool DB] Update failed", e);
    }
};