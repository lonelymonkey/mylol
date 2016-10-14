<?php
if (!class_exists('Database')) {
/**************************************************
reference : http://culttt.com/2012/10/01/roll-your-own-pdo-php-class/
    customized features were added
**********************************************/

class Database {
    private $host = DB_HOST;
    private $user = DB_USER;
    private $pass = DB_PASS;
    private $dbname = DB_NAME;
    private $test = false;

    private $currHost;
    private $currUser;
    private $currPass;
    private $currDBName;

    private $queryString = '';

    private $dbh;
    private $error;
    private static $db = false;

    //statement
    private $stmt;
    //prevent cloning
    private function __clone() {
    }
    //prevent serializing
    private function __wakeup() {
    }

    public static function getConnection() {
        if (self::$db === false) {
            self::$db = new Database();
        }
        return self::$db;
    }
    private function __construct(){
        // Set options
        $options = array(
            //PDO::ATTR_PERSISTENT => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'
            //PDO::ATTR_EMULATE_PREPARES => false
        );
        try {
          $dsn = 'mysql:host=' . $this->host . ';dbname=' . $this->dbname;
          $this->currHost = $this->host;
          $this->currDBName = $this->dbname;
          $this->currPass = $this->pass;
          $this->currUser = $this->user;
          $this->dbh = new PDO($dsn, $this->user, $this->pass, $options);
        }
        // Catch any errors
        catch (PDOException $e) {
            $this->error = $e->getMessage();
        }
    }

    public function query($query) {
        try {
                $this->query = $query;
                $this->stmt = $this->dbh->prepare($query);
        }
        catch (PDOException $e) {

            throw $e;
        }

        return $this;
    }
    public function reConnect() {
        echo 'Reconnecting to DB...'.PHP_EOL;
        $this->disconnect();
        $options = array(
            //PDO::ATTR_PERSISTENT => false,
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_EMULATE_PREPARES => false
        );
        $dsn = 'mysql:host=' . $this->currHost . ';dbname=' . $this->currDBName;
        $this->dbh = new PDO($dsn, $this->currUser, $this->currPass, $options);
    }

    public function __destruct() {
        $this->disconnect();
    }

    public function disconnect() {
        $this->dbh = null;
        $this->stmt = null;
    }
    public function bind($param, $value, $type = null) {
        if (is_null($type)) {
          switch (true) {
            case is_int($value):
              $type = PDO::PARAM_INT;
              break;
            case is_bool($value):
              $type = PDO::PARAM_BOOL;
              break;
            case is_null($value):
              $type = PDO::PARAM_NULL;
              break;
            default:
              $type = PDO::PARAM_STR;
          }
        }
        $this->stmt->bindValue($param, $value, $type);
        return $this;
    }

    public function bindAll($input) {
        foreach ($input AS $param => $value) {
            $this->bind($param,$value);
        }
        return $this;
    }

    public function execute(){
        try {
            $this->stmt->execute();
        }
        catch (PDOException $e) {
            $msg = $e->getMessage();
            echo 'caught an exception: '. $msg . PHP_EOL;
            if ($this->test) {
                echo $this->query;
            }
            throw $e;
        }
        return $this;
    }
    /**********************************************
     *  this function is to handle some of the compatability issue migrating from
     *          php 5.3 to php 5.6
     ***********************************************/
    public function quote($str) {
        return $this->dbh->quote($str);
    }
    /**********************************************
    $type :  'assoc' => PDO::FETCH_ASSOC
             'obj'   => PDO::FETCH_OBJ
    **********************************************/
    public function resultset($type = 'assoc'){
        switch ($type) {
            case 'assoc':
                $output = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
                break;
            case 'obj':
                $output = $this->stmt->fetchAll(PDO::FETCH_OBJ);
                break;
            default :
                $output = $this->stmt->fetchAll(PDO::FETCH_ASSOC);
                break;
        }
        if ($output) {
            return $output;
        } else {
            return array();
        }
    }
    //only return single result
    /**********************************************
    $type :  'assoc' => PDO::FETCH_ASSOC
             'obj'   => PDO::FETCH_OBJ
    **********************************************/
    public function single($type = 'assoc'){
        //$this->execute();
        switch ($type) {
            case 'assoc':
                $output = $this->stmt->fetch(PDO::FETCH_ASSOC);
                break;
            case 'obj':
                $output = $this->stmt->fetch(PDO::FETCH_OBJ);
                break;
            default :
                $output = $this->stmt->fetch(PDO::FETCH_ASSOC);
                break;
        }
        if ($output) {
            return $output;
        } else {
            return array();
        }
    }

    public function rowCount(){
        return $this->stmt->rowCount();
    }

    public function lastInsertId(){
        return $this->dbh->lastInsertId();
    }


    //transactions feature
    public function beginTransaction(){
        return $this->dbh->beginTransaction();
    }
    public function endTransaction(){
        return $this->dbh->commit();
    }
    public function cancelTransaction(){
        return $this->dbh->rollBack();
    }

    public function debugDumpParams(){
        return $this->stmt->debugDumpParams();
    }
}


$myDB = Database::getConnection();
}

?>
