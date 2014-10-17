<?php
// here we set the config data to use in controller
return array(
    'name' => 'Restful',
    'mailgun' => false,
    'emails' => array(
        'info' => 'info@restful.dev',
        'admin' => 'admin@restful.dev',
        'noreply' => 'noreply@restful.dev',
        'support' => 'support@restful.dev',
        'career' => 'career@restful.dev',
    ),
    'api' => array(
        'keys' => array(
            'hru8ud28emvr394jd'
        )
    ),
    'paths' => array(
        'profile_img' => public_path() . "/img/profile"
    ),
    'urls' => array(
        'profile_img' => asset('img/profile')
    ),
    'defaults' => array(
        'product' => array(
            'id' => 0
        ),
        'pagination' => array(
            'limit' => 20
        ),
        'user' => array(
            'status' => 'active'
        ),
        'group' => array(
            'name' => 'member'
        )
    )
);
