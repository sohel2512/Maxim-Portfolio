import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Stats from './components/Stats';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Stack from './components/Stack';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background3D from './components/Background3D';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import { Achievement, Credentials } from './types';

const INITIAL_ACHIEVEMENTS: Achievement[] = [
    // Starting with an empty vault as requested, or you can uncomment below to have defaults
    /*
    {
        id: "hack-1",
        title: "1st Place - Global AI Hackathon",
        issuer: "TechCrunch x Google",
        date: "2024",
        category: "Recognition",
        description: "Developed 'EcoMind', an AI-powered waste classification system.",
        verified: true
    }
    */
];

const App: React.FC = () => {
  // Theme management
  const [isDark, setIsDark] = useState<boolean>(true);

  // Auth & Data State
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  // Updated default credentials with Master Key
  const [credentials, setCredentials] = useState<Credentials>({ 
      user: 'Maxim', 
      pass: 'Maxim@251204',
      masterKey: 'MAXIM_NISHU_FOREVER'
  });
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [isDark]);

  // Load creds/data from local storage on mount (Simulation)
  useEffect(() => {
      const storedCreds = localStorage.getItem('maxim_vault_creds');
      if (storedCreds) {
          setCredentials(JSON.parse(storedCreds));
      }
      
      const storedAchievements = localStorage.getItem('maxim_vault_data');
      if (storedAchievements) {
          setAchievements(JSON.parse(storedAchievements));
      }
  }, []);

  // Persist updates
  const handleSetCredentials = (creds: Credentials) => {
      setCredentials(creds);
      localStorage.setItem('maxim_vault_creds', JSON.stringify(creds));
  };

  const handleAddAchievement = (item: Achievement) => {
      const updated = [item, ...achievements];
      setAchievements(updated);
      localStorage.setItem('maxim_vault_data', JSON.stringify(updated));
  };

  const handleDeleteAchievement = (id: string) => {
      const updated = achievements.filter(a => a.id !== id);
      setAchievements(updated);
      localStorage.setItem('maxim_vault_data', JSON.stringify(updated));
  };

  const toggleTheme = () => setIsDark(!isDark);

  return (
    <div className="relative w-full min-h-screen">
      {/* UX Enhancements */}
      <CustomCursor />
      <ScrollProgress />

      {/* 3D Background */}
      <Background3D isDark={isDark} />
      
      {/* Gradient Overlay for readability */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-gradient-to-b from-white/0 via-transparent to-white/80 dark:from-black/0 dark:to-black/80 transition-colors duration-500" />

      {/* Navigation */}
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      {/* Main Content */}
      <main className="relative z-10 pt-40 pb-20">
        <Hero 
            isAdmin={isAdmin} 
            setIsAdmin={setIsAdmin} 
            credentials={credentials}
            setCredentials={handleSetCredentials}
            achievements={achievements}
            deleteAchievement={handleDeleteAchievement}
        />
        <Stats />
        <Projects />
        <Achievements 
            isAdmin={isAdmin}
            achievements={achievements}
            addAchievement={handleAddAchievement}
        />
        <Stack />
        <Contact />
        <Footer />
      </main>
    </div>
  );
};

export default App;