'use client';

import { NavBar } from '@/components/visuals/NavBar';
import { Hero3D } from '@/components/visuals/Hero3D';
import { motion } from 'framer-motion';
import Link from 'next/link';

const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.15 } }
};

export default function LandingPage() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center relative overflow-hidden bg-obsidian">
            <NavBar />

            {/* 3D Background Layer */}
            <Hero3D />

            <motion.div
                className="z-10 text-center max-w-5xl px-6"
                initial="hidden"
                animate="visible"
                variants={stagger}
            >
                <motion.h1
                    className="text-7xl md:text-9xl font-extrabold tracking-tighter mb-8 text-white drop-shadow-2xl"
                    variants={fadeInUp}
                >
                    Scale Your Vision.
                </motion.h1>

                <motion.p
                    className="text-xl md:text-2xl text-gray-500 mb-12 max-w-3xl mx-auto leading-relaxed font-light tracking-wide"
                    variants={fadeInUp}
                >
                    Access <span className="text-white font-medium">$100k+</span> in exclusive software credits and resources.
                    Curated for the next generation of unicorns.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                    <Link
                        href="/auth-access/join"
                        className="px-10 py-4 bg-white text-black font-bold text-lg rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.15)]"
                    >
                        Apply for Access
                    </Link>
                    <Link
                        href="/auth-access/login"
                        className="px-10 py-4 bg-white/5 border border-white/10 text-white font-medium text-lg rounded-full hover:bg-white/10 hover:border-white/20 transition-all backdrop-blur-sm"
                    >
                        Member Login
                    </Link>
                </motion.div>
            </motion.div>

            {/* Trust Badges / Quick Preview */}
            <motion.div
                className="absolute bottom-12 flex gap-16 opacity-20 grayscale mix-blend-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                transition={{ delay: 1.2, duration: 1.5 }}
            >
                <span className="text-2xl font-bold tracking-widest">AWS</span>
                <span className="text-2xl font-bold tracking-widest">STRIPE</span>
                <span className="text-2xl font-bold tracking-widest">NOTION</span>
                <span className="text-2xl font-bold tracking-widest">HUBSPOT</span>
            </motion.div>
        </main>
    );
}
