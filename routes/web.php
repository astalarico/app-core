<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePassword;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RegisteredUserController;
use Illuminate\Http\Request;
use App\Http\Controllers\SettingController;
use Laravel\Sanctum\PersonalAccessToken;
use App\Models\Setting;
use App\Models\User;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
Route::middleware('guest')->group(function () {

    // splash page
    Route::get('/', function () {
        return view('welcome');
    }); 

    // login page
    Route::get('/login', [AuthenticatedSessionController::class, 'create'])
                    ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    // register page
    Route::get('/register', [RegisteredUserController::class, 'create'])
                    ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);
    // forgot password route

    // reset password route

    // verify email route

});

Route::middleware('auth')->group(function () {
    Route::get('/admin/{any?}', fn () => view('admin'))->where('any', '.*')->name('admin');
    Route::get('/logout', [AuthenticatedSessionController::class, 'destroy'])->name('logout');

    // Data routes
    Route::get('/data/init', function(Request $request){
        $user = $request->user();
        $user->roles = $user->roles()->get()->pluck('name');

        $settings = Setting::getSettings();
  
        return response()->json([
            'user' => $user,
            'settings' => $settings,
            'appUrl' => url('/'),
            'users' => User::all(),
        ]);
    });

    // Data routes
    Route::resource('/data/users', UserController::class);
    Route::get('/data/settings', [SettingController::class, 'index']);
    Route::put('/data/settings/{id?}', [SettingController::class, 'update']);
    Route::get('/data/create-api-token', [SettingController::class, 'createApiToken']);
    Route::post('/data/revoke-api-token', [SettingController::class, 'revokeApiToken']);
    Route::get('/data/dashboard', [DashboardController::class, 'index']);
});
