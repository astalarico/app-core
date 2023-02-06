<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSettingRequest;
use App\Http\Requests\UpdateSettingRequest;
use App\Models\Setting;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

class SettingController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $settings = Setting::orderBy('id', 'desc')->first();
        $settings->app_api_tokens = unserialize($settings->app_api_tokens);
        return response()->json($settings);
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSettingRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSettingRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function show(Setting $setting)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function edit(Setting $setting)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSettingRequest  $request
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Setting $setting)
    {
        $settings = Setting::where( "id", $request->id )->first();
        info( $settings );

    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Setting  $setting
     * @return \Illuminate\Http\Response
     */
    public function destroy(Setting $setting)
    {
        
    }

    public function createApiToken(Request $request)
    {
        $token = $request->user()->createToken('API Token');
        $settings = Setting::orderBy('id', 'desc')->first();
        $tokenObj = ["id" => $token->accessToken->id, 'bearer' => $token->plainTextToken];
        if (!$settings) {
            $settings = new Setting();
            $settings->app_api_tokens = serialize($tokenObj);
            $settings->save();
        } else {
            $tokens = unserialize($settings->app_api_tokens);
            info( $tokens );
            $tokens[] = $tokenObj;
            $settings->app_api_tokens = serialize($tokens);
            $settings->save();
        }


        return response()->json( Setting::getSettings() );
    }

    public function revokeApiToken(Request $request)
    {

        $token = PersonalAccessToken::find($request->token['id']);
        $token->delete();

        $settings = Setting::getSettings();
        $bearerTokens =  $settings->app_api_tokens;
        $filteredBearerTokens = array_filter($bearerTokens, function ($bearerToken) use ($request) {
            return $bearerToken['id'] != $request->token['id'];
        });

        $settings->app_api_tokens = serialize($filteredBearerTokens);
        $settings->save();

        return response()->json(
            Setting::getSettings()
        );
    }
}
