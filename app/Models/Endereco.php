<?php

namespace App\Models;

use Database\Factories\EnderecoFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Endereco extends Model
{
    /** @use HasFactory<EnderecoFactory> */
    use HasFactory;

    protected $table = 'enderecos';

    protected $fillable = [
        'client_id',
        'cep',
        'logradouro',
        'numero',
        'complemento',
        'bairro',
        'cidade',
        'uf',
    ];

    public function cliente(): BelongsTo
    {
        return $this->belongsTo(Cliente::class, 'client_id');
    }
}
