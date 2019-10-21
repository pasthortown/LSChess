<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\BestMove; 
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class BestMoveController extends Controller
{
    function find(Request $data)
    {
      $result = $data->json()->all();
      return response()->json(BestMove::select('response')->where('current_position', $result['current_position'])->get(),200);
    }

    function get(Request $data)
    {
       $id = $data['id'];
       if ($id == null) {
          return response()->json(BestMove::get(),200);
       } else {
          $bestmove = BestMove::findOrFail($id);
          $attach = [];
          return response()->json(["BestMove"=>$bestmove, "attach"=>$attach],200);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(BestMove::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $bestmove = new BestMove();
          $lastBestMove = BestMove::orderBy('id')->get()->last();
          if($lastBestMove) {
             $bestmove->id = $lastBestMove->id + 1;
          } else {
             $bestmove->id = 1;
          }
          $bestmove->current_position = $result['current_position'];
          $bestmove->response = $result['response'];
          $bestmove->from = $result['from'];
          $bestmove->to = $result['to'];
          $bestmove->is__best = $result['is__best'];
          $bestmove->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($bestmove,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $bestmove = BestMove::where('id',$result['id'])->update([
             'current_position'=>$result['current_position'],
             'response'=>$result['response'],
             'from'=>$result['from'],
             'to'=>$result['to'],
             'is__best'=>$result['is__best'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($bestmove,200);
    }

    function delete(Request $data)
    {
       $id = $data['id'];
       return BestMove::destroy($id);
    }

    function backup(Request $data)
    {
       $bestmoves = BestMove::get();
       $toReturn = [];
       foreach( $bestmoves as $bestmove) {
          $attach = [];
          array_push($toReturn, ["BestMove"=>$bestmove, "attach"=>$attach]);
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
         $result = $row['BestMove'];
         $exist = BestMove::where('id',$result['id'])->first();
         if ($exist) {
           BestMove::where('id', $result['id'])->update([
             'current_position'=>$result['current_position'],
             'response'=>$result['response'],
             'from'=>$result['from'],
             'to'=>$result['to'],
             'is__best'=>$result['is__best'],
           ]);
         } else {
          $bestmove = new BestMove();
          $bestmove->id = $result['id'];
          $bestmove->current_position = $result['current_position'];
          $bestmove->response = $result['response'];
          $bestmove->from = $result['from'];
          $bestmove->to = $result['to'];
          $bestmove->is__best = $result['is__best'];
          $bestmove->save();
         }
       }
       DB::commit();
      } catch (Exception $e) {
         return response()->json($e,400);
      }
      return response()->json('Task Complete',200);
    }
}