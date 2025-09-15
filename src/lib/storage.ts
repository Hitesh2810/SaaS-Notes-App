export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubscriptionPlan {
  type: 'free' | 'pro';
  noteLimit?: number;
}

const NOTES_STORAGE_KEY = 'saas-notes-data';
const SUBSCRIPTION_STORAGE_KEY = 'saas-notes-subscriptions';

export class StorageService {
  // Get tenant-specific storage key
  private static getTenantKey(tenant: string, key: string): string {
    return `${key}-${tenant}`;
  }

  // Notes management
  static getNotes(tenant: string): Note[] {
    try {
      const key = this.getTenantKey(tenant, NOTES_STORAGE_KEY);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  static saveNotes(tenant: string, notes: Note[]): void {
    const key = this.getTenantKey(tenant, NOTES_STORAGE_KEY);
    localStorage.setItem(key, JSON.stringify(notes));
  }

  static addNote(tenant: string, note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const notes = this.getNotes(tenant);
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes.push(newNote);
    this.saveNotes(tenant, notes);
    return newNote;
  }

  static updateNote(tenant: string, id: string, updates: Partial<Pick<Note, 'title' | 'content'>>): Note | null {
    const notes = this.getNotes(tenant);
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) return null;

    notes[index] = {
      ...notes[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.saveNotes(tenant, notes);
    return notes[index];
  }

  static deleteNote(tenant: string, id: string): boolean {
    const notes = this.getNotes(tenant);
    const filtered = notes.filter(n => n.id !== id);
    if (filtered.length === notes.length) return false;
    
    this.saveNotes(tenant, filtered);
    return true;
  }

  // Subscription management
  static getSubscription(tenant: string): SubscriptionPlan {
    try {
      const key = this.getTenantKey(tenant, SUBSCRIPTION_STORAGE_KEY);
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : { type: 'free', noteLimit: 3 };
    } catch {
      return { type: 'free', noteLimit: 3 };
    }
  }

  static upgradeSubscription(tenant: string): void {
    const key = this.getTenantKey(tenant, SUBSCRIPTION_STORAGE_KEY);
    const proSubscription: SubscriptionPlan = { type: 'pro' };
    localStorage.setItem(key, JSON.stringify(proSubscription));
  }

  // Check if tenant can create more notes
  static canCreateNote(tenant: string): boolean {
    const subscription = this.getSubscription(tenant);
    if (subscription.type === 'pro') return true;
    
    const notes = this.getNotes(tenant);
    return notes.length < (subscription.noteLimit || 3);
  }
}