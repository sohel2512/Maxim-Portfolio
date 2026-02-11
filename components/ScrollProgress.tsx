import React, { useEffect, useState } from 'react';

const ScrollProgress: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scroll = `${totalScroll / windowHeight}`;
            
            setProgress(Number(scroll));
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="fixed top-0 left-0 w-full h-[3px] z-[100] bg-transparent">
            <div 
                className="h-full bg-gradient-to-r from-emerald-500 via-cyan-500 to-purple-500 shadow-[0_0_10px_rgba(16,185,129,0.7)] transition-all duration-100 ease-out"
                style={{ width: `${progress * 100}%` }}
            />
        </div>
    );
};

export default ScrollProgress;