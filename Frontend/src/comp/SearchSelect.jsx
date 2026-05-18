import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { useClickOutside } from '../../hooks';

export default function SearchSelect({
  options = [],           // [{ value, label, sub }]
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  disabled = false,
  clearable = true,
  loading = false,
  onSearch,               // if provided, fires on search input change
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const inputRef = useRef(null);

  useClickOutside(ref, () => { setOpen(false); setSearch(''); });

  const selected = options.find(o => o.value === value);

  const filtered = search
    ? options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.sub?.toLowerCase().includes(search.toLowerCase())
      )
    : options;

  const handleSelect = (opt) => {
    onChange(opt.value);
    setOpen(false);
    setSearch('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange('');
  };

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50);
  }, [open]);

  useEffect(() => {
    onSearch?.(search);
  }, [search]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div
        onClick={() => !disabled && setOpen(v => !v)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '10px 14px', border: '1.5px solid var(--border)',
          borderRadius: 'var(--r)', background: 'var(--surface)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? .6 : 1,
          borderColor: open ? 'var(--blue)' : 'var(--border)',
          boxShadow: open ? '0 0 0 3px var(--blue-soft)' : 'none',
          transition: 'all .15s',
        }}
      >
        <div style={{ flex: 1, fontSize: 14 }}>
          {selected ? (
            <span style={{ color: 'var(--text)' }}>{selected.label}</span>
          ) : (
            <span style={{ color: 'var(--text3)' }}>{placeholder}</span>
          )}
        </div>
        {clearable && selected && (
          <button onClick={handleClear} style={{ background: 'none', border: 'none', color: 'var(--text3)', cursor: 'pointer', padding: 2, display: 'flex' }}>
            <X size={14} />
          </button>
        )}
        <ChevronDown size={15} style={{ color: 'var(--text3)', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .15s', flexShrink: 0 }} />
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 300,
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 10, boxShadow: 'var(--shadow-md)', marginTop: 4,
          overflow: 'hidden',
        }}>
          {/* Search */}
          <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <Search size={14} style={{ color: 'var(--text3)', flexShrink: 0 }} />
            <input
              ref={inputRef}
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              style={{ border: 'none', outline: 'none', fontSize: 13, flex: 1, background: 'transparent', color: 'var(--text)' }}
            />
          </div>

          {/* Options */}
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {loading ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>Loading...</div>
            ) : filtered.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--text3)', fontSize: 13 }}>No results found</div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  onClick={() => handleSelect(opt)}
                  style={{
                    padding: '10px 14px', cursor: 'pointer',
                    background: opt.value === value ? 'var(--blue-light)' : 'transparent',
                    borderLeft: opt.value === value ? '3px solid var(--blue)' : '3px solid transparent',
                    transition: 'background .1s',
                  }}
                  onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = 'var(--bg)'; }}
                  onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = 'transparent'; }}
                >
                  <div style={{ fontSize: 13, fontWeight: opt.value === value ? 600 : 400, color: opt.value === value ? 'var(--blue)' : 'var(--text)' }}>
                    {opt.label}
                  </div>
                  {opt.sub && (
                    <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 1 }}>{opt.sub}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
