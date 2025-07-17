"use client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { POSITION_OPTIONS } from "@/lib/constant";

interface PositionSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export function PositionSelect({ value, onChange }: PositionSelectProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full sm:w-[200px]  ">
        <SelectValue placeholder="Select position" />
      </SelectTrigger>
      <SelectContent>
        {POSITION_OPTIONS.map((position) => (
          <SelectItem key={position.value} value={position.value}>
            {position.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}