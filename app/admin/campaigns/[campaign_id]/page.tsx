import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Target, Users, Activity } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

const MOCK_CAMPAIGN_DETAILS = {
  campaign_id: "CMP-1001",
  campaign_name: "Spring Trading Clash",
  campaign_type: "trading competition",
  status: "active",
  start_date: "2026-03-01T00:00:00Z",
  end_date: "2026-03-31T23:59:59Z",
  description: "A month-long trading competition to boost volume across all major pairs.",
  total_participants: 1250,
  total_volume_generated: 45000000.00,
  budget_allocated: 50000.00,
  budget_spent: 12500.00
};

export default async function CampaignDetailPage({ params }: { params: Promise<{ campaign_id: string }> }) {
  const { campaign_id } = await params;

  let campaign: any = null;
  let isMock = false;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('campaign_id', campaign_id)
        .single();
        
      if (error) throw error;
      campaign = data;
    } catch (error) {
      console.error("Supabase client error:", error);
      isMock = true;
    }
  } else {
    isMock = true;
  }

  if (isMock) {
    campaign = { ...MOCK_CAMPAIGN_DETAILS, campaign_id };
  }

  if (!campaign) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Not Found</h1>
        </div>
      </div>
    );
  }

  const formatType = (type: string) => {
    return type.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/campaigns">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
              {campaign.campaign_name}
              {isMock && <Badge variant="secondary" className="text-sm">Mock Data</Badge>}
            </h1>
            <p className="text-slate-500">Campaign ID: {campaign.campaign_id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={
            campaign.status === "active" ? "default" : 
            campaign.status === "completed" ? "secondary" : 
            campaign.status === "upcoming" ? "outline" : "destructive"
          } className="text-sm px-3 py-1">
            {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
          </Badge>
          <Button variant="outline">Edit Campaign</Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Campaign Type</CardTitle>
            <Target className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mt-1">
              {formatType(campaign.campaign_type)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participants</CardTitle>
            <Users className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.total_participants?.toLocaleString() || '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Volume Generated</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.total_volume_generated ? `$${(campaign.total_volume_generated / 1000000).toFixed(2)}M` : '-'}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Spent</CardTitle>
            <Activity className="h-4 w-4 text-slate-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {campaign.budget_spent ? `$${campaign.budget_spent.toLocaleString()}` : '-'}
              <span className="text-xs text-slate-500 font-normal ml-1">
                / {campaign.budget_allocated ? `$${campaign.budget_allocated.toLocaleString()}` : '-'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
            <CardDescription>Configuration and schedule.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-500">Description</div>
              <div className="col-span-2 text-sm text-slate-900">{campaign.description || 'No description provided.'}</div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3 border-b border-slate-100">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Start Date
              </div>
              <div className="col-span-2 text-sm text-slate-900">
                {campaign.start_date ? new Date(campaign.start_date).toLocaleString() : 'Not set'}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 py-3">
              <div className="text-sm font-medium text-slate-500 flex items-center gap-2">
                <Calendar className="h-4 w-4" /> End Date
              </div>
              <div className="col-span-2 text-sm text-slate-900">
                {campaign.end_date ? new Date(campaign.end_date).toLocaleString() : 'Not set'}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rules & Automation</CardTitle>
            <CardDescription>Triggers and reward distribution rules.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Target className="h-8 w-8 text-slate-300 mb-3" />
              <p className="text-sm text-slate-500">
                Detailed rule configuration and automation triggers will be available in a future update.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
