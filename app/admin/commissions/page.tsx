import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CommissionsFilter } from "@/components/admin/commissions-filter";
import { CommissionsUpload } from "@/components/admin/commissions-upload";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_BATCHES = [
  { batch_id: "B-20260318-01", broker: "Alpha Markets", import_date: "2026-03-18T10:00:00Z", record_count: 1250, status: "processed" },
  { batch_id: "B-20260317-02", broker: "Beta Trading", import_date: "2026-03-17T14:30:00Z", record_count: 840, status: "processed" },
  { batch_id: "B-20260316-01", broker: "Gamma FX", import_date: "2026-03-16T09:15:00Z", record_count: 320, status: "pending" },
  { batch_id: "B-20260315-03", broker: "Alpha Markets", import_date: "2026-03-15T16:45:00Z", record_count: 1500, status: "failed" },
  { batch_id: "B-20260314-01", broker: "Delta Capital", import_date: "2026-03-14T11:20:00Z", record_count: 450, status: "processing" },
];

export default async function CommissionsPage({ searchParams }: { searchParams: Promise<{ broker?: string, status?: string }> }) {
  const params = await searchParams;
  const broker = params.broker || '';
  const status = params.status || '';

  let batches: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('commission_batches')
        .select('batch_id, broker, import_date, record_count, status')
        .order('import_date', { ascending: false });

      if (broker) {
        query = query.ilike('broker', `%${broker}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        batches = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    batches = MOCK_BATCHES.filter(batch => {
      const matchBroker = broker ? batch.broker.toLowerCase().includes(broker.toLowerCase()) : true;
      const matchStatus = status ? batch.status === status : true;
      return matchBroker && matchStatus;
    });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-slate-500">Manage commission batches from brokers.</p>
        </div>
      </div>

      <CommissionsUpload />

      <Card>
        <CardHeader>
          <CardTitle>Commission Batches {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>Recent batches uploaded from brokers.</CardDescription>
        </CardHeader>
        <CardContent>
          <CommissionsFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Import Date</TableHead>
                <TableHead className="text-right">Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No batches found.
                  </TableCell>
                </TableRow>
              ) : (
                batches.map((batch) => (
                  <TableRow key={batch.batch_id} className="cursor-pointer hover:bg-slate-50 transition-colors">
                    <TableCell className="font-medium">
                      <Link href={`/admin/commissions/${batch.batch_id}`} className="block w-full">
                        {batch.batch_id}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/commissions/${batch.batch_id}`} className="block w-full">
                        {batch.broker}
                      </Link>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      <Link href={`/admin/commissions/${batch.batch_id}`} className="block w-full">
                        {batch.import_date ? new Date(batch.import_date).toLocaleString() : 'N/A'}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/commissions/${batch.batch_id}`} className="block w-full">
                        {batch.record_count?.toLocaleString() || '0'}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Link href={`/admin/commissions/${batch.batch_id}`} className="block w-full">
                        <Badge variant={
                          batch.status === "processed" ? "default" : 
                          batch.status === "failed" ? "destructive" : 
                          batch.status === "processing" ? "secondary" : "outline"
                        }>
                          {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                        </Badge>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/commissions/${batch.batch_id}`}>
                          View Details
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
