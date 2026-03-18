'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function FinanceFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get('user_id') || '');
  const [type, setType] = useState(searchParams.get('type') || '');
  const [startDate, setStartDate] = useState(searchParams.get('start') || '');
  const [endDate, setEndDate] = useState(searchParams.get('end') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (userId) params.set('user_id', userId);
    if (type) params.set('type', type);
    if (startDate) params.set('start', startDate);
    if (endDate) params.set('end', endDate);
    router.push(`/admin/finance?${params.toString()}`);
  };

  const handleClear = () => {
    setUserId('');
    setType('');
    setStartDate('');
    setEndDate('');
    router.push('/admin/finance');
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
        <label className="text-xs font-medium text-slate-500">Transaction Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          <option value="">All Types</option>
          <option value="Commission">Commission</option>
          <option value="Rebate">Rebate</option>
          <option value="Withdrawal">Withdrawal</option>
          <option value="Deposit">Deposit</option>
          <option value="Adjustment">Adjustment</option>
        </select>
      </div>
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Start Date</label>
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">End Date</label>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full sm:w-40"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto">Filter</Button>
        <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
      </div>
    </form>
  );
}
