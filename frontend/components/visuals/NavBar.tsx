'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Vault } from '@/lib/auth';

export const NavBar = () => {
    const router = useRouter();
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
        setIsAuth(Vault.isAuthenticated());
    }, []);

    const handleExit = () => {
        Vault.wipe();
        setIsAuth(false);
        router.push('/');
    };

    return (
        <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-obsidian/60 transition-all duration-300 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                <Link href="/" className="text-2xl font-bold tracking-tighter text-white">
                    Startup<span className="text-gray-500">Boost</span>
                </Link>

                <div className="flex items-center gap-8 text-sm font-medium">
                    {isAuth ? (
                        <>
                            <Link href="/portal/dashboard" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Dashboard
                            </Link>
                            <Link href="/portal/catalog" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Deals
                            </Link>
                            <button
                                onClick={handleExit}
                                className="px-5 py-2.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-gray-300 hover:text-white transition-all duration-200"
                            >
                                Sign Out
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/auth-access/login" className="text-gray-400 hover:text-white transition-colors duration-200">
                                Log In
                            </Link>
                            <Link
                                href="/auth-access/join"
                                className="px-6 py-2.5 bg-white text-black rounded-full hover:bg-gray-100 transition-colors duration-200 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                            >
                                Get Access
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
