import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { update } from '@/actions/App/Http/Controllers/Api/ClienteController';
import { ClienteFormFields } from '@/components/cliente-form-fields';
import { ApiValidationError, apiRequest } from '@/lib/api';
import type {
    Cliente,
    ClienteForm as ClienteFormData,
    ValidationErrors,
} from '@/types/cliente';

function toFormData(cliente: Cliente): ClienteFormData {
    return {
        nome: cliente.nome,
        email: cliente.email,
        endereco: {
            cep: cliente.endereco.cep,
            logradouro: cliente.endereco.logradouro,
            numero: String(cliente.endereco.numero),
            complemento: cliente.endereco.complemento ?? '',
            bairro: cliente.endereco.bairro,
            cidade: cliente.endereco.cidade,
            uf: cliente.endereco.uf,
        },
    };
}

function ClienteEditForm({
    cliente,
    onUpdated,
    onClose,
}: {
    cliente: Cliente;
    onUpdated: (cliente: Cliente) => void;
    onClose: () => void;
}) {
    const [form, setForm] = useState<ClienteFormData>(() =>
        toFormData(cliente),
    );
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const request = update(cliente.id);
            const { data } = await apiRequest<{ data: Cliente }>(
                request.url,
                request.method,
                {
                    nome: form.nome,
                    email: form.email,
                    endereco: {
                        ...form.endereco,
                        numero: Number(form.endereco.numero),
                    },
                },
            );

            onUpdated(data);
        } catch (error) {
            if (error instanceof ApiValidationError) {
                setErrors(error.errors);
            } else {
                throw error;
            }
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-6">
            <h2 className="text-lg font-semibold">Editar cliente</h2>

            <ClienteFormFields form={form} onChange={setForm} errors={errors} />

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                >
                    {submitting ? 'Salvando...' : 'Salvar alterações'}
                </button>
            </div>
        </form>
    );
}

export function ClienteEditDialog({
    cliente,
    onUpdated,
    onClose,
}: {
    cliente: Cliente | null;
    onUpdated: (cliente: Cliente) => void;
    onClose: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (cliente && !dialog.open) {
            dialog.showModal();
        } else if (!cliente && dialog.open) {
            dialog.close();
        }
    }, [cliente]);

    return (
        <dialog
            ref={dialogRef}
            onCancel={(e) => {
                e.preventDefault();
                onClose();
            }}
            onClose={onClose}
            className="m-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-lg border border-neutral-200 p-0 backdrop:bg-black/30"
        >
            {cliente && (
                <ClienteEditForm
                    key={cliente.id}
                    cliente={cliente}
                    onUpdated={onUpdated}
                    onClose={onClose}
                />
            )}
        </dialog>
    );
}
