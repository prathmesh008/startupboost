'use client';

import { useEffect, useState } from 'react';
import { Bridge } from '@/lib/bridge';
import { Vault } from '@/lib/vault';
import { DealCard } from '@/components/blocks/DealCard';
import { motion, AnimatePresence } from 'framer-motion';

// Skeleton Component for loading state
const SkeletonCard = () => (
    <div className="relative h-[320px] bg-charcoal/50 rounded-xl border border-white/5 overflow-hidden">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-tr from-white/0 via-white/5 to-white/0" />
        <div className="p-6 h-full flex flex-col justify-between">
            <div className="flex justify-between">
                <div className="w-14 h-14 bg-white/5 rounded-lg" />
                <div className="w-16 h-6 bg-white/5 rounded" />
            </div>
            <div className="space-y-3">
                <div className="h-6 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-2/3 bg-white/5 rounded" />
            </div>
            <div className="h-4 w-1/4 bg-white/5 rounded mt-4" />
        </div>
    </div>
);

export default function CatalogPage() {
    const [deals, setDeals] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDeals = async () => {
            // Artificial delay to demonstrate skeleton if response is instant
            // Remove delay in production if desired
            await new Promise(r => setTimeout(r, 800));

            try {
                const token = Vault.retrievePass();
                if (token) {
                    const response = await Bridge.interact('/market/opportunities', { token });
                    setDeals(response.payload);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDeals();
    }, []);

    return (
        <div className="space-y-8 min-h-screen">
            {/* Premium Marketplace Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl p-10 border border-white/10 bg-[#080808] shadow-2xl"
            >
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10">
                    <h1 className="text-4xl font-bold mb-3 tracking-tighter text-white">Marketplace & Assets</h1>
                    <p className="text-gray-400 max-w-xl text-lg font-light leading-relaxed">
                        Curated infrastructure and growth tools for scaling high-performance teams.
                        Exclusive to verified founders.
                    </p>

                    <div className="flex items-center gap-4 mt-8">
                        {['All Assets', 'Infrastructure', 'Productivity', 'Finance'].map((tab, i) => (
                            <button
                                key={tab}
                                className={`
                                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border
                                    ${i === 0
                                        ? 'bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                                        : 'bg-transparent text-gray-500 border-transparent hover:bg-white/5 hover:text-white'
                                    }
                                `}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        /* Render Skeletons */
                        [...Array(6)].map((_, i) => (
                            <motion.div
                                key={`skel-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                            >
                                <SkeletonCard />
                            </motion.div>
                        ))
                    ) : (
                        /* Render Actual Deals */
                        deals.map((deal: any, index) => (
                            <motion.div
                                key={deal._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.4,
                                    delay: index * 0.05, // Stagger effect
                                    ease: "easeOut"
                                }}
                            >
                                <DealCard
                                    id={deal._id}
                                    provider={deal.provider_identity}
                                    offer={deal.offer_headline}
                                    value={deal.benefit_value}
                                    locked={deal.is_locked_asset}
                                    logo={deal.visual_asset_url}
                                />
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
