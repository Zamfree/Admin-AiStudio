'use server';

import { createClient } from "@/lib/supabase/server";

export async function searchGlobal(query: string) {
  if (!query || query.length < 2) return { users: [], accounts: [], brokers: [], tickets: [] };

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  const isSupabaseConfigured = supabaseUrl.startsWith('http') && supabaseKey.length > 0;

  let results = {
    users: [] as any[],
    accounts: [] as any[],
    brokers: [] as any[],
    tickets: [] as any[]
  };

  if (isSupabaseConfigured) {
    try {
      const supabase = await createClient();
      
      // Search users
      const { data: users } = await supabase
        .from('users')
        .select('user_id, email, role')
        .or(`email.ilike.%${query}%`)
        .limit(5);
        
      // Search trading accounts
      const { data: accounts } = await supabase
        .from('trading_accounts')
        .select('account_id, account_number, user_id')
        .ilike('account_number', `%${query}%`)
        .limit(5);
        
      // Search brokers
      const { data: brokers } = await supabase
        .from('brokers')
        .select('broker_id, broker_name, status')
        .ilike('broker_name', `%${query}%`)
        .limit(5);
        
      // Search tickets
      const { data: tickets } = await supabase
        .from('support_tickets')
        .select('ticket_id, subject, status')
        .or(`ticket_id.ilike.%${query}%,subject.ilike.%${query}%`)
        .limit(5);

      if (users) results.users = users;
      if (accounts) results.accounts = accounts;
      if (brokers) results.brokers = brokers;
      if (tickets) results.tickets = tickets;
      
      return results;
    } catch (error) {
      console.error("Supabase search error:", error);
      // Fallback to mock
    }
  }

  // Mock data fallback
  const q = query.toLowerCase();
  
  const MOCK_USERS = [
    { user_id: "U1", email: "alice@example.com", role: "Trader" },
    { user_id: "U2", email: "bob@example.com", role: "L1" },
    { user_id: "U3", email: "charlie@example.com", role: "L2" },
    { user_id: "U4", email: "diana@example.com", role: "Trader" },
    { user_id: "U5", email: "evan@example.com", role: "L1" },
  ];
  
  const MOCK_ACCOUNTS = [
    { account_id: "ACC-8821", account_number: "8821001", user_id: "U1" },
    { account_id: "ACC-8822", account_number: "8822002", user_id: "U4" },
    { account_id: "ACC-9901", account_number: "9901005", user_id: "U2" },
  ];
  
  const MOCK_BROKERS = [
    { broker_id: "BRK-1001", broker_name: "Alpha Markets", status: "active" },
    { broker_id: "BRK-1002", broker_name: "Beta Trading", status: "active" },
    { broker_id: "BRK-1003", broker_name: "Gamma FX", status: "inactive" },
    { broker_id: "BRK-1004", broker_name: "Delta Capital", status: "pending" },
    { broker_id: "BRK-1005", broker_name: "Epsilon Securities", status: "active" },
  ];
  
  const MOCK_TICKETS = [
    { ticket_id: "T-1001", subject: "Withdrawal Issue", status: "open" },
    { ticket_id: "T-1002", subject: "Missing Commission", status: "pending" },
    { ticket_id: "T-1003", subject: "Account Verification", status: "closed" },
    { ticket_id: "T-1004", subject: "Rebate Calculation", status: "open" },
    { ticket_id: "T-1005", subject: "Login Problem", status: "closed" },
  ];

  results.users = MOCK_USERS.filter(u => u.email.toLowerCase().includes(q)).slice(0, 5);
  results.accounts = MOCK_ACCOUNTS.filter(a => a.account_number.toLowerCase().includes(q)).slice(0, 5);
  results.brokers = MOCK_BROKERS.filter(b => b.broker_name.toLowerCase().includes(q)).slice(0, 5);
  results.tickets = MOCK_TICKETS.filter(t => t.ticket_id.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)).slice(0, 5);

  return results;
}
