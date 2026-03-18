export type User = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Trader' | 'L1' | 'L2';
  status: 'Active' | 'Inactive';
};

export type Broker = {
  id: string;
  name: string;
  status: 'Active' | 'Inactive';
  integrations: string;
};

export type CommissionBatch = {
  id: string;
  broker: string;
  date: string;
  records: number;
  status: 'Pending' | 'Processed' | 'Failed';
};

export type LedgerEntry = {
  id: string;
  date: string;
  type: 'Credit' | 'Debit';
  amount: number;
  user: string;
  description: string;
};

export type Campaign = {
  id: string;
  name: string;
  type: string;
  status: 'Active' | 'Ended' | 'Draft';
  budget: string;
};

export type SupportTicket = {
  id: string;
  user: string;
  subject: string;
  status: 'Open' | 'In Progress' | 'Closed';
  priority: 'High' | 'Medium' | 'Low';
};
