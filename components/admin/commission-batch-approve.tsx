'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';

export function CommissionBatchApprove({ batchId, currentStatus }: { batchId: string, currentStatus: string }) {
  const [isApproving, setIsApproving] = useState(false);

  const handleApprove = () => {
    // In a real implementation, this would call an API endpoint
    // e.g., POST /api/admin/commissions/${batchId}/approve
    // The backend would then handle the complex logic:
    // commission_records -> rebate_records -> finance_ledger
    setIsApproving(true);
    setTimeout(() => {
      setIsApproving(false);
      alert('Batch approval simulation complete. (Backend settlement logic not implemented yet)');
    }, 1500);
  };

  // Only show the approve button if the batch is not already processed or failed
  if (currentStatus === 'processed' || currentStatus === 'failed') {
    return null;
  }

  return (
    <Button 
      onClick={handleApprove} 
      disabled={isApproving}
      className="gap-2"
    >
      <CheckCircle className="h-4 w-4" />
      {isApproving ? 'Approving...' : 'Approve Batch'}
    </Button>
  );
}
