import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useAuthModal } from '@/hooks/useAuthModal';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
export const AuthModal = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');
  const [isResetMode, setIsResetMode] = useState(false);
  const {
    signIn,
    signUp,
    isAuthenticated
  } = useAuth();
  const {
    isOpen,
    defaultTab,
    close
  } = useAuthModal();
  const {
    toast
  } = useToast();

  // Set active tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
      setError(null);
      // Reset form
      setEmail('');
      setPassword('');
      setUsername('');
      setIsResetMode(false);
    }
  }, [isOpen, defaultTab]);

  // Close modal if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated && isOpen) {
      close();
    }
  }, [isAuthenticated, isOpen, close]);
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error.message);
        return;
      }
      toast({
        title: "Welcome back!",
        description: "You've been signed in successfully."
      });
      setPassword('');
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await signUp(email, password, { username });
      if (error) {
        setError(error.message);
        return;
      }
      toast({
        title: "Account created!",
        description: "Check your email to verify your account."
      });
      setPassword('');
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const redirectUrl = `${window.location.origin}/auth?type=recovery`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: redirectUrl,
      });
      if (error) {
        setError(error.message);
        return;
      }
      toast({
        title: "Reset email sent",
        description: "Check your inbox for the password reset link.",
      });
      setIsResetMode(false);
      setActiveTab('signin');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };
  return <Dialog open={isOpen} onOpenChange={(open) => { if (!open) close(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Welcome to DG Caddy</DialogTitle>
          <DialogDescription>
            Sign in to access all course features
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={value => { if (isLoading) return; setActiveTab(value as 'signin' | 'signup'); if (value === 'signup') { setIsResetMode(false); } }} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="signin" disabled={isLoading}>Sign In</TabsTrigger>
            <TabsTrigger value="signup" disabled={isLoading}>Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            {isResetMode ? (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reset-email">Email</Label>
                  <Input
                    id="reset-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription role="alert" aria-live="assertive">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send reset link
                </Button>
                <div className="text-sm text-muted-foreground text-center">
                  Remembered your password?{' '}
                  <Button
                    type="button"
                    variant="link"
                    disabled={isLoading}
                    onClick={() => {
                      setIsResetMode(false);
                      setError(null);
                    }}
                  >
                    Back to sign in
                  </Button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    name="email"
                    autoComplete="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                </div>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription role="alert" aria-live="assertive">{error}</AlertDescription>
                  </Alert>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    disabled={isLoading}
                    onClick={() => {
                      setIsResetMode(true);
                      setError(null);
                    }}
                  >
                    Forgot password?
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input id="signup-email" type="email" name="email" autoComplete="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-username">Username (Optional)</Label>
                <Input id="signup-username" type="text" name="username" autoComplete="username" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input id="signup-password" type="password" name="new-password" autoComplete="new-password" value={password} onChange={e => setPassword(e.target.value)} required />
              </div>
              {error && <Alert variant="destructive">
                  <AlertDescription role="alert" aria-live="assertive">{error}</AlertDescription>
                </Alert>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign Up
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>;
};