import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Cpu, FileCode, Coffee, Braces, FileType, Layout, Wind, 
    GitBranch, Terminal, Figma, Atom, Globe, Server, Layers, 
    Sparkles, Code2, Workflow, Zap, Database, Box, Hexagon,
    Search, X, ExternalLink, Activity, Command, Grid
} from 'lucide-react';

// --- Types ---

type SkillCategory = 'All' | 'Languages' | 'Frontend' | 'Backend' | 'Tools';
type SkillStatus = 'CORE' | 'ACTIVE' | 'AUX' | 'LEARNING';

interface Skill {
    id: string;
    name: string;
    icon: React.ElementType;
    category: SkillCategory;
    status: SkillStatus;
    description: string;
    useCase: string;
    related: string[];
    projects: string[];
    color: string; // Tailwind text class
    hex: string;   // Hex for glow effects
}

// --- Data ---

const SKILLS: Skill[] = [
    // Languages
    {
        id: "python",
        name: "Python",
        icon: FileCode,
        category: "Languages",
        status: "CORE",
        description: "High-level programming language emphasizing code readability.",
        useCase: "Data analysis, automation scripts, and backend logic.",
        related: ["Django", "FastAPI", "Pandas"],
        projects: ["AI Code Assistant", "Data Scrapers"],
        color: "text-yellow-500",
        hex: "#EAB308"
    },
    {
        id: "java",
        name: "Java",
        icon: Coffee,
        category: "Languages",
        status: "ACTIVE",
        description: "Class-based, object-oriented programming language.",
        useCase: "Enterprise backend systems and Android development.",
        related: ["Spring Boot", "Kotlin", "Android SDK"],
        projects: ["Student Portal", "Bank System"],
        color: "text-orange-500",
        hex: "#F97316"
    },
    {
        id: "js",
        name: "JavaScript",
        icon: Braces,
        category: "Languages",
        status: "CORE",
        description: "The programming language of the Web.",
        useCase: "Interactive frontend logic and asynchronous operations.",
        related: ["TypeScript", "React", "Node.js"],
        projects: ["All Web Projects"],
        color: "text-yellow-400",
        hex: "#FACC15"
    },
    {
        id: "ts",
        name: "TypeScript",
        icon: FileType,
        category: "Languages",
        status: "CORE",
        description: "JavaScript with syntax for types.",
        useCase: "Large-scale application development with type safety.",
        related: ["React", "Angular", "VS Code"],
        projects: ["Neon Dashboard", "Portfolio"],
        color: "text-blue-500",
        hex: "#3B82F6"
    },
    // Frontend
    {
        id: "react",
        name: "React",
        icon: Atom,
        category: "Frontend",
        status: "CORE",
        description: "A library for building user interfaces.",
        useCase: "Building Single Page Applications (SPAs) and component systems.",
        related: ["Next.js", "Redux", "Framer Motion"],
        projects: ["Neon Dashboard", "Portfolio"],
        color: "text-cyan-400",
        hex: "#22D3EE"
    },
    {
        id: "tailwind",
        name: "Tailwind CSS",
        icon: Wind,
        category: "Frontend",
        status: "ACTIVE",
        description: "A utility-first CSS framework.",
        useCase: "Rapid UI development and design system implementation.",
        related: ["CSS3", "PostCSS", "Sass"],
        projects: ["Cyberpunk Commerce", "Portfolio"],
        color: "text-cyan-500",
        hex: "#06B6D4"
    },
    {
        id: "three",
        name: "Three.js",
        icon: Layers,
        category: "Frontend",
        status: "LEARNING",
        description: "Cross-browser JavaScript library and application programming interface.",
        useCase: "Creating and displaying animated 3D computer graphics.",
        related: ["WebGL", "React Three Fiber", "Blender"],
        projects: ["Portfolio 3D Background"],
        color: "text-white",
        hex: "#FFFFFF"
    },
    {
        id: "html",
        name: "HTML5",
        icon: Globe,
        category: "Frontend",
        status: "CORE",
        description: "Standard markup language for documents designed to be displayed in a web browser.",
        useCase: "Structuring web content and semantic markup.",
        related: ["CSS3", "JavaScript", "SEO"],
        projects: ["All Web Projects"],
        color: "text-orange-600",
        hex: "#EA580C"
    },
    // Backend
    {
        id: "node",
        name: "Node.js",
        icon: Server,
        category: "Backend",
        status: "ACTIVE",
        description: "JavaScript runtime built on Chrome's V8 JavaScript engine.",
        useCase: "Building scalable network applications and REST APIs.",
        related: ["Express", "Socket.io", "MongoDB"],
        projects: ["Chat App Backend", "API Services"],
        color: "text-green-500",
        hex: "#22C55E"
    },
    {
        id: "sql",
        name: "SQL",
        icon: Database,
        category: "Backend",
        status: "ACTIVE",
        description: "Domain-specific language used in programming and designed for managing data.",
        useCase: "Querying and managing relational databases.",
        related: ["PostgreSQL", "MySQL", "Prisma"],
        projects: ["E-commerce DB", "User Management"],
        color: "text-blue-400",
        hex: "#60A5FA"
    },
    // Tools
    {
        id: "git",
        name: "Git",
        icon: GitBranch,
        category: "Tools",
        status: "CORE",
        description: "Distributed version control system.",
        useCase: "Source code management and team collaboration.",
        related: ["GitHub", "GitLab", "CI/CD"],
        projects: ["All Projects"],
        color: "text-red-500",
        hex: "#EF4444"
    },
    {
        id: "vscode",
        name: "VS Code",
        icon: Terminal,
        category: "Tools",
        status: "CORE",
        description: "Source-code editor made by Microsoft.",
        useCase: "Daily development, debugging, and extension management.",
        related: ["Vim", "Extensions", "Terminal"],
        projects: ["Daily Driver"],
        color: "text-blue-500",
        hex: "#3B82F6"
    },
    {
        id: "figma",
        name: "Figma",
        icon: Figma,
        category: "Tools",
        status: "ACTIVE",
        description: "Vector graphics editor and prototyping tool.",
        useCase: "UI/UX design, wireframing, and high-fidelity prototyping.",
        related: ["Adobe XD", "Sketch", "CSS"],
        projects: ["Project Designs", "Portfolio Mockup"],
        color: "text-purple-500",
        hex: "#A855F7"
    }
];

// --- Components ---

const SkillTile: React.FC<{ skill: Skill; onClick: () => void }> = ({ skill, onClick }) => {
    return (
        <motion.div
            layoutId={`skill-${skill.id}`}
            onClick={onClick}
            className="group relative cursor-pointer bg-white/40 dark:bg-zinc-900/40 backdrop-blur-sm border border-zinc-200 dark:border-white/5 rounded-lg overflow-hidden transition-all duration-300 hover:-translate-y-1"
        >
            {/* Hover Glow */}
            <div 
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ boxShadow: `inset 0 0 20px ${skill.hex}20` }}
            />
            {/* Animated Border on Hover */}
            <div className="absolute inset-0 border border-transparent group-hover:border-[color:var(--glow-color)] transition-colors duration-300" style={{ '--glow-color': skill.hex } as React.CSSProperties} />

            <div className="p-4 flex items-start justify-between relative z-10">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/5 group-hover:scale-110 transition-transform duration-300`}>
                        <skill.icon size={20} className={skill.color} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{skill.name}</h4>
                        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">{skill.category}</span>
                    </div>
                </div>
                
                {/* Status Indicator */}
                <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${skill.status === 'CORE' ? 'bg-emerald-500 animate-pulse' : skill.status === 'ACTIVE' ? 'bg-blue-500' : 'bg-yellow-500'}`} />
                        <span className={`text-[9px] font-bold font-mono ${skill.status === 'CORE' ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-500'}`}>
                            {skill.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* Scanline Effect (CSS Animation) */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent -translate-y-full group-hover:translate-y-full transition-transform duration-1000 ease-in-out pointer-events-none" />
        </motion.div>
    );
};

const SkillInspector: React.FC<{ skill: Skill; onClose: () => void }> = ({ skill, onClose }) => {
    // Close on click outside
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
                className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />

            {/* Panel */}
            <motion.div 
                layoutId={`skill-${skill.id}`} // Shared layout ID for seamless transition logic if we wanted expanding card, but here we slide
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="relative w-full max-w-md h-full bg-white dark:bg-[#0c0c0c] border-l border-zinc-200 dark:border-white/10 shadow-2xl overflow-y-auto"
            >
                {/* Header */}
                <div className="sticky top-0 z-10 bg-white/80 dark:bg-[#0c0c0c]/80 backdrop-blur-md border-b border-zinc-200 dark:border-white/10 p-6 flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div 
                            className="p-3 rounded-xl bg-zinc-100 dark:bg-white/5 border border-zinc-200 dark:border-white/10"
                            style={{ boxShadow: `0 0 20px ${skill.hex}30` }}
                        >
                            <skill.icon size={32} className={skill.color} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">{skill.name}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-zinc-100 dark:bg-white/10 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5">
                                    MODULE: {skill.id.toUpperCase()}
                                </span>
                                <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-500">
                                    <Activity size={10} /> {skill.status}
                                </span>
                            </div>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-white/10 transition-colors"
                    >
                        <X size={20} className="text-zinc-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-8">
                    
                    {/* Description Block */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Command size={14} /> System Description
                        </h3>
                        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed p-4 rounded-lg bg-zinc-50 dark:bg-white/5 border border-zinc-200 dark:border-white/5">
                            {skill.description}
                        </p>
                    </div>

                    {/* Operational Use */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Workflow size={14} /> Operational Use
                        </h3>
                        <div className="flex items-start gap-3 p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
                            <Zap size={18} className="text-emerald-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-zinc-700 dark:text-zinc-300">
                                {skill.useCase}
                            </p>
                        </div>
                    </div>

                    {/* Synergy Grid */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Grid size={14} /> Synergy Modules
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {skill.related.map(item => (
                                <span key={item} className="px-3 py-1.5 rounded-full text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-white/5 flex items-center gap-1.5">
                                    <Hexagon size={10} /> {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Deployed Projects */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest flex items-center gap-2">
                            <Box size={14} /> Deployed In
                        </h3>
                        <div className="space-y-2">
                            {skill.projects.map(project => (
                                <div key={project} className="group flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5 hover:border-emerald-500/30 transition-colors">
                                    <span className="text-sm text-zinc-700 dark:text-zinc-300">{project}</span>
                                    <ExternalLink size={14} className="text-zinc-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </motion.div>
        </div>
    );
};

// --- Main Component ---

const Stack: React.FC = () => {
    const [filter, setFilter] = useState<SkillCategory>('All');
    const [activeSkill, setActiveSkill] = useState<Skill | null>(null);

    const categories: SkillCategory[] = ['All', 'Languages', 'Frontend', 'Backend', 'Tools'];
    
    const filteredSkills = filter === 'All' 
        ? SKILLS 
        : SKILLS.filter(s => s.category === filter);

    return (
        <section id="stack" className="max-w-7xl mx-auto px-6 py-20 min-h-screen">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h3 className="text-3xl font-medium text-zinc-900 dark:text-white flex items-center gap-3 tracking-tight">
                        <Cpu className="text-emerald-500" size={32} />
                        Tech Matrix
                    </h3>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 max-w-md">
                        Explore the modular components of my technical arsenal. 
                        Click on any module to inspect detailed specifications.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/5">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 py-1.5 rounded-md text-xs font-medium transition-all duration-300 relative ${
                                filter === cat 
                                    ? 'text-white' 
                                    : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'
                            }`}
                        >
                            {filter === cat && (
                                <motion.div 
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-zinc-900 dark:bg-emerald-600 rounded-md shadow-sm"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10">{cat}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid */}
            <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
                <AnimatePresence mode='popLayout'>
                    {filteredSkills.map(skill => (
                        <SkillTile 
                            key={skill.id} 
                            skill={skill} 
                            onClick={() => setActiveSkill(skill)} 
                        />
                    ))}
                </AnimatePresence>
            </motion.div>

            {/* Empty State */}
            {filteredSkills.length === 0 && (
                <div className="py-20 text-center text-zinc-400">
                    <Search className="mx-auto mb-2 opacity-50" size={32} />
                    <p>No modules found in this sector.</p>
                </div>
            )}

            {/* Inspector Modal */}
            <AnimatePresence>
                {activeSkill && (
                    <SkillInspector 
                        skill={activeSkill} 
                        onClose={() => setActiveSkill(null)} 
                    />
                )}
            </AnimatePresence>
        </section>
    );
};

export default Stack;