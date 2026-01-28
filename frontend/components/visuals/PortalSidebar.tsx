'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Vault } from '@/lib/vault';
import { motion } from 'framer-motion';
import { LayoutDashboard, CreditCard, Settings, LogOut, Layers } from 'lucide-react';

const SidebarItem = ({ href, label, active, onClick, icon: Icon }: any) => {
    return (
        <Link
            href={href}
            onClick={onClick}
            className={`
                group flex items-center gap-3 px-6 py-3.5 text-sm font-medium transition-all duration-300 relative overflow-hidden
                ${active
                    ? 'text-white bg-white/[0.08]'
                    : 'text-gray-500 hover:text-white hover:bg-white/[0.04]'
                }
            `}
        >
            {active && (
                <motion.div
                    layoutId="sidebar-active"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 shadow-[0_0_10px_#6366f1]"
                />
            )}
            <Icon size={18} className={`transition-colors ${active ? 'text-indigo-400' : 'group-hover:text-gray-300'}`} />
            <span className="relative z-10">{label}</span>
        </Link>
    );
};

export const PortalSidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const handleSignOut = () => {
        Vault.wipe();
        router.push('/');
    };

    return (
        <aside className="fixed top-0 left-0 w-72 h-full bg-[#050505]/90 backdrop-blur-xl border-r border-white/5 z-40 flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
            {/* Sidebar Header */}
            <div className="h-20 flex items-center px-8 border-b border-white/5 bg-white/[0.02]">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/20 transition-all">
                        <Layers size={18} className="text-white" />
                    </div>
                    <div className="text-lg font-bold tracking-tight text-white">
                        Startup<span className="text-gray-500">Boost</span>
                    </div>
                </Link>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-8 space-y-2">
                <SidebarItem
                    href="/portal/dashboard"
                    label="Overview"
                    icon={LayoutDashboard}
                    active={pathname === '/portal/dashboard'}
                />
                <SidebarItem
                    href="/portal/catalog"
                    label="Marketplace"
                    icon={CreditCard}
                    active={pathname.startsWith('/portal/catalog')}
                />
                <SidebarItem
                    href="#"
                    label="Settings"
                    icon={Settings}
                    active={pathname === '/portal/settings'}
                    onClick={(e: any) => e.preventDefault()}
                />
            </nav>

            {/* Footer / User Actions */}
            <div className="p-6 border-t border-white/5">
                <button
                    onClick={handleSignOut}
                    className="w-full text-left px-4 py-3 text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/10 rounded-lg transition-colors"
                >
                    Sign Out
                </button>
            </div>
        </aside>
    );
};
