import { useEffect, useState } from 'react';
import { show } from '@/actions/App/Http/Controllers/Api/AuthController';
import { ClientesManager } from '@/components/clientes-manager';
import { Login } from '@/components/login';
import { apiRequest } from '@/lib/api';
import { clearToken, getToken } from '@/lib/auth';
import type { AuthUser } from '@/types/auth';

type AuthStatus = 'checking' | 'authenticated' | 'unauthenticated';

export function App() {
    const [status, setStatus] = useState<AuthStatus>(() =>
        getToken() ? 'checking' : 'unauthenticated',
    );
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        if (!getToken()) {
            return;
        }

        const request = show();

        apiRequest<{ data: AuthUser }>(request.url, request.method)
            .then(({ data }) => {
                setUser(data);
                setStatus('authenticated');
            })
            .catch(() => setStatus('unauthenticated'));
    }, []);

    function handleLogout() {
        clearToken();
        setUser(null);
        setStatus('unauthenticated');
    }

    if (status === 'checking') {
        return (
            <p className="px-6 py-10 text-sm text-neutral-500">Carregando...</p>
        );
    }

    if (status === 'unauthenticated') {
        return (
            <Login
                onLoggedIn={(loggedInUser) => {
                    setUser(loggedInUser);
                    setStatus('authenticated');
                }}
            />
        );
    }

    if (status === 'authenticated' && user) {
        return <ClientesManager user={user} onLogout={handleLogout} />;
    }

    return null;
}
