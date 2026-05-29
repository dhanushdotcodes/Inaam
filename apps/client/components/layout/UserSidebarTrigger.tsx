import React from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { LogOut, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

export function UserSidebarTrigger({ 
  user, 
  isSidebarOpen, 
  onLogout 
}: { 
  user: { username: string; email: string }; 
  isSidebarOpen: boolean; 
  onLogout: (e: React.MouseEvent) => void;
}) {
  return (
    <DialogTrigger
      className={cn(
        "group relative flex items-center transition-all duration-400 ease-in-out h-16 select-none outline-none w-full cursor-pointer overflow-hidden border border-transparent",
        isSidebarOpen 
          ? "px-3 gap-3 rounded-[20px] hover:bg-card hover:border-border/60 hover:shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]" 
          : "px-0 gap-0 justify-center rounded-[16px] hover:bg-accent/50"
      )}
    >
      {/* Subtle hover gradient background */}
      {isSidebarOpen && (
        <div className="absolute inset-0 bg-linear-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      )}

      <div className={cn(
        "flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5 rounded-full text-primary shrink-0 transition-all duration-400 ease-in-out shadow-inner ring-1 ring-primary/20 relative z-10",
        isSidebarOpen ? "size-10" : "size-10"
      )}>
        <Shield className="size-5 shrink-0 drop-shadow-sm" />
      </div>
      
      <div
        className={cn(
          "flex flex-col items-start transition-all duration-400 ease-in-out whitespace-nowrap overflow-hidden flex-1 relative z-10",
          isSidebarOpen ? "opacity-100 max-w-full translate-x-0" : "opacity-0 max-w-0 -translate-x-4 pointer-events-none"
        )}
      >
        <span className="text-[13px] font-semibold tracking-tight text-foreground truncate w-full text-left font-sans group-hover:text-primary transition-colors">
          {user.username}
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/80 truncate w-full text-left font-sans mt-0.5">
          {user.email}
        </span>
      </div>

      <div 
        onClick={onLogout}
        className={cn(
          "flex items-center justify-center size-8 rounded-full hover:bg-destructive/10 hover:text-destructive text-muted-foreground transition-all shrink-0 z-20",
          isSidebarOpen ? "opacity-100 scale-100 translate-x-0" : "opacity-0 scale-50 translate-x-4 pointer-events-none hidden"
        )}
        title="Logout"
      >
        <LogOut className="size-4" />
      </div>
    </DialogTrigger>
  );
}
