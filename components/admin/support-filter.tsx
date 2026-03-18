'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function SupportFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get('user_id') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (userId) params.set('user_id', userId);
    if (status) params.set('status', status);
    router.push(`/admin/support?${params.toString()}`);
  };

  const handleClear = () => {
    setUserId('');
    setStatus('');
    router.push('/admin/support');
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">User ID</label>
        <Input
          placeholder="Filter by User ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full sm:w-48"
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
          <option value="open">Open</option>
          <option value="pending">Pending</option>
          <option value="closed">Closed</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto">Filter</Button>
        <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
      </div>
    </form>
  );
}
