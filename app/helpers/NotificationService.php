<?php
class NotificationService
{

    public static function newUser(User $user) {
        $data = array(
            'user' => $user,
        );
        
        if (Config::get('restful.mailgun')) {
            Mailgun::send('emails.new_user', $data, function ($message) use ($user) {
                $message->to($user->email, $user->fullName());
                $message->subject("Welcome to Consult Conduit");
                $message->from(Config::get('restful.emails.noreply'), Config::get('restful.name'));
            });

            Mailgun::send('emails.admin_new_user', $data, function ($message) use ($user) {
                $message->to("info@consultconduit.com", "info");
                $message->subject("New User: " . $user->fullName());
                $message->from(Config::get('restful.emails.noreply'), Config::get('restful.name'));
            });
        }
    }

    public static function userActivation(User $user) {
        $data = array(
            'user' => $user,
        );

        if (Config::get('restful.mailgun')) {
            Mailgun::send('emails.user_activation', $data, function ($message) use ($user) {
                $message->to($user->email, $user->fullName());
                $message->subject("Congratulation! Your account has been verified.");
                $message->from(Config::get('restful.emails.noreply'), Config::get('restful.name'));
            });
        }
    }
}

