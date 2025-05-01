
import { useAuth } from "@/contexts/AuthContext";
import Dashboard from "./Dashboard";
import Auth from "./Auth";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Loading...</div>
      </div>
    );
  }
  
  return isAuthenticated ? <Dashboard /> : <Auth />;
};

export default Index;
