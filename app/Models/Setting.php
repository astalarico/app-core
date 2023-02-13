<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;

class Setting extends Model implements HasMedia
{
    use HasFactory, interactsWithMedia;

    protected $guarded = [];
    protected $hidden = ['guid', 'created_at', 'updated_at'];

    protected static function booted()
    {
        static::creating(function ($model) {
            $model->guid = Str::uuid();
        });
    }

    public function adminContact(){
        return $this->hasOne(User::class, 'admin_contact');
    }
    
    public static function getSettings()
    {
        $settings = Setting::orderBy('id', 'desc')->first();

        if( $settings ){
            $settings->app_api_tokens = unserialize( $settings->app_api_tokens );
            $settings->app_logo = $settings->getFirstMediaUrl('app_logo') ? url('/') . $settings->getFirstMediaUrl('app_logo') : null;
        }
    
        return $settings;
    }
}
