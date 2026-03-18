import { SettingsTabs } from "@/components/admin/settings-tabs";

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-slate-500">Manage platform configuration and preferences.</p>
      </div>

      <SettingsTabs />
    </div>
  );
}
