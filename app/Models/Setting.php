<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;

class Setting extends Model
{
    use HasFactory;

    protected $guarded = [];
    protected $hidden = ['guid', 'created_at', 'updated_at'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->guid = Str::uuid();
        });
    }

    public static function getSettings()
    {
        $settings = Setting::orderBy('id', 'desc')->first();

        if( $settings ){
            $settings->app_api_tokens = unserialize( $settings->app_api_tokens );
        }else{

        }
    
        return $settings;
    }
}
