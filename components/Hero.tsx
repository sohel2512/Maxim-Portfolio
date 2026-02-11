import React, { useRef, useState, MouseEvent, useEffect } from 'react';
import { ArrowRight, Download, Home, RotateCw, User, Wifi, Lock, Unlock } from 'lucide-react';
import { HeroProps } from '../types';

interface HistoryItem {
    type: 'input' | 'output';
    content: any;
    promptLabel?: string;
    isError?: boolean;
    isSuccess?: boolean;
    isSystem?: boolean;
}

// File System Types
type NodeType = 'file' | 'dir';
interface FileSystemNode {
    type: NodeType;
    name: string;
    content?: string; // For files
    children?: Record<string, FileSystemNode>; // For directories
    permissions: string;
    owner: string;
    size: number;
    date: string;
}

type TerminalMode =
    | 'IDLE'
    | 'LOGIN_USER' | 'LOGIN_PASS' | 'CHANGE_USER' | 'CHANGE_PASS'
    | 'RESET_CONFIRM' | 'RESET_KEY' | 'CHANGE_MASTER_KEY'
    | 'ADDNEW_CMD' | 'ADDNEW_KEY' | 'ADDNEW_VAL'
    | 'DELCMD_CMD' | 'DELVAL_CMD' | 'DELVAL_KEY' | 'DELVAL_VAL'
    // File System Interactive Modes
    | 'RENAME_INPUT'
    | 'EDIT_CONTENT'
    | 'EDIT_SAVE_CONFIRM'
    | 'RM_CONFIRM';

// Default Data Constants
const DEFAULT_FILE_SYSTEM: Record<string, FileSystemNode> = {
    'root': {
        type: 'dir',
        name: 'root',
        permissions: 'drwxr-xr-x',
        owner: 'root',
        size: 4096,
        date: 'Jan 1 00:00',
        children: {
            'home': {
                type: 'dir',
                name: 'home',
                permissions: 'drwxr-xr-x',
                owner: 'root',
                size: 4096,
                date: 'Jan 1 00:00',
                children: {
                    'maxim': {
                        type: 'dir',
                        name: 'maxim',
                        permissions: 'drwxr-xr-x',
                        owner: 'maxim',
                        size: 4096,
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                        children: {
                            'user_info.json': {
                                type: 'file',
                                name: 'user_info.json',
                                permissions: '-rw-r--r--',
                                owner: 'maxim',
                                size: 342,
                                date: 'Oct 24 10:30',
                                content: JSON.stringify({
                                    name: "Maxim",
                                    role: "Developer",
                                    status: "Online",
                                    skills: ["Python", "React", "Three.js"]
                                }, null, 2)
                            },
                            'about.md': {
                                type: 'file',
                                name: 'about.md',
                                permissions: '-rw-r--r--',
                                owner: 'maxim',
                                size: 128,
                                date: 'Nov 12 14:20',
                                content: "I am a digital architect building scalable solutions and immersive web experiences."
                            },
                            'projects': {
                                type: 'dir',
                                name: 'projects',
                                permissions: 'drwxr-xr-x',
                                owner: 'maxim',
                                size: 4096,
                                date: 'Dec 05 09:15',
                                children: {
                                    'portfolio_v1.txt': {
                                        type: 'file',
                                        name: 'portfolio_v1.txt',
                                        permissions: '-rwxr-xr-x',
                                        owner: 'maxim',
                                        size: 2048,
                                        date: 'Dec 01 11:00',
                                        content: "Initial release of the portfolio."
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
};

const DEFAULT_COMMAND_DATA: Record<string, any> = {
    '/name': { "user": "Maxim", "status": "Online" },
    '/role': { "role": "Full Stack Dev" },
    '/skills': { "stack": ["React", "Node", "Python"] },
    '/hobbies': { "hobbies": ["Coding", "Gaming", "Design"] }
};

const Hero: React.FC<HeroProps> = ({ isAdmin, setIsAdmin, credentials, setCredentials, achievements, deleteAchievement }) => {
    // Refs
    const sectionRef = useRef<HTMLElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // State
    const [tilt, setTilt] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [isFlipped, setIsFlipped] = useState(false);
    const [isMaximized, setIsMaximized] = useState(false);

    // Command History State
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyPointer, setHistoryPointer] = useState<number>(-1);

    // Drag State
    const [dragPosition, setDragPosition] = useState<{ x: number, y: number } | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dragOffset = useRef({ x: 0, y: 0 });

    // --- INITIALIZE PERSISTENT STATE ---

    // Load History
    useEffect(() => {
        const savedHistory = localStorage.getItem('maxim_terminal_history');
        if (savedHistory) {
            try {
                setCmdHistory(JSON.parse(savedHistory));
            } catch (e) {
                console.error("Failed to parse history", e);
            }
        }
    }, []);

    const addToHistory = (cmd: string) => {
        if (!cmd.trim()) return;
        // Avoid duplicates at the end
        if (cmdHistory.length > 0 && cmdHistory[cmdHistory.length - 1] === cmd) return;

        const newHistory = [...cmdHistory, cmd];
        if (newHistory.length > 50) newHistory.shift(); // Keep last 50
        setCmdHistory(newHistory);
        localStorage.setItem('maxim_terminal_history', JSON.stringify(newHistory));
        setHistoryPointer(-1);
    };

    const handleMouseMove3D = (e: MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current || isMaximized) return; // Disable tilt when maximized
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;
        setTilt({ x: yPct * -3, y: xPct * 3 });
    };

    const handleMouseLeave = () => {
        setTilt({ x: 0, y: 0 });
        setIsHovered(false);
    };

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    // --- DRAG LOGIC ---
    useEffect(() => {
        const handleGlobalMove = (e: globalThis.MouseEvent) => {
            if (!isDragging || !sectionRef.current) return;

            const sectionRect = sectionRef.current.getBoundingClientRect();
            // Calculate new position relative to section
            const newX = e.clientX - sectionRect.left - dragOffset.current.x;
            const newY = e.clientY - sectionRect.top - dragOffset.current.y;

            setDragPosition({ x: newX, y: newY });
        };

        const handleGlobalUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            window.addEventListener('mousemove', handleGlobalMove);
            window.addEventListener('mouseup', handleGlobalUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleGlobalMove);
            window.removeEventListener('mouseup', handleGlobalUp);
        };
    }, [isDragging]);

    const handleDragStart = (e: React.MouseEvent) => {
        if (!isMaximized || !cardRef.current || !sectionRef.current) return;

        // Prevent default to avoid text selection etc
        // e.preventDefault(); // Sometimes interferes with inputs, but here we trigger on header

        const terminalRect = cardRef.current.getBoundingClientRect();
        const sectionRect = sectionRef.current.getBoundingClientRect();

        const offsetX = e.clientX - terminalRect.left;
        const offsetY = e.clientY - terminalRect.top;

        dragOffset.current = { x: offsetX, y: offsetY };

        // If first time dragging (currently centered via CSS), set explicit position
        if (!dragPosition) {
            setDragPosition({
                x: terminalRect.left - sectionRect.left,
                y: terminalRect.top - sectionRect.top
            });
        }

        setIsDragging(true);
    };

    const toggleMaximize = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (isMaximized) {
            setIsMaximized(false);
            setDragPosition(null);
        } else {
            setIsMaximized(true);
        }
    };

    // --- FILE SYSTEM STATE (PERSISTENT) ---
    const [currentPath, setCurrentPath] = useState<string[]>(['home', 'maxim']);

    // Initialize File System from Local Storage or Default
    const [fileSystem, setFileSystem] = useState<Record<string, FileSystemNode>>(() => {
        if (typeof window !== 'undefined') {
            const savedFS = localStorage.getItem('maxim_terminal_fs');
            if (savedFS) {
                try {
                    return JSON.parse(savedFS);
                } catch (e) {
                    console.error("Failed to parse file system", e);
                }
            }
        }
        return DEFAULT_FILE_SYSTEM;
    });

    // Save File System whenever it changes
    useEffect(() => {
        localStorage.setItem('maxim_terminal_fs', JSON.stringify(fileSystem));
    }, [fileSystem]);


    // --- CUSTOM COMMANDS STATE (PERSISTENT) ---
    const [commandData, setCommandData] = useState<Record<string, any>>(() => {
        if (typeof window !== 'undefined') {
            const savedCmds = localStorage.getItem('maxim_terminal_commands');
            if (savedCmds) {
                try {
                    return JSON.parse(savedCmds);
                } catch (e) {
                    console.error("Failed to parse custom commands", e);
                }
            }
        }
        return DEFAULT_COMMAND_DATA;
    });

    // Save Command Data whenever it changes
    useEffect(() => {
        localStorage.setItem('maxim_terminal_commands', JSON.stringify(commandData));
    }, [commandData]);


    // Interactive Terminal Logic
    const [inputVal, setInputVal] = useState('');
    const terminalBodyRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const [mode, setMode] = useState<TerminalMode>('IDLE');
    const [tempData, setTempData] = useState({ user: '', pass: '' });

    const [targetNode, setTargetNode] = useState<{ name: string, path: string[] } | null>(null);
    const [editBuffer, setEditBuffer] = useState('');
    const [tempRmTarget, setTempRmTarget] = useState<{ name: string, isRecursive: boolean, isAchievement?: boolean, achievementId?: string } | null>(null);

    const [tempAddData, setTempAddData] = useState({ cmd: '', key: '' });
    const [tempDelData, setTempDelData] = useState({ cmd: '', key: '' });

    const [contactMode, setContactMode] = useState(false);
    const [contactStep, setContactStep] = useState(0);
    const [contactData, setContactData] = useState({ name: '', email: '', message: '' });

    const [history, setHistory] = useState<HistoryItem[]>([
        { type: 'input', content: 'cat user_info.json', promptLabel: 'maxim@dev:~/home/maxim$' },
        {
            type: 'output', content: JSON.stringify({
                name: "Maxim",
                role: "Developer",
                status: "Online",
                skills: ["Python", "React", "Three.js"]
            }, null, 2)
        },
        {
            type: 'output', content: {
                "system": "MAXIM_OS",
                "hint": "Type /help or ls to start."
            }
        }
    ]);

    useEffect(() => {
        if (!isFlipped && terminalBodyRef.current) {
            terminalBodyRef.current.scrollTo({
                top: terminalBodyRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    }, [history, isFlipped, mode, isMaximized]);

    const focusInput = () => {
        if (!isFlipped && inputRef.current) {
            inputRef.current.focus();
        }
    };

    // --- HELPER FUNCTIONS ---

    const getNodeAtCurrentPath = (path: string[] = currentPath) => {
        let current: FileSystemNode = fileSystem['root'];
        for (const segment of path) {
            if (current.children && current.children[segment]) {
                current = current.children[segment];
            } else {
                return null;
            }
        }
        return current;
    };

    const getPromptLabel = () => {
        if (mode === 'LOGIN_USER') return "username:";
        if (mode === 'LOGIN_PASS') return "password:";
        if (mode === 'CHANGE_USER') return "new username:";
        if (mode === 'CHANGE_PASS') return "new password:";
        if (mode === 'RESET_CONFIRM') return "confirm:";
        if (mode === 'RESET_KEY') return "ENTER MASTER KEY:";
        if (mode === 'CHANGE_MASTER_KEY') return "new master key:";
        if (mode === 'ADDNEW_CMD') return "TARGET COMMAND:";
        if (mode === 'ADDNEW_KEY') return "ENTER KEY:";
        if (mode === 'ADDNEW_VAL') return "ENTER VALUE:";
        if (mode === 'DELCMD_CMD') return "COMMAND TO DELETE:";
        if (mode === 'DELVAL_CMD') return "TARGET COMMAND:";
        if (mode === 'DELVAL_KEY') return "ENTER KEY:";
        if (mode === 'DELVAL_VAL') return "VALUE TO DELETE:";
        if (mode === 'RENAME_INPUT') return "enter new file name:";
        if (mode === 'EDIT_CONTENT') return "ENTER FILE CONTENT >";
        if (mode === 'EDIT_SAVE_CONFIRM') return "TYPE :wq TO SAVE >";
        if (mode === 'RM_CONFIRM') return "are you sure? (y/n):";

        if (!contactMode) {
            const user = isAdmin ? "root" : "maxim";
            const host = isAdmin ? "maxim" : "dev";
            let pathStr = "/" + currentPath.join("/");
            if (pathStr.startsWith("/home/maxim")) {
                pathStr = pathStr.replace("/home/maxim", "~");
            }
            return `${user}@${host}:${pathStr}$`;
        }

        switch (contactStep) {
            case 0: return "ENTER_IDENTITY >";
            case 1: return "ENTER_FREQUENCY >";
            case 2: return "ENTER_PAYLOAD >";
            default: return ">";
        }
    };

    const runTransmissionSequence = () => {
        const steps = [
            "Encrypting payload with AES-256...",
            "Establishing secure uplink to host...",
            "Uploading data packets...",
            "TRANSMISSION COMPLETE. END OF LINE."
        ];

        steps.forEach((step, i) => {
            setTimeout(() => {
                setHistory(prev => [...prev, { type: 'output', content: `> ${step}` }]);
            }, (i + 1) * 800);
        });

        setTimeout(() => {
            setHistory(prev => [...prev, { type: 'output', content: { "status": "Ready", "hint": "Type /help to continue" } }]);
        }, steps.length * 800 + 500);
    };

    const updateFileSystem = (newRoot: FileSystemNode) => {
        setFileSystem({ 'root': newRoot });
    };

    const getDeepClone = () => JSON.parse(JSON.stringify(fileSystem['root']));

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        // --- HISTORY NAVIGATION ---
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length === 0) return;

            let newIndex = historyPointer;
            if (newIndex === -1) {
                newIndex = cmdHistory.length - 1;
            } else {
                if (newIndex > 0) newIndex--;
            }
            setHistoryPointer(newIndex);
            setInputVal(cmdHistory[newIndex]);
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyPointer === -1) return;

            let newIndex = historyPointer + 1;
            if (newIndex >= cmdHistory.length) {
                setHistoryPointer(-1);
                setInputVal('');
            } else {
                setHistoryPointer(newIndex);
                setInputVal(cmdHistory[newIndex]);
            }
            return;
        }

        if (e.key === 'Enter') {
            e.preventDefault();
            const val = inputVal;
            const trimmedVal = val.trim();

            const isPasswordInput = mode === 'LOGIN_PASS' || mode === 'CHANGE_PASS' || mode === 'RESET_KEY' || mode === 'CHANGE_MASTER_KEY';
            const displayContent = isPasswordInput ? '*'.repeat(val.length) : val;

            setHistory(prev => [...prev, {
                type: 'input',
                content: displayContent,
                promptLabel: getPromptLabel()
            }]);

            // Save to history only if standard command mode (IDLE) and not empty
            if (mode === 'IDLE' && trimmedVal && !contactMode) {
                addToHistory(trimmedVal);
            }

            setInputVal('');

            // === AUTH MODES ===
            if (mode === 'LOGIN_USER') { setTempData(prev => ({ ...prev, user: trimmedVal })); setMode('LOGIN_PASS'); return; }
            if (mode === 'LOGIN_PASS') {
                if (tempData.user === credentials.user && trimmedVal === credentials.pass) {
                    setIsAdmin(true);
                    setHistory(prev => [...prev, { type: 'output', content: 'ACCESS GRANTED. ROOT PRIVILEGES UNLOCKED.', isSuccess: true }]);
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: 'ACCESS DENIED.', isError: true }]);
                }
                setMode('IDLE'); setTempData({ user: '', pass: '' }); return;
            }
            if (mode === 'CHANGE_USER') { setTempData(prev => ({ ...prev, user: trimmedVal })); setMode('CHANGE_PASS'); return; }
            if (mode === 'CHANGE_PASS') {
                if (tempData.user && trimmedVal) {
                    setCredentials({ ...credentials, user: tempData.user, pass: trimmedVal });
                    setHistory(prev => [...prev, { type: 'output', content: 'CREDENTIALS UPDATED.', isSuccess: true }]);
                }
                setMode('IDLE'); return;
            }
            if (mode === 'RESET_CONFIRM') {
                if (trimmedVal.toLowerCase() === 'confirm') setMode('RESET_KEY');
                else { setHistory(prev => [...prev, { type: 'output', content: 'ABORTED.', isError: true }]); setMode('IDLE'); }
                return;
            }
            if (mode === 'RESET_KEY') {
                if (trimmedVal === credentials.masterKey) {
                    setIsAdmin(true); setCredentials({ ...credentials, user: 'root', pass: 'admin' });
                    setHistory(prev => [...prev, { type: 'output', content: 'SYSTEM RESET COMPLETE.', isSuccess: true }]);
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: 'ACCESS DENIED.', isError: true }]);
                }
                setMode('IDLE'); return;
            }
            if (mode === 'CHANGE_MASTER_KEY') {
                if (trimmedVal.length >= 8) {
                    setCredentials({ ...credentials, masterKey: trimmedVal });
                    setHistory(prev => [...prev, { type: 'output', content: 'MASTER KEY UPDATED.', isSuccess: true }]);
                } else {
                    setHistory(prev => [...prev, { type: 'output', content: 'ERROR: TOO SHORT.', isError: true }]);
                }
                setMode('IDLE'); return;
            }

            // === DATA MODES ===
            if (mode.startsWith('ADDNEW')) {
                if (mode === 'ADDNEW_CMD') { setTempAddData(p => ({ ...p, cmd: trimmedVal.startsWith('/') ? trimmedVal : `/${trimmedVal}` })); setMode('ADDNEW_KEY'); return; }
                if (mode === 'ADDNEW_KEY') { setTempAddData(p => ({ ...p, key: trimmedVal })); setMode('ADDNEW_VAL'); return; }
                if (mode === 'ADDNEW_VAL') {
                    const { cmd, key } = tempAddData;
                    const values = trimmedVal.includes(',') ? trimmedVal.split(',').map(v => v.trim()) : trimmedVal;
                    setCommandData(prev => {
                        const n = { ...prev }; const c = n[cmd] ? { ...n[cmd] } : {};
                        const curr = c[key];
                        if (Array.isArray(curr)) { if (Array.isArray(values)) c[key] = [...curr, ...values]; else c[key] = [...curr, values]; }
                        else if (Array.isArray(values)) { if (!curr) c[key] = values; else c[key] = [curr, ...values]; }
                        else if (cmd === '/skills') { if (!curr) c[key] = [trimmedVal]; else c[key] = [curr, trimmedVal]; }
                        else c[key] = trimmedVal;
                        n[cmd] = c; return n;
                    });
                    setHistory(prev => [...prev, { type: 'output', content: `UPDATED ${cmd}`, isSuccess: true }]);
                    setMode('IDLE'); return;
                }
            }
            if (mode.startsWith('DEL')) {
                if (mode === 'DELCMD_CMD') {
                    const c = trimmedVal.startsWith('/') ? trimmedVal : `/${trimmedVal}`;
                    if (commandData[c.toLowerCase()]) {
                        const n = { ...commandData }; delete n[c.toLowerCase()]; setCommandData(n);
                        setHistory(p => [...p, { type: 'output', content: `DELETED ${c}`, isSuccess: true }]);
                    } else setHistory(p => [...p, { type: 'output', content: 'NOT FOUND', isError: true }]);
                    setMode('IDLE'); return;
                }
                if (mode === 'DELVAL_CMD') {
                    const c = trimmedVal.startsWith('/') ? trimmedVal : `/${trimmedVal}`;
                    if (commandData[c.toLowerCase()]) { setTempDelData(p => ({ ...p, cmd: c.toLowerCase() })); setMode('DELVAL_KEY'); }
                    else { setHistory(p => [...p, { type: 'output', content: 'NOT FOUND', isError: true }]); setMode('IDLE'); }
                    return;
                }
                if (mode === 'DELVAL_KEY') {
                    if (commandData[tempDelData.cmd][trimmedVal]) { setTempDelData(p => ({ ...p, key: trimmedVal })); setMode('DELVAL_VAL'); }
                    else { setHistory(p => [...p, { type: 'output', content: 'KEY NOT FOUND', isError: true }]); setMode('IDLE'); }
                    return;
                }
                if (mode === 'DELVAL_VAL') {
                    const { cmd, key } = tempDelData;
                    setCommandData(prev => {
                        const n = { ...prev }; const c = { ...n[cmd] }; const val = c[key];
                        if (Array.isArray(val)) c[key] = val.filter((i: any) => String(i).toLowerCase() !== trimmedVal.toLowerCase());
                        else if (String(val).toLowerCase() === trimmedVal.toLowerCase()) delete c[key];
                        n[cmd] = c; return n;
                    });
                    setHistory(p => [...p, { type: 'output', content: 'VALUE DELETED', isSuccess: true }]);
                    setMode('IDLE'); return;
                }
            }

            // === INTERACTIVE FILE MODES ===

            if (mode === 'RM_CONFIRM') {
                if (trimmedVal.toLowerCase() === 'y' || trimmedVal.toLowerCase() === 'yes') {
                    if (tempRmTarget) {
                        if (tempRmTarget.isAchievement && tempRmTarget.achievementId) {
                            deleteAchievement(tempRmTarget.achievementId);
                            setHistory(p => [...p, { type: 'output', content: `Achievement '${tempRmTarget.name}' deleted successfully.`, isSuccess: true }]);
                        } else {
                            const rootClone = getDeepClone();
                            let current = rootClone;
                            for (const seg of currentPath) { current = current.children[seg]; }

                            const targetName = tempRmTarget.name;
                            const node = current.children[targetName];

                            if (node && node.type === 'dir' && !tempRmTarget.isRecursive) {
                                setHistory(p => [...p, { type: 'output', content: `rm: cannot remove '${targetName}': Is a directory`, isError: true }]);
                            } else if (node) {
                                delete current.children[targetName];
                                updateFileSystem(rootClone);
                                setHistory(p => [...p, { type: 'output', content: node.type === 'dir' ? 'folder removed' : 'file removed', isSuccess: true }]);
                            }
                        }
                    }
                } else {
                    setHistory(p => [...p, { type: 'output', content: 'aborting.' }]);
                }
                setTempRmTarget(null);
                setMode('IDLE');
                return;
            }

            if (mode === 'RENAME_INPUT') {
                if (!targetNode) { setMode('IDLE'); return; }
                const newName = trimmedVal.trim();
                if (!newName) { setHistory(p => [...p, { type: 'output', content: 'aborted.' }]); setMode('IDLE'); return; }

                const rootClone = getDeepClone();
                let current = rootClone;
                const parentPath = targetNode.path.slice(0, -1);
                for (const seg of parentPath) { current = current.children[seg]; }

                if (current.children[newName]) {
                    setHistory(p => [...p, { type: 'output', content: `rename: ${newName} already exists`, isError: true }]);
                } else {
                    const oldName = targetNode.name;
                    const nodeData = current.children[oldName];
                    nodeData.name = newName;
                    current.children[newName] = nodeData;
                    delete current.children[oldName];

                    updateFileSystem(rootClone);
                    setHistory(p => [...p, { type: 'output', content: 'updated successfully', isSuccess: true }]);
                }
                setTargetNode(null);
                setMode('IDLE');
                return;
            }

            if (mode === 'EDIT_CONTENT') {
                setEditBuffer(val);
                setHistory(p => [...p, { type: 'output', content: '(buffer stored)' }]);
                setMode('EDIT_SAVE_CONFIRM');
                return;
            }

            if (mode === 'EDIT_SAVE_CONFIRM') {
                if (trimmedVal === ':wq') {
                    if (!targetNode) { setMode('IDLE'); return; }
                    const rootClone = getDeepClone();
                    let ptr = rootClone;
                    // Safe traverse using path from targetNode which includes filename at end
                    // We need to traverse to parent then access child
                    const parentPath = targetNode.path.slice(0, -1);
                    for (const seg of parentPath) { ptr = ptr.children[seg]; }

                    const fileNode = ptr.children[targetNode.name];
                    if (fileNode) {
                        fileNode.content = editBuffer;
                        fileNode.size = editBuffer.length;
                        fileNode.date = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
                        updateFileSystem(rootClone);
                        setHistory(p => [...p, { type: 'output', content: 'file saved successfully', isSuccess: true }]);
                    } else {
                        setHistory(p => [...p, { type: 'output', content: 'error: file lost', isError: true }]);
                    }
                } else {
                    setHistory(p => [...p, { type: 'output', content: 'save aborted (type :wq next time)', isError: true }]);
                }
                setTargetNode(null);
                setEditBuffer('');
                setMode('IDLE');
                return;
            }


            // === STANDARD COMMAND MODE ===

            if (!contactMode) {
                if (!trimmedVal) return;
                const args = trimmedVal.split(' ').filter(a => a.length > 0);
                const cmd = args[0].toLowerCase();

                // --- HELP SHORTCUT ---
                if (cmd === '/help') {
                    const dynamicCommands = Object.keys(commandData).map(key => ({ "cmd": key, "desc": "User defined" }));
                    const staticUserCommands = [
                        { "cmd": "/contact", "desc": "Message me" },
                        { "cmd": "/rotate", "desc": "Flip terminal" },
                        { "cmd": "clear", "desc": "Clear screen" }
                        // /max_sys_reset is hidden
                    ];
                    const adminCommands = [
                        { "cmd": "ls", "desc": "List directory" },
                        { "cmd": "cd <dir>", "desc": "Change directory" },
                        { "cmd": "cat <file>", "desc": "View file" },
                        { "cmd": "whoami", "desc": "Current user" },
                        { "cmd": "pwd", "desc": "Show path" },
                        { "cmd": "date", "desc": "Show date" },
                        { "cmd": "mkdir", "desc": "Create folder" },
                        { "cmd": "touch", "desc": "Create file" },
                        { "cmd": "rm", "desc": "Remove (with -r)" },
                        { "cmd": "edit", "desc": "Edit file" },
                        { "cmd": "rename", "desc": "Rename item" },
                        { "cmd": "/addnew", "desc": "Modify system data" },
                        { "cmd": "/delcmd", "desc": "Delete command" },
                        { "cmd": "/maxpsswd", "desc": "Change user password" },
                        { "cmd": "/achievements", "desc": "List all achievements" },
                        { "cmd": "clear", "desc": "Clear screen" },
                        { "cmd": "/logout", "desc": "Exit root" }
                    ];

                    const availableCommands = isAdmin
                        ? adminCommands // Only admin commands for admin
                        : [...dynamicCommands, ...staticUserCommands]; // Only user commands for user

                    setHistory(prev => [...prev, {
                        type: 'output', content: {
                            "system": "MAXIM_OS v2.1",
                            "available_commands": availableCommands,
                            "hint": isAdmin ? "ROOT PRIVILEGES ACTIVE" : "Type sudo su for admin access"
                        }
                    }]);
                    return;
                }

                if (cmd === 'clear') { setHistory([]); return; }
                if ((cmd === 'sudo' && args[1] === 'su') || cmd === 'su') { if (isAdmin) setHistory(p => [...p, { type: 'output', content: 'Already root.' }]); else setMode('LOGIN_USER'); return; }
                if (cmd === '/logout') { setIsAdmin(false); setHistory(p => [...p, { type: 'output', content: 'LOGGED OUT.' }]); return; }
                if (cmd === '/rotate') { setIsFlipped(true); return; }

                // --- EMERGENCY RESET (AVAILABLE TO ALL) ---
                if (cmd === '/max_sys_reset') {
                    setMode('RESET_CONFIRM');
                    setHistory(prev => [...prev, { type: 'output', content: 'SYSTEM RESET INITIATED. TYPE "confirm" TO PROCEED.', isError: true }]);
                    return;
                }

                // Admin Checks
                const adminOnlyCmds = ['ls', 'cd', 'cat', 'whoami', 'pwd', 'date', 'mkdir', 'touch', 'rm', 'edit', 'rename', '/addnew', '/delcmd', '/delvalue', '/maxpsswd', '/changemasskey', '/achievements'];
                if (adminOnlyCmds.includes(cmd) && !isAdmin) {
                    setHistory(prev => [...prev, { type: 'output', content: `bash: ${cmd}: command not found`, isError: true }]);
                    return;
                }

                // --- ADMIN PORTFOLIO COMMANDS ---
                if (['/addnew', '/delcmd', '/delvalue', '/maxpsswd', '/changemasskey', '/achievements'].includes(cmd)) {
                    // We know they are admin here due to check above
                    if (cmd === '/addnew') { setMode('ADDNEW_CMD'); setHistory(p => [...p, { type: 'output', content: 'ENTERING DATA ENTRY MODE...', isSystem: true }]); return; }
                    if (cmd === '/delcmd') { setMode('DELCMD_CMD'); setHistory(p => [...p, { type: 'output', content: 'ENTERING DELETION MODE...', isSystem: true }]); return; }
                    if (cmd === '/delvalue') { setMode('DELVAL_CMD'); setHistory(p => [...p, { type: 'output', content: 'ENTERING VALUE REMOVAL MODE...', isSystem: true }]); return; }
                    if (cmd === '/maxpsswd') { setMode('CHANGE_USER'); setHistory(p => [...p, { type: 'output', content: 'INITIATING CREDENTIAL UPDATE...', isSystem: true }]); return; }
                    if (cmd === '/changemasskey') { setMode('CHANGE_MASTER_KEY'); setHistory(p => [...p, { type: 'output', content: 'INITIATING MASTER KEY OVERRIDE...', isSystem: true }]); return; }
                    if (cmd === '/achievements') {
                        if (achievements.length === 0) {
                            setHistory(p => [...p, { type: 'output', content: 'No achievements found in vault.', isError: true }]);
                        } else {
                            const list = achievements.map(a => `• ${a.title}`).join('\n');
                            setHistory(p => [...p, { type: 'output', content: `=== VAULT CONTENTS ===\n${list}\n\n(Use 'rm "Title Name"' to delete)`, isSystem: true }]);
                        }
                        return;
                    }
                }

                if (commandData[cmd]) {
                    setHistory(prev => [...prev, { type: 'output', content: commandData[cmd] }]);
                    return;
                }
                if (cmd === '/contact') {
                    setHistory(prev => [...prev, { type: 'output', content: { "system": "SECURE_UPLINK", "status": "INITIALIZING..." } }]);
                    setContactMode(true); setContactStep(0); return;
                }

                // LS (Admin Only) - Logic Block for Admin Cmds
                if (isAdmin) {
                    // ... (Implementation of Admin commands similar to previous - re-inserting logic)
                    const resolveNodeFromPathStr = (pathStr: string): { node: FileSystemNode | null, pathArr: string[] } => {
                        let searchPath: string[] = [];
                        if (pathStr === '/') {
                            return { node: fileSystem['root'], pathArr: [] };
                        } else if (pathStr.startsWith('/')) {
                            searchPath = pathStr.split('/').filter(p => p);
                        } else {
                            searchPath = [...currentPath];
                            const parts = pathStr.split('/');
                            for (const p of parts) {
                                if (p === '.') continue;
                                if (p === '..') {
                                    if (searchPath.length > 0) searchPath.pop();
                                } else {
                                    searchPath.push(p);
                                }
                            }
                        }
                        let current: FileSystemNode = fileSystem['root'];
                        for (const seg of searchPath) {
                            if (current.children && current.children[seg]) {
                                current = current.children[seg];
                            } else {
                                return { node: null, pathArr: searchPath };
                            }
                        }
                        return { node: current, pathArr: searchPath };
                    };

                    if (cmd === 'ls') {
                        const params = args.slice(1);
                        const currentNode = getNodeAtCurrentPath();
                        if (currentNode && currentNode.type === 'dir' && currentNode.children) {
                            const showDetails = params.includes('-l');
                            const items = Object.values(currentNode.children);
                            if (items.length > 0) {
                                if (showDetails) {
                                    const rows = items.map(item => `${item.permissions} 1 ${item.owner} ${item.owner} ${String(item.size).padStart(4)} ${item.date} ${item.name}`).join('\n');
                                    setHistory(p => [...p, { type: 'output', content: rows }]);
                                } else {
                                    const names = items.map(i => i.type === 'dir' ? i.name + '/' : i.name).join('  ');
                                    setHistory(p => [...p, { type: 'output', content: names }]);
                                }
                            }
                        }
                        return;
                    }
                    if (cmd === 'cd') {
                        const target = args[1];
                        if (!target) { setCurrentPath(['home', 'maxim']); return; }
                        const { node, pathArr } = resolveNodeFromPathStr(target);
                        if (node && node.type === 'dir') { setCurrentPath(pathArr); }
                        else setHistory(p => [...p, { type: 'output', content: `bash: cd: ${target}: No such file or directory`, isError: true }]);
                        return;
                    }
                    if (cmd === 'cat') {
                        const target = args[1];
                        if (!target) return;
                        const { node } = resolveNodeFromPathStr(target);
                        if (node && node.type === 'file') setHistory(p => [...p, { type: 'output', content: node.content || '' }]);
                        else setHistory(p => [...p, { type: 'output', content: `cat: ${target}: No such file`, isError: true }]);
                        return;
                    }
                    if (cmd === 'whoami') { setHistory(p => [...p, { type: 'output', content: 'root' }]); return; }
                    if (cmd === 'pwd') { setHistory(p => [...p, { type: 'output', content: '/' + currentPath.join('/') }]); return; }
                    if (cmd === 'date') { setHistory(p => [...p, { type: 'output', content: new Date().toString() }]); return; }

                    if (cmd === 'mkdir') {
                        const targetName = args[1];
                        if (!targetName) return;
                        const rootClone = getDeepClone();
                        let current = rootClone;
                        for (const seg of currentPath) { current = current.children[seg]; }
                        if (!current.children[targetName]) {
                            current.children[targetName] = { type: 'dir', name: targetName, permissions: 'drwxr-xr-x', owner: 'root', size: 4096, date: new Date().toLocaleDateString(), children: {} };
                            updateFileSystem(rootClone);
                            setHistory(p => [...p, { type: 'output', content: 'folder created', isSuccess: true }]);
                        } else setHistory(p => [...p, { type: 'output', content: 'File exists', isError: true }]);
                        return;
                    }
                    if (cmd === 'touch') {
                        const targetName = args[1];
                        if (!targetName) return;
                        const rootClone = getDeepClone();
                        let current = rootClone;
                        for (const seg of currentPath) { current = current.children[seg]; }
                        if (!current.children[targetName]) {
                            current.children[targetName] = { type: 'file', name: targetName, permissions: '-rw-r--r--', owner: 'root', size: 0, date: new Date().toLocaleDateString(), content: "" };
                            updateFileSystem(rootClone);
                            setHistory(p => [...p, { type: 'output', content: 'file created', isSuccess: true }]);
                        }
                        return;
                    }
                    if (cmd === 'rm') {
                        // Combined RM logic: First checks Achievement Vault (if flag present or just simple name matching), then File System
                        // Reconstruct the full target name including spaces if user provided them
                        // Example: rm "First Place" -> args: ["First", "Place"] (need to handle quotes manually or just join)

                        let targetName = "";
                        let isRecursive = false;

                        // Simple parsing for -r
                        const rIndex = args.indexOf('-r');
                        if (rIndex !== -1) {
                            isRecursive = true;
                            args.splice(rIndex, 1);
                        }

                        // Parse quotes for multi-word titles
                        const rawInput = trimmedVal.substring(trimmedVal.indexOf(' ') + 1); // everything after 'rm '
                        // Logic to strip -r from rawInput is complex, stick to args join for now or handle quotes
                        if (rawInput.includes('"')) {
                            const match = rawInput.match(/"([^"]+)"/);
                            if (match) targetName = match[1];
                            else targetName = args.join(' ');
                        } else {
                            // If -r was removed from args, join the rest
                            targetName = args.join(' ');
                        }

                        // 1. Check Achievements
                        const ach = achievements.find(a => a.title.toLowerCase() === targetName.toLowerCase());
                        if (ach) {
                            setTempRmTarget({ name: ach.title, isRecursive: false, isAchievement: true, achievementId: ach.id });
                            setHistory(p => [...p, { type: 'output', content: `Deleting achievement '${ach.title}' from vault. Are you sure? (y/n):`, isSystem: true }]);
                            setMode('RM_CONFIRM');
                            return;
                        }

                        // 2. Check File System
                        const currentNode = getNodeAtCurrentPath();
                        // Fallback to single word arg if multi-word failed in FS (FS usually doesn't have spaces in this simple impl)
                        const fsTarget = args[0];

                        if (currentNode && currentNode.children && currentNode.children[fsTarget]) {
                            setTempRmTarget({ name: fsTarget, isRecursive });
                            setHistory(p => [...p, { type: 'output', content: 'are you sure? (y/n):', isSystem: true }]);
                            setMode('RM_CONFIRM');
                        } else {
                            setHistory(p => [...p, { type: 'output', content: `rm: ${targetName}: Not found in file system or vault`, isError: true }]);
                        }
                        return;
                    }

                    // === EDIT COMMAND ===
                    if (cmd === 'edit') {
                        const target = args[1];
                        if (!target) { setHistory(p => [...p, { type: 'output', content: 'Usage: edit <filename>', isError: true }]); return; }
                        const { node, pathArr } = resolveNodeFromPathStr(target);
                        if (node && node.type === 'file') {
                            setTargetNode({ name: node.name, path: pathArr });
                            setHistory(p => [...p, { type: 'output', content: `Current content:\n${node.content}\n\nENTER NEW CONTENT >`, isSystem: true }]);
                            setMode('EDIT_CONTENT');
                        } else {
                            setHistory(p => [...p, { type: 'output', content: `File not found`, isError: true }]);
                        }
                        return;
                    }

                    // === RENAME COMMAND ===
                    if (cmd === 'rename') {
                        const target = args[1];
                        if (!target) { setHistory(p => [...p, { type: 'output', content: 'Usage: rename <filename>', isError: true }]); return; }
                        const { node, pathArr } = resolveNodeFromPathStr(target);
                        if (node) {
                            setTargetNode({ name: node.name, path: pathArr });
                            setMode('RENAME_INPUT');
                        } else {
                            setHistory(p => [...p, { type: 'output', content: `File not found`, isError: true }]);
                        }
                        return;
                    }
                }

                if (!commandData[cmd] && !['clear', '/rotate', '/contact', 'sudo', '/logout', 'su', '/max_sys_reset'].includes(cmd) && !adminOnlyCmds.includes(cmd)) {
                    setHistory(prev => [...prev, { type: 'output', content: `bash: ${cmd}: command not found`, isError: true }]);
                }
            } else {
                if (contactStep === 0) { if (!trimmedVal) { setHistory(p => [...p, { type: 'output', content: 'ERROR: ID REQUIRED' }]); return; } setContactData(p => ({ ...p, name: val })); setContactStep(1); }
                else if (contactStep === 1) { if (!trimmedVal.includes('@')) { setHistory(p => [...p, { type: 'output', content: 'ERROR: INVALID EMAIL' }]); return; } setContactData(p => ({ ...p, email: val })); setContactStep(2); }
                else if (contactStep === 2) { if (!trimmedVal) { setHistory(p => [...p, { type: 'output', content: 'ERROR: EMPTY' }]); return; } setContactData(p => ({ ...p, message: val })); setContactMode(false); setContactStep(0); runTransmissionSequence(); }
            }
        }
    };

    const highlightJSON = (json: any) => {
        if (typeof json === 'string') return json;
        let jsonStr = JSON.stringify(json, undefined, 2);
        return jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match: string) => {
                let cls = 'text-orange-500 dark:text-orange-300';
                if (/^"/.test(match)) { if (/:$/.test(match)) cls = 'text-purple-600 dark:text-purple-400'; else cls = 'text-emerald-600 dark:text-emerald-300'; }
                else if (/true|false/.test(match)) cls = 'text-blue-500 dark:text-blue-400';
                else if (/null/.test(match)) cls = 'text-zinc-500';
                return `<span class="${cls}">${match}</span>`;
            });
    };

    // Calculate Dynamic Styles for Terminal
    const getTerminalStyle = () => {
        if (isMaximized) {
            // Absolute positioning relative to the Hero Section
            const baseStyle: React.CSSProperties = {
                position: 'absolute',
                width: '50vw',
                height: '50vh',
                zIndex: 50,
            };

            if (dragPosition) {
                return {
                    ...baseStyle,
                    left: dragPosition.x,
                    top: dragPosition.y,
                    transform: 'none'
                };
            } else {
                // Centered default
                return {
                    ...baseStyle,
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)'
                };
            }
        } else {
            // Default 3D State
            return {
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg) scale(${isHovered ? 1.05 : 1})`,
                transformStyle: 'preserve-3d' as const,
            };
        }
    };

    return (
        <section
            id="about"
            ref={sectionRef}
            className={`max-w-7xl mx-auto px-6 min-h-[80vh] flex flex-col md:flex-row items-center justify-between relative ${isMaximized ? '' : 'perspective-container'}`}
        >

            {/* Left: Text */}
            <div className="w-full md:w-1/2 space-y-8 z-20 mb-12 md:mb-0 pointer-events-none md:pointer-events-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 text-xs font-mono backdrop-blur-md pointer-events-auto">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    System Online
                </div>

                <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-zinc-900 dark:text-white leading-[1.1]">
                    Maxim <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500 dark:from-emerald-400 dark:to-cyan-400 glitch-hover cursor-default pointer-events-auto">
                        Developer
                    </span>
                </h1>

                <p className="text-zinc-600 dark:text-zinc-400 text-lg max-w-md font-light leading-relaxed">
                    A Passionate Web Developer//Editor
                </p>

                <div className="flex gap-4 pt-4 pointer-events-auto">
                    <button
                        onClick={() => {
                            if (inputRef.current) {
                                inputRef.current.focus();
                                setInputVal('/contact');
                            }
                        }}
                        className="group relative px-6 py-3 bg-zinc-900 dark:bg-white text-white dark:text-black text-sm font-semibold rounded hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all overflow-hidden shadow-lg shadow-emerald-500/20"
                    >
                        <span className="relative flex items-center gap-2">
                            Initialize Contact
                            <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                        </span>
                    </button>
                    <button className="px-6 py-3 text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-zinc-200 dark:border-white/10 rounded hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors backdrop-blur-sm flex items-center gap-2">
                        <Download size={16} />
                        Resume
                    </button>
                </div>
            </div>

            {/* Right: Terminal Container */}
            <div className={`w-full md:w-1/2 h-[450px] flex items-center justify-center ${isMaximized ? 'static' : 'relative'}`}>
                {/* Glow behind - Only show when not maximized to avoid clutter */}
                {!isMaximized && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-blue-500/20 blur-[60px] rounded-full pointer-events-none opacity-50 dark:opacity-100 transition-opacity"></div>
                )}

                {/* Terminal Card */}
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove3D}
                    onMouseLeave={handleMouseLeave}
                    onMouseEnter={handleMouseEnter}
                    onClick={focusInput}
                    style={getTerminalStyle()}
                    className={`terminal-interface transition-all duration-300 ease-out 
                        ${isMaximized
                            ? 'shadow-2xl'
                            : 'w-full max-w-[420px] h-[380px] relative'
                        } ${isDragging ? 'cursor-grabbing select-none' : ''}`
                    }
                >
                    {/* ================= FRONT FACE (Terminal) ================= */}
                    <div
                        className="absolute inset-0 glass-card rounded-xl shadow-2xl flex flex-col overflow-hidden bg-white/80 dark:bg-[#0c0c0c]/95 border border-zinc-200 dark:border-white/10"
                        style={{ backfaceVisibility: 'hidden' }}
                    >
                        {/* Terminal Header (Draggable Handle) */}
                        <div
                            onMouseDown={handleDragStart}
                            className={`h-9 border-b border-zinc-200 dark:border-white/10 flex items-center px-4 gap-2 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-md z-10 shrink-0 ${isMaximized ? 'cursor-grab active:cursor-grabbing' : ''}`}
                        >
                            <div className="flex gap-1.5 group-hover:opacity-100 opacity-60 transition-opacity">
                                <button
                                    onMouseDown={(e) => e.stopPropagation()} // Prevent drag on button click
                                    onClick={(e) => { e.stopPropagation(); setIsFlipped(true); }}
                                    className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-600 shadow-sm transition-colors"
                                    title="Close / Rotate"
                                ></button>
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={toggleMaximize}
                                    className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 hover:bg-yellow-600 shadow-sm transition-colors"
                                    title="Minimize"
                                ></button>
                                <button
                                    onMouseDown={(e) => e.stopPropagation()}
                                    onClick={toggleMaximize}
                                    className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 hover:bg-emerald-600 shadow-sm transition-colors"
                                    title="Maximize"
                                ></button>
                            </div>
                            <div className="ml-auto text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-2 select-none">
                                {isAdmin ? (
                                    <span className="flex items-center gap-1 text-emerald-500 animate-pulse"><Unlock size={10} /> ROOT_ACCESS</span>
                                ) : contactMode ? (
                                    <span className="flex items-center gap-1 text-emerald-500 animate-pulse"><Wifi size={10} /> SECURE_UPLINK</span>
                                ) : (
                                    <span className="flex items-center gap-1"><Lock size={10} /> maxim@dev</span>
                                )}
                            </div>
                        </div>

                        {/* Terminal Content */}
                        <div
                            ref={terminalBodyRef}
                            className="flex-1 overflow-y-auto p-4 font-mono text-xs text-zinc-600 dark:text-zinc-300 scrollbar-hide custom-scrollbar"
                            onClick={focusInput}
                        >
                            {history.map((item, index) => (
                                <div key={index} className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                    {item.type === 'input' ? (
                                        <div className="flex gap-2">
                                            <span className={`${mode.includes('LOGIN') || mode.includes('CHANGE') || mode.includes('RESET') || mode.includes('ADDNEW') || mode.includes('DEL') || mode.includes('EDIT') || mode.includes('RENAME') || mode.includes('RM_CONFIRM')
                                                ? 'text-yellow-500'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                                } shrink-0 select-none`}>
                                                {item.promptLabel || 'maxim@dev:~$'}
                                            </span>
                                            <span className="text-zinc-800 dark:text-zinc-100 break-all">{item.content}</span>
                                        </div>
                                    ) : (
                                        <div className={`mt-1 pl-4 border-l-2 ${item.isError ? 'border-red-500 text-red-500'
                                            : item.isSuccess ? 'border-emerald-500 text-emerald-500'
                                                : item.isSystem ? 'border-blue-500 text-blue-400'
                                                    : 'border-zinc-200 dark:border-white/10'
                                            } whitespace-pre-wrap font-mono text-[11px] leading-relaxed`}>
                                            {typeof item.content === 'string' ? item.content : (
                                                <pre dangerouslySetInnerHTML={{ __html: highlightJSON(item.content) }} />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}

                            {/* Input Line */}
                            <div className="flex gap-2 items-center">
                                <span className={`${contactMode ? 'text-emerald-500 animate-pulse'
                                    : mode === 'RESET_CONFIRM' ? 'text-red-500 font-bold animate-pulse'
                                        : mode !== 'IDLE' ? 'text-yellow-500'
                                            : isAdmin ? 'text-red-500 font-bold'
                                                : 'text-emerald-600 dark:text-emerald-400'
                                    } shrink-0 font-bold transition-colors select-none`}>
                                    {getPromptLabel()}
                                </span>
                                <input
                                    ref={inputRef}
                                    type={mode === 'LOGIN_PASS' || mode === 'CHANGE_PASS' || mode === 'RESET_KEY' || mode === 'CHANGE_MASTER_KEY' ? "password" : "text"}
                                    value={inputVal}
                                    onChange={(e) => setInputVal(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="bg-transparent border-none outline-none text-zinc-800 dark:text-zinc-100 w-full font-mono text-xs placeholder-zinc-400/50"
                                    placeholder={contactMode ? "" : mode !== 'IDLE' ? "" : isAdmin ? "Type /logout to exit root" : "Type ls to explore..."}
                                    autoFocus
                                    spellCheck={false}
                                    autoComplete="off"
                                />
                                <span className="w-1.5 h-4 bg-zinc-400 dark:bg-zinc-600 animate-pulse -ml-1"></span>
                            </div>
                        </div>
                    </div>

                    {/* ================= BACK FACE (Profile Image) ================= */}
                    <div
                        className="absolute inset-0 glass-card rounded-xl shadow-2xl overflow-hidden bg-white/80 dark:bg-[#0c0c0c]/90 border border-zinc-200 dark:border-white/10 flex flex-col"
                        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    >
                        {/* Header (Mirrored functionality for return) */}
                        <div className="h-9 border-b border-zinc-200 dark:border-white/10 flex items-center px-4 gap-2 bg-zinc-50/80 dark:bg-white/5 backdrop-blur-md z-10 shrink-0">
                            <div className="flex gap-1.5">
                                <button
                                    onClick={(e) => { e.stopPropagation(); setIsFlipped(false); }}
                                    className="w-2.5 h-2.5 rounded-full bg-red-500/80 hover:bg-red-600 shadow-sm transition-colors"
                                    title="Return"
                                ></button>
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80 opacity-50"></div>
                                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 opacity-50"></div>
                            </div>
                            <div className="ml-auto text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center gap-2 select-none">
                                <User size={10} /> Profile View
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="flex-1 relative group cursor-pointer" onClick={() => setIsFlipped(false)}>
                            <img
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=800&q=80"
                                alt="Profile"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                                <h2 className="text-white text-2xl font-bold">Maxim</h2>
                                <p className="text-emerald-400 text-sm font-mono">Full Stack Developer</p>
                                <div className="mt-4 flex items-center gap-2 text-zinc-300 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                                    <RotateCw size={12} className="animate-spin-slow" /> Click to return to terminal
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default Hero;