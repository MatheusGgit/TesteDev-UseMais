import type { Cliente } from '@/types/cliente';

function enderecoResumo(cliente: Cliente): string {
    const { endereco } = cliente;

    return `${endereco.logradouro}, ${endereco.numero}${endereco.complemento ? ` - ${endereco.complemento}` : ''} · ${endereco.bairro} · ${endereco.cidade}/${endereco.uf} · ${endereco.cep}`;
}

export function ClienteList({
    clientes,
    onEdit,
    onDelete,
}: {
    clientes: Cliente[];
    onEdit: (cliente: Cliente) => void;
    onDelete: (cliente: Cliente) => void;
}) {
    if (clientes.length === 0) {
        return (
            <p className="text-sm text-neutral-500">
                Nenhum cliente cadastrado ainda.
            </p>
        );
    }

    return (
        <>
            {/* Tabela: telas médias e maiores */}
            <div className="hidden overflow-x-auto rounded-lg border border-neutral-200 md:block">
                <table className="w-full text-left text-sm">
                    <thead className="bg-neutral-50 text-neutral-600">
                        <tr>
                            <th className="px-4 py-2 font-medium">Nome</th>
                            <th className="px-4 py-2 font-medium">Email</th>
                            <th className="px-4 py-2 font-medium">Endereço</th>
                            <th className="px-4 py-2 font-medium">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes.map((cliente) => (
                            <tr
                                key={cliente.id}
                                className="border-t border-neutral-200"
                            >
                                <td className="px-4 py-2">{cliente.nome}</td>
                                <td className="px-4 py-2">{cliente.email}</td>
                                <td className="px-4 py-2 text-neutral-600">
                                    {enderecoResumo(cliente)}
                                </td>
                                <td className="px-4 py-2">
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => onEdit(cliente)}
                                            className="text-neutral-700 underline underline-offset-2"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => onDelete(cliente)}
                                            className="text-red-600 underline underline-offset-2"
                                        >
                                            Remover
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Cards: telas pequenas */}
            <div className="flex flex-col gap-3 md:hidden">
                {clientes.map((cliente) => (
                    <div
                        key={cliente.id}
                        className="flex flex-col gap-2 rounded-lg border border-neutral-200 p-4"
                    >
                        <div>
                            <p className="font-medium">{cliente.nome}</p>
                            <p className="text-sm text-neutral-600">
                                {cliente.email}
                            </p>
                        </div>
                        <p className="text-sm text-neutral-600">
                            {enderecoResumo(cliente)}
                        </p>
                        <div className="flex gap-4 pt-1">
                            <button
                                type="button"
                                onClick={() => onEdit(cliente)}
                                className="text-sm text-neutral-700 underline underline-offset-2"
                            >
                                Editar
                            </button>
                            <button
                                type="button"
                                onClick={() => onDelete(cliente)}
                                className="text-sm text-red-600 underline underline-offset-2"
                            >
                                Remover
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
