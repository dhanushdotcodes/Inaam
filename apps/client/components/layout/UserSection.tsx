"use client";

import React, { useEffect, useState } from "react";
import { useAppStore } from "@/hooks/store";
import { removeToken } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { getUserMe, getRanks } from "@/lib/api";
import { UserMeResponse, RankConfigResponse } from "@/types";
import { Dialog } from "@/components/ui/dialog";
import { UserProfileModal } from "./UserProfileModal";

export function UserSection() {
  const { isOpen } = useAppStore((state) => state.sidebar);
  const router = useRouter();
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [ranks, setRanks] = useState<RankConfigResponse[]>([]);

  useEffect(() => {
    getUserMe().then(setUser).catch(console.error);
    getRanks().then(setRanks).catch(console.error);
  }, []);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeToken();
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-14 rounded-xl animate-pulse bg-muted/50 w-full" />
    );
  }

  return (
    <Dialog>
      <UserProfileModal 
        user={user} 
        ranks={ranks} 
        isSidebarOpen={isOpen} 
        onLogout={handleLogout} 
      />
    </Dialog>
  );
}
