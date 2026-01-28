'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Vault } from '@/lib/vault';
import { PortalSidebar } from '@/components/visuals/PortalSidebar';

export default function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const isAuth = Vault.isAuthenticated();
        if (!isAuth) {
            router.push('/auth-access/login');
        } else {
            setAuthorized(true);
            setUser(Vault.retrieveIdentity());
        }
    }, [router]);

    if (!authorized) {
        return <div className="min-h-screen bg-obsidian flex items-center justify-center text-gray-500 font-mono text-sm">INITIALIZING SECURITY PROTOCOLS...</div>;
    }

    return (
        <div className="min-h-screen bg-obsidian text-ivory flex relative overflow-hidden">
            {/* Ambient Background Glows */}
            <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0" />
            <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-fuchsia-900/5 rounded-full blur-[100px] translate-x-1/3 translate-y-1/3 pointer-events-none z-0" />

            {/* Fixed Left Sidebar */}
            <PortalSidebar />

            {/* Main Content Area */}
            <div className="flex-1 ml-64 flex flex-col min-h-screen">

                {/* Premium Glass Top Bar */}
                <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-30 transition-all duration-300">
                    {/* Glass Background Layer */}
                    <div className="absolute inset-0 bg-[#050505]/70 backdrop-blur-md border-b border-white/5" />

                    <div className="relative z-10 flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/5 text-xs font-mono text-gray-400 uppercase tracking-widest">
                            Secure Channel
                        </div>
                    </div>

                    <div className="relative z-10 flex items-center gap-6">
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-bold text-white leading-none tracking-tight">{user?.name}</div>
                            <div className="text-[10px] text-indigo-400 leading-none mt-1.5 uppercase font-bold tracking-widest">
                                {user?.role} Access
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-800 to-gray-700 border border-white/10 shadow-lg ring-2 ring-white/5 flex items-center justify-center text-sm font-bold text-gray-400">
                            {user?.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-8 max-w-6xl w-full mx-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
