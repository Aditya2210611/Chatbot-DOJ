
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut, Scale } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onToggleSidebar: () => void;
}

export function Header({ onToggleSidebar }: HeaderProps) {
  const { currentUser, logout } = useAuth();
  
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Scale className="h-6 w-6 text-primary" />
          <h1 className={cn(
            "text-xl font-bold tracking-tight",
            "bg-gradient-to-r from-law to-law-accent text-transparent bg-clip-text"
          )}>
            ChatBot-DOJ
          </h1>
        </div>
        
        <div className="flex items-center gap-2">
          <ThemeToggle />
          
          <Button
            variant="ghost" 
            size="icon"
            onClick={onToggleSidebar}
            aria-label="Toggle chat history"
            className="md:flex"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="h-5 w-5"
            >
              <rect x="4" y="4" width="16" height="6" rx="2" />
              <rect x="4" y="14" width="16" height="6" rx="2" />
            </svg>
          </Button>
          
          {currentUser && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={logout}
              aria-label="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
