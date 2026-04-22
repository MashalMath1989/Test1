import { Subject, SubjectName, SubjectIndexData, Semester } from './types';

export const subjectsData: Subject[] = [
  // --- الفصل الأول ---
  {
    id: SubjectName.JordanHistory,
    coverImage: 'https://i.postimg.cc/PfB5Smtw/1760536062333-tarykh-alardn.jpg',
    fontClass: 'font-naskh',
    semester: Semester.First,
    textbookUrl: 'https://drive.google.com/file/d/1S9QTEgpTzZTKKkRdTF0OdDmwQNJFvvxS/view?usp=drivesdk',
  },
  {
    id: SubjectName.IslamicEducation,
    coverImage: 'https://i.postimg.cc/gcf2gvY8/1760541071199-aslamyt-11.png',
    fontClass: 'font-naskh',
    semester: Semester.First,
    textbookUrl: 'https://drive.google.com/file/d/1Fv17znBl9OEKStLMgBvNdECtouiivOiB/view?usp=drivesdk',
  },
  {
    id: SubjectName.Arabic,
    coverImage: 'https://i.postimg.cc/J79zpb1X/1760540922343-g11.png',
    fontClass: 'font-naskh',
    semester: Semester.First,
    textbookUrl: 'https://drive.google.com/file/d/1O7zMWn_hGQ-HnsLUZIZm-g68jDDEULCo/view?usp=drivesdk',
  },
  {
    id: SubjectName.English,
    coverImage: 'https://i.postimg.cc/3rPxtgK2/1760541032985-1760540938507-s11.png',
    fontClass: 'font-sans',
    semester: Semester.First,
    multiBooks: [
      { label: "Student's Book", url: "https://drive.google.com/file/d/1ZHbhPBZH49_W_HxffR4kV4fBzToMODkU/view?usp=drivesdk" },
      { label: "Workbook", url: "https://drive.google.com/file/d/1Msvajg0yTe06B8v8NgsiHFirjZJfqeF4/view?usp=drivesdk" }
    ]
  },

  // --- الفصل الثاني ---
  {
    id: SubjectName.JordanHistory,
    coverImage: 'https://i.postimg.cc/PfB5Smtw/1760536062333-tarykh-alardn.jpg',
    fontClass: 'font-naskh',
    semester: Semester.Second,
  },
  {
    id: SubjectName.IslamicEducation,
    coverImage: 'https://i.postimg.cc/gcf2gvY8/1760541071199-aslamyt-11.png',
    fontClass: 'font-naskh',
    semester: Semester.Second,
  },
  {
    id: SubjectName.Arabic,
    coverImage: 'https://i.postimg.cc/L5CcDhpX/IMG_20260317_200321_670.png',
    fontClass: 'font-naskh',
    semester: Semester.Second,
  },
  {
    id: SubjectName.English,
    coverImage: 'https://i.postimg.cc/3rPxtgK2/1760541032985-1760540938507-s11.png',
    fontClass: 'font-sans',
    semester: Semester.Second,
  },
];

export const subjectIndexData: SubjectIndexData = {
  [SubjectName.IslamicEducation]: [
    {
      title: 'الوحدة الأولى: "وَاعْتَصِمُوا بِحَبْلِ اللَّهِ جَمِيعًا"',
      lessons: [
        { title: 'الدرس الأول: سورة آل عمران الآيات الكريمة (١٠٢–١٠٥) – صفحة 6', page: 6 },
        { title: 'الدرس الثاني: الحديث الشريف: اتقاء الشبهات – صفحة 12', page: 12 },
        { title: 'الدرس الثالث: من صور الضلال – صفحة 20', page: 20 },
        { title: 'الدرس الرابع: كرامة الإنسان في الشريعة الإسلامية – صفحة 26', page: 26 },
        { title: 'الدرس الخامس: الزواج: مشروعيته ومقدماته – صفحة 31', page: 31 },
        { title: 'الدرس السادس: الجهاد في الإسلام – صفحة 37', page: 37 },
      ],
    },
    {
      title: 'الوحدة الثانية: "وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا"',
      lessons: [
        { title: 'الدرس الأول: جهود علماء المسلمين في خدمة القرآن الكريم – صفحة 44', page: 44 },
        { title: 'الدرس الثاني: العزيمة والرخصة – صفحة 50', page: 50 },
        { title: 'الدرس الثالث: معركة مؤتة (8 هـ) – صفحة 56', page: 56 },
        { title: 'الدرس الرابع: المحرّمات من النساء – صفحة 61', page: 61 },
        { title: 'الدرس الخامس: التعايش الإنساني – صفحة 67', page: 67 },
        { title: 'الدرس السادس: الحقوق الاجتماعية للمرأة في الإسلام – صفحة 73', page: 73 },
      ],
    },
    {
      title: 'الوحدة الثالثة: "وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ"',
      lessons: [
        { title: 'الدرس الأول: سورة آل عمران الآيات الكريمة (169–174) – صفحة 81', page: 81 },
        { title: 'الدرس الثاني: الحديث الشريف: رضا الله تعالى – صفحة 87', page: 87 },
        { title: 'الدرس الثالث: فتح مكة (8 هـ) – صفحة 93', page: 93 },
        { title: 'الدرس الرابع: من خصائص الشريعة الإسلامية: الإيجابية – صفحة 99', page: 99 },
        { title: 'الدرس الخامس: شروط صحة عقد الزواج – صفحة 105', page: 105 },
        { title: 'الدرس السادس: الحقوق المالية للمرأة في الإسلام – صفحة 110', page: 110 },
      ],
    },
    {
      title: 'الوحدة الرابعة: "لِتَسْكُنُوا إِلَيْهَا"',
      lessons: [
        { title: 'الدرس الأول: سورة الروم الآيات الكريمة (21–24) – صفحة 115', page: 115 },
        { title: 'الدرس الثاني: مكانة السنة النبوية الشريفة في التشريع الإسلامي – صفحة 120', page: 120 },
        { title: 'الدرس الثالث: مراعاة الأعراف في الشريعة الإسلامية – صفحة 128', page: 128 },
        { title: 'الدرس الرابع: حقوق الزوجين في الإسلام – صفحة 134', page: 134 },
        { title: 'الدرس الخامس: تنظيم النسل وتحديده – صفحة 141', page: 141 },
        { title: 'الدرس السادس: الأمن الغذائي في الإسلام – صفحة 146', page: 146 },
        { title: 'الدرس السابع: الإسلام والوحدة الوطنية – صفحة 152', page: 152 },
      ],
    },
  ],
  [SubjectName.JordanHistory]: [
    {
      title: 'الوحدة الأولى: الأردن في العصور القديمة (صفحة 6)',
      lessons: [
        { title: 'الدرس الأول: الأردن في العصور الحجرية – صفحة 8', page: 8 },
        { title: 'الدرس الثاني: الأردن في العصر الحديدي – صفحة 16', page: 16 },
        { title: 'الدرس الثالث: مملكة الأنباط – صفحة 22', page: 22 },
        { title: 'الدرس الرابع: مظاهر الحضارتين اليونانية والرومانية–البيزنطية في الأردن – صفحة 31', page: 31 },
      ],
    },
    {
      title: 'الوحدة الثانية: الأردن في العصور الإسلامية (صفحة 44)',
      lessons: [
        { title: 'الدرس الأول: الأردن في صدر الإسلام – صفحة 46', page: 46 },
        { title: 'الدرس الثاني: الأردن في العصرين الأموي والعباسي – صفحة 56', page: 56 },
        { title: 'الدرس الثالث: الأردن خلال حملات الفرنجة – صفحة 66', page: 66 },
        { title: 'الدرس الرابع: الأردن في العصر الأيوبي – صفحة 72', page: 72 },
        { title: 'الدرس الخامس: الأردن في العصر المملوكي – صفحة 77', page: 77 },
      ],
    },
    {
      title: 'الوحدة الثالثة: الأردن في العصر الحديث (صفحة 86)',
      lessons: [
        { title: 'الدرس الأول: الأوضاع السياسية والإدارية في الأردن في العهد العثماني – صفحة 88', page: 88 },
        { title: 'الدرس الثاني: الأوضاع الاجتماعية والاقتصادية في الأردن في العهد العثماني – صفحة 94', page: 94 },
        { title: 'الدرس الثالث: الثورة العربية الكبرى (النهضة العربية) – صفحة 105', page: 105 },
        { title: 'الدرس الرابع: الأردن في عهد المملكة العربية السورية والحكومات المحلية – صفحة 118', page: 118 },
      ],
    },
  ],
  [SubjectName.Arabic]: [
    {
      title: 'الوِحْدَةُ الأُولَى: مِنَ القِيَمِ الإِنْسَانِيَّةِ فِي القُرْآنِ',
      lessons: []
    },
    {
      title: 'الوِحْدَةُ الثَّانِيَةُ: فِي حُبِّ الوَطَنِ',
      lessons: []
    },
    {
      title: 'الوِحْدَةُ الثَّالِثَةُ: أَمْرَاضُ العَصْرِ',
      lessons: []
    },
    {
      title: 'الوِحْدَةُ الرَّابِعَةُ: الإِعْلامُ الرَّقْمِيُّ',
      lessons: []
    },
    {
      title: 'الوِحْدَةُ الخَامِسَةُ: التَّعْلِيمُ التِّقَنِيُّ بَوَّابَةُ المُسْتَقْبَلِ',
      lessons: []
    }
  ],
};