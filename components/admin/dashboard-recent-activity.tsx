import { Badge } from "@/components/ui/badge";

// In the future, replace this with a real database query or analytics view.
// Example: const { data } = await supabase.from('finance_ledger').select('*').order('created_at', { ascending: false }).limit(5);
const MOCK_RECENT_ACTIVITY = [
  { id: "L-1005", user: "U2", type: "Commission", amount: 75.50, date: "2026-03-18T14:20:00Z" },
  { id: "L-1004", user: "U3", type: "Deposit", amount: 1000.00, date: "2026-03-18T09:15:00Z" },
  { id: "L-1003", user: "U1", type: "Withdrawal", amount: -200.00, date: "2026-03-17T11:30:00Z" },
  { id: "L-1002", user: "U2", type: "Commission", amount: 50.00, date: "2026-03-17T10:05:00Z" },
  { id: "L-1001", user: "U1", type: "Rebate", amount: 150.00, date: "2026-03-17T10:00:00Z" },
];

export async function DashboardRecentActivity() {
  const activities = MOCK_RECENT_ACTIVITY;

  return (
    <div className="space-y-8">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-center">
          <div className="space-y-1">
            <p className="text-sm font-medium leading-none">
              {activity.type} - {activity.user}
            </p>
            <p className="text-sm text-slate-500">
              {new Date(activity.date).toLocaleString()}
            </p>
          </div>
          <div className="ml-auto font-medium">
            <Badge variant={activity.amount > 0 ? "default" : "destructive"}>
              {activity.amount > 0 ? "+" : ""}{activity.amount.toFixed(2)}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );
}
