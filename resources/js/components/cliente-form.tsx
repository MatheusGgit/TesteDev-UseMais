import { useState } from 'react';
import type { FormEvent } from 'react';
import { store } from '@/actions/App/Http/Controllers/Api/ClienteController';
import { ClienteFormFields } from '@/components/cliente-form-fields';
import { ApiValidationError, apiRequest } from '@/lib/api';
import type {
    Cliente,
    ClienteForm as ClienteFormData,
    ValidationErrors,
} from '@/types/cliente';

const emptyForm: ClienteFormData = {
    nome: '',
    email: '',
    endereco: {
        cep: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        cidade: '',
        uf: '',
    },
};

export function ClienteForm({
    onCreated,
}: {
    onCreated: (cliente: Cliente) => void;
}) {
    const [form, setForm] = useState<ClienteFormData>(emptyForm);
    const [errors, setErrors] = useState<ValidationErrors>({});
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        setSubmitting(true);
        setErrors({});

        try {
            const request = store();
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

            onCreated(data);
            setForm(emptyForm);
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
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-lg border border-neutral-200 p-6"
        >
            <h2 className="text-lg font-semibold">Novo cliente</h2>

            <ClienteFormFields form={form} onChange={setForm} errors={errors} />

            <button
                type="submit"
                disabled={submitting}
                className="self-start rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
                {submitting ? 'Salvando...' : 'Cadastrar'}
            </button>
        </form>
    );
}
