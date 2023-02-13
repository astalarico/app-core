<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Setting;
use App\Models\User;
class SettingSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        Setting::create([
            'google_maps_api_key' => env('GOOGLE_MAPS_API_KEY'),
            'app_api_tokens'      => serialize( array() ),
            'open_ai_key'         => env('OPEN_AI_KEY'),
            'app_name'            => 'App Database',
        
        ]);
    }
}
