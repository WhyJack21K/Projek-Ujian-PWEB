<?php
require_once "db.php";

header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") { http_response_code(200); exit; }

$conn = getConnection();
$action = $_GET["action"] ?? "";

function json($data, $code=200){
  http_response_code($code);
  echo json_encode($data);
  exit;
}
function body(){ return json_decode(file_get_contents("php://input"), true) ?: []; }
function clamp0($n){ return max(0, (int)$n); }

switch ($action) {
  case "getAnime":
    $res = $conn->query("SELECT * FROM anime ORDER BY id DESC");
    $out = [];
    while ($row = $res->fetch_assoc()) $out[] = $row;
    json($out);

  case "addAnime": {
    $in = body();
    $judul   = trim($in["judul"] ?? "");
    $genre   = trim($in["genre"] ?? "");
    $total   = clamp0($in["total_episode"] ?? 0);
    $episode = clamp0($in["episode_terakhir"] ?? 0);
    $status  = $in["status"] ?? "Plan";

    if ($judul === "") json(["success"=>false,"error"=>"Judul wajib diisi"], 400);
    if ($episode > $total) $episode = $total;

    $st = $conn->prepare("INSERT INTO anime (judul, genre, total_episode, episode_terakhir, status) VALUES (?,?,?,?,?)");
    $st->bind_param("ssiis", $judul, $genre, $total, $episode, $status);
    $st->execute();
    json(["success"=>true]);
  }

  case "updateAnime": {
    $in = body();
    $id = (int)($in["id"] ?? 0);
    if ($id <= 0) json(["success"=>false,"error"=>"ID tidak valid"], 400);

    $judul  = trim($in["judul"] ?? "");
    $genre  = trim($in["genre"] ?? "");
    $episode = clamp0($in["episode_terakhir"] ?? 0);
    $status  = $in["status"] ?? "Plan";

    if ($judul === "") json(["success"=>false,"error"=>"Judul wajib diisi"], 400);

    $chk = $conn->prepare("SELECT total_episode FROM anime WHERE id=?");
    $chk->bind_param("i", $id);
    $chk->execute();
    $row = $chk->get_result()->fetch_assoc();
    if ($row) $episode = min($episode, (int)$row["total_episode"]);

    $st = $conn->prepare("UPDATE anime SET judul=?, genre=?, episode_terakhir=?, status=? WHERE id=?");
    $st->bind_param("ssisi", $judul, $genre, $episode, $status, $id);
    $st->execute();
    json(["success"=>true]);
  }

  case "deleteAnime": {
    $id = (int)($_GET["id"] ?? 0);
    if ($id <= 0) json(["success"=>false,"error"=>"ID tidak valid"], 400);

    $st = $conn->prepare("DELETE FROM anime WHERE id=?");
    $st->bind_param("i", $id);
    $st->execute();
    json(["success"=>true]);
  }

  default:
    json([
      "message" => "API Daftar Tonton Anime aktif",
      "endpoints" => [
        "GET  ?action=getAnime",
        "POST ?action=addAnime",
        "POST ?action=updateAnime",
        "GET  ?action=deleteAnime&id=ID"
      ]
    ]);
}