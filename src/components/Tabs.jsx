import React from "react";
export default function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-2 border-b">
      {tabs.map((t) => (
        <button
          key={t}
          className={`px-3 py-2 text-sm ${active === t ? "border-b-2 border-brand-600 text-brand-700" : "text-gray-600 hover:text-gray-800"}`}
          onClick={() => onChange(t)}
        >
          {t}
        </button>
      ))}
    </div>
  );
}
