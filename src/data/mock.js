export const employees = [
  { id: "EMP001", name: "Aarav Kumar", role: "Developer", email: "aarav@example.com", status: "active" },
  { id: "EMP002", name: "Diya Nair", role: "Designer", email: "diya@example.com", status: "active" },
];

export const tasks = [
  { id: "T-1001", title: "Build login page", assignee: "EMP001", status: "in-progress", progress: 60 },
  { id: "T-1002", title: "Design invoices", assignee: "EMP002", status: "pending", progress: 10 },
];

export const notifications = [
  { id: 1, title: "Payslip generated", body: "Your November payslip is ready.", date: "2025-12-20" },
  { id: 2, title: "Task assigned", body: "New task: Build EPFO form.", date: "2025-12-22" },
];

export const invoices = [
  { id: "INV-001", employeeId: "EMP001", amount: 25000, status: "paid", date: "2025-12-10" },
  { id: "INV-002", employeeId: "EMP002", amount: 18000, status: "pending", date: "2025-12-18" },
];

export const payments = [
  { id: "PAY-001", ref: "INV-001", method: "Razorpay", amount: 25000, status: "successful", date: "2025-12-11" },
  { id: "PAY-002", ref: "INV-002", method: "UPI", amount: 18000, status: "pending", date: "2025-12-19" },
];

export const epfoRequests = [
  { id: "EPFO-001", employeeId: "EMP001", type: "KYC Update", status: "processing", date: "2025-12-15" },
];

export const reports = [
  { id: "RPT-001", title: "Monthly Payments", range: "Nov 2025", generatedBy: "Admin" },
  { id: "RPT-002", title: "Pending Tasks", range: "Dec 2025", generatedBy: "Manager" },
];
