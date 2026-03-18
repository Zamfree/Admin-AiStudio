'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Bell, Network, DollarSign, Settings, Info } from "lucide-react";

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Settings saved successfully. (Backend storage not implemented yet)');
    }, 1000);
  };

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'finance', label: 'Finance Rules', icon: DollarSign },
    { id: 'network', label: 'Network Rules', icon: Network },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <aside className="w-full md:w-64 shrink-0">
        <nav className="flex md:flex-col gap-2 overflow-x-auto pb-2 md:pb-0">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-slate-100 text-slate-900' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="flex-1 max-w-3xl">
        {activeTab === 'general' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-semibold">General Settings</h2>
              <p className="text-sm text-slate-500">Manage basic platform configuration.</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Platform Identity</CardTitle>
                <CardDescription>Configure how the platform appears to users.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Platform Name</label>
                  <Input defaultValue="Finhalo" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Support Email</label>
                  <Input defaultValue="support@finhalo.com" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">System Timezone</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                    <option value="UTC">UTC (Coordinated Universal Time)</option>
                    <option value="EST">EST (Eastern Standard Time)</option>
                    <option value="PST">PST (Pacific Standard Time)</option>
                  </select>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="mt-4">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'finance' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-semibold">Finance Rules</h2>
              <p className="text-sm text-slate-500">Configure global financial and settlement parameters.</p>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 flex items-start gap-3 text-blue-800">
              <Info className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="text-sm">
                <strong>Architecture Rule Enforcement:</strong> User balances and settlements are strictly derived from the <code>finance_ledger</code>. This is the immutable source of truth and cannot be overridden manually.
              </div>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Currency & Fees</CardTitle>
                <CardDescription>Set default financial values.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default Currency</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                    <option value="USD">USD - US Dollar</option>
                    <option value="EUR">EUR - Euro</option>
                    <option value="GBP">GBP - British Pound</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Admin Fee (%)</label>
                  <Input type="number" defaultValue="5.00" step="0.1" />
                  <p className="text-xs text-slate-500">The minimum percentage retained by the platform before Network rebates.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Settlement Cycle</label>
                  <select className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2">
                    <option value="daily">Daily (T+1)</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="mt-4">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'network' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-semibold">Network Rules</h2>
              <p className="text-sm text-slate-500">Configure Network structure and constraints.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Hierarchy Constraints</CardTitle>
                <CardDescription>Rules governing the Network referral tree.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    Network Max Depth
                    <Badge variant="secondary">System Enforced</Badge>
                  </label>
                  <Input value="2 (Trader → L1 → L2)" disabled className="bg-slate-50 text-slate-500" />
                  <p className="text-xs text-slate-500">The Network structure supports only two levels. This is a core architectural constraint and cannot be changed.</p>
                </div>
                <div className="space-y-2 pt-4">
                  <label className="text-sm font-medium">Default L1 Rebate Share (%)</label>
                  <Input type="number" defaultValue="60.00" step="1" />
                  <p className="text-xs text-slate-500">Default percentage of the available rebate pool allocated to the direct referrer (L1).</p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Default L2 Rebate Share (%)</label>
                  <Input type="number" defaultValue="40.00" step="1" />
                  <p className="text-xs text-slate-500">Default percentage of the available rebate pool allocated to the secondary referrer (L2).</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="mt-4">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-xl font-semibold">Notifications</h2>
              <p className="text-sm text-slate-500">Manage system alerts and email preferences.</p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Admin Alerts</CardTitle>
                <CardDescription>Select which events trigger an email to administrators.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Commission Batch Failures</label>
                    <p className="text-xs text-slate-500">Receive alerts when a CSV import fails validation.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-batch" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Large Withdrawal Requests</label>
                    <p className="text-xs text-slate-500">Alerts for withdrawals exceeding $10,000.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-withdraw" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <label className="text-sm font-medium">Daily Settlement Summary</label>
                    <p className="text-xs text-slate-500">A daily digest of all processed rebates and ledger entries.</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="notif-daily" className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900" />
                  </div>
                </div>
                <Button onClick={handleSave} disabled={isSaving} className="mt-4">
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
