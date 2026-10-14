import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Send, Smile, MoreHorizontal } from "lucide-react";
import { useCourseChat } from "@/hooks/useCourseChat";
import { useAuth } from "@/hooks/useAuth";
import { AuthGate } from "./AuthGate";
import { formatDistanceToNow } from "date-fns";

interface CourseChatProps {
  courseId: string;
}

const DISC_GOLF_EMOJIS = ['🥏', '⛓️', '🎯', '🌲', '🏆', '💪', '🔥', '👏'];

export const CourseChat = ({ courseId }: CourseChatProps) => {
  const [message, setMessage] = useState("");
  const [showEmojis, setShowEmojis] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  
  const { 
    data: messages = [], 
    sendMessage, 
    deleteMessage, 
    isSending,
    isDeleting 
  } = useCourseChat(courseId);

  // Auto-scroll to bottom when new messages arrive - but only for new messages
  useEffect(() => {
    if (messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]); // Only trigger on message count change

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage({ message: message.trim() });
      setMessage("");
    }
  };

  const handleSendEmoji = (emoji: string) => {
    sendMessage({ message: "", emojiType: emoji });
    setShowEmojis(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const chatContent = (
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="flex gap-3 group">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={msg.profiles?.avatar_url} />
                  <AvatarFallback className="text-xs">
                    {getInitials(msg.profiles?.full_name || msg.profiles?.username)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">
                      {msg.profiles?.username || msg.profiles?.full_name || 'Player'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {msg.emoji_type ? (
                      <Badge variant="secondary" className="text-lg px-2 py-1">
                        {msg.emoji_type}
                      </Badge>
                    ) : (
                      <p className="text-sm bg-muted px-3 py-2 rounded-lg break-words">
                        {msg.message}
                      </p>
                    )}
                    
                    {/* Delete button for own messages */}
                    {user?.id === msg.user_id && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                        disabled={isDeleting}
                        onClick={() => deleteMessage(msg.id)}
                      >
                        <MoreHorizontal className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="border-t p-4 space-y-2">
        {/* Emoji Picker */}
        {showEmojis && (
          <div className="flex gap-1 p-2 bg-muted rounded-lg">
            {DISC_GOLF_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg hover:bg-accent"
                onClick={() => handleSendEmoji(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
        )}
        
        {/* Message Input */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmojis(!showEmojis)}
            className="flex-shrink-0"
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            disabled={isSending}
            className="flex-1"
          />
          
          <Button 
            onClick={handleSendMessage} 
            disabled={!message.trim() || isSending}
            size="sm"
            className="flex-shrink-0"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <AuthGate
      feature="chat"
      title="Join the Course Discussion"
      description="Connect with other disc golfers and share real-time updates about course conditions, tips, and experiences."
    >
      {chatContent}
    </AuthGate>
  );
};