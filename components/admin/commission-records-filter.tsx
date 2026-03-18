'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Search } from 'lucide-react';

export function CommissionRecordsFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    router.push(`?${params.toString()}`);
  };

  const handleClear = () => {
    setSearch('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    router.push(`?${params.toString()}`);
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-col sm:flex-row gap-2 items-center mb-4">
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          placeholder="Search Account Number or Symbol..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 w-full"
        />
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button type="submit" variant="secondary" className="w-full sm:w-auto">Search</Button>
        {search && (
          <Button type="button" variant="ghost" onClick={handleClear} className="w-full sm:w-auto">Clear</Button>
        )}
      </div>
    </form>
  );
}
