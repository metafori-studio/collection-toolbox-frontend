export const toYearRange = (startDatetime: string | null | undefined, endDatetime: string | null | undefined): string | null => {
  const start = startDatetime ? startDatetime.substring(0, 4) : null;
  const end = endDatetime ? endDatetime.substring(0, 4) : null;
  if (!start && !end) {
    return null;
  }
  if (start && !end) {
    return start;
  }
  if (!start && end) {
    return end;
  }
  if (start === end) {
    return start;
  }
  return `${start} - ${end}`;
};
