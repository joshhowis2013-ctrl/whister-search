<?php

header('Content-Type: application/json');

$OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY';

$input = json_decode(
    file_get_contents("php://input"),
    true
);

$query =
$input["query"] ?? "";

$ch = curl_init();

curl_setopt_array($ch, [

    CURLOPT_URL =>
    "https://api.openai.com/v1/chat/completions",

    CURLOPT_RETURNTRANSFER => true,

    CURLOPT_POST => true,

    CURLOPT_HTTPHEADER => [

        "Authorization: Bearer $OPENAI_API_KEY",

        "Content-Type: application/json"

    ],

    CURLOPT_POSTFIELDS =>
    json_encode([

        "model" => "gpt-4o-mini",

        "messages" => [

            [
                "role" => "system",

                "content" =>
                "Give concise search summaries."
            ],

            [
                "role" => "user",

                "content" => $query
            ]

        ]

    ])

]);

$response =
curl_exec($ch);

echo $response;
