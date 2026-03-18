import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

const MOCK_USERS = [
  { user_id: "U1", email: "alice@example.com", role: "Trader", status: "Active", created_at: "2026-01-15T10:00:00Z" },
  { user_id: "U2", email: "bob@example.com", role: "L1", status: "Active", created_at: "2026-02-20T14:30:00Z" },
  { user_id: "U3", email: "charlie@example.com", role: "L2", status: "Inactive", created_at: "2025-11-05T09:15:00Z" },
  { user_id: "U4", email: "diana@example.com", role: "Trader", status: "Active", created_at: "2026-03-01T11:45:00Z" },
  { user_id: "U5", email: "evan@example.com", role: "L1", status: "Active", created_at: "2026-03-10T16:20:00Z" },
];

export default async function UserDetailPage({ params }: { params: Promise<{ user_id: string }> }) {
  const { user_id } = await params;

  let user: any = null;
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user_id)
        .single();

      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        user = data;
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    user = MOCK_USERS.find(u => u.user_id === user_id);
  }

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/admin/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Details</h1>
          <p className="text-slate-500">View detailed information for user {user.user_id}.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
            <CardDescription>Basic details and status.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div className="text-sm font-medium text-slate-500">User ID</div>
              <div className="col-span-2 text-sm font-medium">{user.user_id}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div className="text-sm font-medium text-slate-500">Email</div>
              <div className="col-span-2 text-sm">{user.email}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div className="text-sm font-medium text-slate-500">Role</div>
              <div className="col-span-2">
                <Badge variant="outline">{user.role}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 border-b pb-4">
              <div className="text-sm font-medium text-slate-500">Status</div>
              <div className="col-span-2">
                <Badge variant={user.status === "Active" ? "default" : "secondary"}>
                  {user.status}
                </Badge>
              </div>
            </div>
            {user.created_at && (
              <div className="grid grid-cols-3 gap-4 pb-2">
                <div className="text-sm font-medium text-slate-500">Joined</div>
                <div className="col-span-2 text-sm">{new Date(user.created_at).toLocaleDateString()}</div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage this user's account.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline">Reset Password</Button>
            <Button className="w-full justify-start" variant="outline">Change Role</Button>
            <Button className="w-full justify-start" variant={user.status === 'Active' ? 'destructive' : 'default'}>
              {user.status === 'Active' ? 'Suspend Account' : 'Activate Account'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Trading Accounts</CardTitle>
            <CardDescription>Connected broker accounts.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-500">
              [Trading Accounts Placeholder]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Commission History</CardTitle>
            <CardDescription>Recent generated commissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-500">
              [Commission History Placeholder]
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rebate History</CardTitle>
            <CardDescription>Recent distributed rebates.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed border-slate-200 text-sm text-slate-500">
              [Rebate History Placeholder]
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
