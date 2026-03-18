import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const batches = [
  { id: "B100", broker: "Broker Alpha", date: "2026-03-18", records: 1250, status: "Processed" },
  { id: "B101", broker: "Broker Beta", date: "2026-03-17", records: 840, status: "Processed" },
  { id: "B102", broker: "Broker Gamma", date: "2026-03-16", records: 320, status: "Pending" },
];

export default function CommissionsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Commissions</h1>
          <p className="text-slate-500">Manage commission batches from brokers.</p>
        </div>
        <Button>Upload CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Commission Batches</CardTitle>
          <CardDescription>Recent batches uploaded from brokers.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch ID</TableHead>
                <TableHead>Broker</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Records</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {batches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.id}</TableCell>
                  <TableCell>{batch.broker}</TableCell>
                  <TableCell>{batch.date}</TableCell>
                  <TableCell>{batch.records}</TableCell>
                  <TableCell>
                    <Badge variant={batch.status === "Processed" ? "default" : "secondary"}>
                      {batch.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">View Details</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
