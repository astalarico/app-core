<x-public-layout>

    <div class="h-full flex flex-col items-center justify-center">
        {{ session('status') }}
        @foreach ($errors->all() as $error)
            <div class="bg-red-600 text-white p-2 mb-6">{{ $error }}</div>
        @endforeach
        <form action="{{ route('login') }}" method="POST" class="">
            @csrf
            <div class="flex flex-col mb-4">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" class="form-control">
            </div>
            <div class="flex flex-col mb-8">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" class="!bg-white">
            </div>
            <div class="flex flex-col">
                <button type="submit"
                    class="bg-yellow-400 px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-md">
                    Login
                </button>
            </div>
        </form>
    </div>
</x-public-layout>
