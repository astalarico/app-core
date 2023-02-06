<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Setting;
use Laravel\Sanctum\PersonalAccessToken;

class SettingsController extends Controller
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
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        //
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
