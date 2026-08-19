import { clearToken, getToken } from '@/lib/auth';
import type { ValidationErrors } from '@/types/cliente';

export class ApiValidationError extends Error {
    constructor(public errors: ValidationErrors) {
        super('Validation failed');
    }
}

export class UnauthorizedError extends Error {
    constructor() {
        super('Unauthorized');
    }
}

export async function apiRequest<T>(
    url: string,
    method: string,
    body?: unknown,
): Promise<T> {
    const token = getToken();

    const response = await fetch(url, {
        method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
        clearToken();

        throw new UnauthorizedError();
    }

    if (response.status === 422) {
        const payload = (await response.json()) as { errors: ValidationErrors };

        throw new ApiValidationError(payload.errors);
    }

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await response.json()) as T;
}
