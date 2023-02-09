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
        $settings->getMedia('app_logo');

        $settings = convertNullToEmptyString($settings);

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
    public function update(Request $request, $id)
    {

        $settings = Setting::where("id", $id)->first();

        if ($request->hasFile('value')) {
            info($request->value);
            
            // delete existing app logo before processing the new one
            $settings->clearMediaCollection('app_logo');

            $originalName = $request->value->getClientOriginalName();
            $imagePath = $request->value->store('public/media');
            $fileName = substr($imagePath, strrpos($imagePath, '/') + 1);

            $settings
                ->addMedia(storage_path('app/public/media/' . $fileName))
                ->withCustomProperties(['fileName' => $originalName])
                ->toMediaCollection('app_logo');


            // $logoPath = $request['data']['featured_image']->store('public/media');
            // $fileName = substr($logoPath, strrpos($logoPath, '/') + 1);
            // $data['featured_image'] = $fileName;
        }

        $settings->update([
            $request->setting => $request->value
        ]);

        $settings = convertNullToEmptyString(Setting::getSettings());

        return response()->json($settings);
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
        } else {
            $tokens = unserialize($settings->app_api_tokens);
            $tokens[] = $tokenObj;
            $settings->app_api_tokens = serialize($tokens);
        }

        $settings->save();

        return response()->json(Setting::getSettings());
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
