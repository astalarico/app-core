<x-public-layout>
    <div class="h-full flex flex-col items-center justify-center">
        @foreach ($errors->all() as $error)
            <div class="bg-red-600 text-white p-2 mb-6">{{ $error }}</div>
        @endforeach
        <div id="form-container">
            <img src="{{ getSettings()->app_logo }}" alt="" class="mb-14">
            <form action="{{ route('login') }}" method="POST" class="">
                @csrf
                <div class="flex flex-col mb-4">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-control rounded-md">
                </div>
                <div class="flex flex-col mb-8">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" class="!bg-white rounded-md">
                </div>
                <div class="flex flex-col">
                    <button type="submit"
                        class="bg-[#CDEE2D] px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-md">
                        Login
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-public-layout>
