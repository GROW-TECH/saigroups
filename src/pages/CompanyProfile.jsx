import React, { useEffect, useState } from "react";

const API = "https://projects.growtechnologies.in/srisaigroups/api";

export default function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [company, setCompany] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !user.id) {
      setLoading(false);
      return;
    }

    // Fetch company profile data with user_id
    fetch(`${API}/company/profile.php?user_id=${user.id}`)
      .then((res) => res.json())
    .then((data) => {
  console.log("Company Profile Response:", data);
console.log(company);

  if (
    data.success &&
    data.data &&
    Object.keys(data.data).length > 0
  ) {
    setCompany(data.data);
  } else {
    setCompany(null);
  }

  setLoading(false);
})


      .catch((err) => {
        console.error("Error loading company profile:", err);
        setLoading(false);
      });
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-orange-600"></div>
          <p className="text-gray-500 mt-4">Loading company profile...</p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center">
        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">No company profile found</h3>
        <p className="text-gray-500 mt-2">Please contact administrator to set up company profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-6">
          <div className="bg-white rounded-full p-6 shadow-lg">
            <svg className="h-16 w-16 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold">Company Profile</h1>
            <p className="text-orange-100 mt-1">Complete information about our organization</p>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* LEFT COLUMN - BASIC INFO */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 space-y-6">
          <div className="border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Company Details
            </h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Company Name</label>
              <p className="text-gray-900 font-semibold mt-1 text-lg">{company.company_name || "N/A"}</p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Owner Name</label>
              <p className="text-gray-900 mt-1">{company.owner_name || "N/A"}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Mobile No</label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <svg className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {company.mobile_no || "N/A"}
                </p>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone No</label>
                <p className="text-gray-900 mt-1 flex items-center gap-2">
                  <svg className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {company.phone_no || "N/A"}
                </p>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Email ID</label>
              <p className="text-gray-900 mt-1 flex items-center gap-2">
                <svg className="h-4 w-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {company.email_id || "N/A"}
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</label>
              <p className="text-gray-900 mt-1 flex items-start gap-2">
                <svg className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{company.address || "N/A"}</span>
              </p>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Website</label>
              <p className="text-gray-900 mt-1 flex items-center gap-2">
                <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
                {company.website || "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - REGISTRATION DETAILS */}
        <div className="space-y-6">
          {/* REGISTRATION INFO */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Registration Details
              </h2>
            </div>

            <div className="space-y-4">
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <label className="text-xs font-semibold text-orange-800 uppercase tracking-wide">Company GSTIN</label>
                <p className="text-gray-900 font-mono font-semibold mt-1 text-lg">{company.company_gstin || "N/A"}</p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <label className="text-xs font-semibold text-blue-800 uppercase tracking-wide">EPFO Number</label>
                <p className="text-gray-900 font-mono font-semibold mt-1">{company.epfo_number || "N/A"}</p>
              </div>

              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <label className="text-xs font-semibold text-green-800 uppercase tracking-wide">ESIC Number</label>
                <p className="text-gray-900 font-mono font-semibold mt-1">{company.esic_number || "N/A"}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
  <label className="text-xs font-semibold text-green-800 uppercase tracking-wide">
    Digital Key Expiry Date
  </label>
  <p className="text-gray-900 font-mono font-semibold mt-1">
  {company.digital_key
  ? new Date(company.digital_key).toLocaleDateString("en-IN")
  : "N/A"}

  </p>
</div>

            </div>
          </div>

          {/* BALANCE INFO */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl shadow-md border-2 border-green-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-green-800 uppercase tracking-wide">Current Balance</label>
                <p className="text-3xl font-bold text-green-600 mt-1">
                  ₹{new Intl.NumberFormat("en-IN").format(company.balance || 0)}
                </p>
              </div>
              <div className="bg-white rounded-full p-4 shadow-lg">
                <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER NOTE */}
      <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
        <p className="text-sm text-gray-600 text-center flex items-center justify-center gap-2">
          <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          For any updates to company profile, please contact the administrator
        </p>
      </div>
    </div>
  );
}