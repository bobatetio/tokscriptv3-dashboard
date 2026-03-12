// Inline Tokscript wordmark — pure HTML/CSS, no external image dependencies.

export default function Frame4Logo() {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        userSelect: 'none',
        lineHeight: 1,
        height: 35,
      }}
    >
      {/* "T" badge */}
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: 7,
          background: '#111111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <span
          style={{
            color: '#ffffff',
            fontSize: 15,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            fontFamily: 'Inter, sans-serif',
            lineHeight: 1,
          }}
        >
          T
        </span>
      </div>

      {/* Wordmark */}
      <span
        style={{
          fontSize: 17,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          color: '#111111',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        Tokscript
      </span>
    </div>
  );
}