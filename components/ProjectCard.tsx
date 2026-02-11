import React, { useRef, useState, MouseEvent } from 'react';
import { Project } from '../types';
import { ExternalLink, Code2, Github, ArrowRight } from 'lucide-react';

interface ProjectCardProps {
    project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [glowPos, setGlowPos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Calculate rotation based on mouse position (max 8 degrees)
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        setTilt({ x: rotateX, y: rotateY });
        setGlowPos({ x, y });
    };

    const handleMouseEnter = () => setIsHovered(true);
    
    const handleMouseLeave = () => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
    };

    return (
        <div 
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="group relative h-[450px] w-full rounded-2xl transition-all duration-300 ease-out"
            style={{ 
                transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.02 : 1})`,
                transformStyle: 'preserve-3d',
                willChange: 'transform'
            }}
        >
            {/* 1. Dynamic Neon Glow (Behind) */}
            <div 
                className={`absolute -inset-1 bg-gradient-to-br from-emerald-500 via-cyan-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500`}
                style={{ transform: 'translateZ(-10px)' }}
            />
            
            {/* 2. Main Content Wrapper */}
            <div className="relative h-full w-full bg-white dark:bg-[#0c0c0c] rounded-2xl overflow-hidden border border-zinc-200 dark:border-white/10 flex flex-col shadow-2xl">
                
                {/* 2.1 Spotlight Glare Effect */}
                {isHovered && (
                    <div 
                        className="pointer-events-none absolute inset-0 z-50 transition-opacity duration-300 mix-blend-overlay"
                        style={{
                            background: `radial-gradient(800px circle at ${glowPos.x}px ${glowPos.y}px, rgba(255,255,255,0.15), transparent 40%)`
                        }}
                    />
                )}

                {/* 2.2 Image Section with Parallax */}
                <div className="relative h-56 shrink-0 overflow-hidden bg-zinc-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10 pointer-events-none" />
                    
                    <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out will-change-transform"
                        style={{
                            transform: isHovered ? 'scale(1.15)' : 'scale(1.0)'
                        }}
                    />

                    {/* Tags overlaying image */}
                    <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 pointer-events-none">
                        {project.tags.slice(0, 3).map(tag => (
                            <span key={tag} className="px-2.5 py-1 text-[10px] font-mono font-bold text-white bg-black/40 backdrop-blur-md rounded border border-white/10 shadow-lg">
                                {tag}
                            </span>
                        ))}
                    </div>

                    {/* Action Buttons Overlay (Reveals on Hover) */}
                    <div className={`absolute inset-0 z-20 flex items-center justify-center gap-4 transition-all duration-300 ${isHovered ? 'opacity-100 backdrop-blur-[2px]' : 'opacity-0'}`}>
                        <button className="p-3 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-emerald-500 hover:border-emerald-500 hover:text-white transition-all hover:scale-110 shadow-xl group/btn" title="View Live">
                            <ExternalLink size={20} className="group-hover/btn:stroke-2" />
                        </button>
                        <button className="p-3 bg-zinc-900/80 dark:bg-black/80 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-purple-500 hover:border-purple-500 hover:text-white transition-all hover:scale-110 shadow-xl group/btn" title="View Code">
                            <Github size={20} className="group-hover/btn:stroke-2" />
                        </button>
                    </div>
                </div>

                {/* 2.3 Text Content */}
                <div className="flex-1 p-6 flex flex-col relative z-20 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-sm group-hover:bg-white/80 dark:group-hover:bg-zinc-900/80 transition-colors duration-300">
                    
                    <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-zinc-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {project.title}
                        </h3>
                        <ArrowRight size={18} className={`text-emerald-500 transform transition-all duration-300 ${isHovered ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                    </div>
                    
                    <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed mb-6 line-clamp-3">
                        {project.description}
                    </p>

                    <div className="mt-auto">
                         <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700 to-transparent mb-4" />
                         <div className="flex justify-between items-center text-xs font-mono text-zinc-500 dark:text-zinc-500">
                             <span className="flex items-center gap-1">
                                <span className={`w-1.5 h-1.5 rounded-full ${isHovered ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'}`}></span>
                                v1.0.{project.id}
                             </span>
                             <span className="flex items-center gap-1 group-hover:text-emerald-500 transition-colors cursor-pointer">
                                <Code2 size={12} /> Source
                             </span>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProjectCard;