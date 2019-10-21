<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class StockfishController extends Controller
{
    function get_best_move(Request $data)
    {
        $result = $data->json()->all();
        $descriptorspec = array(
            0 => array('pipe', 'r'),
            1 => array('pipe', 'w'),
        );
        $cwd = './';
        $other_options = array('bypass_shell' => 'true');
        $process = proc_open('stockfish', $descriptorspec, $pipes, $cwd, $other_options);
        $fen = $result['fen'];
        $thinking_time = $result['thinking_time'];
        if (is_resource($process)) {
            fwrite($pipes[0], "uci\n");
            fwrite($pipes[0], "ucinewgame\n");
            fwrite($pipes[0], "isready\n");
            fwrite($pipes[0], "position fen $fen\n");
            fwrite($pipes[0], "go movetime $thinking_time\n");
            $str="";
            while(true){
                usleep(100);
                $s = fgets($pipes[1],4096);
                $str .= $s;
                if(strpos(' '.$s,'bestmove')){
                    break;
                }
            }
        }
        fclose($pipes[0]);
        fclose($pipes[1]);
        proc_close($process);
        $bestmmove = explode(' ', $s)[1];
        if(strlen($bestmmove)==5) {
            $toReturn = ["from"=>$bestmmove[0].$bestmmove[1],"to"=>$bestmmove[2].$bestmmove[3], "promotion"=>$bestmmove[4]];
        } else {
            $toReturn = ["from"=>$bestmmove[0].$bestmmove[1],"to"=>$bestmmove[2].$bestmmove[3], "promotion"=>""];
        }
        return response()->json($toReturn,200);
    }
}