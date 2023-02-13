<?php
use App\Models\Setting;

if ( !function_exists('convertNullToEmptyString') ) {

    function convertNullToEmptyString($model)
    {
        $attributes = $model->getAttributes();

        foreach( $attributes as $key => $value ) {
            if( is_null($value) ) {
                $model->$key = '';
            }
        }

        return $model;
    }
}

if( ! function_exists('getSettings') ){
    
        function getSettings()
        {
           return Setting::getSettings();
        }
}