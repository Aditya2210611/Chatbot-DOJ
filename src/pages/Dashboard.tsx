
import { ChatInterface } from "@/components/chat/ChatInterface";
import { ChatProvider } from "@/contexts/ChatContext";

const Dashboard = () => {
  return (
    <ChatProvider>
      <ChatInterface />
    </ChatProvider>
  );
};

export default Dashboard;
