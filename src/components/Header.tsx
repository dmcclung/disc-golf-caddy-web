import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useToast } from "@/hooks/use-toast";

export const Header = () => {
  const { user, signOut, isAuthenticated } = useAuth();
  const { open } = useAuthModal();
  const { toast } = useToast();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (!error) {
      toast({
        title: "Signed out",
        description: "You've been signed out successfully.",
      });
    }
  };

  return (
    <header className="bg-black text-white px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-bold">
            DG
            <span className="text-primary ml-1 text-3xl">Caddy</span>
          </h1>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <a href="#" className="text-white hover:text-primary transition-colors">
            {/* This is where nav items go */}
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="w-4 h-4" />
                <span className="text-gray-300">
                  {user?.email}
                </span>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                className="bg-primary hover:bg-primary/90 text-white font-medium"
                onClick={() => open('signup')}
              >
                Sign Up Now
              </Button>
              <Button 
                className="bg-accent hover:bg-accent/90 text-white font-medium"
                onClick={() => open('signin')}
              >
                Login
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};