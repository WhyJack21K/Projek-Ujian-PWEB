const STATUS = ["Plan", "Watching", "Completed", "Dropped"];

export default function AnimeForm({ title, value, setValue, onSubmit, submitText }) {
  const set = (k) => (e) => setValue((s) => ({ ...s, [k]: e.target.value }));

  const setNum = (k, maxKey) => (e) => {
    const n = Math.max(0, Number(e.target.value || 0));
    setValue((s) => {
      const max = maxKey ? Number(s[maxKey] || 0) : Infinity;
      const v = Math.min(n, max);
      return k === "total_episode"
        ? { ...s, total_episode: v, episode_terakhir: Math.min(Number(s.episode_terakhir || 0), v) }
        : { ...s, [k]: v };
    });
  };

  return (
    <div className="card">
      {title && <h2>{title}</h2>}

      <div className="grid">
        <div className="field">
          <label>Judul</label>
          <input className="input" value={value.judul} onInput={set("judul")} />
        </div>

        <div className="field">
          <label>Genre</label>
          <input className="input" value={value.genre} onInput={set("genre")} />
        </div>

        {"total_episode" in value && (
          <div className="field">
            <label>Total Episode</label>
            <input className="input" type="number" min="0" value={value.total_episode} onInput={setNum("total_episode")} />
          </div>
        )}

        <div className="field">
          <label>Episode Terakhir</label>
          <input
            className="input"
            type="number"
            min="0"
            value={value.episode_terakhir}
            onInput={setNum("episode_terakhir", "total_episode")}
          />
        </div>

        <div className="field">
          <label>Status</label>
          <select className="select" value={value.status} onInput={set("status")}>
            {STATUS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="actions">
        <button className="btn" onClick={onSubmit}>
          {submitText}
        </button>
      </div>
    </div>
  );
}