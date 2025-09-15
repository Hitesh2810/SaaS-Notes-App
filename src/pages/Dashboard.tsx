import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StorageService, Note } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Building2, Crown, Users, FileText, Edit, Trash2, LogOut, Zap } from 'lucide-react';
import { NoteForm } from '@/components/NoteForm';
import { NoteCard } from '@/components/NoteCard';
import { InviteModal } from '@/components/InviteModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [subscription, setSubscription] = useState<{ type: 'free' | 'pro'; noteLimit?: number }>({ type: 'free', noteLimit: 3 });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setNotes(StorageService.getNotes(user.tenant));
      setSubscription(StorageService.getSubscription(user.tenant));
    }
  }, [user]);

  const refreshData = () => {
    if (user) {
      setNotes(StorageService.getNotes(user.tenant));
      setSubscription(StorageService.getSubscription(user.tenant));
    }
  };

  const handleCreateNote = (noteData: { title: string; content: string }) => {
    if (!user) return;
    
    if (!StorageService.canCreateNote(user.tenant)) {
      return;
    }

    StorageService.addNote(user.tenant, noteData);
    refreshData();
    setIsCreateModalOpen(false);
  };

  const handleUpdateNote = (id: string, updates: { title: string; content: string }) => {
    if (!user) return;
    StorageService.updateNote(user.tenant, id, updates);
    refreshData();
    setEditingNote(null);
  };

  const handleDeleteNote = (id: string) => {
    if (!user) return;
    StorageService.deleteNote(user.tenant, id);
    refreshData();
  };

  const handleUpgrade = () => {
    if (!user) return;
    StorageService.upgradeSubscription(user.tenant);
    refreshData();
  };

  const canCreateMoreNotes = user ? StorageService.canCreateNote(user.tenant) : false;
  const isAtLimit = subscription.type === 'free' && notes.length >= (subscription.noteLimit || 3);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">SaaS Notes</h1>
                <p className="text-sm text-muted-foreground capitalize">
                  {user.tenant} Organization
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
              {user.role === 'admin' ? (
                <Crown className="w-3 h-3 mr-1" />
              ) : (
                <Users className="w-3 h-3 mr-1" />
              )}
              {user.role}
            </Badge>
            <Button variant="outline" onClick={logout} size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Subscription Status */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome back, {user.email}</h2>
            <div className="flex items-center gap-4">
              <Badge variant={subscription.type === 'pro' ? 'default' : 'outline'}>
                {subscription.type === 'pro' ? (
                  <Zap className="w-3 h-3 mr-1" />
                ) : (
                  <FileText className="w-3 h-3 mr-1" />
                )}
                {subscription.type === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </Badge>
              {subscription.type === 'free' && (
                <span className="text-sm text-muted-foreground">
                  {notes.length} / {subscription.noteLimit} notes used
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <>
                <Button variant="outline" onClick={() => setIsInviteModalOpen(true)}>
                  <Users className="w-4 h-4 mr-2" />
                  Invite User
                </Button>
                {subscription.type === 'free' && (
                  <Button onClick={handleUpgrade} className="gradient-primary">
                    <Zap className="w-4 h-4 mr-2" />
                    Upgrade to Pro
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Upgrade Banner */}
        {isAtLimit && (
          <Alert className="mb-6 border-warning bg-warning/10">
            <Zap className="w-4 h-4" />
            <AlertDescription>
              You've reached the {subscription.noteLimit} note limit for your Free plan.{' '}
              {user.role === 'admin' ? (
                <Button variant="link" className="p-0 h-auto" onClick={handleUpgrade}>
                  Upgrade to Pro
                </Button>
              ) : (
                'Ask your admin to upgrade to Pro for unlimited notes.'
              )}
            </AlertDescription>
          </Alert>
        )}

        {/* Notes Section */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Your Notes</h3>
          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button disabled={!canCreateMoreNotes}>
                <Plus className="w-4 h-4 mr-2" />
                Create Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Note</DialogTitle>
              </DialogHeader>
              <NoteForm onSubmit={handleCreateNote} />
            </DialogContent>
          </Dialog>
        </div>

        {/* Notes Grid */}
        {notes.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle className="mb-2">No notes yet</CardTitle>
              <CardDescription className="mb-4">
                Create your first note to get started
              </CardDescription>
              {canCreateMoreNotes && (
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Note
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={setEditingNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}

        {/* Edit Note Modal */}
        <Dialog open={!!editingNote} onOpenChange={() => setEditingNote(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Note</DialogTitle>
            </DialogHeader>
            {editingNote && (
              <NoteForm
                initialData={editingNote}
                onSubmit={(data) => handleUpdateNote(editingNote.id, data)}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* Invite Modal */}
        <InviteModal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
        />
      </main>
    </div>
  );
};

export default Dashboard;