import React, { useEffect, useState } from 'react';
import { NavProps } from '../types';
import { 
    Terminal, 
    Github, 
    Instagram, 
    Send, 
    MessageCircle, 
    Sun, 
    Moon, 
    Sparkles 
} from 'lucide-react';

const Navbar: React.FC<NavProps> = ({ isDark, toggleTheme }) => {
    const [activeSection, setActiveSection] = useState('about');

    useEffect(() => {
        const handleScroll = () => {
            const sections = ['about', 'projects', 'achievements', 'stack', 'contact'];
            // Offset to handle header height (approx 100px)
            const scrollPosition = window.scrollY + 150;

            for (const section of sections) {
                const element = document.getElementById(section);
                if (element) {
                    const { offsetTop, offsetHeight } = element;
                    if (
                        scrollPosition >= offsetTop &&
                        scrollPosition < offsetTop + offsetHeight
                    ) {
                        setActiveSection(section);
                        break;
                    }
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        // Trigger once on mount
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            // Update active state immediately for feedback
            setActiveSection(id);
            // Smooth scroll to the element
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setActiveSection('about');
    };

    const navItems = [
        { id: 'about', label: 'About' },
        { id: 'projects', label: 'Projects' },
        { id: 'achievements', label: 'Vault' },
        { id: 'stack', label: 'Stack' },
        { id: 'contact', label: 'Contact' },
    ];

    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full max-w-[95%] md:max-w-4xl">
            <div className="glass-pill rounded-full px-2 py-2 flex items-center justify-between transition-all duration-300">
                
                {/* Logo */}
                <a 
                    href="#" 
                    onClick={handleLogoClick}
                    className="pl-4 pr-6 flex items-center gap-2 group"
                >
                    <div className="bg-zinc-900 dark:bg-emerald-500 text-white p-1.5 rounded-full transition-colors duration-300">
                        <Terminal size={14} />
                    </div>
                    <span className="font-mono text-sm tracking-tighter font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        MAXIM_DEV
                    </span>
                </a>

                {/* Links (Hidden on small mobile) */}
                <div className="hidden md:flex items-center gap-1 bg-zinc-100/50 dark:bg-white/5 rounded-full px-1 py-1">
                    {navItems.map((item) => (
                        <a 
                            key={item.id}
                            href={`#${item.id}`} 
                            onClick={(e) => handleNavClick(e, item.id)}
                            className={`px-3 lg:px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-300 cursor-pointer ${
                                activeSection === item.id 
                                ? 'bg-white dark:bg-zinc-800 text-black dark:text-white shadow-sm scale-105' 
                                : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white hover:bg-white/50 dark:hover:bg-zinc-800/50'
                            }`}
                        >
                            {item.label}
                        </a>
                    ))}
                </div>

                {/* Right Side: Socials + Theme Toggle */}
                <div className="flex items-center gap-2 pr-2">
                    {/* Vertical Divider */}
                    <div className="w-px h-6 bg-zinc-300 dark:bg-zinc-700 hidden md:block mx-1"></div>

                    {/* Social Icons */}
                    <div className="flex items-center gap-1">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white transition-all hover:scale-110" title="Github">
                            <Github size={18} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-pink-100 dark:hover:bg-pink-900/30 hover:text-pink-600 dark:hover:text-pink-400 transition-all hover:scale-110" title="Instagram">
                            <Instagram size={18} />
                        </a>
                        <a href="https://telegram.org" target="_blank" rel="noreferrer" className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-500 dark:hover:text-blue-400 transition-all hover:scale-110" title="Telegram">
                            <Send size={18} />
                        </a>
                        <a href="https://whatsapp.com" target="_blank" rel="noreferrer" className="p-2 rounded-full text-zinc-600 dark:text-zinc-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all hover:scale-110" title="WhatsApp">
                            <MessageCircle size={18} />
                        </a>
                    </div>

                    {/* Theme Toggle Button */}
                    <button 
                        onClick={toggleTheme}
                        className="ml-2 p-2 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-yellow-400 hover:ring-2 ring-emerald-500/50 transition-all shadow-sm"
                        aria-label="Toggle Theme"
                    >
                        {isDark ? (
                            /* Sun icon for Dark Mode (to switch to light) with a nice glow */
                            <Sun size={18} className="animate-pulse-slow" />
                        ) : (
                            /* Moon icon for Light Mode (to switch to dark) */
                            <div className="relative">
                                <Moon size={18} className="text-zinc-600" />
                                <Sparkles size={8} className="absolute -top-1 -right-1 text-purple-500 animate-pulse" />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;