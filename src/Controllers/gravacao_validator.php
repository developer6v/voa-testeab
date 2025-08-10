<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
// (Opcional CORS)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Trata preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(204);
  exit;
}

// Apenas POST
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  http_response_code(405);
  echo json_encode([
    'error' => 'Method Not Allowed',
    'received_method' => $_SERVER['REQUEST_METHOD'] ?? null,
    'hint' => 'Verifique se há redirecionamento 301/302. Use a URL final com HTTPS/www corretos ou configure 307/308.'
  ]);
  exit;
}

// Lê JSON ou form
$raw = file_get_contents('php://input') ?: '';
$ct  = $_SERVER['CONTENT_TYPE'] ?? '';
$input = (stripos($ct, 'application/json') !== false)
  ? json_decode($raw, true) ?: []
  : $_POST;

$email = isset($input['email']) ? trim((string)$input['email']) : '';
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  http_response_code(400);
  echo json_encode(['error' => 'E-mail inválido ou ausente']); exit;
}

$productIds = [];
if (isset($input['product_ids']) && is_array($input['product_ids'])) {
  $productIds = array_values(array_filter(array_map('intval', $input['product_ids'])));
}
// ===== Funções auxiliares =====
function http_post_json(string $url, array $data, array $headers = []): array {
  $ch = curl_init($url);
  $payload = json_encode($data);
  $headers = array_merge([
    'Content-Type: application/json',
    'Accept: application/json'
  ], $headers);

  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST => true,
    CURLOPT_POSTFIELDS => $payload,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 20,
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($resp === false) {
    $err = curl_error($ch);
    curl_close($ch);
    throw new RuntimeException("HTTP POST error: $err");
  }
  curl_close($ch);
  return [$code, $resp];
}

function http_get(string $url, array $headers = []): array {
  $ch = curl_init($url);
  $headers = array_merge([
    'Accept: application/json'
  ], $headers);

  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_TIMEOUT => 20,
  ]);
  $resp = curl_exec($ch);
  $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
  if ($resp === false) {
    $err = curl_error($ch);
    curl_close($ch);
    throw new RuntimeException("HTTP GET error: $err");
  }
  curl_close($ch);
  return [$code, $resp];
}

try {
  // 1) Token OAuth2 (client credentials)
  [$code, $resp] = http_post_json(HOTMART_TOKEN_URL, [
    'grant_type' => 'client_credentials',
    'client_id' => $CLIENT_ID,
    'client_secret' => $CLIENT_SECRET,
  ]);
  if ($code !== 200) {
    http_response_code(502);
    echo json_encode(['error' => 'Falha ao obter token da Hotmart', 'details' => $resp]); exit;
  }
  $token = json_decode($resp, true)['access_token'] ?? null;
  if (!$token) {
    http_response_code(502);
    echo json_encode(['error' => 'Token não retornado pela Hotmart']); exit;
  }

  // 2) Consulta Sales History
  // Dica: alguns ambientes já aceitam filtrar por e-mail no query.
  // Usaremos buyer_email quando disponível; mantendo um fallback por filtro local.
  $since = (new DateTimeImmutable("-{$LOOKBACK_DAYS} days"))->format('Y-m-d');
  $page = 1;
  $rows = 50;

  $foundPurchases = [];
  $approvedStatuses = ['APPROVED','COMPLETE','COMPLETED']; // variações possíveis

  do {
    $query = http_build_query([
      'page' => $page,
      'rows' => $rows,
      'start_date' => $since,
      'buyer_email' => $email, // se o provedor ignorar, filtraremos abaixo
    ]);
    $url = HOTMART_SALES_HISTORY_URL . '?' . $query;

    [$code, $resp] = http_get($url, [
      "Authorization: Bearer {$token}"
    ]);

    if ($code !== 200) {
      http_response_code(502);
      echo json_encode(['error' => 'Falha ao consultar vendas na Hotmart', 'details' => $resp]); exit;
    }

    $data = json_decode($resp, true);
    $items = $data['items'] ?? $data['data']['items'] ?? [];  // lida com variação de payload
    $totalPages = (int)($data['total_pages'] ?? $data['pagination']['total_pages'] ?? 1);

    // Filtro local por e-mail + status + (opcional) productId
    foreach ($items as $sale) {
      $buyerEmail = $sale['buyer']['email'] ?? null;
      $status = strtoupper($sale['status'] ?? '');
      $productId = $sale['product']['id'] ?? null;

      $emailMatch = $buyerEmail && strcasecmp($buyerEmail, $email) === 0;
      $statusOk = in_array($status, $approvedStatuses, true);
      $productOk = empty($productIds) || ($productId && in_array((int)$productId, $productIds, true));

      if ($emailMatch && $statusOk && $productOk) {
        $foundPurchases[] = [
          'transaction' => $sale['transaction'] ?? null,
          'status' => $status,
          'product' => [
            'id' => $productId,
            'name' => $sale['product']['name'] ?? null,
          ],
          'approved_at' => $sale['approved_date'] ?? $sale['purchase_date'] ?? null,
          'price' => $sale['price']['value'] ?? null,
          'currency' => $sale['price']['currency'] ?? null,
        ];
      }
    }

    $page++;
  } while ($page <= max(1, $totalPages) && count($foundPurchases) === 0);

  // 3) Resposta
  $purchased = count($foundPurchases) > 0;
  echo json_encode([
    'email' => $email,
    'purchased' => $purchased,
    'matches' => $foundPurchases,
  ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
  http_response_code(500);
  echo json_encode(['error' => 'Erro interno', 'details' => $e->getMessage()]);
}
