import estados from '@/data/estados.json';
import { useCepLookup } from '@/hooks/use-cep-lookup';
import { maskCep, onlyDigits } from '@/lib/masks';
import { cn } from '@/lib/utils';
import type {
    ClienteForm as ClienteFormData,
    ValidationErrors,
} from '@/types/cliente';

export const inputClass = cn(
    'rounded-md border border-neutral-300 px-3 py-2 text-sm',
    'focus:border-neutral-500 focus:outline-none',
);

export function Field({
    label,
    error,
    children,
}: {
    label: string;
    error?: string[];
    children: React.ReactNode;
}) {
    return (
        <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-neutral-700">{label}</span>
            {children}
            {error && <span className="text-xs text-red-600">{error[0]}</span>}
        </label>
    );
}

export function ClienteFormFields({
    form,
    onChange,
    errors,
}: {
    form: ClienteFormData;
    onChange: (form: ClienteFormData) => void;
    errors: ValidationErrors;
}) {
    const { lookup, loading: cepLoading, error: cepError } = useCepLookup();

    function setEndereco(patch: Partial<ClienteFormData['endereco']>) {
        onChange({ ...form, endereco: { ...form.endereco, ...patch } });
    }

    async function handleCepBlur() {
        const digits = form.endereco.cep.replace(/\D/g, '');

        if (digits.length !== 8) {
            return;
        }

        const endereco = await lookup(digits);

        if (endereco) {
            setEndereco({
                cep: endereco.cep,
                logradouro: endereco.logradouro,
                complemento: endereco.complemento,
                bairro: endereco.bairro,
                cidade: endereco.cidade,
                uf: endereco.uf,
            });
        }
    }

    return (
        <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nome" error={errors.nome}>
                    <input
                        className={inputClass}
                        value={form.nome}
                        onChange={(e) =>
                            onChange({ ...form, nome: e.target.value })
                        }
                        required
                    />
                </Field>
                <Field label="Email" error={errors.email}>
                    <input
                        type="email"
                        className={inputClass}
                        value={form.email}
                        onChange={(e) =>
                            onChange({ ...form, email: e.target.value })
                        }
                        required
                    />
                </Field>
            </div>

            <h3 className="text-sm font-semibold text-neutral-600">Endereço</h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="CEP" error={errors['endereco.cep']}>
                    <input
                        className={inputClass}
                        value={form.endereco.cep}
                        onChange={(e) =>
                            setEndereco({ cep: maskCep(e.target.value) })
                        }
                        onBlur={handleCepBlur}
                        placeholder="00000-000"
                        inputMode="numeric"
                        maxLength={9}
                        required
                    />
                    {cepLoading && (
                        <span className="text-xs text-neutral-500">
                            Buscando endereço...
                        </span>
                    )}
                    {!cepLoading && cepError && (
                        <span className="text-xs text-red-600">{cepError}</span>
                    )}
                </Field>
                <Field label="Logradouro" error={errors['endereco.logradouro']}>
                    <input
                        className={inputClass}
                        value={form.endereco.logradouro}
                        onChange={(e) =>
                            setEndereco({ logradouro: e.target.value })
                        }
                        required
                    />
                </Field>
                <Field label="Número" error={errors['endereco.numero']}>
                    <input
                        className={inputClass}
                        value={form.endereco.numero}
                        onChange={(e) =>
                            setEndereco({ numero: onlyDigits(e.target.value) })
                        }
                        inputMode="numeric"
                        required
                    />
                </Field>
                <Field
                    label="Complemento"
                    error={errors['endereco.complemento']}
                >
                    <input
                        className={inputClass}
                        value={form.endereco.complemento}
                        onChange={(e) =>
                            setEndereco({ complemento: e.target.value })
                        }
                    />
                </Field>
                <Field label="Bairro" error={errors['endereco.bairro']}>
                    <input
                        className={inputClass}
                        value={form.endereco.bairro}
                        onChange={(e) =>
                            setEndereco({ bairro: e.target.value })
                        }
                        required
                    />
                </Field>
                <Field label="Cidade" error={errors['endereco.cidade']}>
                    <input
                        className={inputClass}
                        value={form.endereco.cidade}
                        onChange={(e) =>
                            setEndereco({ cidade: e.target.value })
                        }
                        required
                    />
                </Field>
                <Field label="UF" error={errors['endereco.uf']}>
                    <select
                        className={inputClass}
                        value={form.endereco.uf}
                        onChange={(e) => setEndereco({ uf: e.target.value })}
                        required
                    >
                        <option value="" disabled>
                            Selecione
                        </option>
                        {estados.map((estado) => (
                            <option key={estado.sigla} value={estado.sigla}>
                                {estado.sigla} - {estado.nome}
                            </option>
                        ))}
                    </select>
                </Field>
            </div>
        </>
    );
}
