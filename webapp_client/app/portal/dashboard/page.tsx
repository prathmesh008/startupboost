'use client';

import { useEffect, useState, useRef } from 'react';
import { Bridge } from '@/lib/bridge';
import { Vault } from '@/lib/vault';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';

// --- Custom Components ---

const Ticker = ({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) => {
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString());

    useEffect(() => {
        const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
        return controls.stop;
    }, [value]);

    return (
        <span className="flex">
            {prefix}<motion.span>{rounded}</motion.span>{suffix}
        </span>
    );
};

// --- Variants ---

const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 }
    }
};

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { type: "spring", stiffness: 300, damping: 24 }
    }
};

// --- Page Logic ---

export default function DashboardPage() {
    const [profile, setProfile] = useState<any>(null);
    const [claims, setClaims] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [totalValue, setTotalValue] = useState(0);

    useEffect(() => {
        const user = Vault.retrieveIdentity();
        setProfile(user);

        const fetchData = async () => {
            try {
                const token = Vault.retrievePass();
                if (token) {
                    const data = await Bridge.interact('/account/status', { token });
                    setClaims(data.claims);

                    const total = data.claims.reduce((acc: number, item: any) => {
                        const valStr = item.asset_reference_id?.benefit_value || '';
                        const cleanVal = valStr.replace(/[^0-9]/g, '');
                        return acc + (parseInt(cleanVal) || 0);
                    }, 0);
                    setTotalValue(total);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center h-64 text-gray-500 font-mono animate-pulse text-xs uppercase tracking-widest">
            Fetching Secure Data...
        </div>
    );

    return (
        <motion.div
            className="space-y-12"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
        >
            {/* Welcome Banner */}
            <motion.div variants={fadeInUp} className="relative overflow-hidden rounded-3xl p-10 border border-white/10 bg-gradient-to-r from-gray-900 via-[#0a0a0a] to-gray-900 shadow-2xl">
                <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 mb-2">
                            Welcome back, {profile?.name?.split(' ')[0] || 'Founder'}.
                        </h1>
                        <p className="text-gray-400 text-lg font-light tracking-wide">
                            Your ecosystem performance at a glance.
                        </p>
                    </div>
                    <div className="px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono text-gray-300 uppercase tracking-widest">
                        System Operational
                    </div>
                </div>
            </motion.div>

            {/* Metrics Grid */}
            <motion.div
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
                variants={staggerContainer}
            >
                {/* User Role Card */}
                <motion.div variants={fadeInUp} className="group relative p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                    <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Account Status</div>
                    <div className="text-2xl text-white font-medium capitalize flex items-center gap-3">
                        {profile?.role}
                        <span className="text-xs px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/5">Tier 1</span>
                    </div>
                </motion.div>

                {/* Net Value Card */}
                <motion.div variants={fadeInUp} className="group relative p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Total Value Unlocked</div>
                    <div className="text-4xl font-bold text-white font-mono tracking-tighter">
                        <Ticker value={totalValue} prefix="$" />
                    </div>
                </motion.div>

                {/* Active Assets Card */}
                <motion.div variants={fadeInUp} className="group relative p-8 rounded-2xl bg-[#080808] border border-white/5 hover:border-white/10 transition-colors shadow-lg">
                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent opacity-50" />
                    <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-4">Active Deployments</div>
                    <div className="text-4xl font-bold text-white font-mono tracking-tighter">
                        <Ticker value={claims.length} />
                    </div>
                </motion.div>
            </motion.div>

            {/* Recent Activity Table */}
            <motion.section variants={fadeInUp}>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold tracking-tight text-white">Recent Acquisitions</h2>
                    <button className="text-xs text-gray-500 hover:text-white transition-colors uppercase tracking-widest">View All History</button>
                </div>

                {claims.length === 0 ? (
                    <div className="h-48 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.01]">
                        <p className="text-gray-500">No assets acquired yet.</p>
                        <a href="/portal/catalog" className="text-indigo-400 hover:text-indigo-300 text-sm mt-2 underline decoration-indigo-500/30">Browse Catalog</a>
                    </div>
                ) : (
                    <div className="rounded-2xl border border-white/5 bg-[#080808] overflow-hidden">
                        {claims.map((claim: any, i: number) => (
                            <motion.div
                                key={claim._id}
                                variants={fadeInUp}
                                className={`
                                    group flex items-center justify-between p-6 transition-colors hover:bg-white/[0.02]
                                    ${i !== claims.length - 1 ? 'border-b border-white/5' : ''}
                                `}
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-xs font-bold text-gray-300">
                                        {claim.asset_reference_id.provider_identity.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-medium text-white text-base mb-1 group-hover:text-indigo-200 transition-colors">
                                            {claim.asset_reference_id.provider_identity}
                                        </div>
                                        <div className="text-xs text-gray-500 font-mono">
                                            {claim.asset_reference_id.benefit_value}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 font-mono bg-white/5 px-3 py-1 rounded-full">
                                        {new Date(claim.claim_timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.section>
        </motion.div>
    );
}
