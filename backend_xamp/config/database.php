<?php
/**
 * Konfigurasi Database MySQL untuk XAMPP
 * Database: emoment_db
 * Host: localhost
 * User Default XAMPP: root
 * Password Default XAMPP: (kosong)
 */

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

class Database {
    private $host = "localhost";
    private $db_name = "emoment_db";
    private $username = "root";
    private $password = "";
    public $conn;

    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $exception) {
            http_response_code(500);
            echo json_encode([
                "status" => "error",
                "message" => "Gagal terhubung ke database MySQL XAMPP: " . $exception->getMessage(),
                "troubleshoot" => [
                    "1. Pastikan modul MySQL di XAMPP Control Panel sudah berstatus RUNNING (hijau).",
                    "2. Pastikan database bernama 'emoment_db' sudah dibuat di phpMyAdmin.",
                    "3. Pastikan file 'database/emoment_db.sql' sudah di-import ke database 'emoment_db'."
                ]
            ]);
            exit();
        }

        return $this->conn;
    }
}
