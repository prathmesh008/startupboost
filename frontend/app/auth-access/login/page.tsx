'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bridge } from '@/lib/bridge';
import { Vault } from '@/lib/vault';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
    const router = useRouter();
    const [creds, setCreds] = useState({
        email_address: '',
        secret_code: ''
    });
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const result = await Bridge.interact('/auth/identify', {
                method: 'POST',
                body: JSON.stringify(creds)
            });

            if (result.token) {
                Vault.storeIdentity(result.token, result.profile);
                router.push('/portal/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Access Denied');
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-obsidian">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md p-8 glass-panel rounded-2xl"
            >
                <div className="mb-8 text-center">
                    <h2 className="text-2xl font-bold text-white mb-2">Identify Yourself</h2>
                    <p className="text-gray-400 text-sm">Access the secure terminal.</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Email</label>
                        <input
                            type="email"
                            className="w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                            value={creds.email_address}
                            onChange={(e) => setCreds({ ...creds, email_address: e.target.value })}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">Passcode</label>
                        <input
                            type="password"
                            className="w-full bg-charcoal border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/40 transition-colors"
                            value={creds.secret_code}
                            onChange={(e) => setCreds({ ...creds, secret_code: e.target.value })}
                            required
                        />
                    </div>

                    {error && (
                        <div className="text-sm text-center text-red-500 bg-red-500/10 py-2 rounded">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Authenticate
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-500">
                    New here? <Link href="/auth-access/join" className="text-white hover:underline">Apply for access</Link>
                </div>
            </motion.div>
        </div>
    );
}
