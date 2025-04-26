
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  receiver_id: string;
  created_at: string;
  read_at: string | null;
}

export function useMessages(otherUserId: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !otherUserId) return;

    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        // Properly format the query to get messages between the current user and the architect
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .or(`sender_id.eq.${otherUserId},receiver_id.eq.${otherUserId}`)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Filter to only include messages between these two users
        const filteredMessages = data?.filter(msg => 
          (msg.sender_id === user.id && msg.receiver_id === otherUserId) || 
          (msg.sender_id === otherUserId && msg.receiver_id === user.id)
        ) || [];
        
        setMessages(filteredMessages);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages using Supabase realtime
    const channel = supabase
      .channel('messages_channel')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
        },
        (payload) => {
          const newMessage = payload.new as Message;
          // Only add the message if it's relevant to this conversation
          if ((newMessage.sender_id === user.id && newMessage.receiver_id === otherUserId) ||
              (newMessage.sender_id === otherUserId && newMessage.receiver_id === user.id)) {
            setMessages(current => [...current, newMessage]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, otherUserId]);

  const sendMessage = async (content: string) => {
    if (!user || !otherUserId) return false;

    try {
      const { error } = await supabase.from('messages').insert({
        content,
        sender_id: user.id,
        receiver_id: otherUserId
      });

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err as Error);
      return false;
    }
  };

  return { messages, isLoading, error, sendMessage };
}
