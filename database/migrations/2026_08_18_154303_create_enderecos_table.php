<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enderecos', function (Blueprint $table) {
            $table->id();

            $table->unsignedBigInteger('client_id')->unique();
            $table->string('cep', 9);
            $table->string('logradouro');
            $table->integer('numero');
            $table->string('complemento', 100)->nullable();
            $table->string('bairro', 100);
            $table->string('cidade');
            $table->string('uf', 2);

            $table->timestamps();

            $table->foreign('client_id')->references('id')->on('clientes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enderecos');
    }
};
