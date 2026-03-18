'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function CommissionsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [broker, setBroker] = useState(searchParams.get('broker') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (broker) params.set('broker', broker);
    if (status) params.set('status', status);
    router.push(`/admin/commissions?${params.toString()}`);
  };

  const handleClear = () => {
    setBroker('');
    setStatus('');
    router.push('/admin/commissions');
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Broker</label>
        <Input
          placeholder="Filter by Broker..."
          value={broker}
          onChange={(e) => setBroker(e.target.value)}
          className="w-full sm:w-64"
        />
      </div>
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="processed">Processed</option>
          <option value="failed">Failed</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto">Filter</Button>
        <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
      </div>
    </form>
  );
}
