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
use Orhanerday\OpenAi\OpenAi;
use RRule\RSet;

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
    Route::get('/data/init', function (Request $request) {

        // rrule string for every month on the 1st and 30th until 2023-12-31




        $open_ai_key = getSettings()->open_ai_key;
        $open_ai = new OpenAi($open_ai_key);
        $completion = $open_ai->completion([
            'model' => 'text-davinci-003',
            //'prompt' => "create an rrule string for event occurring $request->repeatingText starting $request->endDate until $request->endDate",
            'prompt' => "create an rrule string for an event occurring every month on the 1st and 30th until 2023-12-31",
            'temperature' => 0,
            'max_tokens' => 256,
            'frequency_penalty' => 0,
            'presence_penalty' => 0,
            'top_p' => 1,
        ]);

        $aiResponse = json_decode($completion, true);
        if ( ! array_key_exists( 'error', $aiResponse ) ) {
            info( $aiResponse );
            $rruleString = trim($aiResponse['choices'][0]['text']);

            $rruleStringData = str_replace('RRULE:', '', $aiResponse['choices'][0]['text']);
            $rruleArray = explode(';', trim($rruleStringData));
            // $rruleString = str_replace( 'RRULE:', '', $aiResponse['choices'][0]['text']);
            // $rruleString = str_replace( 'RRULE:', '', $aiResponse['choices'][0]['text']);
            $eventDateTime = new \DateTime('2022-12-01', new \DateTimeZone('UTC'));


            $ruleRuleArrayFiltered = array_filter($rruleArray, function ($item) {
                return !str_contains($item, 'EXDATE');
            });

            $excludeDatesArray = array_filter($rruleArray, function ($item) {
                return str_contains($item, 'EXDATE');
            });

            $rruleConfig = [];
            foreach ($ruleRuleArrayFiltered as $filtered) {
                $rruleClause = explode('=', $filtered);
                $rruleConfig[$rruleClause[0]] = $rruleClause[1];
            }

            $rruleConfig['DTSTART'] = $eventDateTime;
            $rset = new RSet();
            $rset->addRRule($rruleConfig);
   
            $excludeDatesExploded = [];
            if (count($excludeDatesArray) > 0) {
                foreach ($excludeDatesArray as $excludeDateString) {
                    $excludeDates = str_replace('EXDATE=', '', $excludeDateString);
                    $excludeDatesExploded = explode(',', $excludeDates);
                }
            }

            if( count($excludeDatesExploded) > 0 ){
                foreach ($excludeDatesExploded as $excludeDate) {
                    info( ( new \DateTime($excludeDate, new \DateTimeZone('UTC') ) )->format('Y-m-d') ) ;
                    $rset->addExDate(new \DateTime($excludeDate, new \DateTimeZone('UTC')));
                }
            }

            $occurrences = $rset->getOccurrences();

            foreach ($occurrences as $occurrence) {
                info($occurrence->format('Y-m-d H:i:s'));
            }
        } else {
            info( $aiResponse['error'] );
        }

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
