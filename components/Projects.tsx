import React from 'react';
import { Project } from '../types';
import ProjectCard from './ProjectCard';
import { FolderOpen } from 'lucide-react';

const projectsData: Project[] = [
    {
        id: 1,
        title: "LUSTIFY MUSIC",
        description: "A feature-rich music streaming and discovery platform. Experience seamless audio playback with a beautiful, modern interface designed for music lovers.",
        tags: ["Music", "Streaming", "Web App"],
        image: "https://images.unsplash.com/photo-1614680376593-902f74cf0d41?q=80&w=800&auto=format&fit=crop",
        link: "https://github.com/spicycodez/LUSTIFYMUSIC"
    },
    {
        id: 2,
        title: "SPICY STRING HACK",
        description: "A powerful string manipulation and hacking toolkit. Advanced utilities for text processing, encoding/decoding, and security testing.",
        tags: ["Security", "Tools", "Hacking"],
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=800&auto=format&fit=crop",
        link: "https://github.com/spicycodez/SPICYSTRINGHACK"
    }
];

const Projects: React.FC = () => {
    return (
        <section id="projects" className="max-w-7xl mx-auto px-6 py-32">
            <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight mb-16 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                    <FolderOpen size={24} />
                </div>
                Projects
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 perspective-container px-2">
                {projectsData.map((project, index) => (
                    <div key={project.id} className={index % 2 === 1 ? 'md:mt-16' : ''}>
                        <ProjectCard project={project} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;