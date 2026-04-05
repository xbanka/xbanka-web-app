import { timeAgo } from "@/lib/formatDate";
import { useEffect, useState } from "react";

export function TimeAgoComponent({ date }: { date: string }) {
  const [value, setValue] = useState(timeAgo(date));

  useEffect(() => {
    const interval = setInterval(() => {
      setValue(timeAgo(date));
    }, 60000); // update every minute

    return () => clearInterval(interval);
  }, [date]);

  return <span>{value}</span>;
}