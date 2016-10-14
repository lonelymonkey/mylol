<?php
if (!class_exists('profiler')) {

class profiler {
    public $data = array();
    private static $instance = false;
    /*********************************************************
     *  $desc : profiler description
     *  $type :
     *      "start" or "finish"
     ********************************************************/
    public static function getConnection(){
        if (self::$instance === false) {
            self::$instance = new profiler();
        }
        return self::$instance;
    }

    private function __construct() {

    }
    public function mark($desc, $type = 'start'){
        if (empty($this->data[$desc])) {
            $this->data[$desc] = array(
                't1' => 0,
                't2' => 0,
                'totalTime' => 0,
                'count' => 0,
            );
        }
        switch ($type) {
            case 'start' :
                $this->data[$desc]['t1'] = microtime(true);
                break;
            case 'finish':
                $this->data[$desc]['t2'] = microtime(true);
                $this->data[$desc]['totalTime'] += round($this->data[$desc]['t2'] - $this->data[$desc]['t1'],4);
                $this->data[$desc]['count']++;
                break;
            default:
                break;
        }
    }
    public function getResults() {
        foreach ($this->data AS $desc => $time) {
            echo $desc . ' : ' . $time['totalTime'].' ('.$time['count'].')<br/>';
        }
    }
}
}

?>
