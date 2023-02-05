<x-public-layout>
    {{session('status')}}
    @foreach($errors->all() as $error)
        <div class="alert alert-danger">{{$error}}</div>
    @endforeach
    <form action="{{route('login')}}" method="POST">
        @csrf
        <div class="form-group">
            <label for="email">Email</label>
            <input type="email" name="email" id="email" class="form-control">
        </div>
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" name="password" id="password" class="form-control">
        </div>
        <div class="form-group">
            <button type="submit" class="btn btn-primary">Login</button>
        </div>
    </form>
</x-public-layout>