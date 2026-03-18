import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CampaignsFilter } from "@/components/admin/campaigns-filter";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_CAMPAIGNS = [
  { campaign_id: "CMP-1001", campaign_name: "Spring Trading Clash", campaign_type: "trading competition", status: "active", start_date: "2026-03-01T00:00:00Z", end_date: "2026-03-31T23:59:59Z" },
  { campaign_id: "CMP-1002", campaign_name: "Q1 Network Rebate Boost", campaign_type: "rebate bonus", status: "active", start_date: "2026-01-01T00:00:00Z", end_date: "2026-03-31T23:59:59Z" },
  { campaign_id: "CMP-1003", campaign_name: "New User Invite", campaign_type: "referral campaign", status: "upcoming", start_date: "2026-04-01T00:00:00Z", end_date: "2026-06-30T23:59:59Z" },
  { campaign_id: "CMP-1004", campaign_name: "Affiliate CPA Q4", campaign_type: "CPA campaign", status: "completed", start_date: "2025-10-01T00:00:00Z", end_date: "2025-12-31T23:59:59Z" },
  { campaign_id: "CMP-1005", campaign_name: "Summer Volume Challenge", campaign_type: "trading competition", status: "paused", start_date: "2025-06-01T00:00:00Z", end_date: "2025-08-31T23:59:59Z" },
];

export default async function CampaignsPage({ searchParams }: { searchParams: Promise<{ search?: string, status?: string, campaign_type?: string }> }) {
  const params = await searchParams;
  const search = params.search || '';
  const status = params.status || '';
  const campaignType = params.campaign_type || '';

  let campaigns: any[] = [];
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      let query = supabase
        .from('campaigns')
        .select('campaign_id, campaign_name, campaign_type, status, start_date, end_date')
        .order('start_date', { ascending: false });

      if (search) {
        query = query.or(`campaign_id.ilike.%${search}%,campaign_name.ilike.%${search}%`);
      }
      if (status) {
        query = query.eq('status', status);
      }
      if (campaignType) {
        query = query.eq('campaign_type', campaignType);
      }

      const { data, error } = await query;
      if (error) {
        console.error("Supabase error:", error);
        isMock = true;
      } else {
        campaigns = data || [];
      }
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    campaigns = MOCK_CAMPAIGNS.filter(campaign => {
      const matchSearch = search 
        ? campaign.campaign_id.toLowerCase().includes(search.toLowerCase()) || campaign.campaign_name.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchStatus = status ? campaign.status === status : true;
      const matchType = campaignType ? campaign.campaign_type === campaignType : true;
      return matchSearch && matchStatus && matchType;
    });
  }

  const formatType = (type: string) => {
    return type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
          <p className="text-slate-500">Manage marketing and promotional campaigns.</p>
        </div>
        <Button>Create Campaign</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Campaigns {isMock && <Badge variant="secondary" className="ml-2">Mock Data</Badge>}</CardTitle>
          <CardDescription>Overview of active and past campaigns.</CardDescription>
        </CardHeader>
        <CardContent>
          <CampaignsFilter />
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-slate-500 py-8">
                    No campaigns found.
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => (
                  <TableRow key={campaign.campaign_id}>
                    <TableCell className="font-medium">{campaign.campaign_id}</TableCell>
                    <TableCell>{campaign.campaign_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal text-slate-600">
                        {formatType(campaign.campaign_type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        campaign.status === "active" ? "default" : 
                        campaign.status === "completed" ? "secondary" : 
                        campaign.status === "upcoming" ? "outline" : "destructive"
                      }>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {campaign.start_date ? new Date(campaign.start_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-slate-500">
                      {campaign.end_date ? new Date(campaign.end_date).toLocaleDateString() : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/admin/campaigns/${campaign.campaign_id}`}>
                          Manage
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
