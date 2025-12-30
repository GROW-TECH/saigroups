import React from "react";
export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="card w-full max-w-lg">
        <div className="border-b px-4 py-3 flex justify-between items-center">
          <h3 className="font-semibold">{title}</h3>
          <button className="btn-secondary" onClick={onClose}>Close</button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
