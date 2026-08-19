import { useState } from 'react';
import { show } from '@/actions/App/Http/Controllers/Api/CepController';
import { getToken } from '@/lib/auth';
import type { EnderecoLookup } from '@/types/cliente';

export function useCepLookup() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function lookup(cep: string): Promise<EnderecoLookup | null> {
        setLoading(true);
        setError(null);

        try {
            const token = getToken();
            const request = show(cep);
            const response = await fetch(request.url, {
                method: request.method,
                headers: {
                    Accept: 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
            });

            if (response.status === 404) {
                setError('CEP não encontrado');

                return null;
            }

            if (!response.ok) {
                setError('Não foi possível buscar o CEP, tente novamente');

                return null;
            }

            const { data } = (await response.json()) as {
                data: EnderecoLookup;
            };

            return data;
        } catch {
            setError('Não foi possível buscar o CEP, tente novamente');

            return null;
        } finally {
            setLoading(false);
        }
    }

    return { lookup, loading, error };
}
