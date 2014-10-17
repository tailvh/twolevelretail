<?php

class AuthController extends BaseController {

  public function status() {    
    return Response::json(Auth::check());
  }

  public function secrets() {
    if(Auth::check()) {
      return 'You are logged in, here are secrets.';
    } else {
      return 'You aint logged in, no secrets for you.';
    }
  }

  public function login()
  {
    // change from MD5 to bcrypt
    $userEmail = Input::json('email'); 
    $user = User::where('email', 'like', $userEmail)->get();  
    if(!empty($user)) {
      $user = $user[0];
      if(!$user->changed) {
        // check if MD5 ok 
        if($user->email === Input::json('email') && $user->password === md5(Input::json('password'))) {
          $user->password = Hash::make(Input::json('password'));
          $user->changed = 1;
          $user->save();
        }
      }
    }    
    
    if(Auth::attempt(array('email' => Input::json('email'), 'password' => Input::json('password')), true))
    {       
      $authUser = Auth::user();
      return Response::json(array('success' => true, 'user' => $authUser->toArray()));
    } else {
      return Response::json(array('success' => false, 'flash' => 'Invalid username or password'), 500);
    }
  }

  public function logout()
  {
    Auth::logout();
    return Response::json(array('flash' => 'Logged Out!'));
  }

  public function token()
  {
    return csrf_token();
  }
}