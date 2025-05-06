function formatDateToLocal(dateString) {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('uk-UA', {
    timeZone: 'Europe/Kyiv',
    dateStyle: 'short',
    timeStyle: 'medium'
  }).format(date);
}

export { formatDateToLocal };