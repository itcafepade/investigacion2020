<?php

namespace App\Http\Controllers;

use App\Record;
use App\Station;
use App\Notification;
use Illuminate\Http\Request;
use DB;
use MongoDB\BSON\Decimal128;

class RecordController extends Controller
{
    public function add(Request $request)
    {
        try {
            $record = new Record();
            $record->id = $request->id;

            if (isset($request->humidity)) {
                $record->humidity = new Decimal128($request->humidity);
            }
            if (isset($request->temperature)) {
                $record->temperature = new Decimal128($request->temperature);
            }
            if (isset($request->radiation)) {
                $record->radiation = new Decimal128($request->radiation);
            }
            if (isset($request->ph)) {
                $record->ph = new Decimal128($request->ph);
            }
            if (isset($request->oxigen)) {
                $record->oxigen = new Decimal128($request->oxigen);
            }

            $record->updated_at = date("Y-m-d h:i:s A", time());
            $record->created_at = date("Y-m-d h:i:s A", time());
            $record->save();

            $notification = new Notification();
            $notification->id = $request->id;

            if (isset($request->humidity)) {
                $notification->humidity = strval($request->humidity);
            }
            if (isset($request->temperature)) {
                $notification->temperature = strval($request->temperature);
            }
            if (isset($request->radiation)) {
                $notification->radiation = strval($request->radiation);
            }
            if (isset($request->ph)) {
                $notification->ph = strval($request->ph);
            }
            if (isset($request->oxigen)) {
                $notification->oxigen = strval($request->oxigen);
            }
            $notification->updated_at = date("Y-m-d h:i:s A", time());
            $notification->created_at = date("Y-m-d h:i:s A", time());
            $not = new NotificationController();
            $not->add($notification);

            return response()->json(['message'=>'success']);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'failed: '.$th]);
        }
    }

    public function get($id)
    {
        try {
            $records = DB::table('record')->where(['id'=>$id])->get();
            $station = DB::table('station')->where(['id'=>$id])->get();

            $stations = array();
            $recs = array();

            foreach ($station as $st) {
                $station = new Station();
                $station->title = $st['title'];
                $station->id = $st['id'];
                $station->description = $st['description'];
                $station->photo = $st['photo'];
                $station->created_at = $st['created_at'];

                foreach ($records as $r) {
                    $rec = new Record();
                    $rec->created_at = $r['created_at'];

                    if (isset($st['humidity'])) {
                        $station->humidity = strval($st['humidity']);
                        $station->humidityM = strval($st['humidityM']);
                        $rec->humidity = strval($r['humidity']);
                    }
                    if (isset($st['temperature'])) {
                        $station->temperature = strval($st['temperature']);
                        $station->temperatureM = strval($st['temperatureM']);
                        $rec->temperature = strval($r['temperature']);
                    }
                    if (isset($st['radiation'])) {
                        $station->radiation = strval($st['radiation']);
                        $station->radiationM = strval($st['radiationM']);
                        $rec->radiation = strval($r['radiation']);
                    }
                    if (isset($st['ph'])) {
                        $station->ph = strval($st['ph']);
                        $station->phM = strval($st['phM']);
                        $rec->ph = strval($r['ph']);
                    }
                    if (isset($st['oxigen'])) {
                        $station->oxigen = strval($st['oxigen']);
                        $station->oxigenM = strval($st['oxigenM']);
                        $rec->oxigen = strval($r['oxigen']);
                    }
                    array_push($stations, $station);
                    array_push($recs, $rec);
                }
            }
            return response()
                   ->json([
                       'message'=>'success',
                       'records'=>$recs,
                       'station'=>$stations
                    ]);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'failed']);
        }
    }

    public function filterRecords(Request $request)
    {
        try {
            $start = $request->start;
            $end = $request->end;
            //$start = date("Y/m/d", strtotime($request->start));
            //$end = date("Y/m/d", strtotime($request->end));
            $id = $request->id;
            $records = DB::table('record')->where(['id'=>$id])->whereBetween('created_at', [$start, $end])->get();

            $recs = array();
            $station = DB::table('station')->where(['id'=>$id])->get();

            $stations = array();
            $recs = array();

            foreach ($station as $st) {
                $station = new Station();
                $station->title = $st['title'];
                $station->id = $st['id'];
                $station->description = $st['description'];
                $station->photo = $st['photo'];
                $station->created_at = $st['created_at'];

                foreach ($records as $r) {
                    $rec = new Record();
                    $rec->created_at = $r['created_at'];

                    if (isset($st['humidity'])) {
                        $station->humidity = strval($st['humidity']);
                        $station->humidityM = strval($st['humidityM']);
                        $rec->humidity = strval($r['humidity']);
                    }
                    if (isset($st['temperature'])) {
                        $station->temperature = strval($st['temperature']);
                        $station->temperatureM = strval($st['temperatureM']);
                        $rec->temperature = strval($r['temperature']);
                    }
                    if (isset($st['radiation'])) {
                        $station->radiation = strval($st['radiation']);
                        $station->radiationM = strval($st['radiationM']);
                        $rec->radiation = strval($r['radiation']);
                    }
                    if (isset($st['ph'])) {
                        $station->ph = strval($st['ph']);
                        $station->phM = strval($st['phM']);
                        $rec->ph = strval($r['ph']);
                    }
                    if (isset($st['oxigen'])) {
                        $station->oxigen = strval($st['oxigen']);
                        $station->oxigenM = strval($st['oxigenM']);
                        $rec->oxigen = strval($r['oxigen']);
                    }
                    array_push($stations, $station);
                    array_push($recs, $rec);
                }
            }
            return response()
                   ->json([
                       'message'=>'success',
                       'records'=>$recs,
                       'station'=>$stations
                    ]);
        } catch (\Throwable $th) {
            return response()->json(['message'=>'fail:'.$th]);
        }
    }
}
