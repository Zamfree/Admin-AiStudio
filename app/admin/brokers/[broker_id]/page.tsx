import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Building2, Users, CreditCard, Activity } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_BROKER_DETAILS = {
  broker_id: "BRK-1001",
  broker_name: "Alpha Markets",
  status: "active",
  total_accounts: 1250,
  total_users: 1100,
  created_at: "2025-06-15T08:30:00Z",
  api_key_prefix: "pk_live_alpha...",
  webhook_url: "https://api.alphamarkets.com/webhooks/finhalo",
  contact_email: "partnerships@alphamarkets.com"
};

export default async function BrokerDetailPage({ params }: { params: Promise<{ broker_id: string }> }) {
  const { broker_id } = await params;

  let broker: any = null;
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('brokers')
        .select('*')
        .eq('broker_id', broker_id)
        .single();
        
      if (error) throw error;
      broker = data;
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    broker = { ...MOCK_BROKER_DETAILS, broker_id };
  }

  if (!broker) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/brokers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Broker Not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/brokers">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {broker.broker_name}
              {isMock && <Badge variant="secondary" className="text-sm">Mock Data</Badge>}
            </h1>
            <p className="text-slate-500">Broker ID: {broker.broker_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={
            broker.status === "active" ? "default" : 
            broker.status === "pending" ? "secondary" : "outline"
          } className="text-sm px-3 py-1">
            {broker.status.charAt(0).toUpperCase() + broker.status.slice(1)}
          </Badge>
          <Button variant="outline">Edit Broker</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {broker.total_accounts !== null && broker.total_accounts !== undefined ? broker.total_accounts.toLocaleString() : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {broker.total_users !== null && broker.total_users !== undefined ? broker.total_users.toLocaleString() : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Integration Status</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">Healthy</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Joined Date</CardTitle>
            <Building2 className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mt-1">
              {broker.created_at ? new Date(broker.created_at).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Integration Details</CardTitle>
            <CardDescription>API and webhook configuration for this broker.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-500">API Key Prefix</div>
              <div className="col-span-2 text-sm font-mono">{broker.api_key_prefix || 'Not configured'}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-500">Webhook URL</div>
              <div className="col-span-2 text-sm text-slate-900 break-all">{broker.webhook_url || 'Not configured'}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3">
              <div className="text-sm font-medium text-slate-500">Contact Email</div>
              <div className="col-span-2 text-sm text-slate-900">{broker.contact_email || 'Not configured'}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Sync Activity</CardTitle>
            <CardDescription>Latest data synchronization events.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Activity className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                Detailed sync logs will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
