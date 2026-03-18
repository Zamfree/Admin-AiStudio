import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearch } from "@/components/admin/global-search";

export function Topbar() {
  return (
    <header className="flex h-14 items-center gap-4 border-b bg-white px-6 lg:h-[60px]">
      <div className="w-full flex-1">
        <GlobalSearch />
      </div>
      <Button variant="ghost" size="icon" className="rounded-full">
        <Bell className="h-5 w-5" />
        <span className="sr-only">Toggle notifications</span>
      </Button>
    </header>
  );
}
