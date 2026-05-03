export const HomeDefaults = {
  DefHomePageData: [
    {
      name: 'Hero Banner',
      type: 'hero',
      order: 1,
      visible: true,
      anchor: 'home',
      content: {
        title: 'Transform Your Career with KSR IT****',
        subtitle:
          'Hands-on training, real-time projects, and career guidance with Real Industry Mentors.',
        buttonText: '🚀 Join Now',
        buttonLink: '#contact',
      },
    },
    {
      name: 'Why Us',
      type: 'about',
      order: 2,
      visible: true,
      anchor: 'about',
      content: {
        title: 'Why Choose KSR IT?',
        subtitle: 'We build careers with industry-aligned curriculum.',
      },
    },
    {
      name: 'Programs',
      type: 'courses',
      order: 3,
      visible: true,
      anchor: 'courses',
      content: {
        title: 'Our Specializations',
        subtitle: 'Master the tech of tomorrow.',
      },
    },
    {
      name: 'Trainers',
      type: 'trainers',
      order: 4,
      visible: true,
      anchor: 'trainers',
      content: {
        title: 'Learn from Experts',
        subtitle: 'MNC professionals at your service.',
      },
    },
    {
      name: 'Upcoming Batches',
      type: 'batches',
      order: 5,
      visible: true,
      anchor: 'batches',
      content: {
        title: 'Upcoming <span class="text-gradient">Batches</span>',
        subtitle: 'Join our professional training programs.',
      },
    },
    {
      name: 'Success Stories',
      type: 'testimonials',
      order: 6,
      visible: true,
      anchor: 'testimonials',
      content: {
        title: 'Student Success',
        subtitle: 'Join our list of high-earning graduates.',
      },
    },
    {
      name: 'Frequently Asked Questions',
      type: 'faq',
      order: 7,
      visible: true,
      anchor: 'faq',
      content: {
        title: 'Have <span class="text-gradient">Questions?</span>',
        subtitle: 'Find answers to common queries about our training.',
      },
    },
    {
      name: 'Contact Us',
      type: 'contact',
      order: 8,
      visible: true,
      anchor: 'contact',
      content: {
        title: 'Get in Touch',
        subtitle: 'Start your journey today.',
      },
    },
  ],
};

export const CourseDefaults = {
  DefCourses: [
    {
      slug: 'angular',
      title: 'Modern Angular Pro',
      description:
        'Master Angular 17+ with standalone components, signals, and advanced SSR techniques.',
      duration: '6 Months',
      level: 'Intermediate',
      imageUrl:
        'https://images.unsplash.com/photo-1593720213428-28a5b9ed9461?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      badge: 'Most Popular',
      price: '₹14,999',
      originalPrice: '₹24,999',
      rating: '4.9',
      longDescription:
        'This course covers everything from basic component architecture to advanced state management with Signals and RxJS. You will build a production-ready enterprise application.',
      syllabus: [
        {
          title: 'Angular Core',
          topics: [
            'Standalone Components',
            'Signals API',
            'Control Flow Syntax',
          ],
        },
        {
          title: 'Routing & State',
          topics: [
            'Advanced Router Guards',
            'RxJS Patterns',
            'NGXS/NgRx Store',
          ],
        },
      ],
    },
    {
      slug: 'python',
      title: 'Python for Data Science',
      description:
        'Learn Python from scratch and dive into Pandas, NumPy, and Machine Learning basics.',
      duration: '4 Months',
      level: 'Beginner',
      imageUrl:
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      badge: 'Bestseller',
      price: '₹10,000',
      originalPrice: '₹19,999',
      rating: '4.8',
      longDescription:
        'Master the most versatile programming language. From automation scripts to complex data analysis, this course prepares you for the high-demand data science roles.',
    },
    {
      slug: 'java',
      title: 'Java Full Stack Masterclass',
      description:
        'End-to-end Java development with Spring Boot, Microservices, and Cloud Deployment.',
      duration: '8 Months',
      level: 'Advanced',
      imageUrl:
        'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      badge: 'Hot Topic',
      price: '₹19,999',
      originalPrice: '₹29,999',
      rating: '4.9',
      longDescription:
        'The ultimate guide to building enterprise-grade Java applications. Covers Spring Security, Docker, Kubernetes, and Cloud-native development.',
    },
  ],
};

export const CourseDetailDefaults = {
  DefLongDetail: `This comprehensive course is designed to take you from fundamentals to
              advanced concepts. You will learn by building real-world projects and gain the skills needed to land a job
              in top tech companies. Our industry-expert mentors will guide you throughout the journey.`,
  DefDownloadUrl: 'https://i.postimg.cc/bdX5MXkd/KSR-IT.png',
  defaultBatches: [
    {
      timing: 'Evening Batch',
      days: 'Mon - Fri',
      startDate: 'May 10',
      status: 'Filling Fast',
    },
    {
      timing: 'Weekend Batch',
      days: 'Sat - Sun',
      startDate: 'May 15',
      status: 'Few Seats Left',
    },
  ],
  defaultFaq: [
    {
      question: 'Is there a prerequisite for this course?',
      answer:
        'Basic understanding of programming is recommended but not mandatory for beginners.',
    },
    {
      question: 'Will I get placement support?',
      answer:
        'Yes, we provide resume building, mock interviews, and referrals to hiring partners.',
    },
  ],
  defaultPlans: [
    {
      name: 'Standard',
      price: '₹14,999',
      features: ['All recorded sessions', 'Source code access', 'Certificate'],
    },
    {
      name: 'Premium',
      price: '₹19,999',
      features: [
        'Live 1-on-1 sessions',
        'Direct mentor referrals',
        'Job assurance',
      ],
      highlight: true,
    },
  ],
  DefKeyPoints: [
    'Hands-on learning with real projects',
    'xxxxxxxx',
    'eeeeeee',
    'rrrrrrr',
  ],
  defaultProjects: [
    {
      title: 'E-commerce Platform',
      description:
        'Build a fully functional shopping cart with payment integration.',
      image: '',
    },
    {
      title: 'Social Media Dashboard',
      description: 'Real-time feed, profiles, and interactive analytics.',
      image: '',
    },
  ],

  defaultReviews: [
    {
      studentName: 'Rahul Sharma',
      rating: 5,
      comment:
        'Amazing course! The projects really helped me understand the concepts.',
      date: 'April 2026',
    },
    {
      studentName: 'Sneha Reddy',
      rating: 5,
      comment: 'The mentors are very supportive. Landed a job in 2 months.',
      date: 'March 2026',
    },
    {
      studentName: 'Anil Kumar',
      rating: 5,
      comment: 'Worth every penny. The curriculum is very industry-focused.',
      date: 'Feb 2026',
    },
  ],

  defaultSyllabus: [
    {
      title: 'Fundamentals & Setup',
      topics: [
        'Environment configuration',
        'Core syntax & concepts',
        'Basic project structure',
      ],
    },
    {
      title: 'Intermediate Concepts',
      topics: [
        'Data handling & state',
        'Component architecture',
        'API integration',
      ],
    },
    {
      title: 'Advanced Patterns',
      topics: [
        'Performance optimization',
        'Security best practices',
        'Scaling applications',
      ],
    },
  ],
};

export const AdminCourseDefaults = {
  syllabusNote:
    'Enter a JSON array eg: [{"title":"Fundamentals & Setup","topics":["Environment configuration","Core syntax & concepts","Basic project structure"]}]',
  batches:
    '[{ days:"Mon - Fri",startDate:"May 10",status:"Filling Fast",timing"Evening Batch"}]',
  faq: '[{question: "Is there a prerequisite for this course?",answer:"Basic understanding of programming is recommended but not mandatory for beginners."}]',
};
