'use client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EventForm } from './EventForm';

export function EventDialog({
  open,
  onOpenChange,
  event,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: any;
  onSave: (event: any) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{event ? 'Edit Event' : 'Create Event'}</DialogTitle>
        </DialogHeader>
        <EventForm
          event={event}
          onSave={(updatedEvent) => {
            onSave(updatedEvent);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}