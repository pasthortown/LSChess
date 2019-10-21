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
          $game->start_fen = $result['start_fen'];
          $game->pgn = $result['pgn'];
          $game->save();
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
             'start_fen'=>$result['start_fen'],
             'pgn'=>$result['pgn'],
          ]);
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
             'start_fen'=>$result['start_fen'],
             'pgn'=>$result['pgn'],
           ]);
         } else {
          $game = new Game();
          $game->id = $result['id'];
          $game->id_player_white = $result['id_player_white'];
          $game->id_player_black = $result['id_player_black'];
          $game->start_time = $result['start_time'];
          $game->end_time = $result['end_time'];
          $game->start_fen = $result['start_fen'];
          $game->pgn = $result['pgn'];
          $game->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}