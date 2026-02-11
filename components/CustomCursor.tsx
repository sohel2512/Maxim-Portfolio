import React, { useEffect, useRef, useState } from 'react';

const CustomCursor: React.FC = () => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const followerRef = useRef<HTMLDivElement>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isHidden, setIsHidden] = useState(false);

    useEffect(() => {
        // Only run on devices that support hover (desktop)
        if (window.matchMedia("(pointer: fine)").matches) {
            setIsVisible(true);
        }

        const moveCursor = (e: MouseEvent) => {
            if (cursorRef.current) {
                cursorRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
            if (followerRef.current) {
                // Use a slight delay/lag for the follower in the animation loop
                // But for simplicity and performance in React, we'll set CSS transition on the follower
                followerRef.current.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
            }
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            
            // Hide custom cursor when inside terminal
            if (target.closest('.terminal-interface')) {
                setIsHidden(true);
            } else {
                setIsHidden(false);
            }

            // Check if the target is clickable
            if (
                target.tagName.toLowerCase() === 'a' ||
                target.tagName.toLowerCase() === 'button' ||
                target.tagName.toLowerCase() === 'input' ||
                target.tagName.toLowerCase() === 'textarea' ||
                target.closest('a') ||
                target.closest('button') ||
                target.closest('.cursor-pointer')
            ) {
                setIsHovering(true);
            } else {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', moveCursor);
        window.addEventListener('mouseover', handleMouseOver);

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            window.removeEventListener('mouseover', handleMouseOver);
        };
    }, []);

    if (!isVisible) return null;

    return (
        <>
            {/* Main Dot */}
            <div 
                ref={cursorRef}
                className={`fixed top-0 left-0 w-2 h-2 bg-zinc-900 dark:bg-white rounded-full pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 mix-blend-difference transition-opacity duration-200 ${isHidden ? 'opacity-0' : 'opacity-100'}`}
                style={{ willChange: 'transform' }}
            />
            
            {/* Trailing Ring */}
            <div 
                ref={followerRef}
                className={`fixed top-0 left-0 w-8 h-8 border rounded-full pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-out will-change-transform
                    ${isHidden ? 'opacity-0' : 'opacity-100'}
                    ${isHovering 
                        ? 'scale-[2.5] border-emerald-500 bg-emerald-500/10' 
                        : 'scale-100 border-zinc-400/50 dark:border-white/30'
                    }
                `}
            />
        </>
    );
};

export default CustomCursor;