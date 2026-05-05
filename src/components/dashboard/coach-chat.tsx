"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { Play, Send, Paperclip, Video, MoreHorizontal, User as UserIcon, Loader2 } from "lucide-react";
import { CoachMessage } from "@/types";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export function CoachChat() {
  const [messages, setMessages] = useState<CoachMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel("coach_messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "coach_messages" },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as CoachMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from("coach_messages")
      .select("*")
      .order("created_at", { ascending: true });

    if (error) {
      toast.error("Failed to load messages");
    } else {
      setMessages(data || []);
    }
    setLoading(false);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() && !uploading) return;

    setSending(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("You must be logged in");
      setSending(false);
      return;
    }

    const { error } = await supabase.from("coach_messages").insert({
      user_id: user.id,
      content: newMessage,
      is_from_coach: false,
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
    setSending(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 50 * 1024 * 1024) {
      toast.error("File size exceeds 50MB limit");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const fileExt = file.name.split(".").pop();
    const fileName = `${user.id}/${Math.random()}.${fileExt}`;
    const filePath = `swings/${fileName}`;

    // Note: This requires a 'swings' bucket in Supabase Storage
    const { data, error } = await supabase.storage
      .from("swings")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      toast.error("Upload failed: " + error.message);
      setUploading(false);
      return;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage.from("swings").getPublicUrl(filePath);

    // Save message with video
    const { error: msgError } = await supabase.from("coach_messages").insert({
      user_id: user.id,
      content: "Shared a video of my swing",
      video_url: publicUrl,
      is_from_coach: false,
    });

    if (msgError) {
      toast.error("Failed to save message");
    } else {
      toast.success("Swing uploaded successfully!");
    }

    setUploading(false);
  };

  return (
    <Card className="flex flex-col h-[600px] border-white/10 bg-zinc-900/50 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-10 h-10 border border-golf-green/50">
              <AvatarImage src="/coach-avatar.jpg" />
              <AvatarFallback className="bg-golf-green text-black font-bold">C</AvatarFallback>
            </Avatar>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-golf-green border-2 border-zinc-900 rounded-full" />
          </div>
          <div>
            <h3 className="font-bold text-white text-sm">Head Coach Miller</h3>
            <p className="text-[10px] text-golf-green font-bold uppercase tracking-widest">Always Active</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-white/40 hover:text-white">
          <MoreHorizontal size={20} />
        </Button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-grow p-4" ref={scrollRef}>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-8 h-8 text-golf-green animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            {messages.length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 rounded-full bg-golf-green/10 flex items-center justify-center mx-auto mb-4 text-golf-green">
                  <Video size={24} />
                </div>
                <h4 className="text-white font-bold mb-1">Start a Conversation</h4>
                <p className="text-white/40 text-xs max-w-[200px] mx-auto">
                  Upload your swing or ask a question to get expert feedback.
                </p>
              </div>
            )}
            
            {messages.map((msg) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id}
                className={`flex ${msg.is_from_coach ? "justify-start" : "justify-end"}`}
              >
                <div className={`max-w-[80%] ${msg.is_from_coach ? "order-1" : "order-2"}`}>
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.is_from_coach 
                      ? "bg-zinc-800 text-white rounded-tl-none" 
                      : "bg-golf-green text-black font-medium rounded-tr-none shadow-[0_0_20px_-5px_rgba(34,197,94,0.3)]"
                  }`}>
                    {msg.content}
                    
                    {msg.video_url && (
                      <div className="mt-3 aspect-video rounded-lg overflow-hidden bg-black/40 border border-black/10 relative group cursor-pointer">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Play size={16} className={msg.is_from_coach ? "text-white" : "text-black"} fill="currentColor" />
                          </div>
                        </div>
                        {/* video placeholder */}
                        <div className="w-full h-full bg-black/20" />
                      </div>
                    )}
                  </div>
                  <p className="text-[10px] text-white/30 mt-1 px-1">
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        {uploading && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-golf-green font-bold uppercase">Uploading Swing...</span>
              <span className="text-[10px] text-white/40">{uploadProgress}%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-golf-green transition-all duration-300" 
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}
        
        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
          <div className="relative group">
            <input
              type="file"
              id="video-upload"
              className="hidden"
              accept="video/*"
              onChange={handleFileUpload}
              disabled={uploading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-white/50"
              onClick={() => document.getElementById("video-upload")?.click()}
              disabled={uploading}
            >
              <Paperclip size={18} />
            </Button>
          </div>
          
          <div className="relative flex-grow">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="bg-white/5 border-white/10 rounded-full h-11 pl-4 pr-10 focus:border-golf-green/50"
              disabled={sending || uploading}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20">
              <UserIcon size={14} />
            </div>
          </div>
          
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-golf-green hover:bg-golf-green/90 text-black shadow-lg"
            disabled={(!newMessage.trim() && !uploading) || sending || uploading}
          >
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send size={18} />}
          </Button>
        </form>
      </div>
    </Card>
  );
}
