import { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useChatThread } from "@/hooks/useChatStore";
import {
  addMessage,
  removeThread,
  updateMessageInviteStatus,
  addVirtualDateInvite,
  updateMessageStatus,
  setTyping,
  ChatThread,
  ChatMessage,
  ReplyPreview,
} from "@/lib/chatStore";
import { toast } from "sonner";
import ReportDialog from "@/components/discover/ReportDialog";
import BlockDialog from "@/components/discover/BlockDialog";
import VirtualDateInvite from "./VirtualDateInvite";
import VirtualDateRoom from "./VirtualDateRoom";
import VirtualDateInviteBubble from "./VirtualDateInviteBubble";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";


export default function ChatDetail({
  thread,
  onBack,
}: {
  thread: ChatThread;
  onBack: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [blockOpen, setBlockOpen] = useState(false);
  const [dateInviteOpen, setDateInviteOpen] = useState(false);
  const [dateRoomOpen, setDateRoomOpen] = useState(false);
  const [replyingTo, setReplyingTo] = useState<ReplyPreview | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fresh = useChatThread(thread.id);
  const messages = fresh?.messages || thread.messages;

  // Auto-scroll to bottom on new messages or typing indicator
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, fresh?.typing]);

  // Simulate send lifecycle: sending → sent (with a small chance of failure
  // so users can hit retry). Then trigger partner typing + auto-reply.
  const simulateLifecycle = (msgId: string, willFail = false) => {
    if (willFail) {
      window.setTimeout(() => updateMessageStatus(thread.id, msgId, "failed"), 900);
      return;
    }
    window.setTimeout(() => {
      updateMessageStatus(thread.id, msgId, "sent");
      setTyping(thread.id, true);
      window.setTimeout(() => {
        setTyping(thread.id, false);
        addMessage(thread.id, "", "them", "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80");
      }, 1800);
    }, 600);
  };

  const handleMenuAction = (action: "disconnect" | "block" | "report") => {
    setMenuOpen(false);
    switch (action) {
      case "disconnect":
        removeThread(thread.id);
        toast.success(`Connection with ${thread.name} has been closed.`);
        onBack();
        break;
      case "block":
        setBlockOpen(true);
        break;
      case "report":
        setReportOpen(true);
        break;
    }
  };

  const handleSend = (text: string, image?: string) => {
    const id = addMessage(thread.id, text, "me", image, undefined, replyingTo || undefined);
    setReplyingTo(null);
    // ~10% chance the message "fails" so users can experience the retry state
    const willFail = Math.random() < 0.1;
    simulateLifecycle(id, willFail);
  };

  const handleReply = (msg: ChatMessage) => {
    setReplyingTo({ id: msg.id, sender: msg.sender, text: msg.text, image: msg.image });
  };

  const handleRetry = (msg: ChatMessage) => {
    updateMessageStatus(thread.id, msg.id, "sending");
    simulateLifecycle(msg.id, false);
  };

  const handleVirtualDateConfirm = () => {
    setDateInviteOpen(false);
    // Add invite message from "me"
    addVirtualDateInvite(thread.id, "me");

    // Simulate partner receiving the invite after a delay
    setTimeout(() => {
      addVirtualDateInvite(thread.id, "them");
      toast(`${thread.name} received your Virtual Date invite! 🎥`, {
        duration: 3000,
      });
    }, 1500);
  };

  const handleInviteJoin = (msgId: string) => {
    updateMessageInviteStatus(thread.id, msgId, "accepted");
    setDateRoomOpen(true);
  };

  const handleInviteDecline = (msgId: string) => {
    updateMessageInviteStatus(thread.id, msgId, "declined");
    addMessage(thread.id, "Maybe next time! 😊", "them");
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-background overflow-hidden">
      {/* Fixed header */}
      <div className="shrink-0">
        <ChatHeader
          thread={thread}
          onBack={onBack}
          onDateRoom={() => setDateInviteOpen(true)}
          onMenuAction={handleMenuAction}
          menuOpen={menuOpen}
          setMenuOpen={setMenuOpen}
        />
      </div>

      {/* Scrollable messages area */}
      <div
        className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-2.5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, hsl(var(--primary) / 0.02) 0%, transparent 50%),
                           radial-gradient(circle at 80% 20%, hsl(var(--accent) / 0.02) 0%, transparent 50%)`,
        }}
      >
        {/* Date separator */}
        <div className="flex items-center justify-center py-2">
          <span className="px-3 py-1 rounded-full bg-muted/50 text-[10px] font-medium text-muted-foreground/70 backdrop-blur-sm">
            Today
          </span>
        </div>

        {messages.map((msg, i) => {
          const prevMsg = messages[i - 1];
          const showAvatar = !prevMsg || prevMsg.sender !== msg.sender;

          if (msg.type === "system" || msg.sender === "system") {
            return (
              <div key={msg.id} className="flex items-center justify-center py-2">
                <span
                  className="max-w-[85%] text-center px-3.5 py-1.5 rounded-full bg-muted/50 backdrop-blur-sm text-[11px] font-medium text-muted-foreground/80"
                >
                  {msg.text}
                </span>
              </div>
            );
          }

          if (msg.type === "virtual-date-invite") {
            return (
              <VirtualDateInviteBubble
                key={msg.id}
                msg={msg}
                isMe={msg.sender === "me"}
                partnerName={thread.name}
                showAvatar={showAvatar}
                partnerPhoto={thread.photo}
                onJoin={() => handleInviteJoin(msg.id)}
                onDecline={() => handleInviteDecline(msg.id)}
              />
            );
          }

          return (
            <MessageBubble
              key={msg.id}
              msg={msg}
              isLast={i === messages.length - 1}
              showAvatar={showAvatar}
              partnerPhoto={thread.photo}
              onRetry={handleRetry}
              onReply={handleReply}
              partnerName={thread.name}
            />
          );
        })}
        <AnimatePresence>
          {fresh?.typing && <TypingIndicator key="typing" partnerPhoto={thread.photo} />}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Fixed input */}
      <div className="shrink-0 border-t border-border/20 bg-card/50 backdrop-blur-sm">
        <ChatInput
          onSend={handleSend}
          disabled={messages[messages.length - 1]?.sender === "me" && messages[messages.length - 1]?.status === "sending"}
          replyingTo={replyingTo}
          onCancelReply={() => setReplyingTo(null)}
          partnerName={thread.name}
        />
      </div>

      <ReportDialog open={reportOpen} onClose={() => setReportOpen(false)} profileName={thread.name} />
      <BlockDialog open={blockOpen} onClose={() => setBlockOpen(false)} profileName={thread.name} />

      <VirtualDateInvite
        open={dateInviteOpen}
        partnerName={thread.name}
        onCancel={() => setDateInviteOpen(false)}
        onConfirm={handleVirtualDateConfirm}
      />

      <AnimatePresence>
        {dateRoomOpen && (
          <VirtualDateRoom
            partnerName={thread.name}
            partnerPhoto={thread.photo}
            onEnd={() => {
              setDateRoomOpen(false);
              addMessage(thread.id, "Virtual date ended. Hope you had fun! 💫", "me");
              toast.success("Virtual date ended");
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
