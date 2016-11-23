<?php
include 'database.class.inc';

date_default_timezone_set('America/Vancouver');

if (!class_exists('lolWebAPICache')) {
  class lolWebAPICache {
      private $db;
      public $config = array(
        'maxBytesData' => 60000
      );
      public function __construct() {
        $this->db = Database::getConnection();
      }
      private function deleteExpired() {
        $query = 'delete from lolwebapicache where expiredDate <= :now ';
        $this->db->query($query)
                ->bindAll(array(
                    ':now' => date('Y-m-d H:i:s')
                  ))
                ->execute();
      }
      public function getCommand($command) {
        $output = '';
        $this->deleteExpired();
        $query = 'select * from lolwebapicache where command = :cmd order by id asc';
        $results = $this->db->query($query)
                            ->bindAll(array(
                                ':cmd' => substr($command,0,256)
                              ))
                            ->execute()
                            ->resultset();
        foreach ($results AS $row) {
          $output .= $row['results'];
        }
        return json_decode($output,true);//json_decode($output,true);
      }
      private function delete($command) {
        $query = 'delete from lolwebapicache where command=:cmd';
        $this->db->query($query)
                  ->bindAll(array(
                      ':cmd' => $command
                    ))
                  ->execute();
      }
      public function save($command, $results, $expDate) {
        $this->delete($command);
        //$this->deleteExpired();
        if(!empty($results)){
          $index = 1;
          $results = json_encode($results);
          $dataSegment = substr($results, 0, $this->config['maxBytesData']);
          $now = date('Y-m-d H:i:s');
          while (strlen($dataSegment) > 0 ) {
            if(!empty($dataSegment)){
              $query = 'insert into lolwebapicache (createdDate, expiredDate, command, results) values (:now, :expDate, :command, :results)';
              $this->db->query($query)
                    ->bindAll(array(
                      ':now' => $now,
                      ':expDate' => $expDate,
                      ':command' => $command,  //string
                      ':results' => $dataSegment //php data
                    ))
                    ->execute();
              $dataSegment = substr($results, $index*$this->config['maxBytesData'], $this->config['maxBytesData']);
              $index++;
            }
          }
        }
      }

  }

}



?>
