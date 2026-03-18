'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UploadCloud } from 'lucide-react';

export function CommissionsUpload() {
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadClick = () => {
    // In a real implementation, this would open a file picker
    // For now, we just simulate an upload process
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      alert('Upload simulation complete. (Backend processing not implemented yet)');
    }, 1500);
  };

  return (
    <div className="border-2 border-dashed border-slate-200 rounded-lg p-8 flex flex-col items-center justify-center text-center bg-slate-50/50 mb-6">
      <div className="h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center mb-4">
        <UploadCloud className="h-6 w-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-medium mb-1">Upload Commission Batch</h3>
      <p className="text-sm text-slate-500 max-w-sm mb-4">
        Drag and drop your CSV file here, or click to browse. Ensure the file follows the standard broker format.
      </p>
      <Button onClick={handleUploadClick} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Select CSV File'}
      </Button>
    </div>
  );
}
