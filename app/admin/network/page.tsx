import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { NetworkFilter } from "@/components/admin/network-filter";
import { createClient } from "@/lib/supabase/server";
import { Network as NetworkIcon, Users, UserCheck, UserPlus } from "lucide-react";

const MOCK_NETWORK = [
  { id: "R1", user_id: "U3", parent_user_id: null, level: "L2", created_at: "2025-11-05T09:15:00Z" },
  { id: "R2", user_id: "U2", parent_user_id: "U3", level: "L1", created_at: "2026-02-20T14:30:00Z" },
  { id: "R3", user_id: "U5", parent_user_id: "U3", level: "L1", created_at: "2026-03-10T16:20:00Z" },
  { id: "R4", user_id: "U1", parent_user_id: "U2", level: "Trader", created_at: "2026-01-15T10:00:00Z" },
  { id: "R5", user_id: "U4", parent_user_id: "U5", level: "Trader", created_at: "2026-03-01T11:45:00Z" },
];

export default async function NetworkPage({ searchParams }: { searchParams: Promise<{ user_id?: string, level?: string }> }) {
  const params = await searchParams;
  const userId = params.user_id || '';
  const level = params.level || '';

  let relationships: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('ib_relationships')
        .select('id, user_id, parent_user_id, level, created_at')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.ilike('user_id', `%${userId}%`);
      }
      if (level) {
        query = query.eq('level', level);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        relationships = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    relationships = MOCK_NETWORK.filter(rel => {
      const matchUserId = userId ? rel.user_id.toLowerCase().includes(userId.toLowerCase()) : true;
      const matchLevel = level ? rel.level === level : true;
      return matchUserId && matchLevel;
    });
  }

  // Summary statistics
  const totalRelationships = relationships.length;
  const totalL2 = relationships.filter(r => r.level === 'L2').length;
  const totalL1 = relationships.filter(r => r.level === 'L1').length;
  const totalTraders = relationships.filter(r => r.level === 'Trader').length;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Network Structure</h1>
        <p className="text-slate-500">View and manage the IB hierarchy (Trader &rarr; L1 &rarr; L2).</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Network Size</CardTitle>
            <NetworkIcon className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRelationships}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">L2 Partners</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalL2}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">L1 Partners</CardTitle>
            <UserCheck className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalL1}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Traders</CardTitle>
            <UserPlus className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTraders}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Network Relationships {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>Explore the relationships between L2s, L1s, and Traders.</CardDescription>
        </CardHeader>
        <CardContent>
          <NetworkFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Parent User ID</TableHead>
                <TableHead>Hierarchy Path</TableHead>
                <TableHead className="text-right">Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {relationships.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No relationships found.
                  </TableCell>
                </TableRow>
              ) : (
                relationships.map((rel) => (
                  <TableRow key={rel.id || rel.user_id}>
                    <TableCell className="font-medium">{rel.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={
                        rel.level === 'L2' ? 'default' : 
                        rel.level === 'L1' ? 'secondary' : 'outline'
                      }>
                        {rel.level}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {rel.parent_user_id || <span className="italic">None (Top Level)</span>}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        {rel.level === 'L2' && <span>{rel.user_id}</span>}
                        {rel.level === 'L1' && <span>{rel.parent_user_id} &rarr; {rel.user_id}</span>}
                        {rel.level === 'Trader' && <span>{rel.parent_user_id} &rarr; {rel.user_id}</span>}
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {rel.created_at ? new Date(rel.created_at).toLocaleDateString() : 'N/A'}
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
