import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, Subject, SubjectName, Question, Semester } from './types';
import { subjectsData, subjectIndexData } from './data';
import { getQuizzesForLesson } from './services/quizService';
import { updateDatabase, examsDatabase } from './data/examsDatabase';
import { ArrowLeftIcon, ChevronDownIcon, StarIcon, XIcon, CheckIcon, BookOpenIcon, BookmarkOutlineIcon, RefreshIcon, ChevronLeftIcon, LogOutIcon, UserIcon } from './data/Icons';
import { auth, db, googleProvider, OperationType, handleFirestoreError } from './firebase';
import { 
    onAuthStateChanged, 
    signInWithPopup, 
    signOut, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    updateProfile,
    User as FirebaseUser 
} from 'firebase/auth';
import { 
    doc, 
    setDoc, 
    getDoc, 
    updateDoc, 
    serverTimestamp, 
    increment, 
    collection, 
    addDoc,
    deleteDoc,
    query,
    where,
    getDocs,
    onSnapshot
} from 'firebase/firestore';

// روابط امتحانات مادة تاريخ الأردن - الفصل الأول
const HISTORY_U1_EXAMS = [
    { title: "الدرس الأول: الأردن في العصور الحجرية – صفحة 8", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit1_exam1.json" },
    { title: "الدرس الثاني: الأردن في العصر الحديدي – صفحة 16", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit1_exam2.json" },
    { title: "الدرس الثالث: مملكة الأنباط – صفحة 22", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit1_exam3.json" },
    { title: "الدرس الرابع: مظاهر الحضارتين اليونانية والرومانية–البيزنطية في الأردن – صفحة 31", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit1_exam4.json" }
];

const HISTORY_U2_EXAMS = [
    { title: "الدرس الأول: الأردن في صدر الإسلام – صفحة 46", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit2_exam1.json" },
    { title: "الدرس الثاني: الأردن في العصرين الأموي والعباسي – صفحة 56", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit2_exam2.json" },
    { title: "الدرس الثالث: الأردن خلال حملات الفرنجة – صفحة 66", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit2_exam3.json" },
    { title: "الدرس الرابع: الأردن في العصر الأيوبي – صفحة 72", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit2_exam4.json" },
    { title: "الدرس الخامس: الأردن في العصر المملوكي – صفحة 77", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit2_exam5.json" }
];

const HISTORY_U3_EXAMS = [
    { title: "الدرس الأول: الأوضاع السياسية والإدارية في الأردن في العهد العثماني – صفحة 88", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit3_exam1.json" },
    { title: "الدرس الثاني: الأوضاع الاجتماعية والاقتصادية في الأردن في العهد العثماني – صفحة 94", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit3_exam2.json" },
    { title: "الدرس الثالث: الثورة العربية الكبرى (النهضة العربية) – صفحة 105", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit3_exam3.json" },
    { title: "الدرس الرابع: الأردن في عهد المملكة العربية السورية والحكومات المحلية – صفحة 118", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/history_s1_unit3_exam4.json" }
];

// روابط امتحانات التربية الإسلامية
const ISLAMIC_U1_EXAMS = [
    { title: "الدرس الأول: سورة آل عمران الآيات الكريمة (١٠٢–١٠٥) – صفحة 6", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam1.json" },
    { title: "الدرس الثاني: الحديث الشريف: اتقاء الشبهات – صفحة 12", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam2.json" },
    { title: "الدرس الثالث: من صور الضلال – صفحة 20", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam3.json" },
    { title: "الدرس الرابع: كرامة الإنسان في الشريعة الإسلامية – صفحة 26", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam4.json" },
    { title: "الدرس الخامس: الزواج: مشروعيته ومقدماته – صفحة 31", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam5.json" },
    { title: "الدرس السادس: الجهاد في الإسلام – صفحة 37", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit1_exam6.json" }
];
const ISLAMIC_U2_EXAMS = [
    { title: "الدرس الأول: جهود علماء المسلمين في خدمة القرآن الكريم – صفحة 44", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam1.json" },
    { title: "الدرس الثاني: العزيمة والرخصة – صفحة 50", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam2.json" },
    { title: "الدرس الثالث: معركة مؤتة (8 هـ) – صفحة 56", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam3.json" },
    { title: "الدرس الرابع: المحرّمات من النساء – صفحة 61", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam4.json" },
    { title: "الدرس الخامس: التعايش الإنساني – صفحة 67", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam5.json" },
    { title: "الدرس السادس: الحقوق الاجتماعية للمرأة في الإسلام – صفحة 73", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit2_exam6.json" }
];
const ISLAMIC_U3_EXAMS = [
    { title: "الدرس الأول: سورة آل عمران الآيات الكريمة (169–174) – صفحة 81", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam1.json" },
    { title: "الدرس الثاني: الحديث الشريف: رضا الله تعالى – صفحة 87", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam2.json" },
    { title: "الدرس الثالث: فتح مكة (8 هـ) – صفحة 93", page: 93, url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam3.json" },
    { title: "الدرس الرابع: من خصائص الشريعة الإسلامية: الإيجابية – صفحة 99", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam4.json" },
    { title: "الدرس الخامس: شروط صحة عقد الزواج – صفحة 105", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam5.json" },
    { title: "الدرس السادس: الحقوق المالية للمرأة في الإسلام – صفحة 110", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit3_exam6.json" }
];
const ISLAMIC_U4_EXAMS = [
    { title: "الدرس الأول: سورة الروم الآيات الكريمة (21–24) – صفحة 115", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam1.json" },
    { title: "الدرس الثاني: مكانة السنة النبوية الشريفة في التشريع الإسلامي – صفحة 120", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam2.json" },
    { title: "الدرس الثالث: مراعاة الأعراف في الشريعة الإسلامية – صفحة 128", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam3.json" },
    { title: "الدرس الرابع: حقوق الزوجين في الإسلام – صفحة 134", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam4.json" },
    { title: "الدرس الخامس: تنظيم النسل وتحديده – صفحة 141", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam5.json" },
    { title: "الدرس السادس: الأمن الغذائي في الإسلام – صفحة 146", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam6.json" },
    { title: "الدرس السابع: الإسلام والوحدة الوطنية – صفحة 152", url: "https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/Arabic-S1/Islamic_s1_unit4_exam7.json" }
];

// توليد روابط امتحانات اللغة العربية بتنسيق العناوين الجديد
const generateArabicExams = () => {
    const config = [
        { unit: 1, count: 12, unitLabel: "الوحدة الأولى" },
        { unit: 2, count: 12, unitLabel: "الوحدة الثانية" },
        { unit: 3, count: 13, unitLabel: "الوحدة الثالثة" },
        { unit: 4, count: 13, unitLabel: "الوحدة الرابعة" },
        { unit: 5, count: 14, unitLabel: "الوحدة الخامسة" },
    ];
    
    const allExams: { title: string, url: string }[] = [];
    config.forEach(c => {
        for(let i = 1; i <= c.count; i++) {
            let branch = "Arabic-S1";
            if (c.unit === 1 && i === 1) {
                branch = "main";
            }
            allExams.push({
                title: `${c.unitLabel} - امتحان ${i}`,
                url: `https://raw.githubusercontent.com/MashalMath/joschool-11-arabic-exams/${branch}/arabic_s1_unit${c.unit}_exam${i}.json`
            });
        }
    });
    return allExams;
};

const ARABIC_EXAMS = generateArabicExams();
const ARABIC_UNIT_LABELS = ["الوحدة الأولى", "الوحدة الثانية", "الوحدة الثالثة", "الوحدة الرابعة", "الوحدة الخامسة"];
const ARABIC_UNIT_COUNTS = [12, 12, 13, 13, 14];

const App: React.FC = () => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [viewHistory, setViewHistory] = useState<View[]>([View.Landing]);
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
    const [currentQuiz, setCurrentQuiz] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [userAnswers, setUserAnswers] = useState<(string | null)[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [expandedUnitIndices, setExpandedUnitIndices] = useState<number[]>([]);
    const [expandedLessonKeys, setExpandedLessonKeys] = useState<string[]>([]);
    const [isDbLoaded, setIsDbLoaded] = useState(false);
    const [showBackConfirmation, setShowBackConfirmation] = useState(false);
    const [showMultiBooksModal, setShowMultiBooksModal] = useState(false);
    const [quizProgressMap, setQuizProgressMap] = useState<Record<string, any>>({});
    const [completedExams, setCompletedExams] = useState<Set<string>>(new Set());
    const [resumeModal, setResumeModal] = useState<{ questions: Question[]; progress: any; title: string } | null>(null);
    const [currentExamTitle, setCurrentExamTitle] = useState<string>('');

    const isLeavingQuizRef = useRef(false);

    const currentView = viewHistory[viewHistory.length - 1];

    // Handle Auth State
    useEffect(() => {
        const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setIsAuthReady(true);
        });
        return () => unsubscribeAuth();
    }, []);

    // Handle User-specific Data Listeners and Profile Sync
    useEffect(() => {
        if (!user) {
            setQuizProgressMap({});
            setCompletedExams(new Set());
            return;
        }

        const uid = user.uid;

        // Fetch progress and completed exams with snapshot listeners
        const progressUnsubscribe = onSnapshot(
            collection(db, 'users', uid, 'quizProgress'), 
            (snapshot) => {
                const progress: Record<string, any> = {};
                snapshot.docs.forEach(doc => {
                    progress[doc.id] = doc.data();
                });
                setQuizProgressMap(progress);
            },
            (error) => {
                // Log and ignore permission-denied errors that often happen during logout
                if (error.code !== 'permission-denied') {
                    console.error("Error in quizProgress listener:", error);
                }
            }
        );

        const attemptsUnsubscribe = onSnapshot(
            collection(db, 'users', uid, 'attempts'), 
            (snapshot) => {
                const completed = new Set<string>();
                snapshot.docs.forEach(doc => {
                    const data = doc.data();
                    if (data.score === data.totalQuestions) {
                        completed.add(data.examTitle || data.subjectId + " - " + data.lessonTitle); // Fallback for old data
                    }
                });
                setCompletedExams(completed);
            },
            (error) => {
                // Log and ignore permission-denied errors that often happen during logout
                if (error.code !== 'permission-denied') {
                    console.error("Error in attempts listener:", error);
                }
            }
        );

        // Ensure user document exists in Firestore - only if needed
        const syncUserProfile = async () => {
            const userRef = doc(db, 'users', uid);
            try {
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        uid: uid,
                        email: user.email,
                        displayName: user.displayName || 'طالب',
                        photoURL: user.photoURL,
                        role: 'student',
                        createdAt: serverTimestamp(),
                        lastLogin: serverTimestamp()
                    });
                } else {
                    await updateDoc(userRef, {
                        lastLogin: serverTimestamp()
                    });
                }
            } catch (error) {
                console.error("Error updating user profile:", error);
            }
        };

        syncUserProfile();

        return () => {
            progressUnsubscribe();
            attemptsUnsubscribe();
        };
    }, [user]);

    const fetchExams = useCallback(() => {
        const examSets = [
            { subject: SubjectName.JordanHistory, exams: [...HISTORY_U1_EXAMS, ...HISTORY_U2_EXAMS, ...HISTORY_U3_EXAMS] },
            { subject: SubjectName.IslamicEducation, exams: [...ISLAMIC_U1_EXAMS, ...ISLAMIC_U2_EXAMS, ...ISLAMIC_U3_EXAMS, ...ISLAMIC_U4_EXAMS] },
            { subject: SubjectName.Arabic, exams: ARABIC_EXAMS }
        ];

        const allPromises: Promise<void>[] = [];

        examSets.forEach(set => {
            set.exams.forEach(item => {
                const p = fetch(item.url)
                    .then(res => {
                        if (!res.ok) return null;
                        return res.text();
                    })
                    .then(text => {
                        if (!text) return;
                        let cleanedText = text.replace(/^\uFEFF/, '').trim();
                        const firstBrace = cleanedText.indexOf('{');
                        const firstBracket = cleanedText.indexOf('[');
                        let start = -1;
                        let end = -1;

                        if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
                            start = firstBrace;
                            end = cleanedText.lastIndexOf('}');
                        } else if (firstBracket !== -1) {
                            start = firstBracket;
                            end = cleanedText.lastIndexOf(']');
                        }

                        if (start !== -1 && end !== -1 && end > start) {
                            cleanedText = cleanedText.substring(start, end + 1);
                        }
                        cleanedText = cleanedText.replace(/\u00A0/g, ' ');

                        try {
                            const data = JSON.parse(cleanedText);
                            const questions = Array.isArray(data) ? data : data.questions;
                            if (questions && questions.length > 0) {
                                updateDatabase(set.subject, item.title, questions);
                            }
                        } catch (parseError) {
                            if (!cleanedText.includes('404')) {
                                console.error(`Failed to parse JSON for ${item.url}:`, parseError);
                            }
                        }
                    })
                    .catch(e => {});
                allPromises.push(p);
            });
        });

        Promise.all(allPromises).finally(() => {
            setIsDbLoaded(true);
        });
    }, []);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    useEffect(() => {
        const handlePopState = () => {
            if (isLeavingQuizRef.current) {
                isLeavingQuizRef.current = false;
                setViewHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
                return;
            }

            if (currentView === View.Quiz && !showResults) {
                window.history.pushState({ view: View.Quiz }, '');
                setShowBackConfirmation(true);
            } else {
                setViewHistory(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
            }
        };
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [currentView, showResults]);

    const navigateTo = (newView: View) => {
        window.history.pushState({ view: newView }, '');
        setViewHistory(prev => [...prev, newView]);
    };

    const goBack = () => {
        if (currentView === View.Quiz && !showResults) {
            setShowBackConfirmation(true);
        } else {
            window.history.back();
        }
    };

    const confirmLeaveQuiz = async () => {
        if (user && currentQuiz.length > 0 && !showResults) {
            try {
                // Save progress
                const progressRef = doc(db, 'users', user.uid, 'quizProgress', currentExamTitle.replace(/\//g, '-'));
                await setDoc(progressRef, {
                    subjectId: selectedSubject?.id || 'unknown',
                    examTitle: currentExamTitle || 'unnamed',
                    currentQuestionIndex: currentQuestionIndex,
                    userAnswers: userAnswers,
                    totalQuestions: currentQuiz.length,
                    lastUpdated: serverTimestamp()
                });
            } catch (error) {
                console.error("Error saving quiz progress:", error);
            }
        }
        setShowBackConfirmation(false);
        isLeavingQuizRef.current = true;
        window.history.back();
    };

    const goToHome = () => {
        setSelectedSubject(null);
        setShowResults(false);
        setViewHistory([View.Landing]);
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            goToHome();
        } catch (error) {
            console.error("Logout error:", error);
        }
    };

    const AuthPage = () => {
        const [isLogin, setIsLogin] = useState(true);
        const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');
        const [name, setName] = useState('');
        const [error, setError] = useState('');
        const [loading, setLoading] = useState(false);

        const handleEmailAuth = async (e: React.FormEvent) => {
            e.preventDefault();
            setError('');
            setLoading(true);
            try {
                if (isLogin) {
                    await signInWithEmailAndPassword(auth, email, password);
                } else {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await updateProfile(userCredential.user, { displayName: name });
                }
                setViewHistory([View.Landing]);
            } catch (err: any) {
                setError(err.message === 'Firebase: Error (auth/user-not-found).' ? 'المستخدم غير موجود' : 
                          err.message === 'Firebase: Error (auth/wrong-password).' ? 'كلمة المرور خاطئة' : 
                          err.message === 'Firebase: Error (auth/email-already-in-use).' ? 'البريد الإلكتروني مستخدم بالفعل' : 
                          'حدث خطأ ما، يرجى المحاولة مرة أخرى');
            } finally {
                setLoading(false);
            }
        };

        const handleGoogleSignIn = async () => {
            setError('');
            setLoading(true);
            try {
                await signInWithPopup(auth, googleProvider);
                setViewHistory([View.Landing]);
            } catch (err: any) {
                setError('فشل تسجيل الدخول باستخدام جوجل');
            } finally {
                setLoading(false);
            }
        };

        return (
            <div className="container mx-auto p-4 max-w-md pt-10 text-right" dir="rtl">
                <div className="bg-white cartoon-border cartoon-shadow-lg p-8 md:p-10">
                    <h2 className="text-3xl font-black text-slate-900 mb-2 text-center font-cartoon">
                        {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
                    </h2>
                    <p className="text-slate-400 font-bold mb-8 text-center">
                        {isLogin ? 'أهلاً بك مجدداً في JoSchool 11' : 'انضم إلينا وابدأ رحلة التفوق'}
                    </p>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 cartoon-border border-2 border-red-200 mb-6 text-sm font-bold animate-shake">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleEmailAuth} className="space-y-4">
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-black text-slate-700 mb-2 mr-2 font-cartoon">الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full p-4 bg-slate-50 cartoon-border border-2 focus:border-sky-500 focus:bg-white outline-none transition-all font-bold"
                                    placeholder="أدخل اسمك"
                                    required
                                />
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 mr-2 font-cartoon">البريد الإلكتروني</label>
                            <input 
                                type="email" 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-4 bg-slate-50 cartoon-border border-2 focus:border-sky-500 focus:bg-white outline-none transition-all font-bold"
                                placeholder="example@mail.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-black text-slate-700 mb-2 mr-2 font-cartoon">كلمة المرور</label>
                            <input 
                                type="password" 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-4 bg-slate-50 cartoon-border border-2 focus:border-sky-500 focus:bg-white outline-none transition-all font-bold"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-sky-500 text-white cartoon-border cartoon-shadow cartoon-button font-black disabled:opacity-50 mt-4 font-cartoon"
                        >
                            {loading ? 'جاري التحميل...' : (isLogin ? 'دخول' : 'إنشاء الحساب')}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-slate-900"></div></div>
                        <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-slate-900 font-black font-cartoon">أو من خلال</span></div>
                    </div>

                    <button 
                        onClick={handleGoogleSignIn}
                        disabled={loading}
                        className="w-full py-4 bg-white cartoon-border border-2 text-slate-700 font-black flex items-center justify-center gap-3 cartoon-shadow-sm cartoon-button transition-all"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
                        تسجيل الدخول بجوجل
                    </button>

                    <p className="mt-8 text-center text-slate-500 font-bold">
                        {isLogin ? 'ليس لديك حساب؟' : 'لديك حساب بالفعل؟'}
                        <button 
                            onClick={() => setIsLogin(!isLogin)} 
                            className="text-sky-600 mr-2 hover:underline font-cartoon"
                        >
                            {isLogin ? 'سجل الآن' : 'سجل دخولك'}
                        </button>
                    </p>
                </div>
            </div>
        );
    };

    const handleStartQuiz = (questions: Question[], title: string = '') => {
        if (!questions || questions.length === 0) return;
        
        let examTitle = title || (selectedSubject?.id + " - " + questions[0].question.substring(0, 20));
        examTitle = examTitle.replace(/\//g, '-');
        
        if (user && quizProgressMap[examTitle]) {
            setResumeModal({ questions, progress: quizProgressMap[examTitle], title: examTitle });
            return;
        }

        startNewQuiz(questions, examTitle);
    };

    const startNewQuiz = (questions: Question[], title: string) => {
        setCurrentExamTitle(title);
        setCurrentQuiz([...questions]);
        setCurrentQuestionIndex(0);
        setUserAnswers(new Array(questions.length).fill(null));
        setShowResults(false);
        navigateTo(View.Quiz);
    };

    const resumeQuiz = (questions: Question[], progress: any, title: string) => {
        setCurrentExamTitle(title);
        setCurrentQuiz([...questions]);
        setCurrentQuestionIndex(progress.currentQuestionIndex);
        setUserAnswers(progress.userAnswers);
        setShowResults(false);
        setResumeModal(null);
        navigateTo(View.Quiz);
    };

    const handleStartComprehensiveExam = () => {
        if (!selectedSubject) return;
        const subjectData = examsDatabase[selectedSubject.id as SubjectName];
        if (!subjectData) {
            alert('عذراً، لا توجد امتحانات متوفرة لهذه المادة حالياً.');
            return;
        }

        const allQuestions: Question[] = [];
        Object.values(subjectData).forEach((lessonChunks) => {
            lessonChunks.forEach((chunk) => {
                allQuestions.push(...chunk);
            });
        });

        if (allQuestions.length === 0) {
            alert('عذراً، لا توجد أسئلة متوفرة حالياً.');
            return;
        }

        // اختيار 40 سؤال عشوائي أو كل الأسئلة إذا كانت أقل من 40
        const shuffled = allQuestions.sort(() => 0.5 - Math.random());
        handleStartQuiz(shuffled.slice(0, Math.min(40, shuffled.length)));
    };

    const toggleUnit = (idx: number) => {
        setExpandedUnitIndices(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
    };

    const toggleLesson = (key: string) => {
        setExpandedLessonKeys(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]);
    };

    const openExternalBook = () => {
        if (selectedSubject?.multiBooks) {
            setShowMultiBooksModal(true);
        } else if (selectedSubject?.textbookUrl) {
            window.open(selectedSubject.textbookUrl, '_blank');
        } else {
            alert('عذراً، كتاب هذه المادة غير متوفر حالياً.');
        }
    };

    const LandingPage = () => (
        <div className="container mx-auto p-4 max-w-lg pt-6 text-right" dir="rtl">
            {[Semester.First, Semester.Second].map((sem) => (
                <div key={sem} className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex flex-col">
                            <div className="flex items-center gap-3 mb-2 pr-1">
                                <div className="w-2 h-10 bg-gradient-to-b from-[#93e310] to-orange-600 rounded-full shadow-[0_0_15px_rgba(147,227,16,0.4)]"></div>
                                <h3 className="text-4xl font-black text-slate-900 tracking-tight">{sem}</h3>
                            </div>
                            <p className="text-slate-400 mr-6 font-bold text-sm">اختر مادة للبدء بمراجعة الدروس</p>
                        </div>
                    </div>
                    
                    <div className="bg-sky-500 p-4 cartoon-border cartoon-shadow-lg grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                        
                        {subjectsData.filter(s => s.semester === sem).map(s => {
                            const hasData = (s.id === SubjectName.JordanHistory || s.id === SubjectName.IslamicEducation || s.id === SubjectName.Arabic) && sem === Semester.First;
                            return (
                                <button 
                                    key={`${s.id}-${s.semester}`} 
                                    onClick={() => { setSelectedSubject(s); setExpandedUnitIndices([]); navigateTo(View.SubjectIndex); }} 
                                    className="group bg-white p-2.5 cartoon-border cartoon-shadow-sm cartoon-button flex flex-row items-center gap-2.5 transition-all min-h-[85px]"
                                >
                                    <div className="relative shrink-0">
                                        <img src={s.coverImage} className="w-10 h-14 object-cover cartoon-border border-2 group-hover:scale-105 transition-transform" alt="" />
                                    </div>
                                    <div className="flex-1 text-right overflow-hidden">
                                        <h4 className="text-[14px] md:text-[15px] font-black text-slate-800 whitespace-nowrap mb-0.5 tracking-tight font-cartoon">{s.id}</h4>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${hasData ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                            <span className={`text-[10px] font-bold ${hasData ? 'text-green-600' : 'text-slate-400'}`}>
                                                {hasData ? 'متاح الآن' : 'قريباً'}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            ))}
        </div>
    );

    const SubjectIndexPage = () => {
        if (!selectedSubject) return null;
        const units = subjectIndexData[selectedSubject.id] || [];
        const isArabic = selectedSubject.id === SubjectName.Arabic;

        return (
            <div className="container mx-auto p-4 max-w-2xl pt-6 text-right" dir="rtl">
                {/* رأس الصفحة: الكتاب والمحتوى التفاعلي */}
                <div className="flex flex-row items-start justify-between mb-10 gap-6">
                    
                    {/* الجهة اليمنى: صورة الكتاب */}
                    <div className="relative shrink-0 w-32 h-44 group cursor-pointer order-1" onClick={openExternalBook}>
                        <img src={selectedSubject.coverImage} className="w-full h-full object-cover cartoon-border cartoon-shadow relative z-10 transition-transform duration-500 group-hover:scale-[1.02] group-hover:-rotate-1" alt="" />
                        
                        {/* Floating Book Button */}
                        <div className="absolute -bottom-3 -left-3 z-20 w-16 h-16">
                            <button className="relative w-full h-full bg-green-500 cartoon-border border-2 cartoon-shadow-sm cartoon-button flex flex-col items-center justify-center text-white transition-all">
                                <BookOpenIcon className="w-5 h-5 mb-0.5" />
                                <span className="text-[9px] font-black leading-none font-cartoon">تصفح</span>
                            </button>
                        </div>
                    </div>

                    {/* منطقة المحتوى اليسرى والوسطى */}
                    <div className="flex flex-col flex-1 order-2 py-2">
                        {/* الصف العلوي: اسم المادة والمفضلة */}
                        <div className="flex flex-row items-start justify-between mb-6">
                            <div className="flex flex-col text-right">
                                <h2 className="text-4xl font-black text-slate-900 leading-tight mb-2 tracking-tight font-cartoon">{selectedSubject.id}</h2>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-2 bg-sky-500 cartoon-border border-2"></div>
                                    <span className="text-sm font-bold text-slate-400/80 font-cartoon">تصفح الوحدات والدروس</span>
                                </div>
                            </div>

                            <button className="bg-white p-3.5 cartoon-border border-2 cartoon-shadow-sm cartoon-button flex items-center gap-3 transition-all group">
                                <BookmarkOutlineIcon className="w-5 h-5 text-slate-400 group-hover:text-sky-500 transition-colors" />
                                <span className="text-xs font-black text-slate-600 font-cartoon">المفضلة</span>
                            </button>
                        </div>

                        {/* زر امتحان شامل */}
                        <div className="mt-auto">
                            <button 
                                onClick={handleStartComprehensiveExam}
                                className="relative group overflow-hidden bg-sky-500 py-5 px-8 cartoon-border border-2 cartoon-shadow cartoon-button flex flex-row-reverse items-center justify-between text-white transition-all w-full max-w-[320px] ml-auto"
                            >
                                <StarIcon className="w-6 h-6 text-white" />
                                <span className="text-base font-black text-right flex-1 pr-4 font-cartoon">امتحان شامل للمادة</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {units.map((unit, uIdx) => (
                        <div key={uIdx} className="group bg-white cartoon-border cartoon-shadow mb-6 overflow-hidden relative">
                            <button onClick={() => toggleUnit(uIdx)} className="w-full p-6 flex items-center justify-between transition-colors hover:bg-slate-50 text-right">
                                <div className="flex flex-col">
                                    <span className="font-black text-slate-800 text-lg mb-0.5 font-cartoon">{unit.title}</span>
                                    <span className="text-[11px] font-bold text-slate-400">يتضمن {unit.lessons.length} دروس تعليمية</span>
                                </div>
                                <div className={`w-10 h-10 cartoon-border border-2 cartoon-shadow-sm flex items-center justify-center transition-all ${expandedUnitIndices.includes(uIdx) ? 'bg-sky-100 text-sky-600 rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                                    <ChevronDownIcon className="w-5 h-5" />
                                </div>
                            </button>
                            
                            {expandedUnitIndices.includes(uIdx) && (
                                <div className="px-6 pb-6 animate-fast-fade">
                                    <div className="h-px bg-slate-100 mb-5"></div>
                                    {isArabic ? (
                                        <div className="grid grid-cols-5 gap-3">
                                            {Array.from({ length: ARABIC_UNIT_COUNTS[uIdx] }).map((_, i) => {
                                                const examTitle = `${ARABIC_UNIT_LABELS[uIdx]} - امتحان ${i + 1}`;
                                                const quizChunks = getQuizzesForLesson(SubjectName.Arabic, examTitle);
                                                const hasData = quizChunks && quizChunks.length > 0;
                                                
                                                const progress = quizProgressMap[examTitle];
                                                const isCompleted = completedExams.has(examTitle);
                                                const answeredCount = progress ? progress.userAnswers.filter((a: any) => a !== null).length : 0;
                                                const progressPercent = progress ? (answeredCount / progress.totalQuestions) * 100 : 0;

                                                return (
                                                    <button 
                                                        key={i} 
                                                        onClick={() => hasData && handleStartQuiz(quizChunks[0], examTitle)} 
                                                        className={`relative w-full aspect-square bg-white cartoon-border cartoon-shadow-sm cartoon-button font-black text-sm flex items-center justify-center transition-all overflow-hidden ${hasData ? 'border-sky-500 text-sky-600' : 'border-slate-100 text-slate-300 grayscale opacity-50 cursor-not-allowed'}`}
                                                    >
                                                        {isCompleted ? (
                                                            <div className="absolute inset-0 bg-[#93e310]/20 flex items-center justify-center">
                                                                <StarIcon className="w-4 h-4 text-[#93e310] fill-[#93e310]" />
                                                            </div>
                                                        ) : progress ? (
                                                            <div className="absolute bottom-0 left-0 right-0 bg-[#93e310]/30" style={{ height: `${progressPercent}%` }}></div>
                                                        ) : null}
                                                        <span className="relative z-10 font-cartoon">{i + 1}</span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {unit.lessons.map((lesson, lIdx) => {
                                                const quizzes = getQuizzesForLesson(selectedSubject.id as SubjectName, lesson.title);
                                                const lessonKey = `${uIdx}-${lIdx}`;
                                                const isExpanded = expandedLessonKeys.includes(lessonKey);
                                                return (
                                                    <div key={lIdx} className="overflow-hidden">
                                                        <button onClick={() => toggleLesson(lessonKey)} className={`w-full p-5 cartoon-border border-2 cartoon-shadow-sm cartoon-button flex items-center justify-between transition-all ${isExpanded ? 'bg-sky-50 text-sky-700' : 'bg-slate-50 text-slate-700'} mb-2`}>
                                                            <div className="flex items-center gap-3">
                                                                <div className={`w-2 h-2 rounded-full transition-colors ${isExpanded ? 'bg-sky-500' : 'bg-slate-300'}`}></div>
                                                                <span className="font-bold text-[13px] leading-relaxed text-right font-cartoon">{lesson.title}</span>
                                                            </div>
                                                            <ChevronDownIcon className={`w-4 h-4 transition-transform shrink-0 mr-2 ${isExpanded ? 'rotate-180 text-sky-500' : 'text-slate-300'}`} />
                                                        </button>
                                                        {isExpanded && (
                                                            <div className="p-4 pt-5 grid grid-cols-5 gap-3 animate-fast-fade">
                                                                {quizzes && quizzes.length > 0 ? (
                                                                    quizzes.map((q, idx) => {
                                                                        const examTitle = lesson.title + (quizzes.length > 1 ? ` - جزء ${idx + 1}` : '');
                                                                        const progress = quizProgressMap[examTitle];
                                                                        const isCompleted = completedExams.has(examTitle);
                                                                        const answeredCount = progress ? progress.userAnswers.filter((a: any) => a !== null).length : 0;
                                                                        const progressPercent = progress ? (answeredCount / progress.totalQuestions) * 100 : 0;

                                                                        return (
                                                                            <button 
                                                                                key={idx} 
                                                                                onClick={() => handleStartQuiz(q, examTitle)} 
                                                                                className="relative w-full aspect-square bg-white cartoon-border border-2 cartoon-shadow-sm cartoon-button text-sky-600 flex items-center justify-center transition-all overflow-hidden"
                                                                            >
                                                                                {isCompleted ? (
                                                                                    <div className="absolute inset-0 bg-[#93e310]/20 flex items-center justify-center">
                                                                                        <StarIcon className="w-4 h-4 text-[#93e310] fill-[#93e310]" />
                                                                                    </div>
                                                                                ) : progress ? (
                                                                                    <div className="absolute bottom-0 left-0 right-0 bg-[#93e310]/30" style={{ height: `${progressPercent}%` }}></div>
                                                                                ) : null}
                                                                                <span className="relative z-10 font-cartoon">{idx + 1}</span>
                                                                            </button>
                                                                        );
                                                                    })
                                                                ) : <div className="col-span-5 py-4 text-center"><span className="text-xs text-slate-400 font-bold italic bg-slate-100 px-4 py-2 cartoon-border border-2 cartoon-shadow-sm">قريباً إن شاء الله</span></div>}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const QuizPage = () => {
        const q = currentQuiz[currentQuestionIndex];
        if (!q) return null;
        const progress = ((currentQuestionIndex + 1) / currentQuiz.length) * 100;
        const arabicSymbols = ['أ', 'ب', 'ج', 'د'];
        return (
            <div className="container mx-auto p-4 max-w-xl pt-6 text-right" dir="rtl">
                <div className="bg-white cartoon-border cartoon-shadow-lg p-8 md:p-10 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-2 bg-slate-100">
                        <div className="h-full bg-[#93e310] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                    
                    <div className="flex items-center justify-between mb-10 mt-2">
                        <div className="bg-sky-100 text-sky-600 px-5 py-2 cartoon-border border-2 cartoon-shadow-sm text-xs font-black">سؤال {currentQuestionIndex + 1} من {currentQuiz.length}</div>
                        <div className="flex items-center gap-2 text-slate-400">
                            <RefreshIcon className="w-4 h-4" />
                            <span className="text-[11px] font-bold uppercase tracking-wider font-cartoon">مراجعة ذكية</span>
                        </div>
                    </div>

                    <div className="mb-12">
                        <h3 className="text-2xl font-black text-slate-800 text-center leading-relaxed tracking-tight font-cartoon">{q.question}</h3>
                    </div>

                    <div className="space-y-4">
                        {q.choices.map((c, i) => {
                            const isSelected = userAnswers[currentQuestionIndex] === c;
                            return (
                                <button 
                                    key={i} 
                                    onClick={() => setUserAnswers(prev => { const next = [...prev]; next[currentQuestionIndex] = c; return next; })} 
                                    className={`group w-full p-6 cartoon-border cartoon-button text-right font-bold transition-all flex items-center gap-4 ${isSelected ? 'border-sky-500 bg-sky-50 text-sky-700 cartoon-shadow' : 'border-slate-900 bg-white hover:bg-slate-50 cartoon-shadow-sm'}`}
                                >
                                    <div className={`shrink-0 w-10 h-10 cartoon-border border-2 flex items-center justify-center text-sm font-black transition-all ${isSelected ? 'bg-sky-500 border-sky-500 text-white cartoon-shadow-sm' : 'bg-white border-slate-900 text-slate-400'}`}>
                                        {arabicSymbols[i] || i + 1}
                                    </div>
                                    <span className="flex-1 text-lg font-cartoon">{c}</span>
                                    {isSelected && <CheckIcon className="w-5 h-5 text-sky-500 animate-fast-fade" />}
                                </button>
                            );
                        })}
                    </div>

                    <div className="flex gap-4 mt-12">
                        {currentQuestionIndex < currentQuiz.length - 1 ? (
                            <button 
                                onClick={() => setCurrentQuestionIndex(prev => prev + 1)} 
                                disabled={!userAnswers[currentQuestionIndex]} 
                                className="w-full py-5 bg-sky-500 text-white cartoon-border cartoon-shadow cartoon-button font-black disabled:opacity-50 disabled:shadow-none transition-all font-cartoon"
                            >
                                السؤال التالي
                            </button>
                        ) : (
                            <button 
                                onClick={() => setShowResults(true)} 
                                disabled={!userAnswers[currentQuestionIndex]} 
                                className="w-full py-5 bg-slate-900 text-white cartoon-border cartoon-shadow cartoon-button font-black disabled:opacity-50 disabled:shadow-none transition-all font-cartoon"
                            >
                                عرض النتيجة
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };


    const ResultsPage = () => {
        const score = userAnswers.reduce((acc, ans, idx) => acc + (ans?.trim() === currentQuiz[idx].correct_answer?.trim() ? 1 : 0), 0);
        const markFrom40 = Math.round((score / currentQuiz.length) * 40);
        const isPassed = markFrom40 >= 20;

        useEffect(() => {
            if (user) {
                const saveResult = async () => {
                    try {
                        const attemptRef = collection(db, 'users', user.uid, 'attempts');
                        await addDoc(attemptRef, {
                            subjectId: selectedSubject?.id,
                            examTitle: currentExamTitle,
                            score: score,
                            totalQuestions: currentQuiz.length,
                            markFrom40: markFrom40,
                            isPassed: isPassed,
                            timestamp: serverTimestamp()
                        });

                        // Delete progress if completed
                        const progressRef = doc(db, 'users', user.uid, 'quizProgress', currentExamTitle.replace(/\//g, '-'));
                        await deleteDoc(progressRef);

                        const progressDocRef = doc(db, 'users', user.uid, 'progress', 'current');
                        await setDoc(progressDocRef, {
                            lastSubject: selectedSubject?.id,
                            totalQuizzes: increment(1),
                            totalScore: increment(score),
                            lastUpdated: serverTimestamp()
                        }, { merge: true });
                    } catch (error) {
                        handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}/attempts`);
                    }
                };
                saveResult();
            }
        }, [user]);

        return (
            <div className="container mx-auto p-4 max-w-xl text-center pt-10" dir="rtl">
                <div className="bg-white cartoon-border cartoon-shadow-lg p-10 md:p-12 mb-8 text-center relative overflow-hidden">
                    <div className={`absolute top-0 left-0 w-full h-3 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    
                    <div className={`w-28 h-28 cartoon-border border-4 flex items-center justify-center mx-auto mb-8 cartoon-shadow rotate-3 transition-transform hover:rotate-0 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`}>
                        {isPassed ? <StarIcon className="w-14 h-14 text-white" /> : <XIcon className="w-14 h-14 text-white" />}
                    </div>
                    
                    <h2 className={`text-4xl font-black mb-4 tracking-tight font-cartoon ${isPassed ? 'text-green-600' : 'text-red-600'}`}>
                        {isPassed ? 'أحسنت يا بطل!' : 'حاول مرة أخرى'}
                    </h2>
                    
                    <p className="text-slate-400 font-bold mb-10">لقد أتممت الاختبار بنجاح، إليك نتيجتك:</p>
                    
                    <div className="bg-slate-50 cartoon-border cartoon-shadow-sm p-10 mb-10 inline-block min-w-[240px]">
                        <div className="flex justify-center items-baseline gap-3">
                            <span className="text-8xl font-black text-slate-900 font-cartoon">{markFrom40}</span>
                            <span className="text-3xl font-black text-slate-300 font-cartoon">/ 40</span>
                        </div>
                        <div className="mt-4 h-3 w-full bg-slate-200 cartoon-border border-2 overflow-hidden">
                            <div className={`h-full transition-all duration-1000 ${isPassed ? 'bg-green-500' : 'bg-red-500'}`} style={{ width: `${(markFrom40 / 40) * 100}%` }}></div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => setViewHistory(prev => prev.slice(0, -1))} 
                            className={`w-full py-6 text-white cartoon-border cartoon-shadow cartoon-button font-black transition-all font-cartoon ${isPassed ? 'bg-green-500' : 'bg-slate-900'}`}
                        >
                            {isPassed ? 'العودة للفهرس' : 'إعادة المحاولة'}
                        </button>
                        
                        <button 
                            onClick={goToHome}
                            className="w-full py-4 text-slate-400 hover:text-slate-600 font-black transition-colors font-cartoon"
                        >
                            العودة للرئيسية
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const currentViewComponent = () => {
        if (!isDbLoaded) return (
            <div className="flex flex-col items-center justify-center h-[80vh]">
                <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-6"></div>
                <p className="font-black text-slate-900 text-lg font-cartoon">جاري تجهيز الاختبارات الذكية...</p>
            </div>
        );
        switch (currentView) {
            case View.Landing: return <LandingPage />;
            case View.SubjectIndex: return <SubjectIndexPage />;
            case View.Quiz: return showResults ? <ResultsPage /> : <QuizPage />;
            case View.Auth: return <AuthPage />;
            case View.SessionSubjects: return <div className="p-10 text-center font-black">قريباً إن شاء الله</div>;
            default: return <LandingPage />;
        }
    };

    return (
        <div className="min-h-screen bg-[#fff9e6]">
            <header className="w-full bg-white cartoon-border border-t-0 border-x-0 border-b-4 sticky top-0 z-40 h-20 flex items-center px-6">
                <div className="flex-1">
                    {viewHistory.length > 1 && (
                        <button onClick={goBack} className="p-3 bg-slate-50 cartoon-border border-2 cartoon-shadow-sm cartoon-button transition-all">
                            <ArrowLeftIcon className="w-6 h-6 transform scale-x-[-1] text-slate-600" />
                        </button>
                    )}
                </div>
                <div className="text-center cursor-pointer group" onClick={goToHome}>
                    <h1 className="text-2xl font-black text-slate-900 leading-none font-cartoon">JoSchool <span className="text-sky-500">11</span></h1>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-cartoon">Generation 2009</span>
                </div>
                <div className="flex-1 flex justify-end items-center gap-3">
                    {isAuthReady && (
                        user ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden md:flex flex-col items-end">
                                    <span className="text-xs font-black text-slate-800 font-cartoon">{user.displayName || 'طالب'}</span>
                                    <button onClick={handleLogout} className="text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors font-cartoon">تسجيل الخروج</button>
                                </div>
                                <div className="w-10 h-10 cartoon-border border-2 cartoon-shadow-sm flex items-center justify-center overflow-hidden bg-white">
                                    {user.photoURL ? (
                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <UserIcon className="w-5 h-5 text-sky-600" />
                                    )}
                                </div>
                                <button onClick={handleLogout} className="md:hidden p-2 text-slate-400 hover:text-red-500 transition-colors">
                                    <LogOutIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ) : (
                            <button 
                                onClick={() => navigateTo(View.Auth)}
                                className="bg-sky-500 text-white px-5 py-2 cartoon-border border-2 cartoon-shadow-sm cartoon-button text-xs font-black transition-all font-cartoon"
                            >
                                دخول
                            </button>
                        )
                    )}
                </div>
            </header>
            <main className="transition-smooth pb-10">
                {!isAuthReady ? (
                    <div className="flex flex-col items-center justify-center h-[80vh]">
                        <div className="w-12 h-12 border-4 border-slate-900 border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="font-black text-slate-900 font-cartoon">جاري التحميل...</p>
                    </div>
                ) : currentViewComponent()}
            </main>
            {showBackConfirmation && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fast-fade" dir="rtl"><div className="bg-white w-full max-w-xs cartoon-border cartoon-shadow-lg p-8"><h3 className="text-xl font-black text-slate-800 text-center mb-6 font-cartoon">هل تريد مغادرة الاختبار؟</h3><p className="text-center text-slate-500 text-xs font-bold mb-8">سيتم حفظ تقدمك تلقائياً</p><div className="space-y-3"><button onClick={() => setShowBackConfirmation(false)} className="w-full py-4 bg-sky-500 text-white cartoon-border cartoon-shadow-sm cartoon-button font-black font-cartoon">إكمال الاختبار</button><button onClick={confirmLeaveQuiz} className="w-full py-4 bg-white cartoon-border cartoon-shadow-sm cartoon-button text-slate-600 font-black font-cartoon">العودة للفهرس</button></div></div></div>}
            {resumeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fast-fade" dir="rtl">
                    <div className="bg-white w-full max-w-xs cartoon-border cartoon-shadow-lg p-8">
                        <h3 className="text-xl font-black text-slate-800 text-center mb-4 font-cartoon">لديك تقدم سابق</h3>
                        <p className="text-center text-slate-500 text-sm font-bold mb-8">هل تريد استكمال الاختبار من حيث توقفت أم البدء من جديد؟</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => resumeQuiz(resumeModal.questions, resumeModal.progress, resumeModal.title)} 
                                className="w-full py-4 bg-sky-500 text-white cartoon-border cartoon-shadow-sm cartoon-button font-black flex items-center justify-center gap-2 font-cartoon"
                            >
                                <RefreshIcon className="w-4 h-4" />
                                استكمال الاختبار
                            </button>
                            <button 
                                onClick={() => {
                                    if (user) deleteDoc(doc(db, 'users', user.uid, 'quizProgress', resumeModal.title.replace(/\//g, '-')));
                                    setResumeModal(null);
                                    startNewQuiz(resumeModal.questions, resumeModal.title);
                                }} 
                                className="w-full py-4 bg-white cartoon-border cartoon-shadow-sm cartoon-button text-slate-600 font-black font-cartoon"
                            >
                                البدء من جديد
                            </button>
                            <button onClick={() => setResumeModal(null)} className="w-full py-2 text-slate-400 font-bold text-xs font-cartoon">إلغاء</button>
                        </div>
                    </div>
                </div>
            )}
            {showMultiBooksModal && <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm" dir="rtl"><div className="bg-white w-full max-w-xs cartoon-border cartoon-shadow-lg p-8 relative"><button onClick={() => setShowMultiBooksModal(false)} className="absolute top-4 left-4 p-2 bg-slate-50 cartoon-border border-2 cartoon-shadow-sm cartoon-button"><XIcon className="w-5 h-5"/></button><h3 className="text-2xl font-black text-slate-800 text-center mb-8 pt-2 font-cartoon">اختر الكتاب</h3><div className="space-y-4">{selectedSubject?.multiBooks?.map((book, idx) => (<button key={idx} onClick={() => { window.open(book.url, '_blank'); setShowMultiBooksModal(false); }} className="w-full p-6 bg-white cartoon-border border-2 cartoon-shadow-sm cartoon-button flex items-center gap-3 transition-all"><div className="w-10 h-10 bg-sky-100 cartoon-border border-2 flex items-center justify-center"><BookOpenIcon className="w-5 h-5 text-sky-500" /></div><span className="text-lg font-black text-slate-700 font-cartoon">{book.label}</span></button>))}</div></div></div>}
        </div>
    );
};

export default App;