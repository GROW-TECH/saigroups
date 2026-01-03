import React from "react";
export default function Pagination({ page, pages, onChange }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-end gap-2 mt-3">
      <button className="btn-secondary" disabled={page === 1} onClick={() => onChange(page - 1)}>Prev</button>
      <span className="text-sm text-gray-600">Page {page} of {pages}</span>
      <button className="btn-secondary" disabled={page === pages} onClick={() => onChange(page + 1)}>Next</button>
    </div>
  );
}
