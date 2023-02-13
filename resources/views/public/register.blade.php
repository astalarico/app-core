<x-public-layout>
    <div class="h-full flex flex-col items-center justify-center">

        <div id="form-container" class="relative">
            {{-- <div id="errors-container" class="absolute top-1/2 right-full -translate-y-1/2 w-full">
                @foreach ($errors->all() as $error)
                    <div class="bg-red-600 text-white p-2 mb-2 rounded-md">{{ $error }}</div>
                @endforeach
            </div> --}}
            <img src="{{ getSettings()->app_logo }}" alt="" class="mb-14">
            <form action="{{ route('register') }}" method="POST" class="">
                @csrf
                <div class="flex flex-col mb-4">
                    <label for="email">Email</label>
                    <input type="email" name="email" id="email" class="form-control rounded-md">
                    @error('email')
                        <div class="text-red-500">{{ $message }}</div>
                    @enderror
                </div>
                <div class="flex flex-col mb-8">
                    <label for="password">Password</label>
                    <input type="password" name="password" id="password" class="!bg-white rounded-md">
                    @error('password')
                        <div class="text-red-500">{{ $message }}</div>
                    @enderror
                </div>
                <div class="flex flex-col mb-8">
                    <label for="password">Confirm Password</label>
                    <input type="password" name="password_confirmation" id="password_confirmation"
                        class="!bg-white rounded-md">
                </div>
                <div class="flex flex-col">
                    <button type="submit"
                        class="bg-[#CDEE2D] px-5 py-2 font-medium border border-b-4 border-r-4 border-black rounded-md">
                        Register
                    </button>
                </div>
            </form>
        </div>
    </div>
</x-public-layout>
