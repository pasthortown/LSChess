<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
Use Exception;
use App\ProfilePicture;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class ProfilePictureController extends Controller
{
    function get(Request $data)
    {
       $profilepicture = ProfilePicture::where('id_user', $data->auth->id)->first();
       if ($profilepicture) {
         return response()->json($profilepicture,200);
       }else {
         return response()->json(["error" => "Record not found."],400);
       }
    }

    function paginate(Request $data)
    {
       $size = $data['size'];
       return response()->json(ProfilePicture::paginate($size),200);
    }

    function post(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $profilepicture = new ProfilePicture();
          $profilepicture->file_type = $result['file_type'];
          $profilepicture->file_name = $result['file_name'];
          $profilepicture->file = $result['file'];
          $profilepicture->id_user = $data->auth->id;
          $profilepicture->save();
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($profilepicture,200);
    }

    function put(Request $data)
    {
       try{
          DB::beginTransaction();
          $result = $data->json()->all();
          $profilepicture = ProfilePicture::where('id',$result['id'])->update([
             'file_type'=>$result['file_type'],
             'file_name'=>$result['file_name'],
             'file'=>$result['file'],
          ]);
          DB::commit();
       } catch (Exception $e) {
          return response()->json($e,400);
       }
       return response()->json($profilepicture,200);
    }

    function delete(Request $data)
    {
       $result = $data->json()->all();
       $id = $result['id'];
       return ProfilePicture::destroy($id);
    }
}