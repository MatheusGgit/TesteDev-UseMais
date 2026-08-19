<?php

use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

test('busca um cep válido na viacep', function () {
    Http::fake([
        'viacep.com.br/*' => Http::response([
            'cep' => '01310-100',
            'logradouro' => 'Avenida Paulista',
            'complemento' => '',
            'bairro' => 'Bela Vista',
            'localidade' => 'São Paulo',
            'uf' => 'SP',
        ]),
    ]);

    $response = $this->getJson('/api/cep/01310100');

    $response->assertSuccessful();
    $response->assertJsonPath('data.cep', '01310-100');
    $response->assertJsonPath('data.logradouro', 'Avenida Paulista');
    $response->assertJsonPath('data.cidade', 'São Paulo');
    $response->assertJsonPath('data.uf', 'SP');
});

test('retorna 404 quando o cep não existe', function () {
    Http::fake([
        'viacep.com.br/*' => Http::response(['erro' => true]),
    ]);

    $response = $this->getJson('/api/cep/00000000');

    $response->assertNotFound();
});

test('retorna 422 para cep com formato inválido sem chamar a viacep', function () {
    Http::fake();

    $response = $this->getJson('/api/cep/abc');

    $response->assertUnprocessable();
    Http::assertNothingSent();
});

test('cacheia a consulta e não chama a viacep de novo pro mesmo cep', function () {
    Http::fake([
        'viacep.com.br/*' => Http::response([
            'cep' => '01310-100',
            'logradouro' => 'Avenida Paulista',
            'complemento' => '',
            'bairro' => 'Bela Vista',
            'localidade' => 'São Paulo',
            'uf' => 'SP',
        ]),
    ]);

    $this->getJson('/api/cep/01310100')->assertSuccessful();
    $this->getJson('/api/cep/01310-100')->assertSuccessful();

    Http::assertSentCount(1);
});

test('retorna 503 quando a viacep está indisponível', function () {
    Http::fake(function () {
        throw new ConnectionException('timeout');
    });

    $response = $this->getJson('/api/cep/01310100');

    $response->assertStatus(503);
});
