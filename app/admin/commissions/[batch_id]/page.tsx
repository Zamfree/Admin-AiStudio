import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, FileSpreadsheet, CheckCircle2, AlertCircle, Clock } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CommissionRecordsFilter } from "@/components/admin/commission-records-filter";
import { CommissionBatchApprove } from "@/components/admin/commission-batch-approve";

const MOCK_BATCH_DETAILS = {
  batch_id: "B-20260318-01",
  broker: "Alpha Markets",
  import_date: "2026-03-18T10:00:00Z",
  record_count: 1250,
  status: "pending",
  file_name: "alpha_commissions_mar18.csv",
  total_commission: 45250.50,
  processed_by: "admin@finhalo.com"
};

const MOCK_RECORDS = [
  { record_id: "REC-001", account_number: "ACC-8821", symbol: "EURUSD", lot: 5.5, commission: 110.00, trade_date: "2026-03-17T08:15:00Z", status: "matched" },
  { record_id: "REC-002", account_number: "ACC-8822", symbol: "GBPUSD", lot: 2.0, commission: 40.00, trade_date: "2026-03-17T09:30:00Z", status: "matched" },
  { record_id: "REC-003", account_number: "ACC-9901", symbol: "XAUUSD", lot: 10.0, commission: 200.00, trade_date: "2026-03-17T11:45:00Z", status: "unmatched" },
  { record_id: "REC-004", account_number: "ACC-8821", symbol: "USDJPY", lot: 1.5, commission: 30.00, trade_date: "2026-03-17T14:20:00Z", status: "matched" },
  { record_id: "REC-005", account_number: "ACC-7742", symbol: "BTCUSD", lot: 0.5, commission: 10.00, trade_date: "2026-03-17T16:05:00Z", status: "error" },
];

export default async function CommissionBatchDetailPage({ params, searchParams }: { params: Promise<{ batch_id: string }>, searchParams: Promise<{ search?: string }> }) {
  const { batch_id } = await params;
  const { search } = await searchParams;

  let batch: any = null;
  let records: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      
      const { data: batchData, error: batchError } = await supabase
        .from('commission_batches')
        .select('*')
        .eq('batch_id', batch_id)
        .single();
        
      if (batchError) throw batchError;
      batch = batchData;

      // Fetch records for this batch
      let recordsQuery = supabase
        .from('commission_records')
        .select('record_id, account_number, symbol, lot, commission, trade_date, status')
        .eq('batch_id', batch_id)
        .order('trade_date', { ascending: false })
        .limit(100); // Pagination could be added later
        
      if (search) {
        recordsQuery = recordsQuery.or(`account_number.ilike.%${search}%,symbol.ilike.%${search}%`);
      }

      const { data: recordsData, error: recordsError } = await recordsQuery;
      
      if (!recordsError && recordsData) {
        records = recordsData;
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    batch = { ...MOCK_BATCH_DETAILS, batch_id };
    records = MOCK_RECORDS.filter(record => {
      if (!search) return true;
      const lowerSearch = search.toLowerCase();
      return record.account_number.toLowerCase().includes(lowerSearch) || 
             record.symbol.toLowerCase().includes(lowerSearch);
    });
  }

  if (!batch) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/commissions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Batch Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/commissions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              Batch Details
              {isMock && <Badge variant="secondary" className="text-sm">Mock Data</Badge>}
            </h1>
            <p className="text-slate-500">{batch.batch_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant={
            batch.status === "processed" ? "default" : 
            batch.status === "failed" ? "destructive" : 
            batch.status === "processing" ? "secondary" : "outline"
          } className="text-sm px-3 py-1">
            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
          </Badge>
          <CommissionBatchApprove batchId={batch.batch_id} currentStatus={batch.status} />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Broker</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mt-1">{batch.broker}</div>
            <p className="text-xs text-slate-500 mt-1 truncate" title={batch.file_name}>
              {batch.file_name}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batch.record_count?.toLocaleString() || '0'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {batch.total_commission ? `$${batch.total_commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Import Date</CardTitle>
            <Clock className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mt-1">
              {batch.import_date ? new Date(batch.import_date).toLocaleDateString() : 'N/A'}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              By {batch.processed_by || 'System'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Records</CardTitle>
          <CardDescription>
            Records imported in this batch.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CommissionRecordsFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Account Number</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead className="text-right">Lot</TableHead>
                <TableHead className="text-right">Commission</TableHead>
                <TableHead>Trade Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                    No records found matching your search.
                  </TableCell>
                </TableRow>
              ) : (
                records.map((record) => (
                  <TableRow key={record.record_id}>
                    <TableCell className="font-medium">{record.account_number}</TableCell>
                    <TableCell>{record.symbol}</TableCell>
                    <TableCell className="text-right">{record.lot}</TableCell>
                    <TableCell className="text-right">
                      ${record.commission.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {record.trade_date ? new Date(record.trade_date).toLocaleString() : 'N/A'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        record.status === "matched" ? "default" : 
                        record.status === "error" ? "destructive" : "secondary"
                      }>
                        {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                      </Badge>
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
