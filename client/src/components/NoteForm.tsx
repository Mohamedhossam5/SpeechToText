import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useToast } from '@/hooks/use-toast';
import { Mic, MicOff, Type } from 'lucide-react';

// Web Speech API types
interface SpeechRecognitionEvent {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

interface Note {
  _id?: string;
  title: string;
  text: string;
}

interface NoteFormProps {
  isOpen: boolean;
  onClose: () => void;
  note?: Note | null;
  onSave: (note: Note) => void;
}

export const NoteForm = ({ isOpen, onClose, note, onSave }: NoteFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    text: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'type' | 'voice'>('type');
  const [isRecording, setIsRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check for speech recognition support
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';
        
        recognitionRef.current.onresult = (event) => {
          let finalTranscript = '';
          let interimTranscript = '';
          
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript;
            } else {
              interimTranscript += transcript;
            }
          }
          
          if (finalTranscript) {
            setFormData(prev => ({
              ...prev,
              text: prev.text + finalTranscript + ' '
            }));
          }
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
          toast({
            variant: "destructive",
            title: "Speech Recognition Error",
            description: "Failed to recognize speech. Please try again.",
          });
        };
        
        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, [toast]);

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        text: note.text
      });
    } else {
      setFormData({
        title: '',
        text: ''
      });
    }
  }, [note, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');

      const noteData = {
        title: formData.title,
        text: formData.text
      };

      const url = note ? `http://localhost:3000/api/notes/${note._id}` : 'http://localhost:3000/api/notes';
      const method = note ? 'PATCH' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(noteData),
      });

      const data = await response.json();

      if (response.ok) {
        onSave(data);
        toast({
          title: note ? "Note updated" : "Note created",
          description: `Your note has been successfully ${note ? 'updated' : 'created'}.`,
        });
        onClose();
      } else {
        throw new Error(data.message || 'Failed to save note');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to ${note ? 'update' : 'create'} note. Please try again.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const startRecording = () => {
    if (recognitionRef.current && !isRecording) {
      setIsRecording(true);
      recognitionRef.current.start();
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const clearContent = () => {
    setFormData(prev => ({ ...prev, text: '' }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-card border-glass backdrop-blur-xl max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl bg-gradient-primary bg-clip-text text-transparent">
            {note ? 'Edit Note' : 'Create New Note'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Enter note title"
              value={formData.title}
              onChange={handleChange}
              required
              className="bg-muted/50 border-glass"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="text">Content</Label>
              
              {speechSupported && (
                <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
                  <Button
                    type="button"
                    variant={inputMode === 'type' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setInputMode('type')}
                    className="h-8 px-3"
                  >
                    <Type className="w-4 h-4 mr-1" />
                    Type
                  </Button>
                  <Button
                    type="button"
                    variant={inputMode === 'voice' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setInputMode('voice')}
                    className="h-8 px-3"
                  >
                    <Mic className="w-4 h-4 mr-1" />
                    Voice
                  </Button>
                </div>
              )}
            </div>

            {inputMode === 'type' ? (
              <Textarea
                id="text"
                name="text"
                placeholder="Write your note content here..."
                value={formData.text}
                onChange={handleChange}
                required
                rows={8}
                className="bg-muted/50 border-glass resize-none"
              />
            ) : (
              <div className="space-y-3">
                <div className="relative">
                  <Textarea
                    id="text"
                    name="text"
                    placeholder="Click record and start speaking..."
                    value={formData.text}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="bg-muted/50 border-glass resize-none"
                  />
                  
                  {isRecording && (
                    <div className="absolute inset-0 bg-red-500/10 border-2 border-red-500/30 rounded-md animate-pulse pointer-events-none" />
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "secondary"}
                    onClick={isRecording ? stopRecording : startRecording}
                    disabled={isLoading}
                    className="flex-1"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-4 h-4 mr-2" />
                        Stop Recording
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearContent}
                    disabled={isLoading || !formData.text}
                  >
                    Clear
                  </Button>
                </div>
                
                {isRecording && (
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground animate-fade-in">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                    Listening... Speak clearly into your microphone
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  {note ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                note ? 'Update Note' : 'Create Note'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};