'use client';

import { useEffect, useState } from 'react';
import { Bridge } from '@/lib/api';
import { Vault } from '@/lib/auth';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function DealDetailsPage() {
    const { id } = useParams();
    const [deal, setDeal] = useState<any>(null);
    const [message, setMessage] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [claiming, setClaiming] = useState(false);
    const user = Vault.retrieveIdentity();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const token = Vault.retrievePass();
                if (token && id) {
                    const response = await Bridge.interact(`/market/opportunities/${id}`, { token });
                    setDeal(response.payload);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const handleClaim = async () => {
        setClaiming(true);
        setMessage(null);
        try {
            const token = Vault.retrievePass() || undefined;
            if (!token) throw new Error("Unauthorized");
            const res = await Bridge.interact(`/market/claim/${id}`, {
                method: 'POST',
                token
            });
            setMessage({ type: 'success', text: res.details, title: 'Asset Secured' });
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Claim Failed' });
        } finally {
            setClaiming(false);
        }
    };

    if (loading) return <div>Loading Intelligence...</div>;
    if (!deal) return <div>Asset Not Found</div>;

    const isLocked = deal.is_locked_asset;
    const canAccess = user?.role === 'founder' || user?.role === 'admin' || !isLocked;

    return (
        <div className="max-w-3xl mx-auto py-12">
            <Link href="/portal/catalog" className="text-gray-500 hover:text-white mb-8 block transition-colors">← Return to Catalog</Link>

            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-charcoal border border-white/10 rounded-2xl p-8 overflow-hidden relative"
            >
                <div className="flex items-center gap-6 mb-8">
                    <div className="w-24 h-24 bg-white rounded-xl flex items-center justify-center p-4">
                        <img src={deal.visual_asset_url} alt={deal.provider_identity} className="w-full h-full object-contain" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">{deal.provider_identity}</h1>
                        <p className="text-xl text-gray-400">{deal.offer_headline}</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Value</div>
                        <div className="text-2xl font-mono text-green-400">{deal.benefit_value}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-lg">
                        <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">Status</div>
                        <div className={`font-bold ${isLocked ? 'text-orange-400' : 'text-blue-400'}`}>
                            {isLocked ? 'Verification Required' : 'Open Access'}
                        </div>
                    </div>
                </div>

                {message ? (
                    <div className={`p-6 rounded-lg ${message.type === 'success' ? 'bg-green-900/20 border-green-900/50' : 'bg-red-900/20 border-red-900/50'} border`}>
                        <h3 className={`font-bold mb-2 ${message.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {message.type === 'success' ? message.title : 'Access Denied'}
                        </h3>
                        <p className="font-mono text-sm">{message.text}</p>
                    </div>
                ) : (
                    <div className="mt-8">
                        {!canAccess ? (
                            <div className="bg-orange-900/20 border border-orange-900/50 p-6 rounded-lg text-center">
                                <p className="text-orange-300 mb-4">You need to be a verified founder to claim this asset.</p>
                                <button disabled className="bg-white/10 text-gray-500 px-8 py-3 rounded-full cursor-not-allowed">
                                    Locked
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={handleClaim}
                                disabled={claiming}
                                className="w-full bg-white text-black font-bold text-lg py-4 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                {claiming ? 'Processing Transaction...' : 'Claim Asset Now'}
                            </button>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
