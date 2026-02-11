import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { BackgroundProps } from '../types';

const Background3D: React.FC<BackgroundProps> = ({ isDark }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const scene = new THREE.Scene();
        const fogColor = isDark ? 0x050505 : 0xfafafa;
        const fog = new THREE.FogExp2(fogColor, 0.002);
        scene.fog = fog;

        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 30;
        camera.position.y = 5;

        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Main Icosahedron
        const geometry = new THREE.IcosahedronGeometry(10, 2);
        const material = new THREE.MeshBasicMaterial({
            color: isDark ? 0x10b981 : 0x000000,
            wireframe: true,
            transparent: true,
            opacity: isDark ? 0.15 : 0.05
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);

        // Particles
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = 700;
        const posArray = new Float32Array(particlesCount * 3);
        for (let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 100;
        }
        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.15,
            color: isDark ? 0x34d399 : 0x18181b,
            transparent: true,
            opacity: 0.6
        });
        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const light1 = new THREE.PointLight(isDark ? 0x10b981 : 0x0ea5e9, 2, 50);
        light1.position.set(10, 10, 10);
        scene.add(light1);

        const light2 = new THREE.PointLight(isDark ? 0x8b5cf6 : 0xf43f5e, 2, 50);
        light2.position.set(-10, -10, 10);
        scene.add(light2);

        // Animation Loop
        let animationFrameId: number;
        const clock = new THREE.Clock();
        let mouseX = 0;
        let mouseY = 0;

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            const targetX = mouseX * 0.001;
            const targetY = mouseY * 0.001;

            sphere.rotation.y += 0.5 * (targetX - sphere.rotation.y);
            sphere.rotation.x += 0.05 * (targetY - sphere.rotation.x);
            sphere.rotation.z += 0.001;
            sphere.rotation.y += 0.002;

            light1.position.x = Math.sin(elapsedTime * 0.5) * 15;
            light1.position.y = Math.cos(elapsedTime * 0.3) * 15;
            light2.position.x = Math.cos(elapsedTime * 0.5) * 15;
            light2.position.y = Math.sin(elapsedTime * 0.3) * 15;

            // Sync with scroll
            const scrollY = window.scrollY;
            camera.position.y = 5 - scrollY * 0.01;
            particlesMesh.rotation.y = -scrollY * 0.0002 + elapsedTime * 0.05;

            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (event: MouseEvent) => {
            const windowHalfX = window.innerWidth / 2;
            const windowHalfY = window.innerHeight / 2;
            mouseX = (event.clientX - windowHalfX);
            mouseY = (event.clientY - windowHalfY);
        };

        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };

        document.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);
        animate();

        // Cleanup
        return () => {
            cancelAnimationFrame(animationFrameId);
            document.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        };
    }, [isDark]); // Re-run effect when theme changes to update colors

    return (
        <div
            ref={containerRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none transition-opacity duration-500"
        />
    );
};

export default Background3D;