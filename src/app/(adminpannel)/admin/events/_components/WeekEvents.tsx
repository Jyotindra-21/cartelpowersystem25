'use client';

import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { EventCard } from './EventCard';
import { EventDialog } from './EventDialog';

export function WeekEvents({
  initialEvents,
  onEventChange
}: {
  initialEvents: any[];
  onEventChange?: (events: any[]) => void;
}) {
  const [events, setEvents] = useState<any[]>(initialEvents);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<any>(null);

  // Update local state when initialEvents prop changes
  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const thisWeekEvents = events
    ?.filter(event => {
      const eventDate = new Date(event.date);
      const now = new Date();
      const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      return eventDate > now && eventDate < nextWeek;
    })
    ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const handleSave = (updatedEvent: any) => {
    const updatedEvents = currentEvent?.id
      ? events.map(e => e.id === currentEvent.id ? updatedEvent : e)
      : [...events, updatedEvent];

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    if (onEventChange) onEventChange(updatedEvents);
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    const updatedEvents = events.filter(event => event.id !== currentEvent?.id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    if (onEventChange) onEventChange(updatedEvents);
    setDeleteDialogOpen(false);
  };

  return (
    <>
      <div className='space-y-2'>
        {thisWeekEvents?.length > 0 ? (
          thisWeekEvents.slice(0, 3).map(event => (
            <EventCard
              key={event.id}
              event={event}
              onEdit={() => {
                setCurrentEvent(event);
                setEditDialogOpen(true);
              }}
              onDelete={() => {
                setCurrentEvent(event);
                setDeleteDialogOpen(true);
              }}
            />
          ))
        ) : (
          <p className="text-sm text-muted-foreground">No events this week</p>
        )}

      </div>

      <EventDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        event={currentEvent}
        onSave={handleSave}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Event</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentEvent?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}