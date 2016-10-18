<?php
include 'database.class.inc';

if (!class_exists('lolWebAPICache')) {
  class lolWebAPICache {
      private $db;
      public $config = array(
        'maxBytesData' => 6000
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
        return json_decode($output,true);
      }
      public function save($command, $results, $expDate) {
        $index = 1;
        $this->deleteExpired();
        $results = json_encode($results);
        $dataSegment = substr($results, 0, $this->config['maxBytesData']);
        $now = date('Y-m-d H:i:s');
        while (strlen($dataSegment) > 0 ) {
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



?>
