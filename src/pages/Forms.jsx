import React from "react";
export default function Forms() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div className="card p-6">
        <h3 className="font-semibold mb-4">Employee form</h3>
        <form className="space-y-3">
          <div>
            <label className="label">Full name</label>
            <input className="input" />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" />
          </div>
          <div>
            <label className="label">Role</label>
            <select className="input">
              <option>Developer</option>
              <option>Designer</option>
              <option>HR</option>
            </select>
          </div>
          <button className="btn-primary">Submit</button>
        </form>
      </div>

      <div className="card p-6">
        <h3 className="font-semibold mb-4">Employer form</h3>
        <form className="space-y-3">
          <div>
            <label className="label">Company name</label>
            <input className="input" />
          </div>
          <div>
            <label className="label">GSTIN</label>
            <input className="input" />
          </div>
          <button className="btn-primary">Submit</button>
        </form>
      </div>
    </div>
  );
}
