'use client'

export const Icon = () => (
  <div style={{
    width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
    overflow: 'hidden', background: 'white',
    boxShadow: '0 0 0 1px rgba(196,30,58,0.3)',
  }}>
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img
      src="/ChatGPT%20Image%20Sep%209%2C%202025%2C%2003_13_02%20PM%20copy%202.png"
      alt="Kawai"
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  </div>
)
