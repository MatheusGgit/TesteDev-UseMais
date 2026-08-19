<?php

namespace App\Http\Requests;

use App\Support\Estados;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateClienteRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'nome.required' => 'O campo nome é obrigatório',
            'nome.string' => 'O campo nome deve conter apenas texto',
            'nome.max' => 'O campo nome deve ter no máximo de 255 caracteres',

            'email.required' => 'O campo email é obrigatório',
            'email.email' => 'Informe um email válido',
            'email.max' => 'O campo email deve ter no máximo de 255 caracteres',
            'email.unique' => 'Um cliente com este email já foi cadastrado',

            'endereco.required' => 'O endereço é obrigatório',
            'endereco.array' => 'O endereço informado é inválido',

            'endereco.cep.required' => 'O campo CEP é obrigatório',
            'endereco.cep.regex' => 'Informe um CEP válido',

            'endereco.logradouro.required' => 'O campo logradouro é obrigatório',
            'endereco.logradouro.max' => 'O campo logradouro deve ter no máximo de 255 caracteres',

            'endereco.numero.required' => 'O campo número é obrigatório',
            'endereco.numero.integer' => 'O campo número deve ser um número inteiro',

            'endereco.complemento.max' => 'O campo complemento deve ter no máximo de 100 caracteres',

            'endereco.bairro.required' => 'O campo bairro é obrigatório',
            'endereco.bairro.max' => 'O campo bairro deve ter no máximo de 100 caracteres',

            'endereco.cidade.required' => 'O campo cidade é obrigatório',
            'endereco.cidade.max' => 'O campo cidade deve ter no máximo de 255 caracteres',

            'endereco.uf.required' => 'O campo UF é obrigatório',
            'endereco.uf.size' => 'O campo UF deve ter 2 caracteres',
            'endereco.uf.in' => 'Selecione uma UF válida',
        ];
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'nome' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('clientes', 'email')->ignore($this->route('cliente'))],

            'endereco' => ['required', 'array'],
            'endereco.cep' => ['required', 'string', 'regex:/^\d{5}-?\d{3}$/'],
            'endereco.logradouro' => ['required', 'string', 'max:255'],
            'endereco.numero' => ['required', 'integer'],
            'endereco.complemento' => ['nullable', 'string', 'max:100'],
            'endereco.bairro' => ['required', 'string', 'max:100'],
            'endereco.cidade' => ['required', 'string', 'max:255'],
            'endereco.uf' => ['required', 'string', 'size:2', Rule::in(Estados::siglas())],
        ];
    }
}
