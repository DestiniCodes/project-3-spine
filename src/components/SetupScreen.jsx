import { useState } from 'react';
import { useLibrary } from '../hooks/useLibrary';

export default function SetupScreen() {
  const { updateProfile } = useLibrary();
  const [name, setName]   = useState('');
  const [goal, setGoal]   = useState(12);
  const [theme, setTheme] = useState('rose');
  const [step, setStep]   = useState(1);

  const finish = () => {
    updateProfile({ name: name.trim() || 'Reader', readingGoal: goal, theme, setupComplete: true });
  };

  const themeBtn = (t, label, desc, color) => (
    <button
      onClick={() => setTheme(t)}
      style={{
        flex: 1,
        padding: '18px',
        borderRadius: 'var(--radius-lg)',
        border: `2px solid ${theme === t ? color : 'var(--border)'}`,
        background: theme === t ? `${color}18` : 'var(--surface)',
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'left',
      }}
    >
      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: color, marginBottom: '10px' }} />
      <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: 'var(--text)', marginBottom: '4px' }}>{label}</div>
      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{desc}</div>
    </button>
  );

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
    }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '8px' }}>
            Spine
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Your reading life, organized.</p>
        </div>

        <div className="card" style={{ padding: '36px' }}>

          {step === 1 && (
            <div className="fade-up">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>Welcome. What should we call you?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '28px' }}>Just for you — this lives only on your device.</p>

              <div className="field">
                <label className="label">Your name</label>
                <input
                  className="input"
                  placeholder="e.g. Destini"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setStep(2)}
                  autoFocus
                />
              </div>

              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setStep(2)}>
                Continue →
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-up">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>
                Hey {name || 'there'} 👋
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '28px' }}>
                This year, I'm hoping to read around...
              </p>

              <div className="field">
                <label className="label">Books (no pressure — just an intention)</label>
                <input
                  className="input"
                  type="number"
                  min="1"
                  max="500"
                  value={goal}
                  onChange={(e) => setGoal(Number(e.target.value))}
                  style={{ fontSize: '1.4rem', textAlign: 'center', fontFamily: 'var(--font-heading)' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={() => setStep(3)}>
                  Continue →
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="fade-up">
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.6rem', marginBottom: '8px' }}>Pick your theme</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '24px' }}>You can change this anytime in settings.</p>

              <div style={{ display: 'flex', gap: '14px', marginBottom: '28px' }}>
                {themeBtn('rose',  'Rose',  'Warm · Soft · Curated',        '#C4849E')}
                {themeBtn('slate', 'Slate', 'Cool · Calm · Editorial',      '#4A6FA5')}
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button className="btn btn-ghost" onClick={() => setStep(2)}>← Back</button>
                <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={finish}>
                  Open my library →
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Step dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
          {[1,2,3].map((s) => (
            <div key={s} style={{
              width: s === step ? '24px' : '8px', height: '8px',
              borderRadius: '99px',
              background: s === step ? 'var(--primary)' : 'var(--border)',
              transition: 'all 0.3s',
            }} />
          ))}
        </div>

      </div>
    </div>
  );
}
