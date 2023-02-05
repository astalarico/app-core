<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- app name -->
    <title>{{ config('app.name', 'Laravel') }}</title>
    <style>
        div.phpdebugbar .phpdebugbar-restore-btn {
            position: fixed;
            bottom: 0px;
            left: 96%;
        }
    </style>
    <!-- Fonts -->
    <link href="https://fonts.bunny.net/css2?family=Nunito:wght@400;600;700&display=swap" rel="stylesheet">
    @viteReactRefresh
    @vite(['resources/css/app.scss', 'resources/js/index.jsx'])
</head>

<body>
    <div id="md-events-db-root"></div>
</body>

</html>