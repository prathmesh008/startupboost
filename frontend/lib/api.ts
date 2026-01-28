const API_CORE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000') + '/api/v1';

interface RequestOptions extends RequestInit {
    token?: string;
}

export const Bridge = {
    async interact(endpoint: string, options: RequestOptions = {}) {
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...((options.headers as Record<string, string>) || {}),
        };

        if (options.token) {
            headers['Authorization'] = `Bearer ${options.token}`;
        }

        const response = await fetch(`${API_CORE}${endpoint}`, {
            ...options,
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            throw { status: response.status, message: data.note || 'Transmission Failed' };
        }

        return data;
    }
};
