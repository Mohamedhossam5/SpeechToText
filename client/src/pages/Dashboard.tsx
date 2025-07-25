import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { NoteCard } from '@/components/NoteCard';
import { NoteForm } from '@/components/NoteForm';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Search, LogOut, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Note {
  _id: string;
  title: string;
  text: string;
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
}

export default function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      navigate('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchNotes();
  }, [navigate]);

  useEffect(() => {
    const filtered = notes.filter(note =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.text.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNotes(filtered);
  }, [notes, searchTerm]);

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:3000/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setNotes(data);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else if (response.status === 404) {
        // No notes found
        setNotes([]);
      } else {
        throw new Error('Failed to fetch notes');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load notes. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate('/login');
  };

  const handleCreateNote = () => {
    setEditingNote(null);
    setIsFormOpen(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setIsFormOpen(true);
  };

  const handleSaveNote = (savedNote: Note) => {
    if (editingNote) {
      setNotes(notes.map(note => note._id === savedNote._id ? savedNote : note));
    } else {
      setNotes([savedNote, ...notes]);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note._id !== id));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-muted-foreground">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Header */}
      <header className="border-b border-glass bg-glass/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <StickyNote className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  My Notes
                </h1>
                <p className="text-sm text-muted-foreground">
                  Welcome back, {user?.name}
                </p>
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={handleLogout}
              className="hover:bg-destructive/20 hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Create */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-glass/50 border-glass backdrop-blur-sm"
            />
          </div>
          <Button
            onClick={handleCreateNote}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Note
          </Button>
        </div>

        {/* Notes Grid */}
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="p-6 bg-gradient-card border-glass backdrop-blur-sm rounded-lg max-w-md mx-auto">
              <StickyNote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                {searchTerm ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm 
                  ? `No notes match "${searchTerm}". Try a different search term.`
                  : 'Start creating your first note to get organized!'
                }
              </p>
              {!searchTerm && (
                <Button 
                  onClick={handleCreateNote}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Note
                </Button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note, index) => (
              <div
                key={note._id}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <NoteCard
                  note={note}
                  onEdit={handleEditNote}
                  onDelete={handleDeleteNote}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Note Form Modal */}
      <NoteForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        note={editingNote}
        onSave={handleSaveNote}
      />
    </div>
  );
}