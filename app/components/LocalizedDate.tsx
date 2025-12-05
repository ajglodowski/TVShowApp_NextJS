"use client";

import { useEffect, useState } from "react";

interface LocalizedDateProps {
  date: Date | string;
  className?: string;
}

export function LocalizedDate({ date, className }: LocalizedDateProps) {
  // Format: month/day/year hour:minutes ampm
  // This is for timestamps (created_at, updated_at) so we WANT local time.
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    if (!date) return;
    const d = new Date(date);
    const month = d.getMonth() + 1;
    const day = d.getDate();
    const year = d.getFullYear();
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    const minutes = d.getMinutes().toString().padStart(2, '0');
    
    setFormatted(`${month}/${day}/${year} ${hours}:${minutes} ${ampm}`);
  }, [date]);

  if (!formatted) return null;

  return <span className={className}>{formatted}</span>;
}

export function LocalizedReleaseDate({ date, className }: LocalizedDateProps) {
  // Format: weekday month/day/year
  // Release dates are typically stored as YYYY-MM-DD (UTC midnight).
  // We want to display that exact date, so we use UTC methods to avoid timezone shifts.
  const [formatted, setFormatted] = useState<string>("");

  useEffect(() => {
    if (!date) return;
    const d = new Date(date);
    const dayOfWeek = d.toLocaleDateString('en-us', { weekday: 'long', timeZone: 'UTC' });
    const day = d.getUTCDate();
    const month = d.getUTCMonth() + 1;
    const year = d.getUTCFullYear();
    
    setFormatted(`${dayOfWeek} ${month}/${day}/${year}`);
  }, [date]);

  if (!formatted) return null;

  return <span className={className}>{formatted}</span>;
}

export function LocalizedDateString({ date, className }: LocalizedDateProps) {
    // Format: Month day(th), year
    // Used for Edit Show date picker display.
    // Like ReleaseDate, we treat this as a date-only value (UTC).
    const [formatted, setFormatted] = useState<string>("");
  
    useEffect(() => {
      if (!date) return;
      const d = new Date(date);
      setFormatted(d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }));
    }, [date]);
  
    if (!formatted) return null;
  
    return <span className={className}>{formatted}</span>;
}

export function LocalizedDaysAway({ date, className }: LocalizedDateProps) {
    const [formatted, setFormatted] = useState<string>("");

    useEffect(() => {
        if (!date) return;
        const now = new Date();
        const releaseDate = new Date(date);
        const diff = releaseDate.getTime() - now.getTime();
        const _days = Math.ceil(diff / (1000 * 60 * 60 * 24)); 
        const daysFloor = Math.floor(diff / (1000 * 60 * 60 * 24));

        const getDaysAwayString = (d: number) => {
            if (d === 1) return "day";
            else return "days";
        }

        if (daysFloor < 0) {
            setFormatted("Out Now");
        } else {
            setFormatted(`${daysFloor} ${getDaysAwayString(daysFloor)} away`);
        }
    }, [date]);

    if (!formatted) return null;
    return <span className={className}>{formatted}</span>;
}

export function LocalizedDaysAgo({ date, className }: LocalizedDateProps) {
    const [formatted, setFormatted] = useState<string>("");

    useEffect(() => {
        if (!date) return;
        const now = new Date();
        const updated = new Date(date);
        const diff = now.getTime() - updated.getTime();
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        
        if (days === 0) setFormatted("Today");
        else if (days === 1) setFormatted("Yesterday");
        else setFormatted(`${days} days ago`);
    }, [date]);

    if (!formatted) return null;
    return <span className={className}>{formatted}</span>;
}
