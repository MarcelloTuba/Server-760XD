"use client";

import { Server as ServerIcon, Database, Cpu, HardDrive, ArrowUpRight, Search, LayoutGrid, List, Power, PowerOff, RefreshCw } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useInfrastructure } from "@/context/InfrastructureContext";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { cn } from "@/lib/utils";

export default function DashboardPage() {
  const { servers, toggleServerPower, resetToDefault } = useInfrastructure();
  
  const onlineServers = servers.filter(s => s.status === 'Online');
  const offlineServers = servers.filter(s => s.status === 'Offline');
  
  const totalVMs = onlineServers.reduce((acc, server) => acc + server.virtualMachines.length, 0);
  const avgCpu = onlineServers.length > 0 
    ? Math.round(onlineServers.reduce((acc, server) => acc + server.currentCpuUsagePercent, 0) / onlineServers.length)
    : 0;
  const avgRam = onlineServers.length > 0 
    ? Math.round(onlineServers.reduce((acc, server) => acc + server.currentRamUsagePercent, 0) / onlineServers.length)
    : 0;

  const r760Server = servers.find(s => s.id === 'dell-r760xd2');

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Infrastructure Overview</h1>
          <p className="text-muted-foreground mt-1 font-medium">Monitoring {onlineServers.length} active Dell PowerEdge hosts in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 font-bold uppercase tracking-tighter border-primary/50 text-primary hover:bg-primary/10"
            onClick={resetToDefault}
          >
            <RefreshCw className="h-4 w-4" />
            Botão Default
          </Button>
          
          {r760Server && (
            <Button 
              variant={r760Server.status === 'Online' ? 'destructive' : 'default'} 
              size="sm"
              className="gap-2 font-bold uppercase tracking-tighter"
              onClick={() => toggleServerPower(r760Server.id)}
            >
              {r760Server.status === 'Online' ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
              {r760Server.status === 'Online' ? 'Desligar R760XD2' : 'Ligar R760XD2'}
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary/20 border-border/50 shadow-sm transition-all hover:bg-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Total Hosts</CardTitle>
            <ServerIcon className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{String(servers.length).padStart(2, '0')}</div>
            <p className="text-xs text-emerald-500 font-medium mt-1">{onlineServers.length} Operational</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50 shadow-sm transition-all hover:bg-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Active VMs</CardTitle>
            <Database className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalVMs}</div>
            <p className="text-xs text-muted-foreground mt-1">On active clusters</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50 shadow-sm transition-all hover:bg-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Global CPU</CardTitle>
            <Cpu className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgCpu}%</div>
            <Progress value={avgCpu} className="h-1.5 mt-2 bg-secondary/50" />
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50 shadow-sm transition-all hover:bg-secondary/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Global RAM</CardTitle>
            <HardDrive className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{avgRam}%</div>
            <Progress value={avgRam} className="h-1.5 mt-2 bg-secondary/50" />
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Host Nodes (Online)
          <div className="h-px flex-1 bg-border/40 ml-4" />
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {onlineServers.map((server) => (
            <Card key={server.id} className="group overflow-hidden border-border/50 bg-secondary/10 hover:border-primary/50 transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-2">
                  <StatusIndicator status={server.status} />
                  <span className="text-[10px] font-bold text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded uppercase tracking-tighter">
                    {server.ip}
                  </span>
                </div>
                <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors">{server.model}</CardTitle>
                <CardDescription className="text-xs font-medium font-mono text-muted-foreground mt-1">
                  {server.exsiVersion.split(' ')[0]} Hypervisor
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                      <span>CPU Load</span>
                      <span>{server.currentCpuUsagePercent}%</span>
                    </div>
                    <Progress value={server.currentCpuUsagePercent} className="h-1 bg-secondary/40" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground">
                      <span>RAM Utilization</span>
                      <span>{server.currentRamUsagePercent}%</span>
                    </div>
                    <Progress value={server.currentRamUsagePercent} className="h-1 bg-secondary/40" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-border/30 text-xs">
                  <span className="text-muted-foreground font-medium">Active Virtual Machines</span>
                  <span className="font-bold text-primary">{server.virtualMachines.length}</span>
                </div>
              </CardContent>
              <CardFooter className="bg-secondary/20 border-t border-border/50 p-0">
                <Button 
                  asChild 
                  variant="ghost" 
                  className="w-full rounded-none h-11 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all group-hover:bg-primary/5"
                >
                  <Link href={`/servers/${server.id}`} className="flex items-center justify-center gap-2">
                    Open Server Console
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {offlineServers.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-muted-foreground">
            Standby / Offline Hosts
            <div className="h-px flex-1 bg-border/40 ml-4 opacity-50" />
          </h2>
          <div className="grid gap-6 md:grid-cols-4 opacity-70">
            {offlineServers.map((server) => (
              <Card key={server.id} className="border-border/30 bg-secondary/5">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <StatusIndicator status={server.status} />
                    <span className="text-[10px] font-bold text-muted-foreground">{server.ip}</span>
                  </div>
                  <CardTitle className="text-sm font-bold">{server.model}</CardTitle>
                </CardHeader>
                <CardFooter className="pt-0">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-[10px] font-bold uppercase tracking-widest h-8"
                    onClick={() => toggleServerPower(server.id)}
                  >
                    Ativar Servidor
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}