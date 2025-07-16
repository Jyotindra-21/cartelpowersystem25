'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface CodeEditorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  initialValue: string;
  onSave: (value: string) => void;
  language?: 'svg' | 'json';
}

export function CodeEditorModal({
  open,
  onOpenChange,
  title,
  description,
  initialValue,
  onSave,
  language = 'svg'
}: CodeEditorModalProps) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="flex-1 min-h-0 overflow-hidden"> {/* Changed this line */}
          <Textarea
            className="h-full w-full font-mono text-sm resize-none"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={language === 'svg' ? '<svg>...</svg>' : '[]'}
          />
        </div>
        <DialogFooter className="mt-4"> {/* Added margin */}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            onSave(value);
            onOpenChange(false);
          }}>
            Apply Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}