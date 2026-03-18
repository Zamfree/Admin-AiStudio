'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Loader2, User, Building, Ticket, CreditCard } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { searchGlobal } from '@/app/actions/search';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{
    users: any[];
    accounts: any[];
    brokers: any[];
    tickets: any[];
  }>({ users: [], accounts: [], brokers: [], tickets: [] });
  
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        try {
          const data = await searchGlobal(query);
          setResults(data);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults({ users: [], accounts: [], brokers: [], tickets: [] });
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const hasResults = 
    results.users.length > 0 || 
    results.accounts.length > 0 || 
    results.brokers.length > 0 || 
    results.tickets.length > 0;

  const handleNavigate = () => {
    setIsOpen(false);
    setQuery('');
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
        <Input
          type="search"
          placeholder="Search users, accounts, brokers, tickets..."
          className="w-full appearance-none bg-slate-50 pl-8 shadow-none md:w-2/3 lg:w-1/3"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
        />
        {isSearching && (
          <Loader2 className="absolute right-3 top-2.5 h-4 w-4 animate-spin text-slate-400 md:right-[calc(33.333%+12px)] lg:right-[calc(66.666%+12px)]" />
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute top-full left-0 mt-2 w-full md:w-2/3 lg:w-1/3 bg-white rounded-md border shadow-lg z-50 max-h-[80vh] overflow-y-auto">
          {!isSearching && !hasResults ? (
            <div className="p-4 text-center text-sm text-slate-500">
              No results found for "{query}"
            </div>
          ) : (
            <div className="py-2">
              {results.users.length > 0 && (
                <div className="px-2 py-1">
                  <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Users</h3>
                  {results.users.map(user => (
                    <Link 
                      key={user.user_id} 
                      href={`/admin/users/${user.user_id}`}
                      onClick={handleNavigate}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{user.email}</span>
                        <span className="text-xs text-slate-500">Role: {user.role}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.accounts.length > 0 && (
                <div className="px-2 py-1">
                  <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Trading Accounts</h3>
                  {results.accounts.map(acc => (
                    <Link 
                      key={acc.account_id} 
                      href={`/admin/users/${acc.user_id}`} // Assuming account details are on the user page
                      onClick={handleNavigate}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                    >
                      <CreditCard className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{acc.account_number}</span>
                        <span className="text-xs text-slate-500">User ID: {acc.user_id}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.brokers.length > 0 && (
                <div className="px-2 py-1">
                  <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Brokers</h3>
                  {results.brokers.map(broker => (
                    <Link 
                      key={broker.broker_id} 
                      href={`/admin/brokers/${broker.broker_id}`}
                      onClick={handleNavigate}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                    >
                      <Building className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{broker.broker_name}</span>
                        <span className="text-xs text-slate-500 capitalize">Status: {broker.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {results.tickets.length > 0 && (
                <div className="px-2 py-1">
                  <h3 className="px-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Support Tickets</h3>
                  {results.tickets.map(ticket => (
                    <Link 
                      key={ticket.ticket_id} 
                      href={`/admin/support/${ticket.ticket_id}`}
                      onClick={handleNavigate}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm hover:bg-slate-100 transition-colors"
                    >
                      <Ticket className="h-4 w-4 text-slate-400" />
                      <div className="flex flex-col">
                        <span className="font-medium">{ticket.subject}</span>
                        <span className="text-xs text-slate-500">{ticket.ticket_id} • {ticket.status}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
