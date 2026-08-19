<?php

namespace App\Support;

use Illuminate\Support\Facades\File;

final class Estados
{
    /**
     * @var array<int, array{sigla: string, nome: string}>|null
     */
    private static ?array $estados = null;

    /**
     * @return array<int, array{sigla: string, nome: string}>
     */
    public static function all(): array
    {
        if (self::$estados === null) {
            self::$estados = json_decode(File::get(resource_path('js/data/estados.json')), true);
        }

        return self::$estados;
    }

    /**
     * @return array<int, string>
     */
    public static function siglas(): array
    {
        return array_column(self::all(), 'sigla');
    }
}
