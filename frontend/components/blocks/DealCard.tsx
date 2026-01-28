'use client';

import React, { useRef } from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

interface DealCardProps {
    id: string;
    provider: string;
    offer: string;
    value: string;
    locked: boolean;
    logo: string;
}

export const DealCard = ({ id, provider, offer, value, locked, logo }: DealCardProps) => {
    // Refs for coordinate calculations
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for raw mouse position relative to card center
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Configuration for the physics-based animation (Spring)
    const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };

    // Create smooth spring values based on raw mouse input
    const rotateX = useSpring(useTransform(y, [-100, 100], [locked ? 2 : 5, locked ? -2 : -5]), springConfig);
    const rotateY = useSpring(useTransform(x, [-100, 100], [locked ? -2 : -5, locked ? 2 : 5]), springConfig);

    // Dynamic scale effect
    const scale = useSpring(useTransform(y, [-100, 100], [1.02, 1.02]), springConfig);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        const xPct = (mouseX / width) - 0.5;
        const yPct = (mouseY / height) - 0.5;

        x.set(xPct * 200); // Normalize to roughly -100 to 100 range for the transform
        y.set(yPct * 200);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // Determine content opacity for locked state
    const contentOpacity = locked ? 0.6 : 1;

    return (
        <Link href={locked ? '#' : `/portal/catalog/${id}`} onClick={e => locked && e.preventDefault()}>
            <motion.div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d",
                    perspective: 1000
                }}
                className={`relative h-full ${locked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
                {/* Main Card Body */}
                <motion.div
                    style={{
                        transformStyle: "preserve-3d", // Ensure children float
                        transform: "translateZ(0px)",
                    }}
                    className={`
                        relative h-full p-6 rounded-xl border transition-all duration-500 backdrop-blur-sm shadow-xl
                        ${locked
                            ? 'bg-charcoal/40 border-white/5 grayscale-[0.5]'
                            : 'bg-white/[0.03] border-white/10 hover:border-white/20 hover:bg-white/[0.06] hover:shadow-2xl hover:shadow-indigo-500/10'
                        }
                    `}
                >
                    {/* Shadow Layer for Depth */}
                    <div
                        className="absolute inset-0 rounded-xl bg-gradient-to-b from-black/0 to-black/80 blur-xl -z-10 translate-y-4 opacity-0 transition-opacity duration-300 group-hover:opacity-60"
                    />

                    {/* Logo & Badge Row */}
                    <div className="flex justify-between items-start mb-6" style={{ opacity: contentOpacity }}>
                        <motion.div
                            style={{ translateZ: 20 }}
                            className="w-14 h-14 bg-white rounded-lg flex items-center justify-center p-3 shadow-lg"
                        >
                            <img src={logo} alt={provider} className="w-full h-full object-contain" />
                        </motion.div>

                        {locked && (
                            <motion.span
                                style={{ translateZ: 10 }}
                                className="px-3 py-1 text-[10px] uppercase font-bold tracking-widest bg-white/5 text-gray-500 rounded border border-white/5"
                            >
                                Locked
                            </motion.span>
                        )}
                    </div>

                    {/* Content Section */}
                    <motion.div style={{ translateZ: 15 }} className="mb-6">
                        <h3 className={`text-xl font-bold mb-1 ${locked ? 'text-gray-500' : 'text-white'}`}>{provider}</h3>
                        <p className={`text-sm leading-relaxed ${locked ? 'text-gray-600' : 'text-gray-400'}`}>{offer}</p>
                    </motion.div>

                    {/* Footer / Value */}
                    <motion.div
                        style={{ translateZ: 10 }}
                        className="flex items-center justify-between mt-auto pt-4 border-t border-white/5"
                    >
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-0.5">Estimated Value</span>
                            <span className={`text-sm font-mono font-medium ${locked ? 'text-gray-600' : 'text-green-400'}`}>
                                {value}
                            </span>
                        </div>
                    </motion.div>

                    {/* Gloss / Sheen Effect on Hover */}
                    {!locked && (
                        <div
                            className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 transition-opacity duration-300 hover:opacity-100 pointer-events-none"
                            style={{ mixBlendMode: 'overlay' }}
                        />
                    )}

                </motion.div>
            </motion.div>
        </Link>
    );
};
