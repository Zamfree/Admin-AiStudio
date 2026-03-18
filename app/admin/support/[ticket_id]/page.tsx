import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import Link from "next/link";
import { SupportReplyForm } from "@/components/admin/support-reply-form";
import { createClient } from "@/lib/supabase/server";

const MOCK_TICKET_DETAILS = {
  ticket_id: "T-1001",
  user_id: "U1",
  subject: "Withdrawal Issue",
  status: "open",
  created_at: "2026-03-18T10:00:00Z",
  messages: [
    { id: "M1", sender: "user", text: "Hi, I requested a withdrawal 2 days ago and it's still pending. Can you check?", created_at: "2026-03-18T10:00:00Z" },
    { id: "M2", sender: "admin", text: "Hello! We are looking into this right now. There was a slight delay with the payment processor.", created_at: "2026-03-18T11:30:00Z" },
    { id: "M3", sender: "user", text: "Okay, thank you for the update. Please let me know when it's resolved.", created_at: "2026-03-18T12:15:00Z" },
  ],
  user_info: {
    name: "Alice Smith",
    email: "alice@example.com",
    joined: "2025-01-10T08:00:00Z"
  }
};

export default async function TicketDetailPage({ params }: { params: Promise<{ ticket_id: string }> }) {
  const { ticket_id } = await params;

  let ticket: any = null;
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      
      // Fetch ticket
      const { data: ticketData, error: ticketError } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('ticket_id', ticket_id)
        .single();
        
      if (ticketError) throw ticketError;
      
      // Fetch messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('ticket_messages')
        .select('*')
        .eq('ticket_id', ticket_id)
        .order('created_at', { ascending: true });
        
      if (messagesError) throw messagesError;
      
      // Fetch user info
      const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('name, email, created_at')
        .eq('user_id', ticketData.user_id)
        .single();
        
      if (userError) throw userError;

      ticket = {
        ...ticketData,
        messages: messagesData || [],
        user_info: {
          name: userData?.name || 'Unknown',
          email: userData?.email || 'Unknown',
          joined: userData?.created_at || null
        }
      };
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    // In a real mock scenario, we'd find the specific ticket. 
    // Here we just use the static mock object and override the ID for display purposes.
    ticket = { ...MOCK_TICKET_DETAILS, ticket_id };
  }

  if (!ticket) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/support">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Ticket Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/support">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {ticket.subject}
              {isMock && <Badge variant="secondary" className="text-sm">Mock Data</Badge>}
            </h1>
            <p className="text-slate-500">Ticket ID: {ticket.ticket_id}</p>
          </div>
        </div>
        <Badge variant={
          ticket.status === "open" ? "default" : 
          ticket.status === "pending" ? "secondary" : "outline"
        } className="text-sm px-3 py-1">
          {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation</CardTitle>
              <CardDescription>Message history for this ticket.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {ticket.messages.length === 0 ? (
                  <p className="text-center text-slate-500 py-4">No messages yet.</p>
                ) : (
                  ticket.messages.map((msg: any) => (
                    <div key={msg.id} className={`flex flex-col ${msg.sender === 'admin' ? 'items-end' : 'items-start'}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-500">
                          {msg.sender === 'admin' ? 'Support Team' : 'User'}
                        </span>
                        <span className="text-xs text-slate-400">
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      <div className={`px-4 py-3 rounded-lg max-w-[85%] ${
                        msg.sender === 'admin' 
                          ? 'bg-slate-900 text-slate-50 rounded-tr-none' 
                          : 'bg-slate-100 text-slate-900 rounded-tl-none'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {ticket.status !== 'closed' && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <SupportReplyForm ticketId={ticket.ticket_id} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <div>
                  <p className="text-sm font-medium">{ticket.user_info.name}</p>
                  <p className="text-xs text-slate-500">ID: {ticket.user_id}</p>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="h-4 w-4 text-slate-400" />
                  <span>{ticket.user_info.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-slate-400" />
                  <span>Joined {ticket.user_info.joined ? new Date(ticket.user_info.joined).toLocaleDateString() : 'Unknown'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ticket Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                Mark as Pending
              </Button>
              <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                Close Ticket
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
