import { useState } from 'react';
import type { FormEvent } from 'react';
import { store } from '@/actions/App/Http/Controllers/Api/AuthController';
import { setToken } from '@/lib/auth';
import type { AuthUser } from '@/types/auth';

export function Login({
    onLoggedIn,
}: {
    onLoggedIn: (user: AuthUser) => void;
}) {
    const [email, setEmail] = useState('test@example.com');
    const [password, setPassword] = useState('password');
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const request = store();
            const response = await fetch(request.url, {
                method: request.method,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                setError('Credenciais inválidas');

                return;
            }

            const { data } = (await response.json()) as {
                data: { token: string; user: AuthUser };
            };

            setToken(data.token);
            onLoggedIn(data.user);
        } catch {
            setError('Não foi possível fazer login, tente novamente');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="mx-auto flex max-w-sm flex-col gap-6 px-6 py-24">
            <h1 className="text-2xl font-bold">Entrar</h1>

            <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-6"
            >
                <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-neutral-700">Email</span>
                    <input
                        type="email"
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <label className="flex flex-col gap-1 text-sm">
                    <span className="font-medium text-neutral-700">Senha</span>
                    <input
                        type="password"
                        className="rounded-md border border-neutral-300 px-3 py-2 text-sm focus:border-neutral-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                {error && <span className="text-xs text-red-600">{error}</span>}

                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {submitting ? 'Entrando...' : 'Entrar'}
                </button>
            </form>
        </div>
    );
}
