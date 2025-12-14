import { useEffect, useMemo, useState } from "preact/hooks";
import "./index.css";

import AnimeForm from "./components/AnimeForm.jsx";
import TableAnime from "./components/TableAnime.jsx";
import EditModal from "./components/EditAnime.jsx";

const API = "http://localhost/Projek_DenjakaHadrian_50423354/server/index.php";
const empty = { judul: "", genre: "", total_episode: 0, episode_terakhir: 0, status: "Plan" };

const post = (action, body) =>
  fetch(`${API}?action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

export default function App() {
  const [anime, setAnime] = useState([]);
  const [q, setQ] = useState("");
  const [form, setForm] = useState(empty);
  const [edit, setEdit] = useState(null);

  const load = async () => {
    const res = await fetch(`${API}?action=getAnime`);
    const data = await res.json();
    setAnime(Array.isArray(data) ? data : []);
  };

  useEffect(() => void load(), []);

  const submit = async () => {
    if (!form.judul.trim()) return alert("Judul wajib diisi!");
    await post("addAnime", form);
    setForm(empty);
    load();
  };

  const openEdit = (a) =>
    setEdit({
      id: a.id,
      judul: a.judul ?? "",
      genre: a.genre ?? "",
      total_episode: +a.total_episode || 0,
      episode_terakhir: +a.episode_terakhir || 0,
      status: a.status ?? "Plan",
    });

  const saveEdit = async () => {
    if (!edit.judul.trim()) return alert("Judul wajib diisi!");
    const { id, judul, genre, status, episode_terakhir } = edit;
    await post("updateAnime", { id, judul, genre, status, episode_terakhir });
    setEdit(null);
    load();
  };

  const hapus = async (id) => {
    if (!confirm("Yakin mau hapus anime ini?")) return;
    await fetch(`${API}?action=deleteAnime&id=${id}`);
    load();
  };

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? anime.filter((a) => `${a.judul} ${a.genre} ${a.status}`.toLowerCase().includes(s)) : anime;
  }, [anime, q]);

  return (
    <div className="container">
      <div className="header">
        <h1 className="title">Daftar Tonton Anime</h1>
        <p className="sub">Denjaka Hadrian Jatmika_50423354</p>
      </div>

      <AnimeForm title="Tambah Anime" value={form} setValue={setForm} onSubmit={submit} submitText="Simpan" />

      <TableAnime q={q} setQ={setQ} data={filtered} onEdit={openEdit} onDelete={hapus} />

      {edit && (
        <EditModal onClose={() => setEdit(null)}>
          <AnimeForm title="" value={edit} setValue={setEdit} onSubmit={saveEdit} submitText="Simpan Perubahan" />
        </EditModal>
      )}
    </div>
  );
}