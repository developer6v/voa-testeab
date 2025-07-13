<?php

ini_set("display_errors", 1);
error_reporting(E_ALL);
date_default_timezone_set('America/Sao_Paulo');

// Lote 0
$inicio_l0 = strtotime("2025-07-08 00:00");
$fim_l0 = strtotime("2025-07-10 08:00");

// Lote 1
$inicio_l1 = strtotime("2025-07-10 08:00");
$fim_l1 = strtotime("2025-07-13 15:00");

// Lote 2
$inicio_l2 = strtotime("2025-07-13 15:00");
$fim_l2 = strtotime("2025-07-16 15:00");

// Lote 3
$inicio_l3 = strtotime("2025-07-16 15:00");
$fim_l3 = strtotime("2025-07-18 15:00");

// Lote 4
$inicio_l4 = strtotime("2025-07-18 15:00");
$fim_l4 = strtotime("2025-07-21 15:00");

// Lote 5
$inicio_l5 = strtotime("2025-07-21 15:00");
$fim_l5 = strtotime("2025-07-25 15:00");

// Lote 6
$inicio_l6 = strtotime("2025-07-25 15:00");
$fim_l6 = strtotime("2025-07-31 15:00");

// Lote 7
$inicio_l7 = strtotime("2025-07-31 15:00");
$fim_l7 = strtotime("2025-08-08 00:00");

$agora = time();

$url = "";
if ($agora < $fim_l0) {
    $lote = 0;
    $valor = "R$ 19,90";
    $inicioTimestamp = $inicio_l0;
    $fimTimestamp = $fim_l0;
    $url = "https://pay.hotmart.com/G100576922A?checkoutMode=10&off=rosipfd1";
} elseif ($agora < $fim_l1) {
    $lote = 1;
    $valor = "R$ 27,00";
    $inicioTimestamp = $inicio_l1;
    $fimTimestamp = $fim_l1;
    $url = "https://pay.hotmart.com/G100576922A?checkoutMode=10&off=ndeirjn9";    
} elseif ($agora < $fim_l2) {
    $lote = 2;
    $valor = "R$ 32,00";
    $inicioTimestamp = $inicio_l2;
    $fimTimestamp = $fim_l2;
    $url = "https://pay.hotmart.com/G100576922A?off=hq2o6eev&checkoutMode=10";
} elseif ($agora < $fim_l3) {
    $lote = 3;
    $valor = "R$ 37,00";
    $inicioTimestamp = $inicio_l3;
    $fimTimestamp = $fim_l3;
} elseif ($agora < $fim_l4) {
    $lote = 4;
    $valor = "R$ 42,00";
    $inicioTimestamp = $inicio_l4;
    $fimTimestamp = $fim_l4;
} elseif ($agora < $fim_l5) {
    $lote = 5;
    $valor = "R$ 47,00";
    $inicioTimestamp = $inicio_l5;
    $fimTimestamp = $fim_l5;
} elseif ($agora < $fim_l6) {
    $lote = 6;
    $valor = "R$ 52,00";
    $inicioTimestamp = $inicio_l6;
    $fimTimestamp = $fim_l6;
} else {
    $lote = 7;
    $valor = "R$ 57,00";
    $inicioTimestamp = $inicio_l7;
    $fimTimestamp = $fim_l7;
} 



if ($lote == 7 && $agora > $fim_l7) {
    $porcentagem = 106;
} else {
    $totalPeriodo = $fimTimestamp - $inicioTimestamp;
    $tempoPassado = $agora - $inicioTimestamp;
    $totalPeriodo = $totalPeriodo == 0 ? 1 : $totalPeriodo;
    $porcentagem = (($tempoPassado / $totalPeriodo) * 100) + 6;
}


echo json_encode([
    "value" => $valor,
    "porcentagem" => number_format($porcentagem, 0),
    "lote" => $lote,
    "url" => $url
]);
?>
