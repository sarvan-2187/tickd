"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface DatePickerProps {
  date: Date;
  setDate: (date: Date) => void;
}

export function DatePicker({ date, setDate }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "flex items-center gap-3 justify-start text-left font-bold text-4xl hover:opacity-80 transition-opacity text-foreground font-serif",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "MMMM d, yyyy") : <span>Pick a date</span>}
          <CalendarIcon className="w-7 h-7 text-amber-500/50" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 border border-border glass glow-amber" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => d && setDate(d)}
          className="bg-transparent"
        />
      </PopoverContent>
    </Popover>
  );
}
