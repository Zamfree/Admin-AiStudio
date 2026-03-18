'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function SupportReplyForm({ ticketId }: { ticketId: string }) {
  const [reply, setReply] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reply.trim()) return;

    setIsSubmitting(true);
    // In the future, this will be an API call to save the reply to the database
    // e.g., await supabase.from('ticket_messages').insert({ ticket_id: ticketId, message: reply, sender: 'admin' })
    
    setTimeout(() => {
      setReply('');
      setIsSubmitting(false);
      // Optional: trigger a refresh or show a success toast
      alert('Reply sent successfully! (Mock Action)');
    }, 500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div className="space-y-2">
        <label htmlFor="reply" className="text-sm font-medium">Add Reply</label>
        <Textarea
          id="reply"
          placeholder="Type your reply here..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          rows={4}
          className="resize-none"
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting || !reply.trim()}>
          {isSubmitting ? 'Sending...' : 'Send Reply'}
        </Button>
      </div>
    </form>
  );
}
