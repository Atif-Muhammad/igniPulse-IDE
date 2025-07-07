
export function groupDates(dateItem) {
  const date = new Date(dateItem);
  const dateStr = date.toDateString();

  const now = new Date();
  const todayStr = now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();
  let label;
  if (dateStr === todayStr) {
    label = "Today";
  } else if (dateStr === yesterdayStr) {
    label = "Yesterday";
  } else {
    label = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  return label;
}
