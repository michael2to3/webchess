<?php
$action = $_GET["action"];

$filename = "action.txt";
$file = fopen($filename, "r+") or die("File die");

switch ($action) {
  case "step":
    $newstep = $_GET["step"];
    $status = file_put_contents($filename, $newstep);
    echo $status;
    break;
  case "get":
    $board = file_get_contents($filename);
    echo $board;
    break;
}

fclose($file);
