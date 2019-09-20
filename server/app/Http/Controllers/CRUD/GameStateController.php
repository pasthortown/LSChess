<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\GameState;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class GameStateController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(GameState::get(),200);
       } else {
          $gamestate = GameState::findOrFail($id);
          $attach = [];
          return response()->json(["GameState"=>$gamestate, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(GameState::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $gamestate = new GameState();
          $lastGameState = GameState::orderBy('id')->get()->last();
          if($lastGameState) {
             $gamestate->id = $lastGameState->id + 1;
          } else {
             $gamestate->id = 1;
          }
          $gamestate->description = $result['description'];
          $gamestate->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($gamestate,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $gamestate = GameState::where('id',$result['id'])->update([
             'description'=>$result['description'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($gamestate,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return GameState::destroy($id);
    }

    function backup(Request $data)
    {
       $gamestates = GameState::get();
       $toReturn = [];
       foreach( $gamestates as $gamestate) {
          $attach = [];
          array_push($toReturn, ["GameState"=>$gamestate, "attach"=>$attach]);
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
         $result = $row['GameState'];
         $exist = GameState::where('id',$result['id'])->first();
         if ($exist) {
           GameState::where('id', $result['id'])->update([
             'description'=>$result['description'],
           ]);
         } else {
          $gamestate = new GameState();
          $gamestate->id = $result['id'];
          $gamestate->description = $result['description'];
          $gamestate->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}