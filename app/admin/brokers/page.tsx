import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrokersFilter } from "@/components/admin/brokers-filter";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_BROKERS = [
  { broker_id: "BRK-1001", broker_name: "Alpha Markets", status: "active", total_accounts: 1250, total_users: 1100, created_at: "2025-06-15T08:30:00Z" },
  { broker_id: "BRK-1002", broker_name: "Beta Trading", status: "active", total_accounts: 840, total_users: 800, created_at: "2025-08-20T14:15:00Z" },
  { broker_id: "BRK-1003", broker_name: "Gamma FX", status: "inactive", total_accounts: 0, total_users: 0, created_at: "2026-01-10T09:45:00Z" },
  { broker_id: "BRK-1004", broker_name: "Delta Capital", status: "pending", total_accounts: null, total_users: null, created_at: "2026-03-05T11:20:00Z" },
  { broker_id: "BRK-1005", broker_name: "Epsilon Securities", status: "active", total_accounts: 3200, total_users: 2950, created_at: "2024-11-02T16:00:00Z" },
];

export default async function BrokersPage({ searchParams }: { searchParams: Promise<{ search?: string, status?: string }> }) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';

  let brokers: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('brokers')
        .select('broker_id, broker_name, status, total_accounts, total_users, created_at')
        .order('created_at', { ascending: false });

      if (search) {
        query = query.or(`broker_id.ilike.%${search}%,broker_name.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        brokers = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    brokers = MOCK_BROKERS.filter(broker => {
      const matchSearch = search 
        ? broker.broker_id.toLowerCase().includes(search.toLowerCase()) || broker.broker_name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStatus = status ? broker.status === status : true;
      return matchSearch && matchStatus;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brokers</h1>
          <p className="text-slate-500">Manage connected brokers and integrations.</p>
        </div>
        <Button>Add Broker</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Brokers {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>List of all brokers integrated with the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <BrokersFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Total Accounts</TableHead>
                <TableHead className="text-right">Total Users</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brokers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    No brokers found.
                  </TableCell>
                </TableRow>
              ) : (
                brokers.map((broker) => (
                  <TableRow key={broker.broker_id}>
                    <TableCell className="font-medium">{broker.broker_id}</TableCell>
                    <TableCell>{broker.broker_name}</TableCell>
                    <TableCell>
                      <Badge variant={
                        broker.status === "active" ? "default" : 
                        broker.status === "pending" ? "secondary" : "outline"
                      }>
                        {broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {broker.total_accounts !== null ? broker.total_accounts.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      {broker.total_users !== null ? broker.total_users.toLocaleString() : '-'}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {broker.created_at ? new Date(broker.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/brokers/${broker.broker_id}`}>
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
