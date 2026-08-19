import { useEffect, useRef } from 'react';

export function ConfirmDialog({
    open,
    title,
    description,
    confirmLabel = 'Confirmar',
    busy = false,
    onConfirm,
    onCancel,
}: {
    open: boolean;
    title: string;
    description: string;
    confirmLabel?: string;
    busy?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        const dialog = dialogRef.current;

        if (!dialog) {
            return;
        }

        if (open && !dialog.open) {
            dialog.showModal();
        } else if (!open && dialog.open) {
            dialog.close();
        }
    }, [open]);

    return (
        <dialog
            ref={dialogRef}
            onCancel={(e) => {
                e.preventDefault();
                onCancel();
            }}
            onClose={onCancel}
            className="m-auto w-full max-w-sm rounded-lg border border-neutral-200 p-0 backdrop:bg-black/30"
        >
            <div className="flex flex-col gap-4 p-6">
                <h2 className="text-lg font-semibold">{title}</h2>
                <p className="text-sm text-neutral-600">{description}</p>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium"
                    >
                        Cancelar
                    </button>
                    <button
                        type="button"
                        disabled={busy}
                        onClick={onConfirm}
                        className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {busy ? 'Removendo...' : confirmLabel}
                    </button>
                </div>
            </div>
        </dialog>
    );
}
