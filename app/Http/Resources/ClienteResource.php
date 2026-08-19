<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    /**
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nome' => $this->nome,
            'email' => $this->email,
            'endereco' => [
                'cep' => $this->endereco?->cep,
                'logradouro' => $this->endereco?->logradouro,
                'numero' => $this->endereco?->numero,
                'complemento' => $this->endereco?->complemento,
                'bairro' => $this->endereco?->bairro,
                'cidade' => $this->endereco?->cidade,
                'uf' => $this->endereco?->uf,
            ],
            'created_at' => $this->created_at,
        ];
    }
}
