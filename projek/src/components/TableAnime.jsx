const cls = { Completed: "ok", Watching: "watch", Dropped: "drop", Plan: "plan" };

export default function TableAnime({ q, setQ, data, onEdit, onDelete }) {
  return (
    <div className="card">
      <div className="row">
        <h2>Daftar Anime</h2>
        <input
          className="input search"
          placeholder="Cari judul/genre/status..."
          value={q}
          onInput={(e) => setQ(e.target.value)}
        />
      </div>

      <div className="tableWrap">
        <table>
          <thead>
            <tr>
              {["Judul", "Genre", "Status", "Episode", "Aksi"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>

          <tbody>
            {data.length ? (
              data.map((a) => (
                <tr key={a.id}>
                  <td>{a.judul}</td>
                  <td>{a.genre || "-"}</td>
                  <td>
                    <span className={`badge ${cls[a.status] || "plan"}`}>{a.status}</span>
                  </td>
                  <td>
                    {a.episode_terakhir}/{a.total_episode}
                  </td>
                  <td>
                    <button className="btnSmall warn" onClick={() => onEdit(a)}>
                      Edit
                    </button>{" "}
                    <button className="btnSmall danger" onClick={() => onDelete(a.id)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} style={{ color: "#9ca3af" }}>
                  Tidak ada data.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}