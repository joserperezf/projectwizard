import { useNetwork } from '../hooks/useNetwork';

export function NetworkIndicator() {
  const isOnline = useNetwork();

  if (isOnline) return null;

  return (
    <div
      style={{
        backgroundColor: '#eb445a',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '8px 16px',
        fontSize: '13px',
        fontWeight: 500,
        textAlign: 'center',
        zIndex: 9999,
        position: 'relative',
        width: '100%',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
        fontFamily: 'Outfit, sans-serif'
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
        <path d="M1 1l22 22M16.72 11.06A10.94 10.94 0 0119 12.55M5 12.55a10.94 10.94 0 015.17-2.39M10.71 5.05A16 16 0 0122.58 9M1.42 9a15.91 15.91 0 014.7-2.88M8.53 16.11a6 6 0 016.95 0M12 20h.01"/>
      </svg>
      Estás en modo offline. Los cambios se guardarán localmente.
    </div>
  );
}
