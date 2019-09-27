<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\Move;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class MoveController extends Controller
{
    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(Move::get(),200);
       } else {
          $move = Move::findOrFail($id);
          $attach = [];
          return response()->json(["Move"=>$move, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(Move::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $move = new Move();
          $lastMove = Move::orderBy('id')->get()->last();
          if($lastMove) {
             $move->id = $lastMove->id + 1;
          } else {
             $move->id = 1;
          }
          $move->from = $result['from'];
          $move->to = $result['to'];
          $move->moment = $result['moment'];
          $move->pgn = $result['pgn'];
          $move->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($move,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $move = Move::where('id',$result['id'])->update([
             'from'=>$result['from'],
             'to'=>$result['to'],
             'moment'=>$result['moment'],
             'pgn'=>$result['pgn'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($move,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return Move::destroy($id);
    }

    function backup(Request $data)
    {
       $moves = Move::get();
       $toReturn = [];
       foreach( $moves as $move) {
          $attach = [];
          array_push($toReturn, ["Move"=>$move, "attach"=>$attach]);
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
         $result = $row['Move'];
         $exist = Move::where('id',$result['id'])->first();
         if ($exist) {
           Move::where('id', $result['id'])->update([
             'from'=>$result['from'],
             'to'=>$result['to'],
             'moment'=>$result['moment'],
             'pgn'=>$result['pgn'],
           ]);
         } else {
          $move = new Move();
          $move->id = $result['id'];
          $move->from = $result['from'];
          $move->to = $result['to'];
          $move->moment = $result['moment'];
          $move->pgn = $result['pgn'];
          $move->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}