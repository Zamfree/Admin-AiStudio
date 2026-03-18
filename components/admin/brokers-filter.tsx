'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function BrokersFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [status, setStatus] = useState(searchParams.get('status') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (status) params.set('status', status);
    router.push(`/admin/brokers?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch('');
    setStatus('');
    router.push('/admin/brokers');
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Search</label>
        <Input
          placeholder="Broker ID or Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
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
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="pending">Pending</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto">Filter</Button>
        <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
      </div>
    </form>
  );
}
