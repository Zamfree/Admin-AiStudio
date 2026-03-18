'use server';

import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  // Mock server action
  console.log('Settings updated:', Object.fromEntries(formData));
  
  // Revalidate the settings page
  revalidatePath('/admin/settings');
  
  return { success: true };
}
