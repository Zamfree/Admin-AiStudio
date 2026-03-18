import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSummaryCards } from "@/components/admin/dashboard-summary-cards";
import { DashboardTrendChart } from "@/components/admin/dashboard-trend-chart";
import { DashboardRecentActivity } from "@/components/admin/dashboard-recent-activity";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-slate-500">Overview of your platform's performance.</p>
      </div>

      <DashboardSummaryCards />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Rebate & Volume Trends</CardTitle>
            <CardDescription>Daily performance over the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            <DashboardTrendChart />
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest ledger entries and system actions.</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardRecentActivity />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
