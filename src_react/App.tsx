/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  X, 
  Cloud, 
  Terminal, 
  Database, 
  Code, 
  HardDrive, 
  Layout, 
  Calendar, 
  BarChart, 
  Brain, 
  Rocket, 
  School, 
  Star, 
  Phone, 
  Mail, 
  ChevronRight,
  LogOut,
  User as UserIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { cn } from './lib/utils';
import { auth, db, signInWithGoogle, logout } from './firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  doc, 
  setDoc, 
  getDoc,
  serverTimestamp 
} from 'firebase/firestore';

// --- Types ---
interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  imageUrl: string;
  badge?: string;
}

interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  imageUrl: string;
  rating: number;
}

// --- Constants ---
const COURSES_SEED: Omit<Course, 'id'>[] = [
  {
    title: "Mastering Snowflake",
    description: "Cloud Data Platform architecture and performance optimization.",
    duration: "6 Months",
    level: "Intermediate",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDnldijmdWSGtk6QwP7zskfVPsgRZzRomoe6bdxrz-aMWBtJ7hMW6v6c3uD3Zu-uOhF0mBz0NB26HXFWWaBfMCZiOibBCJ4KUCW6wL4qmb3rndThgF0vzJbJZHSXPSx5mT38LxfLku6awBKNI9GfXs_A1BsvhBROw9imymdZwFhT7RhYLvDH1ReVnW7m5CaNJR2SA5aP9tKN0ZwdGY4tZvrRbaCdLJfy95BxCwo7kgdRSQu2R0X0WNw8GzJ3QUXicPmTDBMmZYB-mE",
    badge: "Bestseller"
  },
  {
    title: "Advanced SQL Mastery",
    description: "Master complex queries, window functions, and performance tuning.",
    duration: "4 Months",
    level: "Advanced",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA8KoHwxKEgU6y3bqFcjFB4wP3bS1bAXzEavKOZQxO0VjqNFJfnIkrcI1WBmWO1UlUXTrMvFUQBr5gYfOfQnkPmW6Jf_VLvf8eTEimSwz8JfFFZAxHVgPISuyGKl3UTm8heDhxP3_L-5xbt3gkYsHl_op6p32t6T-7O0eYYCtHjBnsn0J1EBZw40tPgOy3lXZIJZ2g076hKCMLupDSqnaejHfQBqci_IfVeN2n0I167bnhisA8KJb86onuGpNHiOT2uWPotwsl7FWI",
    badge: "Hot Topic"
  }
];

const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: "Rahul Sharma",
    role: "Data Engineer at TechCorp",
    content: "The training at KSR was a game changer. I transitioned from a legacy DBA role to a Snowflake Developer in just 4 months. The hands-on projects were exactly like the work I do now.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCpoCxkTKNfCverTARayWRWkRuERG-iEFY6lNM4HfQZOvoXRAeDlKPxDV8rHo3HTvC886L59FedS7sD-hmh4KWbZ2p0s6yc15RC6gz3sUr_2zZuu-T5TZbUBHPngliwIQmVoZVqmicutLtTzi2_IjonWj2Wu3yxpzNJ4ofg0SztRlDANuE-1uMxmHq3byiMooTRJInQ5BKV70OcLdZ0enr5rH1LcOLUQP8CHbkKfcIa3rDt96tYV_HEvnoZqqnJ7OZrVfK8YOnnwnM",
    rating: 5
  }
];

// --- Components ---

const Navbar = ({ user, onLogin, onLogout }: { user: User | null, onLogin: () => void, onLogout: () => void }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-surface/80 backdrop-blur-md border-b border-outline-variant/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            {isOpen ? <X className="w-6 h-6 text-primary" /> : <Menu className="w-6 h-6 text-primary" />}
          </button>
          <span className="text-xl font-black tracking-tighter text-primary">KSR IT Solutions</span>
        </div>

        <div className="hidden md:flex items-center gap-8">
          <a href="#courses" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Courses</a>
          <a href="#about" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">About Us</a>
          <a href="#contact" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">Contact</a>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3">
              <img src={user.photoURL || ''} alt={user.displayName || ''} className="w-8 h-8 rounded-full border border-outline-variant" />
              <button onClick={onLogout} className="text-sm font-bold text-primary hover:text-secondary transition-colors flex items-center gap-1">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <button 
              onClick={onLogin}
              className="bg-primary-container text-on-primary px-5 py-2 rounded-lg font-bold text-sm hover:opacity-90 transition-all active:scale-95"
            >
              Enroll Now
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface-container border-b border-outline-variant/10 overflow-hidden"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              <a href="#courses" onClick={() => setIsOpen(false)} className="text-lg font-medium text-primary">Courses</a>
              <a href="#about" onClick={() => setIsOpen(false)} className="text-lg font-medium text-primary">About Us</a>
              <a href="#contact" onClick={() => setIsOpen(false)} className="text-lg font-medium text-primary">Contact</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => (
  <section className="relative bg-primary-container text-on-primary py-24 px-6 overflow-hidden">
    <div className="absolute inset-0 opacity-10 pointer-events-none">
      <img 
        className="w-full h-full object-cover" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuB6drP5eXzxss2mwg4zeczZnchwxlwXDnXBxVRMT2u6djVkJRgSBvmyPzP__p823T4kAgokiCAGHcTmnkCPpH7XBlXD4ywFEqZcOweXdSIbNmohCGRbi9yfQ7VoPUNymFKtrqSQ5b9qiYrF3VTIqhdllWnzixaHArdJEaJgFfFZ2RAaGnAdNfa4qBpkgUxnvD_LpdcAqSn-JuWlBWaOxVVQavkILpbAulaBjA_Ra4QpRdU68e8B9eKds2_TI9cMvE0mw0ENdpYa9x0"
        alt="Data visualization"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="relative z-10 max-w-4xl mx-auto text-center">
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-block px-4 py-1.5 rounded-full bg-secondary text-on-secondary text-[10px] font-bold uppercase tracking-[0.2em] mb-8"
      >
        Empower Your Career
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1] text-white"
      >
        Master Data Technologies <br /> & Build Your Career
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-on-primary-container text-xl font-light mb-12 leading-relaxed max-w-2xl mx-auto"
      >
        Expert-led training in Snowflake, DBT, and Advanced SQL. Transition into high-growth data roles with real-time projects.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-col sm:flex-row justify-center gap-4"
      >
        <button className="bg-secondary-container text-on-secondary-container px-8 py-4 rounded-xl font-bold text-lg shadow-lg shadow-secondary/20 active:scale-95 transition-transform">
          View Courses
        </button>
        <button className="border border-white/20 bg-white/5 backdrop-blur-md text-white px-8 py-4 rounded-xl font-bold text-lg active:scale-95 transition-transform">
          Contact Us
        </button>
      </motion.div>
    </div>
  </section>
);

const Competencies = () => {
  const items = [
    { icon: Cloud, title: "Snowflake", desc: "Cloud Data Platform architecture and performance." },
    { icon: Terminal, title: "DBT", desc: "Modern data transformation and modeling." },
    { icon: Database, title: "Oracle SQL", desc: "Enterprise relational database mastery." },
    { icon: Code, title: "PL/SQL", desc: "Procedural language extensions for SQL." },
    { icon: HardDrive, title: "MS SQL", desc: "Microsoft SQL Server administration." },
    { icon: Layout, title: "Modeling", desc: "Conceptual, logical and physical design." },
  ];

  return (
    <section className="py-20 px-6 max-w-7xl mx-auto">
      <div className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-widest text-secondary mb-2">Core Competencies</h2>
        <h3 className="text-3xl font-bold text-primary leading-tight">Master Modern Data Stack</h3>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm border border-outline-variant/10 group transition-all"
          >
            <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center mb-6 text-primary group-hover:bg-primary group-hover:text-on-primary transition-colors">
              <item.icon className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-lg text-primary mb-2">{item.title}</h4>
            <p className="text-sm text-on-surface-variant leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const CourseCard = ({ course, onEnroll }: { course: Course, onEnroll: (c: Course) => Promise<void> | void }) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="bg-surface-container-lowest rounded-3xl overflow-hidden shadow-lg shadow-primary/5 flex flex-col"
  >
    <div className="h-48 relative">
      <img 
        className="w-full h-full object-cover" 
        src={course.imageUrl} 
        alt={course.title}
        referrerPolicy="no-referrer"
      />
      {course.badge && (
        <div className="absolute top-4 left-4 px-3 py-1 bg-tertiary-container text-on-tertiary-container text-[10px] font-bold rounded-lg uppercase">
          {course.badge}
        </div>
      )}
    </div>
    <div className="p-8 flex-grow flex flex-col">
      <h4 className="text-2xl font-bold text-primary mb-3">{course.title}</h4>
      <p className="text-sm text-on-surface-variant mb-6 flex-grow">{course.description}</p>
      <div className="flex items-center gap-6 mb-8 text-xs text-on-surface-variant font-medium">
        <span className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-secondary" /> {course.duration}
        </span>
        <span className="flex items-center gap-2">
          <BarChart className="w-4 h-4 text-secondary" /> {course.level}
        </span>
      </div>
      <button 
        onClick={() => onEnroll(course)}
        className="w-full bg-primary-container text-on-primary py-4 rounded-xl font-bold text-sm hover:bg-primary transition-colors active:scale-95"
      >
        Enroll Today
      </button>
    </div>
  </motion.div>
);

const WhyStudy = () => {
  const benefits = [
    { icon: Brain, title: "Industry Experts", desc: "Learn from veterans with over 15+ years of experience in Fortune 500 tech companies.", color: "bg-secondary/10 text-secondary" },
    { icon: Rocket, title: "Real-time Projects", desc: "Don't just watch; build. Work on live datasets and industry-standard scenarios.", color: "bg-tertiary-container/10 text-on-tertiary-container" },
    { icon: School, title: "Placement Assistance", desc: "Resume workshops, mock interviews, and direct referrals to hiring partners.", color: "bg-primary-container/10 text-primary-container" },
  ];

  return (
    <section className="py-24 px-6 bg-surface-container-low">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-primary mb-16 text-center">Why Study at KSR?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {benefits.map((benefit, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6", benefit.color)}>
                <benefit.icon className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-primary text-xl mb-3">{benefit.title}</h4>
              <p className="text-sm text-on-surface-variant leading-relaxed">{benefit.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Mission = () => (
  <section id="about" className="py-24 px-6 bg-primary-container text-on-primary">
    <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
      <span className="text-secondary font-bold tracking-widest text-[10px] uppercase mb-6">Our Mission</span>
      <h2 className="text-4xl md:text-5xl font-bold mb-8">Empowering The Next Generation of Data Professionals</h2>
      <p className="text-on-primary-container text-xl leading-relaxed mb-12 font-light italic opacity-90">
        "At KSR IT Solutions, we bridge the gap between academic knowledge and industrial expertise. Our mission is to transform students into architects of the digital future."
      </p>
      <div className="grid grid-cols-2 gap-12 w-full">
        <div>
          <div className="text-5xl font-black text-secondary mb-2">10K+</div>
          <div className="text-xs uppercase tracking-widest text-on-primary-container font-bold">Students Trained</div>
        </div>
        <div>
          <div className="text-5xl font-black text-secondary mb-2">500+</div>
          <div className="text-xs uppercase tracking-widest text-on-primary-container font-bold">Hiring Partners</div>
        </div>
      </div>
    </div>
  </section>
);

const Testimonials = () => (
  <section className="py-24 px-6 bg-surface-container-high overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-16 text-center">Student Success Stories</h2>
      <div className="relative max-w-3xl mx-auto">
        {TESTIMONIALS.map((t) => (
          <div key={t.id} className="bg-surface-container-lowest p-10 rounded-3xl shadow-xl relative z-10 border border-outline-variant/10">
            <div className="flex gap-1 text-secondary mb-8">
              {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
            </div>
            <p className="text-on-surface-variant text-lg leading-relaxed mb-10 italic">"{t.content}"</p>
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-secondary/20">
                <img className="w-full h-full object-cover" src={t.imageUrl} alt={t.name} referrerPolicy="no-referrer" />
              </div>
              <div>
                <div className="font-bold text-primary text-lg">{t.name}</div>
                <div className="text-xs text-on-surface-variant font-medium">{t.role}</div>
              </div>
            </div>
          </div>
        ))}
        <div className="absolute -bottom-4 left-8 right-8 h-20 bg-surface-container-lowest/50 rounded-3xl -z-10 translate-y-2"></div>
      </div>
    </div>
  </section>
);

const ContactForm = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await addDoc(collection(db, 'inquiries'), {
        ...formData,
        submittedAt: serverTimestamp()
      });
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <section id="contact" className="py-24 px-6 bg-surface">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h2 className="text-4xl font-bold text-primary mb-4">Get in Touch</h2>
          <p className="text-lg text-on-surface-variant mb-12">Have questions? We're here to help you navigate your career path.</p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Call Us</div>
                <div className="text-lg font-bold text-primary">+91 98765 43210</div>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-surface-container flex items-center justify-center text-primary">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <div className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-1">Email Us</div>
                <div className="text-lg font-bold text-primary">admissions@ksrit.com</div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface-container-low p-8 md:p-10 rounded-3xl border border-outline-variant/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 ml-1">Your Name</label>
              <input 
                required
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full px-6 py-4 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-secondary text-sm transition-all" 
                placeholder="John Doe" 
                type="text" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 ml-1">Email Address</label>
              <input 
                required
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full px-6 py-4 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-secondary text-sm transition-all" 
                placeholder="john@example.com" 
                type="email" 
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-primary mb-3 ml-1">Message</label>
              <textarea 
                required
                value={formData.message}
                onChange={e => setFormData({...formData, message: e.target.value})}
                className="w-full px-6 py-4 bg-surface-container-lowest border-0 rounded-xl focus:ring-2 focus:ring-secondary text-sm transition-all" 
                placeholder="How can we help you?" 
                rows={4}
              ></textarea>
            </div>
            <button 
              disabled={status === 'loading'}
              className={cn(
                "w-full py-5 rounded-xl font-bold shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2",
                status === 'success' ? "bg-green-600 text-white" : "bg-secondary text-on-secondary shadow-secondary/20"
              )}
            >
              {status === 'loading' ? "Sending..." : status === 'success' ? <><CheckCircle2 className="w-5 h-5" /> Sent Successfully</> : "Send Message"}
            </button>
            {status === 'error' && (
              <p className="text-red-500 text-xs flex items-center gap-1 mt-2">
                <AlertCircle className="w-4 h-4" /> Something went wrong. Please try again.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-primary text-on-primary py-16 px-8">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
      <div className="text-center md:text-left">
        <span className="text-2xl font-black tracking-tighter block mb-3">KSR IT Solutions</span>
        <p className="text-sm font-light tracking-wider opacity-60">Empowering professionals since 2018.</p>
      </div>
      <nav className="flex flex-wrap justify-center gap-8">
        <a href="#" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-secondary transition-all">Quick Links</a>
        <a href="#" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-secondary transition-all">Social</a>
        <a href="#" className="text-xs font-bold uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-secondary transition-all">Privacy Policy</a>
      </nav>
    </div>
    <div className="max-w-7xl mx-auto text-center pt-12 mt-12 border-t border-white/10">
      <p className="text-[10px] font-light tracking-widest opacity-40">© 2023 KSR IT Solutions. All rights reserved.</p>
    </div>
  </footer>
);

// --- Main App ---

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        // Sync user profile
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);
        if (!userSnap.exists()) {
          await setDoc(userRef, {
            uid: u.uid,
            displayName: u.displayName,
            email: u.email,
            photoURL: u.photoURL,
            role: 'student'
          });
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'courses'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Course));
      setCourses(docs);
      setLoading(false);
    }, (err) => {
      console.error("Firestore Error:", err);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleEnroll = async (course: Course) => {
    if (!user) {
      try {
        await signInWithGoogle();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      await addDoc(collection(db, 'enrollments'), {
        userId: user.uid,
        courseId: course.id,
        courseTitle: course.title,
        enrolledAt: serverTimestamp(),
        status: 'pending'
      });
      alert(`Successfully enrolled in ${course.title}! Our team will contact you soon.`);
    } catch (err) {
      console.error(err);
      alert("Enrollment failed. Please try again.");
    }
  };

  const seedData = async () => {
    try {
      for (const c of COURSES_SEED) {
        await addDoc(collection(db, 'courses'), c);
      }
      alert("Database seeded successfully!");
    } catch (err) {
      console.error(err);
      alert("Seeding failed. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-surface font-['Inter'] selection:bg-secondary-container selection:text-on-secondary-container">
      <Navbar user={user} onLogin={signInWithGoogle} onLogout={logout} />
      
      <main>
        <Hero />
        
        <Competencies />

        <section id="courses" className="py-24 px-6 bg-surface-container-low">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16 text-center">
              <h2 className="text-4xl font-bold text-primary mb-4">Featured Programs</h2>
              <div className="w-16 h-1 bg-secondary mx-auto rounded-full"></div>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="w-12 h-12 border-4 border-secondary border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {courses.map(course => (
                  <div key={course.id}>
                    <CourseCard course={course} onEnroll={handleEnroll} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-lowest rounded-3xl border border-dashed border-outline-variant">
                <p className="text-on-surface-variant mb-6">No courses available yet.</p>
                {user?.email === "manirajmca.ac@gmail.com" && (
                  <button onClick={seedData} className="bg-secondary text-on-secondary px-6 py-2 rounded-lg font-bold">
                    Seed Initial Courses
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <WhyStudy />
        <Mission />
        <Testimonials />
        <ContactForm />
      </main>

      <Footer />

      {/* FAB for Chat/Support */}
      <motion.button 
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-40 w-16 h-16 bg-secondary text-on-secondary rounded-2xl shadow-2xl flex items-center justify-center"
      >
        <Brain className="w-8 h-8" />
      </motion.button>
    </div>
  );
}
