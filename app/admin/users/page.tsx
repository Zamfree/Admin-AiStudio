import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UsersFilter } from "@/components/admin/users-filter";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

const MOCK_USERS = [
  { user_id: "U1", email: "alice@example.com", role: "Trader", status: "Active", created_at: "2026-01-15T10:00:00Z" },
  { user_id: "U2", email: "bob@example.com", role: "L1", status: "Active", created_at: "2026-02-20T14:30:00Z" },
  { user_id: "U3", email: "charlie@example.com", role: "L2", status: "Inactive", created_at: "2025-11-05T09:15:00Z" },
  { user_id: "U4", email: "diana@example.com", role: "Trader", status: "Active", created_at: "2026-03-01T11:45:00Z" },
  { user_id: "U5", email: "evan@example.com", role: "L1", status: "Active", created_at: "2026-03-10T16:20:00Z" },
];

export default async function UsersPage({ searchParams }: { searchParams: Promise<{ search?: string, status?: string }> }) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';

  let users: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase.from('profiles').select('user_id, email, role, status, created_at');

      if (search) {
        query = query.ilike('email', `%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        users = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    users = MOCK_USERS.filter(u => {
      const matchSearch = search ? u.email.toLowerCase().includes(search.toLowerCase()) : true;
      const matchStatus = status ? u.status === status : true;
      return matchSearch && matchStatus;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Users</h1>
        <p className="text-slate-500">Manage platform users and their roles.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>A list of all users in the system.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <UsersFilter />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{user.user_id}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/users/${user.user_id}`}>View</Link>
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
