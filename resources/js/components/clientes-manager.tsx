import { useEffect, useState } from 'react';
import {
    destroy,
    index,
} from '@/actions/App/Http/Controllers/Api/ClienteController';
import { ClienteEditDialog } from '@/components/cliente-edit-dialog';
import { ClienteForm } from '@/components/cliente-form';
import { ClienteList } from '@/components/cliente-list';
import { ConfirmDialog } from '@/components/confirm-dialog';
import { apiRequest, UnauthorizedError } from '@/lib/api';
import type { AuthUser } from '@/types/auth';
import type { Cliente } from '@/types/cliente';

export function ClientesManager({
    user,
    onLogout,
}: {
    user: AuthUser;
    onLogout: () => void;
}) {
    const [clientes, setClientes] = useState<Cliente[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Cliente | null>(null);
    const [deleting, setDeleting] = useState<Cliente | null>(null);
    const [removing, setRemoving] = useState(false);

    useEffect(() => {
        const request = index();

        apiRequest<{ data: Cliente[] }>(request.url, request.method)
            .then(({ data }) => setClientes(data))
            .catch((error) => {
                if (error instanceof UnauthorizedError) {
                    onLogout();
                }
            })
            .finally(() => setLoading(false));
    }, [onLogout]);

    async function handleConfirmDelete() {
        if (!deleting) {
            return;
        }

        setRemoving(true);

        try {
            const request = destroy(deleting.id);
            await apiRequest<void>(request.url, request.method);

            setClientes((current) =>
                current.filter((cliente) => cliente.id !== deleting.id),
            );
            setDeleting(null);
        } finally {
            setRemoving(false);
        }
    }

    return (
        <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 py-6 sm:px-6 sm:py-10">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-bold">Clientes</h1>
                <div className="flex items-center gap-3 text-sm text-neutral-600">
                    <span>{user.email}</span>
                    <button
                        type="button"
                        onClick={onLogout}
                        className="underline underline-offset-2"
                    >
                        Sair
                    </button>
                </div>
            </div>

            <ClienteForm
                onCreated={(cliente) =>
                    setClientes((current) => [cliente, ...current])
                }
            />

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-semibold">Clientes cadastrados</h2>
                {loading ? (
                    <p className="text-sm text-neutral-500">Carregando...</p>
                ) : (
                    <ClienteList
                        clientes={clientes}
                        onEdit={setEditing}
                        onDelete={setDeleting}
                    />
                )}
            </section>

            <ClienteEditDialog
                cliente={editing}
                onClose={() => setEditing(null)}
                onUpdated={(cliente) => {
                    setClientes((current) =>
                        current.map((c) => (c.id === cliente.id ? cliente : c)),
                    );
                    setEditing(null);
                }}
            />

            <ConfirmDialog
                open={deleting !== null}
                title="Remover cliente"
                description={
                    deleting
                        ? `Tem certeza que deseja remover ${deleting.nome}? Essa ação não pode ser desfeita.`
                        : ''
                }
                confirmLabel="Remover"
                busy={removing}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleting(null)}
            />
        </div>
    );
}
