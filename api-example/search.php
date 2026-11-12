<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

$BRAVE_API_KEY = 'YOUR_BRAVE_API_KEY';

$query = $_GET['q'] ?? '';

$url =
'https://api.search.brave.com/res/v1/web/search?q=' .
urlencode($query);

$ch = curl_init();

curl_setopt_array($ch, [
    CURLOPT_URL => $url,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
        'Accept: application/json',
        'X-Subscription-Token: ' . $BRAVE_API_KEY
    ]
]);

$response = curl_exec($ch);

if (curl_errno($ch)) {
    echo json_encode([
        'error' => curl_error($ch)
    ]);
    exit;
}

$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);


echo $response;
exit;