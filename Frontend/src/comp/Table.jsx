import { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';

function SkeletonRow({ cols }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i}><div className="skeleton" style={{ height: 14, width: `${60 + Math.random() * 40}%` }} /></td>
      ))}
    </tr>
  );
}

export default function Table({
  columns,          // [{ key, label, sortable, width, render }]
  data = [],
  loading = false,
  skeletonRows = 5,
  onSort,
  sortKey,
  sortDir,          // 'asc' | 'desc'
  emptyIcon = '📋',
  emptyTitle = 'No data found',
  emptySubtitle = '',
  footer,
}) {
  const handleSort = (col) => {
    if (!col.sortable || !onSort) return;
    const newDir = sortKey === col.key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(col.key, newDir);
  };

  return (
    <div className="tbl-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width, cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}
                onClick={() => handleSort(col)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  {col.label}
                  {col.sortable && (
                    <span style={{ color: 'var(--text3)', display: 'inline-flex' }}>
                      {sortKey === col.key
                        ? sortDir === 'asc' ? <ChevronUp size={13} /> : <ChevronDown size={13} />
                        : <ChevronsUpDown size={13} />
                      }
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            Array.from({ length: skeletonRows }).map((_, i) => (
              <SkeletonRow key={i} cols={columns.length} />
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>
                <div className="empty-state">
                  <div className="empty-state-icon">{emptyIcon}</div>
                  <div className="empty-state-title">{emptyTitle}</div>
                  {emptySubtitle && <div className="empty-state-sub">{emptySubtitle}</div>}
                </div>
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={row.id || i}>
                {columns.map((col) => (
                  <td key={col.key}>
                    {col.render ? col.render(row[col.key], row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
        {footer && (
          <tfoot>
            <tr style={{ background: 'var(--blue-light)', fontWeight: 700 }}>
              {footer.map((cell, i) => (
                <td key={i} style={{ padding: '12px 14px', fontFamily: 'var(--mono)', fontSize: 13 }}>{cell}</td>
              ))}
            </tr>
          </tfoot>
        )}
      </table>
    </div>
  );
}
