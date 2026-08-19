<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClienteRequest;
use App\Http\Requests\UpdateClienteRequest;
use App\Http\Resources\ClienteResource;
use App\Models\Cliente;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;

class ClienteController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $clientes = Cliente::with('endereco')->latest()->get();

        return ClienteResource::collection($clientes);
    }

    public function store(StoreClienteRequest $request): ClienteResource
    {
        $validated = $request->validated();

        $cliente = DB::transaction(function () use ($validated) {
            $cliente = Cliente::create([
                'nome' => $validated['nome'],
                'email' => $validated['email'],
            ]);

            $cliente->endereco()->create($validated['endereco']);

            return $cliente;
        });

        return ClienteResource::make($cliente->load('endereco'));
    }

    public function update(UpdateClienteRequest $request, Cliente $cliente): ClienteResource
    {
        $validated = $request->validated();

        DB::transaction(function () use ($cliente, $validated) {
            $cliente->update([
                'nome' => $validated['nome'],
                'email' => $validated['email'],
            ]);

            $cliente->endereco()->updateOrCreate([], $validated['endereco']);
        });

        return ClienteResource::make($cliente->refresh()->load('endereco'));
    }

    public function destroy(Cliente $cliente): Response
    {
        DB::transaction(function () use ($cliente) {
            $cliente->endereco()->delete();
            $cliente->delete();
        });

        return response()->noContent();
    }
}
