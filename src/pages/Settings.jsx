import { useState } from 'react';
import { useLibrary } from '../hooks/useLibrary';
import { exportLibrary } from '../utils/helpers';

export default function Settings() {
  const { userProfile, updateProfile, library, shelves } = useLibrary();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ name: userProfile.name, readingGoal: userProfile.readingGoal });
  const [importError, setImportError] = useState('');

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = () => {
    updateProfile({ name: form.name, readingGoal: Number(form.readingGoal) });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleTheme = (theme) => updateProfile({ theme });
  const handleDark  = () => updateProfile({ darkMode: !userProfile.darkMode });

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!data.library || !Array.isArray(data.library)) throw new Error('Invalid file');
        localStorage.setItem('spine-library', JSON.stringify(data.library));
        if (data.shelves) localStorage.setItem('spine-shelves', JSON.stringify(data.shelves));
        if (data.userProfile) localStorage.setItem('spine-profile', JSON.stringify({ ...data.userProfile, setupComplete: true }));
        window.location.reload();
      } catch {
        setImportError('Could not read this file. Make sure it\'s a Spine backup (.json).');
      }
    };
    reader.readAsText(file);
  };

  const Section = ({ title, children }) => (
    <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius-lg)', padding: '28px', boxShadow: '0 2px 12px var(--shadow)', marginBottom: '20px' }}>
      <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border)' }}>
        {title}
      </h2>
      {children}
    </div>
  );

  const ThemeBtn = ({ t, label, desc, color }) => (
    <button
      onClick={() => handleTheme(t)}
      style={{
        flex: 1, padding: '16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
        border: `2px solid ${userProfile.theme === t ? color : 'var(--border)'}`,
        background: userProfile.theme === t ? `${color}18` : 'var(--surface)',
      }}
    >
      <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: color, marginBottom: '8px' }} />
      <div style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem' }}>{label}</div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>{desc}</div>
    </button>
  );

  return (
    <div className="page">
      <div className="container" style={{ paddingTop: '32px', paddingBottom: '60px', maxWidth: '600px' }}>

        <p className="badge" style={{ marginBottom: '10px' }}>Preferences</p>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text)', marginBottom: '32px' }}>
          Settings
        </h1>

        <Section title="Profile">
          <div className="field">
            <label className="label">Your name</label>
            <input className="input" value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Reading intention (books this year)</label>
            <input className="input" type="number" min="1" value={form.readingGoal} onChange={(e) => set('readingGoal', e.target.value)} style={{ maxWidth: '120px' }} />
          </div>
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save changes'}
          </button>
        </Section>

        <Section title="Appearance">
          <label className="label" style={{ marginBottom: '12px' }}>Theme</label>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <ThemeBtn t="rose"  label="Rose"  desc="Warm · Soft"   color="#C4849E" />
            <ThemeBtn t="slate" label="Slate" desc="Cool · Calm"   color="#4A6FA5" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.88rem', color: 'var(--text)' }}>Dark mode</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Easy on the eyes</div>
            </div>
            <button
              onClick={handleDark}
              style={{
                width: '48px', height: '28px', borderRadius: '99px', border: 'none', cursor: 'pointer', transition: 'background 0.3s', position: 'relative',
                background: userProfile.darkMode ? 'var(--primary)' : 'var(--border)',
              }}
            >
              <div style={{
                position: 'absolute', top: '4px', width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.3s',
                left: userProfile.darkMode ? '24px' : '4px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
              }} />
            </button>
          </div>
        </Section>

        <Section title="Your Data">
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '20px' }}>
            Your library lives on this device. Export regularly to back it up — if you clear your browser data, your library will be gone. Import a backup to restore it.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              className="btn btn-primary"
              onClick={() => exportLibrary(library, shelves, userProfile)}
            >
              📥 Export Library
            </button>

            <label className="btn btn-ghost" style={{ cursor: 'pointer' }}>
              📤 Import Backup
              <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
          </div>

          {importError && (
            <p style={{ fontSize: '0.82rem', color: '#B05A5A', marginTop: '12px' }}>⚠️ {importError}</p>
          )}

          <div style={{ marginTop: '20px', padding: '14px 16px', background: 'var(--surface-2)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            📚 {library.length} book{library.length !== 1 ? 's' : ''} in your library
          </div>
        </Section>

      </div>
    </div>
  );
}
