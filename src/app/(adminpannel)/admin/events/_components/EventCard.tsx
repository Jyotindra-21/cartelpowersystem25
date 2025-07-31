'use client';

import { Clock, Edit, Trash2 } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { LucideIcon } from 'lucide-react';

const colorClasses = {
  'bg-red-500': 'bg-red-100 text-red-800',
  'bg-pink-500': 'bg-pink-100 text-pink-800',
  'bg-purple-500': 'bg-purple-100 text-purple-800',
  'bg-indigo-500': 'bg-indigo-100 text-indigo-800',
  'bg-blue-500': 'bg-blue-100 text-blue-800',
  'bg-cyan-500': 'bg-cyan-100 text-cyan-800',
  'bg-teal-500': 'bg-teal-100 text-teal-800',
  'bg-green-500': 'bg-green-100 text-green-800',
  'bg-lime-500': 'bg-lime-100 text-lime-800',
  'bg-yellow-500': 'bg-yellow-100 text-yellow-800',
  'bg-amber-500': 'bg-amber-100 text-amber-800',
  'bg-orange-500': 'bg-orange-100 text-orange-800',
};

export function EventCard({
  event,
  onEdit,
  onDelete,
}: {
  event: any;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Safely get the icon component with proper typing
  const IconComponent = event?.icon 
    ? (LucideIcons as unknown as Record<string, LucideIcon>)[event.icon] 
    : null;

  return (
    <Card className={`${colorClasses[event.color as keyof typeof colorClasses]} border-0 py-1`}>
      <CardContent className="p-1">
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg ${colorClasses[event.color as keyof typeof colorClasses]} bg-opacity-30`}>
            {IconComponent && <IconComponent className="h-5 w-5" />}
          </div>
          <div className="flex-1">
            <h3 className="font-medium">{event.title}</h3>
            {event.description && (
              <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
            )}
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDate(event.date)}</span>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={onEdit}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={onDelete}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}