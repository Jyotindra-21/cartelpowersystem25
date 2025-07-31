'use client';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import * as LucideIcons from 'lucide-react';
import { ComponentType, SVGProps, useState, useMemo } from 'react';
import { Search } from 'lucide-react';

const colorOptions = [
    'bg-red-500', 'bg-pink-500', 'bg-purple-500',
    'bg-indigo-500', 'bg-blue-500', 'bg-cyan-500',
    'bg-teal-500', 'bg-green-500', 'bg-lime-500',
    'bg-yellow-500', 'bg-amber-500', 'bg-orange-500'
];

const commonIcons: (keyof typeof LucideIcons)[] = [
    'Calendar', 'Clock', 'AlertCircle', 'CheckCircle',
    'Plus', 'Minus', 'Settings', 'User',
    'MessageSquare', 'Mail', 'Phone', 'MapPin',
    'Heart', 'Star', 'Bookmark', 'Bell'
];

type LucideIcon = ComponentType<SVGProps<SVGSVGElement>>;

export function EventForm({
    event,
    onSave,
    onCancel
}: {
    event?: any;
    onSave: (event: any) => void;
    onCancel: () => void;
}) {
    const [title, setTitle] = useState(event?.title || '');
    const [description, setDescription] = useState(event?.description || '');
    const [date, setDate] = useState<Date | undefined>(event?.date ? new Date(event.date) : undefined);
    const [time, setTime] = useState(event?.date ? format(new Date(event.date), 'HH:mm') : '12:00');
    const [color, setColor] = useState(event?.color || colorOptions[0]);
    const [iconName, setIconName] = useState<keyof typeof LucideIcons>(event?.icon || 'Calendar');
    const [showIconPicker, setShowIconPicker] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredIcons = useMemo(() => {
        if (!searchTerm.trim()) return commonIcons;
        return commonIcons.filter(name =>
            name.toLowerCase().includes(searchTerm.trim().toLowerCase())
        );
    }, [searchTerm]);

    const IconComponent = LucideIcons[iconName] as LucideIcon;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!date) return;

        const [hours, minutes] = time.split(':').map(Number);
        const eventDate = new Date(date);
        eventDate.setHours(hours, minutes);

        const newEvent = {
            id: event?.id || Date.now().toString(),
            title,
            description,
            date: eventDate.toISOString(),
            color,
            icon: iconName
        };

        onSave(newEvent);
    };

    return (
        <Card className="border-0 shadow-none">
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Meeting with team"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Description (optional)</Label>
                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Discuss project timeline"
                            rows={3}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Date</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="w-full justify-start">
                                        <LucideIcons.Calendar className="mr-2 h-4 w-4" />
                                        {date ? format(date, 'MMM dd') : 'Select date'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-2">
                            <Label>Time</Label>
                            <div className="relative">
                                <LucideIcons.Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="time"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Icon & Color</Label>
                        <div className="flex items-center gap-3">
                            <Popover open={showIconPicker} onOpenChange={setShowIconPicker}>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" size="icon" className="h-10 w-10">
                                        {IconComponent && <IconComponent className="h-5 w-5" />}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-64">
                                    <div className="relative mb-2">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search icons..."
                                            className="pl-10"
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            autoFocus
                                        />
                                    </div>
                                    <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                                        {filteredIcons.map((name) => {
                                            const Icon = LucideIcons[name] as LucideIcon;
                                            return (
                                                <Button
                                                    key={name}
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setIconName(name);
                                                        setShowIconPicker(false);
                                                    }}
                                                >
                                                    {Icon && <Icon className="h-5 w-5" />}
                                                </Button>
                                            );
                                        })}
                                    </div>
                                </PopoverContent>
                            </Popover>

                            <div className="flex-1 flex gap-1 flex-wrap">
                                {colorOptions.map((colorOption) => (
                                    <button
                                        key={colorOption}
                                        type="button"
                                        onClick={() => setColor(colorOption)}
                                        className={`h-6 w-6 rounded-full ${colorOption} ${color === colorOption ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
                                        aria-label={`Color ${colorOption}`}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-4">
                        <Button variant="outline" type="button" onClick={onCancel}>
                            Cancel
                        </Button>
                        <Button type="submit">
                            {event ? 'Update' : 'Create'} Event
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}