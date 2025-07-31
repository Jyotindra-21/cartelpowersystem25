'use client';

import { Button } from '@/components/ui/button';
import { motion } from "framer-motion"
import { Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { EventDialog } from './_components/EventDialog';
import { EventCard } from './_components/EventCard';
import { Skeleton } from '@/components/ui/skeleton';

type Event = {
  id: string;
  title: string;
  description?: string;
  date: string;
  color: string;
  icon: string;
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEvents = () => {
      const storedEvents = localStorage.getItem('events');
      if (storedEvents) {
        const parsedEvents = JSON.parse(storedEvents);
        const now = new Date();
        const activeEvents = parsedEvents.filter((event: Event) => new Date(event.date) > now);
        setEvents(activeEvents);
      }
      setIsLoading(false);
    };

    // Simulate loading delay for better UX
    const timer = setTimeout(loadEvents, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleSave = (updatedEvent: Event) => {
    const updatedEvents = currentEvent?.id
      ? events.map(e => e.id === currentEvent.id ? updatedEvent : e)
      : [...events, updatedEvent];

    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEditDialogOpen(false);
  };

  const handleDelete = () => {
    const updatedEvents = events.filter(event => event.id !== currentEvent?.id);
    setEvents(updatedEvents);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setDeleteDialogOpen(false);
  };

  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.date).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  // Sort dates chronologically
  const sortedDates = Object.keys(groupedEvents).sort((a, b) =>
    new Date(a).getTime() - new Date(b).getTime()
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            Your Events
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Welcome to Your Events Hub!
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-4"
        >
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <Button
              onClick={() => {
                setCurrentEvent(null);
                setEditDialogOpen(true);
              }}
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Event
            </Button>
          </div>
        </motion.div>
      </div>


      {isLoading ? (
        <div className="space-y-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-8 w-48 rounded-lg" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(3)].map((_, j) => (
                  <Skeleton key={j} className="h-36 rounded-xl" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {sortedDates.length > 0 ? (
            sortedDates.map((date) => (
              <section key={date} className="space-y-4">
                <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm pb-2 pt-4">
                  <h2 className="text-xl font-semibold tracking-tight flex items-center gap-2">
                    <span className="text-primary">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}
                    </span>
                    <span className="text-muted-foreground">
                      {new Date(date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedEvents[date]
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map(event => (
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
                    ))}
                </div>
              </section>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <div className="w-24 h-24 rounded-full bg-secondary/20 flex items-center justify-center">
                <Plus className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight">No events scheduled</h3>
              <p className="text-muted-foreground text-center max-w-md">
                You don't have any upcoming events. Click the button above to add your first event!
              </p>
              <Button
                onClick={() => {
                  setCurrentEvent(null);
                  setEditDialogOpen(true);
                }}
                className="mt-4"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Event
              </Button>
            </div>
          )}
        </div>
      )}

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
    </div>
  );
}