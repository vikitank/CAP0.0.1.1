import { AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger = false, loading = false }) {
  if (!open) return null;
  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal modal-sm slide-up">
        <div className="modal-body" style={{ padding: '28px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 16 }}>
            <div style={{ width: 42, height: 42, borderRadius: '50%', background: danger ? 'var(--danger-soft)' : 'var(--warn-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <AlertTriangle size={20} style={{ color: danger ? 'var(--danger)' : 'var(--warn)' }} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.6 }}>{message}</div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
          <button className={`btn ${danger ? 'btn-danger' : 'btn-primary'}`} onClick={onConfirm} disabled={loading}>
            {loading ? '...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Page Header ─────────────────────────────────────────────────────────────
export function PageHeader({ title, subtitle, actions }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}
      </div>
      {actions && <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>{actions}</div>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ page, pages, total, limit, onPage }) {
  if (!total || pages <= 1) return null;
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, fontSize: 13, color: 'var(--text2)' }}>
      <span>Showing {from}–{to} of {total.toLocaleString('en-IN')}</span>
      <div style={{ display: 'flex', gap: 4 }}>
        <button className="btn btn-secondary btn-sm" disabled={page === 1} onClick={() => onPage(page - 1)}>
          <ChevronLeft size={14} /> Prev
        </button>
        {Array.from({ length: Math.min(pages, 5) }, (_, i) => {
          let p;
          if (pages <= 5) p = i + 1;
          else if (page <= 3) p = i + 1;
          else if (page >= pages - 2) p = pages - 4 + i;
          else p = page - 2 + i;
          return (
            <button key={p} onClick={() => onPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`} style={{ minWidth: 36 }}>{p}</button>
          );
        })}
        <button className="btn btn-secondary btn-sm" disabled={page >= pages} onClick={() => onPage(page + 1)}>
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ─── Date Range Picker ────────────────────────────────────────────────────────
export function DateRangePicker({ from, to, onFrom, onTo, label = true }) {
  const presets = [
    { label: 'Today', from: new Date().toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] },
    { label: 'This Month', from: `${new Date().getFullYear()}-${String(new Date().getMonth()+1).padStart(2,'0')}-01`, to: new Date().toISOString().split('T')[0] },
    { label: 'Last Month', ...(() => { const d = new Date(); d.setMonth(d.getMonth()-1); return { from: `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-01`, to: new Date(d.getFullYear(), d.getMonth()+1, 0).toISOString().split('T')[0] }; })() },
    { label: 'This FY', from: `${new Date().getMonth() >= 3 ? new Date().getFullYear() : new Date().getFullYear()-1}-04-01`, to: new Date().toISOString().split('T')[0] },
  ];

  return (
    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
      {presets.map(p => (
        <button key={p.label} className="btn btn-ghost btn-sm" style={{ fontSize: 11, padding: '4px 10px', border: '1px solid var(--border)' }}
          onClick={() => { onFrom(p.from); onTo(p.to); }}>
          {p.label}
        </button>
      ))}
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input type="date" className="form-input" style={{ width: 145, padding: '7px 10px', fontSize: 12 }} value={from} onChange={e => onFrom(e.target.value)} />
        <span style={{ color: 'var(--text3)', fontSize: 13 }}>to</span>
        <input type="date" className="form-input" style={{ width: 145, padding: '7px 10px', fontSize: 12 }} value={to} onChange={e => onTo(e.target.value)} />
      </div>
    </div>
  );
}

// ─── Status Badge helper ──────────────────────────────────────────────────────
export function StatusBadge({ status }) {
  const map = {
    Posted:    'badge-success',
    Active:    'badge-success',
    Paid:      'badge-success',
    Filed:     'badge-success',
    Draft:     'badge-neutral',
    Pending:   'badge-warn',
    Trial:     'badge-warn',
    Cancelled: 'badge-danger',
    Expired:   'badge-danger',
    Failed:    'badge-danger',
  };
  return <span className={`badge ${map[status] || 'badge-neutral'}`}>{status}</span>;
}

// ─── Amount display ───────────────────────────────────────────────────────────
export function Amount({ value, colored = false, decimals = 2 }) {
  const n = Number(value || 0);
  const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: decimals }).format(n);
  return (
    <span style={{ fontFamily: 'var(--mono)', fontWeight: 600, color: colored ? (n >= 0 ? 'var(--success)' : 'var(--danger)') : 'inherit' }}>
      {fmt}
    </span>
  );
}
