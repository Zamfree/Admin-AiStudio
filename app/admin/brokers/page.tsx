import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

const brokers = [
  { id: "BRK-1", name: "Broker Alpha", status: "Active", integrations: "API, CSV" },
  { id: "BRK-2", name: "Broker Beta", status: "Active", integrations: "CSV" },
  { id: "BRK-3", name: "Broker Gamma", status: "Inactive", integrations: "API" },
];

export default function BrokersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Brokers</h1>
          <p className="text-slate-500">Manage connected brokers and integrations.</p>
        </div>
        <Button>Add Broker</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Connected Brokers</CardTitle>
          <CardDescription>List of all brokers integrated with the platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Broker ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Integrations</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {brokers.map((broker) => (
                <TableRow key={broker.id}>
                  <TableCell className="font-medium">{broker.id}</TableCell>
                  <TableCell>{broker.name}</TableCell>
                  <TableCell>{broker.integrations}</TableCell>
                  <TableCell>{broker.status}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Edit</Button>
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
