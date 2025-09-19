// utils/maintenanceHelpers.js
export const statusColor = (s) =>
  ({ pending: 'text-yellow-700', 'in-progress': 'text-blue-700', done: 'text-green-700' }[s]);

export const statusLabel = (s) =>
  ({ pending: 'Pending', 'in-progress': 'In Progress', done: 'Done' }[s]);