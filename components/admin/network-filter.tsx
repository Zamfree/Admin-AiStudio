'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export function NetworkFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [userId, setUserId] = useState(searchParams.get('user_id') || '');
  const [level, setLevel] = useState(searchParams.get('level') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (userId) params.set('user_id', userId);
    if (level) params.set('level', level);
    router.push(`/admin/network?${params.toString()}`);
  };

  const handleClear = () => {
    setUserId('');
    setLevel('');
    router.push('/admin/network');
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-4 items-end mb-6">
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">User ID</label>
        <Input
          placeholder="Search User ID..."
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full sm:w-48"
        />
      </div>
      <div className="space-y-1 w-full sm:w-auto">
        <label className="text-xs font-medium text-slate-500">Level</label>
        <select
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          className="h-10 w-full sm:w-48 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950"
        >
          <option value="">All Levels</option>
          <option value="L2">L2</option>
          <option value="L1">L1</option>
          <option value="Trader">Trader</option>
        </select>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" className="w-full sm:w-auto">Filter</Button>
        <Button type="button" variant="outline" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
      </div>
    </form>
  );
}
