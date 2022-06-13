<?php
$action = $_GET["action"];
switch ($action) {
  case "create":
    echo "successful";
    break;
  case "step":
    echo "pass";
    break;
  default:
    http_response_code("500");
    exit;
}
