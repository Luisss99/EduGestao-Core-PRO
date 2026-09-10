import React from 'react';

export default function MetricCard({ title, value, subtext, icon: Icon, color = '#6366f1', trend }) {
  return (
    <div className="glass-panel" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-10px',
        right: '-10px',
        width: '90px',
        height: '90px',
        borderRadius: '50%',
        background: color,
        opacity: 0.12,
        filter: 'blur(20px)'
      }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-muted)' }}>{title}</span>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: `rgba(${color.replace('#', '').match(/.{2}/g)?.map(x => parseInt(x, 16)).join(', ')}, 0.15)`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={20} />
        </div>
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {subtext && (
        <div style={{ fontSize: '0.75rem', color: 'var(--text-subtle)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {trend && <span style={{ color: '#34d399', fontWeight: 600 }}>{trend}</span>}
          <span>{subtext}</span>
        </div>
      )}
    </div>
  );
}
