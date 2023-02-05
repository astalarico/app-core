<x-public-layout>
    {{session('status')}}
    @foreach($errors->all() as $error)
    <div class="alert alert-danger">{{$error}}</div>
    @endforeach
    <form action="{{route('register')}}" method="POST">
        @csrf
        <div class="form-group">
            <label for="first_name"> First Name</label>
            <input type="text" name="first_name" id="first_name" class="form-control">
        </div>
        <div class="form-group">
            <label for="last_name"> Last Name</label>
            <input type="text" name="last_name" id="last_name" class="form-control">
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" class="form-control">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" class="form-control">
        </div>
        <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" name="password_confirmation" id="password_confirmation" class="form-control">
        <div class="form-group">
            <button type="submit" class="btn btn-primary">Register</button>
        </div>
    </form>
</x-public-layout>