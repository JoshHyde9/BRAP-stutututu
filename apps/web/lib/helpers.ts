import { format, isToday, isYesterday } from "date-fns";

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);

  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "dd MMMM yyyy");
};

export const formatDate = (date: Date) => {
  if (isToday(date)) return format(date, "HH:mm");
  if (isYesterday(date)) return `Yesterday at ${format(date, "HH:mm")}`;
  return format(date, "dd/MM/yyyy, HH:mm");
};
