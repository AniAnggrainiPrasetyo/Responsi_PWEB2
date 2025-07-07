<?php
session_start();

if (!isset($_SESSION['shopping_list'])) {
    $_SESSION['shopping_list'] = [
        ["name" => "masako", "category" => "bumbu", "year" => 2025, "purchased" => true],
        ["name" => "gula", "category" => "bumbu", "year" => 2026, "purchased" => false],
        ["name" => "sabun", "category" => "alat mandi", "year" => 2030, "purchased" => false],
    ];
}

$action = $_GET['action'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $_SESSION['shopping_list'][] = [
        "name" => $_POST['name'],
        "category" => $_POST['category'],
        "year" => $_POST['year'],
        "purchased" => isset($_POST['purchased'])
    ];
    exit;
}

if ($action === 'toggle') {
    $_SESSION['shopping_list'][$_GET['index']]['purchased'] = 
        !$_SESSION['shopping_list'][$_GET['index']]['purchased'];
    exit;
}

if ($action === 'delete') {
    array_splice($_SESSION['shopping_list'], $_GET['index'], 1);
    exit;
}

if ($action === 'edit') {
    $_SESSION['shopping_list'][$_GET['index']]['name'] = $_GET['name'];
    exit;
}

header('Content-Type: application/json');
echo json_encode($_SESSION['shopping_list']);
