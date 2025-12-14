<?php

function getConnection(){
    // detail konneksi database
    $host = "localhost";
    $db_name = "projek";
    $username = "root";
    $password = "";

    // membuat koneksi database
    $conn = new mysqli($host, $username, $password, $db_name);

    // cek koneksi database
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
    
}