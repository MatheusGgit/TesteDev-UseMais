<?php

use App\Models\Cliente;
use App\Models\Endereco;
use App\Models\User;
use Laravel\Sanctum\Sanctum;

beforeEach(function () {
    Sanctum::actingAs(User::factory()->create());
});

test('lista os clientes cadastrados com o endereço', function () {
    $cliente = Cliente::factory()
        ->has(Endereco::factory(), 'endereco')
        ->create();

    $response = $this->getJson('/api/clientes');

    $response->assertSuccessful();
    $response->assertJsonPath('data.0.id', $cliente->id);
    $response->assertJsonPath('data.0.nome', $cliente->nome);
    $response->assertJsonPath('data.0.endereco.cep', $cliente->endereco->cep);
});

test('cadastra um cliente com endereço', function () {
    $payload = [
        'nome' => 'Maria Silva',
        'email' => 'maria@example.com',
        'endereco' => [
            'cep' => '01310-100',
            'logradouro' => 'Avenida Paulista',
            'numero' => 1000,
            'complemento' => 'Sala 1',
            'bairro' => 'Bela Vista',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
        ],
    ];

    $response = $this->postJson('/api/clientes', $payload);

    $response->assertSuccessful();
    $response->assertJsonPath('data.nome', 'Maria Silva');
    $response->assertJsonPath('data.endereco.cep', '01310-100');

    $this->assertDatabaseHas('clientes', [
        'nome' => 'Maria Silva',
        'email' => 'maria@example.com',
    ]);

    $this->assertDatabaseHas('enderecos', [
        'cep' => '01310-100',
        'logradouro' => 'Avenida Paulista',
    ]);
});

test('não cadastra cliente com email duplicado', function () {
    Cliente::factory()->create(['email' => 'duplicado@example.com']);

    $response = $this->postJson('/api/clientes', [
        'nome' => 'Outro Nome',
        'email' => 'duplicado@example.com',
        'endereco' => [
            'cep' => '01310-100',
            'logradouro' => 'Avenida Paulista',
            'numero' => 1000,
            'bairro' => 'Bela Vista',
            'cidade' => 'São Paulo',
            'uf' => 'SP',
        ],
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('email');
});

test('não cadastra cliente sem os campos obrigatórios do endereço', function () {
    $response = $this->postJson('/api/clientes', [
        'nome' => 'Maria Silva',
        'email' => 'maria@example.com',
        'endereco' => [],
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors([
        'endereco.cep',
        'endereco.logradouro',
        'endereco.numero',
        'endereco.bairro',
        'endereco.cidade',
        'endereco.uf',
    ]);
});

test('não cadastra cliente com UF que não existe no Brasil', function () {
    $response = $this->postJson('/api/clientes', [
        'nome' => 'Maria Silva',
        'email' => 'maria@example.com',
        'endereco' => [
            'cep' => '01310-100',
            'logradouro' => 'Avenida Paulista',
            'numero' => 1000,
            'bairro' => 'Bela Vista',
            'cidade' => 'São Paulo',
            'uf' => 'XX',
        ],
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('endereco.uf');
});

test('atualiza um cliente e seu endereço', function () {
    $cliente = Cliente::factory()
        ->has(Endereco::factory(), 'endereco')
        ->create();

    $response = $this->putJson("/api/clientes/{$cliente->id}", [
        'nome' => 'Nome Atualizado',
        'email' => 'atualizado@example.com',
        'endereco' => [
            'cep' => '20040-020',
            'logradouro' => 'Rua Atualizada',
            'numero' => 42,
            'complemento' => null,
            'bairro' => 'Centro',
            'cidade' => 'Rio de Janeiro',
            'uf' => 'RJ',
        ],
    ]);

    $response->assertSuccessful();
    $response->assertJsonPath('data.nome', 'Nome Atualizado');
    $response->assertJsonPath('data.endereco.cep', '20040-020');

    $this->assertDatabaseHas('clientes', [
        'id' => $cliente->id,
        'nome' => 'Nome Atualizado',
        'email' => 'atualizado@example.com',
    ]);

    $this->assertDatabaseHas('enderecos', [
        'client_id' => $cliente->id,
        'cep' => '20040-020',
        'logradouro' => 'Rua Atualizada',
    ]);

    expect(Endereco::where('client_id', $cliente->id)->count())->toBe(1);
});

test('não atualiza cliente com email de outro cliente', function () {
    Cliente::factory()->create(['email' => 'existente@example.com']);
    $cliente = Cliente::factory()->has(Endereco::factory(), 'endereco')->create();

    $response = $this->putJson("/api/clientes/{$cliente->id}", [
        'nome' => $cliente->nome,
        'email' => 'existente@example.com',
        'endereco' => $cliente->endereco->only(['cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf']),
    ]);

    $response->assertUnprocessable();
    $response->assertJsonValidationErrors('email');
});

test('mantém o próprio email ao atualizar um cliente', function () {
    $cliente = Cliente::factory()->has(Endereco::factory(), 'endereco')->create();

    $response = $this->putJson("/api/clientes/{$cliente->id}", [
        'nome' => 'Novo Nome',
        'email' => $cliente->email,
        'endereco' => $cliente->endereco->only(['cep', 'logradouro', 'numero', 'complemento', 'bairro', 'cidade', 'uf']),
    ]);

    $response->assertSuccessful();
});

test('remove um cliente e seu endereço', function () {
    $cliente = Cliente::factory()
        ->has(Endereco::factory(), 'endereco')
        ->create();

    $response = $this->deleteJson("/api/clientes/{$cliente->id}");

    $response->assertNoContent();

    $this->assertDatabaseMissing('clientes', ['id' => $cliente->id]);
    $this->assertDatabaseMissing('enderecos', ['client_id' => $cliente->id]);
});
