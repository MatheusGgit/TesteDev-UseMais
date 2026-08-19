<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

final class ViaCepService
{
    /**
     * @return array{cep: string, logradouro: string, complemento: string, bairro: string, cidade: string, uf: string}|null
     */
    public function find(string $cep): ?array
    {
        $cep = preg_replace('/\D/', '', $cep) ?? '';

        if (strlen($cep) !== 8) {
            throw new \InvalidArgumentException('CEP deve conter 8 dígitos.');
        }

        return Cache::remember("viacep:{$cep}", now()->addDays(30), fn () => $this->fetch($cep));
    }

    /**
     * @return array{cep: string, logradouro: string, complemento: string, bairro: string, cidade: string, uf: string}|null
     */
    private function fetch(string $cep): ?array
    {
        $payload = Http::baseUrl(config('services.viacep.base_url'))
            ->timeout(5)
            ->connectTimeout(3)
            ->retry(2, 200)
            ->get("/{$cep}/json/")
            ->throw()
            ->json();

        if (($payload['erro'] ?? false) === true) {
            return null;
        }

        return [
            'cep' => $payload['cep'],
            'logradouro' => $payload['logradouro'],
            'complemento' => $payload['complemento'],
            'bairro' => $payload['bairro'],
            'cidade' => $payload['localidade'],
            'uf' => $payload['uf'],
        ];
    }
}
