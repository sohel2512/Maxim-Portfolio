import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Check, AlertCircle, Loader2, Command } from 'lucide-react';
import emailjs from '@emailjs/browser';

const TerminalContact: React.FC = () => {
    const [formState, setFormState] = useState({ name: '', email: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
    const [terminalLines, setTerminalLines] = useState<string[]>([
        "Initializing secure connection...",
        "Connected to maxim@dev:22",
        "Awaiting user input..."
    ]);

    const logsContainerRef = useRef<HTMLDivElement>(null);

    // --- CONFIGURATION ---
    // REPLACE THESE WITH YOUR ACTUAL EMAILJS KEYS
    const SERVICE_ID = "YOUR_SERVICE_ID";
    const TEMPLATE_ID = "YOUR_TEMPLATE_ID";
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formState.name || !formState.email || !formState.message) return;

        setStatus('sending');
        addLog(`> Executing transmission protocol...`);
        addLog(`> Packaging payload: ${formState.name} <${formState.email}>`);

        // Check if using placeholder keys
        const isPlaceholder = SERVICE_ID === "YOUR_SERVICE_ID" ||
            TEMPLATE_ID === "YOUR_TEMPLATE_ID" ||
            PUBLIC_KEY === "YOUR_PUBLIC_KEY";

        setTimeout(async () => {
            if (isPlaceholder) {
                // FALLBACK: MAILTO
                addLog(`> WARN: Encrypted channel unavailable (Keys not found).`);
                addLog(`> Rerouting to standard mail protocol...`);
                await new Promise(r => setTimeout(r, 1000));

                // Construct mailto link
                const subject = `Portfolio Contact from ${formState.name}`;
                const body = `Name: ${formState.name}\nEmail: ${formState.email}\n\nMessage:\n${formState.message}`;
                window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

                addLog(`> SUCCESS: External mail client invoked.`);
                setStatus('success');
            } else {
                // EMAILJS
                addLog(`> Encrypting data chunks... [DONE]`);
                addLog(`> Establishing SMTP handshake...`);
                try {
                    await emailjs.send(
                        SERVICE_ID,
                        TEMPLATE_ID,
                        {
                            from_name: formState.name,
                            from_email: formState.email,
                            message: formState.message,
                            reply_to: formState.email,
                        },
                        PUBLIC_KEY
                    );

                    addLog(`> Uploading to server... 100%`);
                    setStatus('success');
                    addLog(`> SUCCESS: Message delivered.`);
                } catch (error) {
                    console.error("Email Error:", error);
                    setStatus('error');
                    addLog(`> ERROR: Transmission failed.`);
                    addLog(`> Server responded: Connection Refused.`);
                    // Reset to idle after error
                    setTimeout(() => setStatus('idle'), 3000);
                    return;
                }
            }

            addLog(`> Session closing in 5s...`);

            // Reset form
            setTimeout(() => {
                setStatus('idle');
                setFormState({ name: '', email: '', message: '' });
                setTerminalLines([
                    "Initializing secure connection...",
                    "Connected to maxim@dev:22",
                    "Awaiting user input..."
                ]);
            }, 5000);

        }, 800);
    };

    const addLog = (msg: string) => {
        setTerminalLines(prev => [...prev, msg]);
    };

    // Auto-scroll terminal log within container
    useEffect(() => {
        if (logsContainerRef.current) {
            logsContainerRef.current.scrollTo({
                top: logsContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [terminalLines]);

    return (
        <section id="contact" className="relative w-full py-32 px-6 overflow-hidden">
            <div className="relative max-w-4xl mx-auto">

                {/* Section Header */}
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-3xl font-medium text-zinc-900 dark:text-white tracking-tight flex items-center justify-center gap-3">
                        <div className="p-2 rounded-lg bg-zinc-900 dark:bg-emerald-500/10 text-white dark:text-emerald-500">
                            <Terminal size={24} />
                        </div>
                        System Access
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
                        Execute the form below to establish a direct communication channel.
                    </p>
                </div>

                {/* Terminal Window */}
                <div className="w-full rounded-xl overflow-hidden shadow-2xl bg-[#1e1e1e] border-2 border-zinc-300 dark:border-white/10 font-mono text-sm relative group terminal-interface">

                    {/* Terminal Top Bar */}
                    <div className="bg-[#2d2d2d] px-4 py-2 flex items-center gap-2 border-b border-black/20">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                        </div>
                        <div className="ml-4 text-zinc-400 text-xs flex items-center gap-2">
                            <Command size={10} />
                            user@maxim: ~/contact
                        </div>
                    </div>

                    {/* Terminal Body */}
                    <div className="p-6 md:p-8 text-zinc-300 min-h-[400px] flex flex-col md:flex-row gap-8">

                        {/* Left: Input Form */}
                        <div className="flex-1 space-y-6 relative z-10">
                            {status === 'success' ? (
                                <div className="h-full flex flex-col items-center justify-center text-emerald-400 space-y-4 animate-in fade-in zoom-in duration-500">
                                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold">TRANSMISSION SENT</h3>
                                    <p className="text-zinc-500 text-xs">Return signal expected shortly.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    {/* Name Field */}
                                    <div className="group">
                                        <label className="block text-zinc-500 text-xs mb-1 group-focus-within:text-emerald-400 transition-colors">
                                            // ENTER_IDENTITY
                                        </label>
                                        <div className="flex items-center gap-2 border-b border-zinc-700 group-focus-within:border-emerald-500 transition-colors pb-2">
                                            <span className="text-emerald-500 font-bold">{'>'}</span>
                                            <input
                                                type="text"
                                                placeholder="guest_user"
                                                className="bg-transparent border-none outline-none w-full text-zinc-100 placeholder-zinc-600 focus:ring-0 p-0"
                                                value={formState.name}
                                                onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                                                disabled={status === 'sending'}
                                            />
                                        </div>
                                    </div>

                                    {/* Email Field */}
                                    <div className="group">
                                        <label className="block text-zinc-500 text-xs mb-1 group-focus-within:text-emerald-400 transition-colors">
                                            // ENTER_FREQUENCY
                                        </label>
                                        <div className="flex items-center gap-2 border-b border-zinc-700 group-focus-within:border-emerald-500 transition-colors pb-2">
                                            <span className="text-blue-500 font-bold">@</span>
                                            <input
                                                type="email"
                                                placeholder="email@domain.com"
                                                className="bg-transparent border-none outline-none w-full text-zinc-100 placeholder-zinc-600 focus:ring-0 p-0"
                                                value={formState.email}
                                                onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                                                disabled={status === 'sending'}
                                            />
                                        </div>
                                    </div>

                                    {/* Message Field */}
                                    <div className="group">
                                        <label className="block text-zinc-500 text-xs mb-1 group-focus-within:text-emerald-400 transition-colors">
                                            // DEFINE_PAYLOAD
                                        </label>
                                        <div className="flex items-start gap-2 border-b border-zinc-700 group-focus-within:border-emerald-500 transition-colors pb-2">
                                            <span className="text-purple-500 font-bold mt-1">#</span>
                                            <textarea
                                                rows={4}
                                                placeholder="Write your message here..."
                                                className="bg-transparent border-none outline-none w-full text-zinc-100 placeholder-zinc-600 focus:ring-0 p-0 resize-none"
                                                value={formState.message}
                                                onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                                                disabled={status === 'sending'}
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        disabled={status === 'sending'}
                                        className={`mt-4 w-full border text-sm py-3 px-4 rounded transition-all flex items-center justify-center gap-2 
                                            ${status === 'error'
                                                ? 'bg-red-500/20 border-red-500 text-red-500'
                                                : 'bg-emerald-600/20 hover:bg-emerald-600/30 border-emerald-500/50 text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                                            }`}
                                    >
                                        {status === 'sending' ? (
                                            <>
                                                <Loader2 size={16} className="animate-spin" />
                                                PROCESSING...
                                            </>
                                        ) : status === 'error' ? (
                                            <>
                                                <AlertCircle size={16} />
                                                RETRY TRANSMISSION
                                            </>
                                        ) : (
                                            <>
                                                [ EXECUTE_TRANSMISSION ]
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>

                        {/* Right: Log Output (Hidden on Mobile) */}
                        <div className="hidden md:block w-1/3 border-l border-zinc-700 pl-6 relative">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1e1e1e] pointer-events-none z-10"></div>
                            <div
                                ref={logsContainerRef}
                                className="h-full overflow-y-auto text-[10px] space-y-1 font-mono text-zinc-500 scrollbar-hide"
                            >
                                <div className="mb-4 text-emerald-500 font-bold">
                                    -- SYSTEM LOG --
                                </div>
                                {terminalLines.map((line, idx) => (
                                    <div key={idx} className="break-words">
                                        <span className="text-zinc-600">{new Date().toLocaleTimeString()}</span>{' '}
                                        <span className={`${line.includes('SUCCESS') ? 'text-emerald-400' :
                                                line.includes('ERROR') ? 'text-red-400' :
                                                    'text-zinc-400'
                                            }`}>{line}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>

                    {/* CRT Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-20 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20"></div>
                </div>
            </div>
        </section>
    );
};

export default TerminalContact;