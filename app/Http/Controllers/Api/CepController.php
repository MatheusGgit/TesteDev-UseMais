<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\ViaCepService;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CepController extends Controller
{
    public function __construct(private readonly ViaCepService $viaCep) {}

    public function show(string $cep): JsonResponse
    {
        $validator = Validator::make(
            ['cep' => $cep],
            ['cep' => ['required', 'string', 'regex:/^\d{5}-?\d{3}$/']],
            ['cep.regex' => 'Informe um CEP válido', 'cep.required' => 'Informe um CEP válido'],
        );

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Informe um CEP válido',
                'errors' => $validator->errors(),
            ], 422);
        }

        try {
            $endereco = $this->viaCep->find($cep);
        } catch (ConnectionException $ce) {
            return response()->json(['message' => 'Serviço de CEP indisponível, tente novamente'], 503);
        }

        if ($endereco === null) {
            return response()->json(['message' => 'CEP não encontrado'], 404);
        }

        return response()->json(['data' => $endereco]);
    }
}
