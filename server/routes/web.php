<?php

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
   return 'Web Wervice Realizado con LSCodeGenerator';
});

$router->group(['middleware' => []], function () use ($router) {
   $router->post('/login', ['uses' => 'AuthController@login']);
   $router->post('/register', ['uses' => 'AuthController@register']);
   $router->post('/password_recovery_request', ['uses' => 'AuthController@passwordRecoveryRequest']);
   $router->get('/password_recovery', ['uses' => 'AuthController@passwordRecovery']);
});

$router->group(['middleware' => ['auth']], function () use ($router) {
   $router->post('/user/password_change', ['uses' => 'AuthController@passwordChange']);


   //LSChess

   //CRUD ProfilePicture
   $router->post('/profilepicture', ['uses' => 'ProfilePictureController@post']);
   $router->get('/profilepicture', ['uses' => 'ProfilePictureController@get']);
   $router->get('/profilepicture/paginate', ['uses' => 'ProfilePictureController@paginate']);
   $router->put('/profilepicture', ['uses' => 'ProfilePictureController@put']);
   $router->delete('/profilepicture', ['uses' => 'ProfilePictureController@delete']);

   //CRUD User
   $router->post('/user', ['uses' => 'UserController@post']);
   $router->get('/user', ['uses' => 'UserController@get']);
   $router->get('/user/paginate', ['uses' => 'UserController@paginate']);
   $router->put('/user', ['uses' => 'UserController@put']);
   $router->delete('/user', ['uses' => 'UserController@delete']);

   //CRUD Game
   $router->post('/game', ['uses' => 'GameController@post']);
   $router->get('/game', ['uses' => 'GameController@get']);
   $router->get('/game/paginate', ['uses' => 'GameController@paginate']);
   $router->get('/game/backup', ['uses' => 'GameController@backup']);
   $router->put('/game', ['uses' => 'GameController@put']);
   $router->delete('/game', ['uses' => 'GameController@delete']);
   $router->post('/game/masive_load', ['uses' => 'GameController@masiveLoad']);

   //CRUD GameState
   $router->post('/gamestate', ['uses' => 'GameStateController@post']);
   $router->get('/gamestate', ['uses' => 'GameStateController@get']);
   $router->get('/gamestate/paginate', ['uses' => 'GameStateController@paginate']);
   $router->get('/gamestate/backup', ['uses' => 'GameStateController@backup']);
   $router->put('/gamestate', ['uses' => 'GameStateController@put']);
   $router->delete('/gamestate', ['uses' => 'GameStateController@delete']);
   $router->post('/gamestate/masive_load', ['uses' => 'GameStateController@masiveLoad']);

   //CRUD Move
   $router->post('/move', ['uses' => 'MoveController@post']);
   $router->get('/move', ['uses' => 'MoveController@get']);
   $router->get('/move/paginate', ['uses' => 'MoveController@paginate']);
   $router->get('/move/backup', ['uses' => 'MoveController@backup']);
   $router->put('/move', ['uses' => 'MoveController@put']);
   $router->delete('/move', ['uses' => 'MoveController@delete']);
   $router->post('/move/masive_load', ['uses' => 'MoveController@masiveLoad']);
});
