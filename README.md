THIS IS NOT RUNNING CODE
==================
- APP (this is REST - LARAVEL server)
- FRONTEND (source code angular, template, css, image, ... )
- PUBLIC (front end after deploy will build main.min.js it contain all: angular core, app source, requirejs,...)

Laravel-with-angularjs
==================

* $http
* $rootScope
* taking the [AuthenticationService]
* creating a FlashService for displaying alerts to users
* access control for client-side routes with $rootScope and $routeProvider
* $httpProvider.responseInterceptors and logging out users automatically if serverside sessions expire
* $routeProvider.resolve property and making view rendering data dependent
* laravel 4 migrations, controllers, models, and authentication

Things you can expect to learn from **Security with Angular JS**:

* 3 common-sense ways to secure your web application
* angular.constant
* ng-init
* ng-sanitize
* Laravel CSRF support, route filters, and built in protection

## Requirements:

* [Laravel 4](http://four.laravel.com/)
* PHP 5.4 or higher
* MCrypt
* MySQL or SQLite
* [AngularJS 1.1.4](https://ajax.googleapis.com/ajax/libs/angularjs/1.1.4/angular.js)

## Prerequisite Installation Instructions:

Installing PHP 5.4 and MCrypt is the most tedious part of getting up and running with this example, but Laravel 4 is so nice that I think it's worth it. Here's the basic instructions for getting up on Mac OS X:

1. Install [Homebrew](http://mxcl.github.io/homebrew/)
2. Make sure you correct any problems that `brew doctor` detects
3. Install [Laravel 4](http://four.laravel.com/#install-laravel)
4. Tap the PHP keg from @josegonzalez: `brew tap josegonzalez/homebrew-php`
5. Install PHP 5.4 `brew install php54`
6. Install MCrypt `brew install php54-mcrypt` (this will automatically link the binary into the php.ini for you)
7. Install [Composer](http://getcomposer.org/) (think of it like homebrew, or npm, or apt-get, but for PHP modules)

## App Installation Instructions:

1. clone this repo: `git clone https://github.com/tailvh/twolevelretail.git`
2. install composer dependencies `composer install`
3. create a database called `laravelapp`
4. create your unique security key `php artisan key:generate`
5. run database migrations `php artisan migrate`
6. seed the database `php artisan db:seed`
7. run the app `php artisan serve`
8. browse to `http://localhost:8000`
9. 
Once you have the app up and running you can visit `http://localhost:8000`

Happy Coding! :)
