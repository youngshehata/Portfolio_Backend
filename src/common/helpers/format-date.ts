export function formatDate(date: Date) {
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export function setDateToMax(date: Date) {
  date.setHours(23, 59, 59, 999);
  return date;
}

export function setDateToMin(date: Date) {
  date.setHours(0, 0, 0, 0);
  return date;
}
