import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { StickyNote, ArrowRight, Shield, Zap, Globe } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-background">
      {/* Navigation */}
      <nav className="bg-card/80 backdrop-blur-md border-b border-border/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <StickyNote className="h-8 w-8 text-primary mr-2" />
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Smart Notes
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild size="sm" className="bg-gradient-primary">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-gradient-primary rounded-2xl shadow-glow animate-glow-pulse">
                <StickyNote className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Smart Notes
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto animate-slide-in">
              Organize your thoughts, boost your productivity, and never lose an important idea again.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in">
              <Button 
                asChild
                size="lg"
                className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
              >
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button 
                asChild
                variant="outline" 
                size="lg"
                className="border-glass bg-glass/50 backdrop-blur-sm hover:bg-glass text-lg px-8 py-6"
              >
                <Link to="/login">
                  Sign In
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            Why Choose Smart Notes?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience the perfect blend of simplicity and power in note-taking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-8 bg-gradient-card border-glass backdrop-blur-sm rounded-xl hover:shadow-glow transition-all duration-300 animate-fade-in">
            <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Secure & Private</h3>
            <p className="text-muted-foreground">
              Your notes are encrypted and stored securely. Only you have access to your content.
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-card border-glass backdrop-blur-sm rounded-xl hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Lightning Fast</h3>
            <p className="text-muted-foreground">
              Create, edit, and search through your notes instantly with our optimized interface.
            </p>
          </div>

          <div className="text-center p-8 bg-gradient-card border-glass backdrop-blur-sm rounded-xl hover:shadow-glow transition-all duration-300 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="p-3 bg-primary/20 rounded-lg w-fit mx-auto mb-4">
              <Globe className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Access Anywhere</h3>
            <p className="text-muted-foreground">
              Sync your notes across all devices and access them from anywhere in the world.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-card border-glass backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
              Ready to Get Organized?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join thousands of users who have transformed their productivity with Smart Notes
            </p>
            <Button 
              asChild
              size="lg"
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300 text-lg px-8 py-6"
            >
              <Link to="/register">
                Start Taking Notes Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
