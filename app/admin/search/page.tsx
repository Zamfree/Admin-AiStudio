import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

export default function SearchPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Global Search</h1>
        <p className="text-slate-500">Search across all users, transactions, and records.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Advanced Search</CardTitle>
          <CardDescription>Find specific records across the entire platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-8">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                type="search"
                placeholder="Enter email, ID, or transaction hash..."
                className="w-full pl-10"
              />
            </div>
            <Button>Search</Button>
          </div>

          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 text-slate-500">
            <SearchIcon className="h-12 w-12 mb-4 text-slate-400" />
            <p>Enter a query to see results.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
