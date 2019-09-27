<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Game;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GameController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Game::get(),200);
       } else {
          $game = Game::findOrFail($id);
          $attach = [];
          $moves_on_game = $game->Moves()->get();
          array_push($attach, ["moves_on_game"=>$moves_on_game]);
          return response()->json(["Game"=>$game, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Game::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $game = new Game();
          $lastGame = Game::orderBy('id')->get()->last();
          if($lastGame) {
             $game->id = $lastGame->id + 1;
          } else {
             $game->id = 1;
          }
          $game->id_player_white = $result['id_player_white'];
          $game->id_player_black = $result['id_player_black'];
          $game->start_time = $result['start_time'];
          $game->end_time = $result['end_time'];
          $game->start_position = $result['start_position'];
          $game->first_move = $result['first_move'];
          $game->game_state_id = $result['game_state_id'];
          $game->save();
          $moves_on_game = $result['moves_on_game'];
          foreach( $moves_on_game as $move) {
             $game->Moves()->attach($move['id']);
          }
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($game,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $game = Game::where('id',$result['id'])->update([
             'id_player_white'=>$result['id_player_white'],
             'id_player_black'=>$result['id_player_black'],
             'start_time'=>$result['start_time'],
             'end_time'=>$result['end_time'],
             'start_position'=>$result['start_position'],
             'first_move'=>$result['first_move'],
             'game_state_id'=>$result['game_state_id'],
          ]);
          $game = Game::where('id',$result['id'])->first();
          $moves_on_game = $result['moves_on_game'];
          $moves_on_game_old = $game->Moves()->get();
          foreach( $moves_on_game_old as $move_old ) {
             $delete = true;
             foreach( $moves_on_game as $move ) {
                if ( $move_old->id === $move['id'] ) {
                   $delete = false;
                }
             }
             if ( $delete ) {
                $game->Moves()->detach($move_old->id);
             }
          }
          foreach( $moves_on_game as $move ) {
             $add = true;
             foreach( $moves_on_game_old as $move_old) {
                if ( $move_old->id === $move['id'] ) {
                   $add = false;
                }
             }
             if ( $add ) {
                $game->Moves()->attach($move['id']);
             }
          }
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($game,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Game::destroy($id);
    }

    function backup(Request $data)
    {
       $games = Game::get();
       $toReturn = [];
       foreach( $games as $game) {
          $attach = [];
          $moves_on_game = $game->Moves()->get();
          array_push($attach, ["moves_on_game"=>$moves_on_game]);
          array_push($toReturn, ["Game"=>$game, "attach"=>$attach]);
       }
       return response()->json($toReturn,200);
    }

    function masiveLoad(Request $data)
    {
      $incomming = $data->json()->all();
      $masiveData = $incomming['data'];
      try{
       DB::beginTransaction();
       foreach($masiveData as $row) {
         $result = $row['Game'];
         $exist = Game::where('id',$result['id'])->first();
         if ($exist) {
           Game::where('id', $result['id'])->update([
             'id_player_white'=>$result['id_player_white'],
             'id_player_black'=>$result['id_player_black'],
             'start_time'=>$result['start_time'],
             'end_time'=>$result['end_time'],
             'start_position'=>$result['start_position'],
             'first_move'=>$result['first_move'],
             'game_state_id'=>$result['game_state_id'],
           ]);
         } else {
          $game = new Game();
          $game->id = $result['id'];
          $game->id_player_white = $result['id_player_white'];
          $game->id_player_black = $result['id_player_black'];
          $game->start_time = $result['start_time'];
          $game->end_time = $result['end_time'];
          $game->start_position = $result['start_position'];
          $game->first_move = $result['first_move'];
          $game->game_state_id = $result['game_state_id'];
          $game->save();
         }
         $game = Game::where('id',$result['id'])->first();
         $moves_on_game = [];
         foreach($row['attach'] as $attach){
            $moves_on_game = $attach['moves_on_game'];
         }
         $moves_on_game_old = $game->Moves()->get();
         foreach( $moves_on_game_old as $move_old ) {
            $delete = true;
            foreach( $moves_on_game as $move ) {
               if ( $move_old->id === $move['id'] ) {
                  $delete = false;
               }
            }
            if ( $delete ) {
               $game->Moves()->detach($move_old->id);
            }
         }
         foreach( $moves_on_game as $move ) {
            $add = true;
            foreach( $moves_on_game_old as $move_old) {
               if ( $move_old->id === $move['id'] ) {
                  $add = false;
               }
            }
            if ( $add ) {
               $game->Moves()->attach($move['id']);
            }
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}