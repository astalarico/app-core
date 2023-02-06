<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;


class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {

        //organization::create(['name' => 'test'] );
        $this->call([
            RoleAndPermissionSeeder::class,
            UserSeeder::class,
            SettingSeeder::class,
        ]);
    }
}
