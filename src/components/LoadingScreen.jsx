import { useMemo } from 'react';
import { randomQuote } from '../data/quotes';

export default function LoadingScreen({ message = 'Loading your library...' }) {
  const quote = useMemo(() => randomQuote(), []);

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '32px',
      padding: '40px',
      background: 'var(--bg)',
    }}>
      <div style={{ fontFamily: 'var(--font-heading)', fontSize: '2rem', color: 'var(--primary)', fontWeight: 700 }}>
        Spine
      </div>

      <div className="spinner" />

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{message}</p>

      <div style={{
        maxWidth: '420px',
        textAlign: 'center',
        padding: '24px',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--surface)',
        boxShadow: '0 2px 12px var(--shadow)',
      }}>
        <p style={{
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          fontSize: '1.05rem',
          color: 'var(--text)',
          lineHeight: 1.6,
          marginBottom: '10px',
        }}>
          "{quote.text}"
        </p>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 600 }}>
          — {quote.author}
        </p>
      </div>
    </div>
  );
}
