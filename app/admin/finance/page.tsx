import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FinanceFilter } from "@/components/admin/finance-filter";
import { createClient } from "@/lib/supabase/server";

const MOCK_LEDGER = [
  { id: "L-1001", user_id: "U1", transaction_type: "Rebate", amount: 150.00, balance_after: 150.00, created_at: "2026-03-18T10:00:00Z" },
  { id: "L-1002", user_id: "U2", transaction_type: "Commission", amount: 50.00, balance_after: 50.00, created_at: "2026-03-18T10:05:00Z" },
  { id: "L-1003", user_id: "U1", transaction_type: "Withdrawal", amount: -200.00, balance_after: 300.00, created_at: "2026-03-18T11:30:00Z" },
  { id: "L-1004", user_id: "U3", transaction_type: "Deposit", amount: 1000.00, balance_after: 1000.00, created_at: "2026-03-17T09:15:00Z" },
  { id: "L-1005", user_id: "U2", transaction_type: "Commission", amount: 75.50, balance_after: 125.50, created_at: "2026-03-17T14:20:00Z" },
];

export default async function FinancePage({ searchParams }: { searchParams: Promise<{ user_id?: string, type?: string, start?: string, end?: string }> }) {
  const params = await searchParams;
  const userId = params.user_id || '';
  const type = params.type || '';
  const startDate = params.start || '';
  const endDate = params.end || '';

  let ledgerEntries: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('finance_ledger')
        .select('id, user_id, transaction_type, amount, balance_after, created_at')
        .order('created_at', { ascending: false });

      if (userId) {
        query = query.eq('user_id', userId);
      }
      if (type) {
        query = query.eq('transaction_type', type);
      }
      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00Z`);
      }
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59Z`);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        ledgerEntries = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    ledgerEntries = MOCK_LEDGER.filter(entry => {
      const matchUserId = userId ? entry.user_id.toLowerCase().includes(userId.toLowerCase()) : true;
      const matchType = type ? entry.transaction_type === type : true;
      const matchStart = startDate ? new Date(entry.created_at) >= new Date(`${startDate}T00:00:00Z`) : true;
      const matchEnd = endDate ? new Date(entry.created_at) <= new Date(`${endDate}T23:59:59Z`) : true;
      return matchUserId && matchType && matchStart && matchEnd;
    });
  }

  // Simple summary derived ONLY from the fetched finance_ledger data
  const totalTransactions = ledgerEntries.length;
  const netAmount = ledgerEntries.reduce((sum, entry) => sum + Number(entry.amount), 0);
  const totalCredits = ledgerEntries.filter(e => Number(e.amount) > 0).reduce((sum, entry) => sum + Number(entry.amount), 0);
  const totalDebits = ledgerEntries.filter(e => Number(e.amount) < 0).reduce((sum, entry) => sum + Math.abs(Number(entry.amount)), 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Finance Ledger</h1>
        <p className="text-slate-500">The single source of truth for all user balances.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Transactions (Filtered)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTransactions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Net Change (Filtered)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netAmount >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {netAmount >= 0 ? '+' : '-'}${Math.abs(netAmount).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Credits (Filtered)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">${totalCredits.toFixed(2)}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Debits (Filtered)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">${totalDebits.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Ledger Entries {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>Detailed transaction history.</CardDescription>
        </CardHeader>
        <CardContent>
          <FinanceFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Balance After</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ledgerEntries.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                    No ledger entries found.
                  </TableCell>
                </TableRow>
              ) : (
                ledgerEntries.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell className="font-medium">{entry.user_id}</TableCell>
                    <TableCell>
                      <Badge variant={Number(entry.amount) > 0 ? "default" : "destructive"}>
                        {entry.transaction_type}
                      </Badge>
                    </TableCell>
                    <TableCell className={`text-right font-mono ${Number(entry.amount) > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {Number(entry.amount) > 0 ? "+" : ""}{Number(entry.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${Number(entry.balance_after).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-slate-500">
                      {new Date(entry.created_at).toLocaleString()}
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
