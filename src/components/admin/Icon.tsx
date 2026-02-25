'use client'

export const Icon = () => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: 36, height: 36, borderRadius: 8, background: '#C41E3A', margin: '0 auto',
  }}>
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <rect x="3" y="2" width="3" height="16" rx="1" fill="white" />
      <path d="M6 10 L15 2 L18 2 L9 10" fill="white" />
      <path d="M9 10 L18 18 L15 18 L6 10" fill="white" />
    </svg>
  </div>
)
