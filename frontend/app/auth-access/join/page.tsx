'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bridge } from '@/lib/bridge';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function JoinPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        full_name: '',
        email_address: '',
        secret_code: ''
    });
    const [status, setStatus] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('Processing...');

        try {
            await Bridge.interact('/auth/initiate', {
                method: 'POST',
                body: JSON.stringify(formData)
            });
            setStatus('Success! Redirecting...');
            setTimeout(() => router.push('/auth-access/login'), 1500);
        } catch (err: any) {
            setStatus(`Error: ${err.message}`);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-obsidian">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md p-8 glass-panel rounded-2xl"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Initialize Account</h2>
                    <p className="text-gray-400 text-sm">Join the network of elite founders.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Full Name</label>
                        <input
                            type="text"
                            className="w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                            value={formData.full_name}
                            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Work Email</label>
                        <input
                            type="email"
                            className="w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                            value={formData.email_address}
                            onChange={(e) => setFormData({ ...formData, email_address: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Security Code</label>
                        <input
                            type="password"
                            className="w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                            value={formData.secret_code}
                            onChange={(e) => setFormData({ ...formData, secret_code: e.target.value })}
                            required
                        />
                    </div>

                    {status && (
                        <div className={`text-sm text-center ${status.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                            {status}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Confirm Registration
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Already initialized? <Link href="/auth-access/login" className="text-white hover:underline">Log in</Link>
                </div>
            </motion.div>
        </div>
    );
}
