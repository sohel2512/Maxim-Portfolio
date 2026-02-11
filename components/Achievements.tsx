import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement, AchievementCategory, AchievementsProps } from '../types';
import { 
    Award, 
    ShieldCheck, 
    ChevronDown, 
    ExternalLink, 
    Trophy, 
    FileCheck, 
    GitMerge, 
    TrendingUp,
    CheckCircle2,
    Lock,
    Unlock,
    Plus,
    X,
    Save,
    Upload
} from 'lucide-react';

const CategoryIcon = ({ category }: { category: string }) => {
    switch(category) {
        case 'Recognition': return <Trophy size={14} />;
        case 'Certifications': return <FileCheck size={14} />;
        case 'Open Source': return <GitMerge size={14} />;
        case 'Impact': return <TrendingUp size={14} />;
        default: return <Award size={14} />;
    }
};

const Achievements: React.FC<AchievementsProps> = ({ isAdmin, achievements, addAchievement }) => {
    const [filter, setFilter] = useState<AchievementCategory>('All');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newIssuer, setNewIssuer] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState<AchievementCategory>('Recognition');
    const [newDesc, setNewDesc] = useState('');
    const [newImage, setNewImage] = useState<string>('');

    const categories: AchievementCategory[] = ['All', 'Recognition', 'Certifications', 'Open Source', 'Impact'];
    const filteredData = filter === 'All' ? achievements : achievements.filter(d => d.category === filter);

    const toggleExpand = (id: string) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleAddClick = () => {
        if (!isAdmin) {
            // Redirect to terminal
            const heroSection = document.getElementById('about');
            if (heroSection) {
                heroSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            setIsAdding(true);
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (newTitle && newIssuer && newDate) {
            const newAchievement: Achievement = {
                id: `manual-${Date.now()}`,
                title: newTitle,
                issuer: newIssuer,
                date: newDate,
                category: newCategory,
                description: newDesc,
                verified: true, // Admin added items are verified
                image: newImage
            };
            addAchievement(newAchievement);
            setIsAdding(false);
            // Reset form
            setNewTitle('');
            setNewIssuer('');
            setNewDate('');
            setNewDesc('');
            setNewImage('');
        }
    };

    return (
        <section id="achievements" className="max-w-5xl mx-auto px-6 py-24 min-h-[50vh]">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-600 dark:text-yellow-500">
                            <ShieldCheck size={24} />
                        </div>
                        Milestone Vault
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm max-w-md">
                        A verified ledger of professional recognitions, certifications, and technical impact.
                    </p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 border ${
                                filter === cat 
                                    ? 'bg-zinc-900 dark:bg-white text-white dark:text-black border-zinc-900 dark:border-white' 
                                    : 'bg-transparent text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 border-zinc-200 dark:border-white/10 hover:border-zinc-300 dark:hover:border-white/20'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* List */}
            <div className="flex flex-col gap-3">
                
                {/* Add New Card (Always at top) */}
                <AnimatePresence>
                    {isAdding ? (
                        <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="bg-zinc-100 dark:bg-zinc-900/80 border border-emerald-500/50 rounded-xl overflow-hidden shadow-lg p-5 mb-4"
                        >
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-sm font-bold text-emerald-500 uppercase tracking-widest">Add New Entry</h3>
                                <button onClick={() => setIsAdding(false)} className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white"><X size={16}/></button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <input placeholder="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded p-2 text-sm outline-none focus:border-emerald-500" />
                                <input placeholder="Issuer" value={newIssuer} onChange={e => setNewIssuer(e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded p-2 text-sm outline-none focus:border-emerald-500" />
                                <input placeholder="Year" value={newDate} onChange={e => setNewDate(e.target.value)} className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded p-2 text-sm outline-none focus:border-emerald-500" />
                                <select value={newCategory} onChange={e => setNewCategory(e.target.value as AchievementCategory)} className="bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded p-2 text-sm outline-none focus:border-emerald-500 text-zinc-700 dark:text-zinc-300">
                                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                                </select>
                            </div>
                            <textarea placeholder="Description" value={newDesc} onChange={e => setNewDesc(e.target.value)} rows={2} className="w-full bg-white dark:bg-black border border-zinc-200 dark:border-white/10 rounded p-2 text-sm outline-none focus:border-emerald-500 mb-4 resize-none" />
                            
                            {/* File Upload Area */}
                            <div className="mb-4">
                                <label className="flex items-center gap-2 text-xs text-zinc-500 mb-2 cursor-pointer w-fit hover:text-emerald-500 transition-colors">
                                    <Upload size={14} /> Upload Certificate Image (Optional)
                                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                                </label>
                                {newImage && (
                                    <div className="relative w-20 h-20 rounded overflow-hidden border border-zinc-200 dark:border-white/10">
                                        <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button onClick={() => setNewImage('')} className="absolute top-0 right-0 bg-red-500 text-white p-0.5"><X size={10} /></button>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end">
                                <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded text-xs font-bold hover:bg-emerald-500 transition-colors">
                                    <Save size={14} /> SAVE TO VAULT
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            layout
                            onClick={handleAddClick}
                            className={`
                                group relative flex items-center justify-center p-6 rounded-xl border-2 border-dashed transition-all duration-300 cursor-pointer mb-2
                                ${isAdmin 
                                    ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/60 hover:bg-emerald-500/10' 
                                    : 'border-zinc-200 dark:border-zinc-800 bg-transparent hover:border-zinc-300 dark:hover:border-zinc-700'
                                }
                            `}
                        >
                            <div className="flex flex-col items-center gap-2 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors">
                                {isAdmin ? (
                                    <>
                                        <Plus size={32} className="text-emerald-500 animate-pulse" />
                                        <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400">ADMIN MODE ACTIVE: CLICK TO ADD</span>
                                    </>
                                ) : (
                                    <>
                                        <Lock size={24} />
                                        <span className="text-xs font-mono">VAULT LOCKED (ADMIN ONLY)</span>
                                        <span className="text-[10px] bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">Hint: sudo su</span>
                                    </>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence mode='popLayout'>
                    {filteredData.map((item) => (
                        <motion.div
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            key={item.id}
                            onClick={() => toggleExpand(item.id)}
                            className={`
                                group relative overflow-hidden rounded-xl border transition-all duration-300 cursor-pointer
                                ${expandedId === item.id 
                                    ? 'bg-white dark:bg-zinc-900/80 border-emerald-500/50 shadow-lg shadow-emerald-500/5' 
                                    : 'bg-white/40 dark:bg-zinc-900/40 border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10'
                                }
                            `}
                        >
                            {/* Accent Bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors duration-300 ${expandedId === item.id ? 'bg-emerald-500' : 'bg-transparent group-hover:bg-zinc-300 dark:group-hover:bg-zinc-700'}`} />

                            <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center justify-between pl-6">
                                {/* Left: Main Info */}
                                <div className="flex items-start gap-4 flex-1">
                                    <div className="hidden sm:flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-zinc-100 dark:bg-white/5 text-zinc-500 border border-zinc-200 dark:border-white/5 shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt="cert" className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-xs font-bold">{item.date}</span>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className={`font-medium text-sm sm:text-base transition-colors ${expandedId === item.id ? 'text-emerald-600 dark:text-emerald-400' : 'text-zinc-900 dark:text-white'}`}>
                                                {item.title}
                                            </h3>
                                            {item.verified && (
                                                <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-[9px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
                                                    <CheckCircle2 size={10} /> Verified
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                                            <span className="flex items-center gap-1">
                                                <CategoryIcon category={item.category} />
                                                {item.category}
                                            </span>
                                            <span>•</span>
                                            <span>{item.issuer}</span>
                                            <span className="sm:hidden">• {item.date}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right: Icon */}
                                <div className="absolute top-5 right-5 sm:relative sm:top-0 sm:right-0 text-zinc-400">
                                    <ChevronDown 
                                        size={18} 
                                        className={`transition-transform duration-300 ${expandedId === item.id ? 'rotate-180 text-emerald-500' : ''}`} 
                                    />
                                </div>
                            </div>

                            {/* Expanded Details */}
                            <AnimatePresence>
                                {expandedId === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden bg-zinc-50/50 dark:bg-white/5 border-t border-zinc-100 dark:border-white/5"
                                    >
                                        <div className="p-6 pl-6 sm:pl-[5.5rem] grid gap-4 sm:grid-cols-[2fr_1fr]">
                                            <div className="space-y-3">
                                                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                                                    {item.description}
                                                </p>
                                                {item.image && (
                                                    <div className="mt-4 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/10 max-w-sm">
                                                        <img src={item.image} alt="Certificate Proof" className="w-full h-auto" />
                                                    </div>
                                                )}
                                                {item.link && (
                                                    <a href={item.link} className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-2">
                                                        Verify Credential <ExternalLink size={12} />
                                                    </a>
                                                )}
                                            </div>

                                            {item.tech && (
                                                <div className="space-y-2">
                                                    <p className="text-[10px] uppercase tracking-wider text-zinc-400 font-mono">Tech Stack</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {item.tech.map(t => (
                                                            <span key={t} className="px-2 py-1 rounded bg-white dark:bg-black border border-zinc-200 dark:border-white/10 text-[10px] text-zinc-600 dark:text-zinc-300 font-mono">
                                                                {t}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </AnimatePresence>
                
                {filteredData.length === 0 && !isAdding && (
                    <div className="py-12 text-center text-zinc-400 border border-dashed border-zinc-200 dark:border-white/10 rounded-xl opacity-50">
                        <p className="text-sm">Vault Empty</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default Achievements;