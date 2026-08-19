<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\Endereco;
use App\Support\Estados;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Endereco>
 */
class EnderecoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'client_id' => Cliente::factory(),
            'cep' => fake()->numerify('#####-###'),
            'logradouro' => fake()->streetName(),
            'numero' => fake()->numberBetween(1, 9999),
            'complemento' => fake()->optional()->secondaryAddress(),
            'bairro' => fake()->citySuffix(),
            'cidade' => fake()->city(),
            'uf' => fake()->randomElement(Estados::siglas()),
        ];
    }
}
