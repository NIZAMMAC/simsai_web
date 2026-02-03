import Link from 'next/link';
import './globals.css';

export default function Home() {
  return (
    <div className="container" style={{ paddingTop: '6rem', textAlign: 'center' }}>
      <h1 className="branding-logo" style={{ fontSize: '7rem', marginBottom: '2rem' }}>
        <span className="text-sims">SIMS</span> <span className="text-ai">AI</span>
      </h1>
      <p style={{ marginTop: '1rem', color: '#666', fontSize: '2rem', fontWeight: 500 }}>
        Secure platform for student project submissions.
      </p>

      <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <Link href="/login" className="btn-3d" style={{
          fontSize: '1.5rem',
          padding: '1.25rem 3rem',
          background: 'linear-gradient(145deg, #7476ff, #5254d9)',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: 0.7,
          boxShadow: '0 8px 15px rgba(99, 102, 241, 0.3), 0 3px 6px rgba(99, 102, 241, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.2)',
          transform: 'perspective(500px) rotateX(5deg)',
          transition: 'all 0.3s ease'
        }}>
          Login
        </Link>
        <Link href="/signup" className="btn-3d" style={{
          fontSize: '1.5rem',
          padding: '1.25rem 3rem',
          background: 'linear-gradient(145deg, var(--electric-blue), var(--reddish-pink))',
          color: '#fff',
          border: 'none',
          borderRadius: 'var(--radius)',
          fontWeight: 600,
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'pulse 2s ease-in-out infinite',
          opacity: 0.7,
          boxShadow: '0 8px 15px rgba(255, 0, 85, 0.3), 0 3px 6px rgba(41, 54, 245, 0.2), inset 0 -3px 0 rgba(0, 0, 0, 0.2)',
          transform: 'perspective(500px) rotateX(5deg)',
          transition: 'all 0.3s ease'
        }}>
          Sign Up ✨
        </Link>
      </div>
    </div>
  );
}
