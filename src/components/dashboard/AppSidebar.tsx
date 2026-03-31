"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Server, LayoutDashboard, Database, Activity, Settings, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useInfrastructure } from "@/context/InfrastructureContext";

export function AppSidebar() {
  const pathname = usePathname();
  const { servers } = useInfrastructure();

  return (
    <Sidebar variant="sidebar" className="border-r border-border/50">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <Activity className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight">HostInsight</span>
            <span className="text-[10px] uppercase font-semibold text-muted-foreground tracking-widest">Enterprise Dashboard</span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === "/"}
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-colors",
                  pathname === "/" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/">
                  <LayoutDashboard className="h-4 w-4" />
                  <span className="font-medium">Overview</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-2">
            Managed Servers
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1 px-2">
            {servers.map((server) => {
              const href = `/servers/${server.id}`;
              const active = pathname === href;
              return (
                <SidebarMenuItem key={server.id}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={active}
                    className={cn(
                      "group relative h-10 px-3 hover:bg-primary/10 hover:text-primary transition-all duration-200",
                      active && "bg-primary/10 text-primary font-semibold shadow-sm"
                    )}
                  >
                    <Link href={href} className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <Server className={cn("h-4 w-4 shrink-0 transition-transform duration-200", active && "scale-110")} />
                        <div className="flex flex-col">
                          <span className="truncate max-w-[120px]">{server.model.split(' ')[2]}</span>
                          <span className="text-[10px] font-normal text-muted-foreground opacity-70 leading-none">{server.ip}</span>
                        </div>
                      </div>
                      <ChevronRight className={cn("h-3 w-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0", active && "opacity-100 translate-x-0")} />
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                asChild 
                isActive={pathname === "/storage"}
                className={cn(
                  "hover:bg-primary/10 hover:text-primary transition-colors",
                  pathname === "/storage" && "bg-primary/10 text-primary"
                )}
              >
                <Link href="/storage">
                  <Database className="h-4 w-4" />
                  <span>Global Storage</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild className="hover:bg-secondary/50">
                <Link href="#">
                  <Settings className="h-4 w-4" />
                  <span>System Config</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-2">
          <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-bold">
            AD
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="text-xs font-semibold truncate">Admin Console</span>
            <span className="text-[10px] text-muted-foreground truncate">v2.4.0 Stable</span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
