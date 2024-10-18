export function dateFormatter(timestamp) {
  const date = new Date(timestamp * 1000); // Timestamp'i Date objesine dönüştür
  const hours = String(date.getHours()).padStart(2, "0"); // Saat (2 haneli)
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}
