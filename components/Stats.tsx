import React from 'react';

const Stats: React.FC = () => {
    return (
        <section className="max-w-7xl mx-auto px-6 py-12">
            <div className="glass-pill rounded-xl p-8 grid grid-cols-2 md:grid-cols-4 gap-8 backdrop-blur-xl border border-zinc-200 dark:border-white/5 bg-white/40 dark:bg-black/40">
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-mono">Current Status</p>
                    <p className="text-zinc-900 dark:text-white font-medium flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Available
                    </p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-mono">Location</p>
                    <p className="text-zinc-900 dark:text-white font-medium">Telangana, India</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-mono">Experience</p>
                    <p className="text-zinc-900 dark:text-white font-medium">Student / Junior</p>
                </div>
                <div className="space-y-1">
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 uppercase tracking-widest font-mono">Focus</p>
                    <p className="text-zinc-900 dark:text-white font-medium">Full Stack Dev</p>
                </div>
            </div>
        </section>
    );
};

export default Stats;