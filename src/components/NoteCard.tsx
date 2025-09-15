import React from 'react';
import { Note } from '@/lib/storage';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const updatedAt = formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true });

  return (
    <Card className="card-elevated group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg line-clamp-1">{note.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <Clock className="w-3 h-3" />
              {updatedAt}
            </CardDescription>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(note)}
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(note.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {note.content}
        </p>
      </CardContent>
    </Card>
  );
}