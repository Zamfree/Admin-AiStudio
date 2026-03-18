import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SupportFilter } from "@/components/admin/support-filter";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_TICKETS = [
  { ticket_id: "T-1001", user_id: "U1", subject: "Withdrawal Issue", status: "open", created_at: "2026-03-18T10:00:00Z" },
  { ticket_id: "T-1002", user_id: "U2", subject: "Missing Commission", status: "pending", created_at: "2026-03-17T14:30:00Z" },
  { ticket_id: "T-1003", user_id: "U3", subject: "Account Verification", status: "closed", created_at: "2026-03-15T09:15:00Z" },
  { ticket_id: "T-1004", user_id: "U1", subject: "Rebate Calculation", status: "open", created_at: "2026-03-18T11:45:00Z" },
  { ticket_id: "T-1005", user_id: "U4", subject: "Login Problem", status: "closed", created_at: "2026-03-10T16:20:00Z" },
];

export default async function SupportPage({ searchParams }: { searchParams: Promise<{ user_id?: string, status?: string }> }) {
  const params = await searchParams;
  const userId = params.user_id || '';
  const status = params.status || '';

  let tickets: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('support_tickets')
        .select('ticket_id, user_id, subject, status, created_at')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.ilike('user_id', `%${userId}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        tickets = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    tickets = MOCK_TICKETS.filter(ticket => {
      const matchUserId = userId ? ticket.user_id.toLowerCase().includes(userId.toLowerCase()) : true;
      const matchStatus = status ? ticket.status === status : true;
      return matchUserId && matchStatus;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Support</h1>
        <p className="text-slate-500">Manage user support tickets and inquiries.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Tickets {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>Latest support requests from users.</CardDescription>
        </CardHeader>
        <CardContent>
          <SupportFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket ID</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No tickets found.
                  </TableCell>
                </TableRow>
              ) : (
                tickets.map((ticket) => (
                  <TableRow key={ticket.ticket_id}>
                    <TableCell className="font-medium">{ticket.ticket_id}</TableCell>
                    <TableCell>{ticket.user_id}</TableCell>
                    <TableCell>{ticket.subject}</TableCell>
                    <TableCell>
                      <Badge variant={
                        ticket.status === "open" ? "default" : 
                        ticket.status === "pending" ? "secondary" : "outline"
                      }>
                        {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {new Date(ticket.created_at).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/support/${ticket.ticket_id}`}>
                          View
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
