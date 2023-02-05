<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\App;
use Illuminate\Database\Seeder;
use App\Models\User;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        info( env('ADMIN_USER_FIRST_NAME') );
        $user = User::create([
            'first_name'     => env('ADMIN_USER_FIRST_NAME'),
            'last_name'     => env('ADMIN_USER_LAST_NAME'),
            'email'    => env('ADMIN_USER_EMAIL'),
            'password' => bcrypt(env('ADMIN_USER_PASSWORD')),
        ]);

      
        $user->assignrole('administrator');
         
    }
}
