<?php

use App\Models\User;
use Laravel\Sanctum\Sanctum;

test('faz login com credenciais válidas e recebe um token', function () {
    $user = User::factory()->create(['password' => 'password']);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ]);

    $response->assertSuccessful();
    $response->assertJsonPath('data.user.email', $user->email);
    expect($response->json('data.token'))->toBeString()->not->toBeEmpty();
});

test('não faz login com senha incorreta', function () {
    $user = User::factory()->create(['password' => 'password']);

    $response = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'senha-errada',
    ]);

    $response->assertUnprocessable();
    $response->assertJsonPath('message', 'Credenciais inválidas');
});

test('não acessa rotas protegidas sem token', function () {
    $response = $this->getJson('/api/user');

    $response->assertUnauthorized();
});

test('acessa rotas protegidas com um token válido', function () {
    Sanctum::actingAs(User::factory()->create());

    $response = $this->getJson('/api/user');

    $response->assertSuccessful();
});

test('logout revoga o token usado na requisição', function () {
    $user = User::factory()->create(['password' => 'password']);

    $token = $this->postJson('/api/login', [
        'email' => $user->email,
        'password' => 'password',
    ])->json('data.token');

    expect($user->tokens()->count())->toBe(1);

    $this->withHeader('Authorization', "Bearer {$token}")
        ->postJson('/api/logout')
        ->assertNoContent();

    expect($user->tokens()->count())->toBe(0);
});
