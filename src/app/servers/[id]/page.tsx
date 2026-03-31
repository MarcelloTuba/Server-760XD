"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { 
  ChevronRight, 
  Cpu, 
  HardDrive, 
  Layers, 
  Network, 
  Database,
  Terminal,
  FileCode,
  ShieldCheck,
  RefreshCcw,
  ExternalLink,
  Settings2
} from "lucide-react";
import { useInfrastructure } from "@/context/InfrastructureContext";
import { StatusIndicator } from "@/components/dashboard/StatusIndicator";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ServerHealthAssistant } from "@/components/dashboard/ServerHealthAssistant";
import { Button } from "@/components/ui/button";

export default function ServerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { servers } = useInfrastructure();
  const server = servers.find(s => s.id === id);

  if (!server) {
    notFound();
  }

  const isOffline = server.status === 'Offline';

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">
            <span>Infrastructure</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-primary">{server.id}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-4">
            {server.model}
            <Badge variant="outline" className={`text-xs uppercase font-mono ${isOffline ? 'border-rose-500/50 text-rose-400 bg-rose-500/5' : 'border-emerald-500/50 text-emerald-400 bg-emerald-500/5'}`}>
              {isOffline ? 'Offline Node' : 'Live Node'}
            </Badge>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center gap-2">
            <Network className="h-4 w-4 text-accent" />
            Management IP: <span className="font-mono text-foreground">{server.ip}</span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2 border-border/50" disabled={isOffline}>
            <RefreshCcw className="h-3 w-3" />
            Sync Metrics
          </Button>
          <Button variant="outline" size="sm" className="gap-2 border-border/50" disabled={isOffline}>
            <ExternalLink className="h-3 w-3" />
            vCenter Remote
          </Button>
          <Button size="sm" className="gap-2 bg-primary" disabled={isOffline}>
            <Terminal className="h-3 w-3" />
            SSH Console
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-secondary/10 border-border/50 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <Layers className="h-5 w-5 text-primary" />
              Hardware Profile
            </CardTitle>
            <CardDescription>Comprehensive component inventory and operational parameters.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <Cpu className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Processor Units</div>
                    <div className="text-sm font-semibold">{server.cpuInfo}</div>
                    {server.realCores && (
                      <div className="text-[10px] font-bold text-primary uppercase mt-1">Real Cores: {server.realCores}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <Database className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Memory Configuration</div>
                    <div className="text-sm font-semibold">{server.ramInfo}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <HardDrive className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Storage Array</div>
                    <div className="text-sm font-semibold">{server.storageInfo}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <ShieldCheck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Hypervisor Engine</div>
                    <div className="text-sm font-semibold">VMware ESXi {server.exsiVersion}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-secondary/50">
                    <FileCode className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Support Modules</div>
                    <div className="text-sm font-semibold">{server.supportModules || 'N/A'}</div>
                  </div>
                </div>
                {server.raidConfig && (
                   <div className="flex items-start gap-3">
                   <div className="p-2 rounded-lg bg-secondary/50">
                     <Settings2 className="h-5 w-5 text-accent" />
                   </div>
                   <div>
                     <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-0.5">RAID Configuration</div>
                     <div className="text-sm font-semibold">{server.raidConfig}</div>
                   </div>
                 </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-secondary/10 border-border/50 ${isOffline ? 'opacity-50' : ''}`}>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Performance Pulse</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* CPU Metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>CPU</span>
                <span className="text-foreground/90 font-mono">FREE: {isOffline ? '0 GHz' : (server.cpuMetrics?.free || 'N/A')}</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress 
                  value={server.currentCpuUsagePercent} 
                  className="h-2.5 bg-secondary/50 flex-1" 
                  indicatorClassName={isOffline ? 'bg-slate-500' : 'bg-emerald-500'}
                />
                <span className="text-xs font-bold text-muted-foreground min-w-[3ch] text-right">{server.currentCpuUsagePercent}%</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                <span>USED: {isOffline ? '0 GHz' : (server.cpuMetrics?.used || 'N/A')}</span>
                <span>CAPACITY: {isOffline ? '0 GHz' : (server.cpuMetrics?.capacity || 'N/A')}</span>
              </div>
            </div>

            {/* RAM Metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>MEMORY</span>
                <span className="text-foreground/90 font-mono">FREE: {isOffline ? '0 GB' : (server.ramMetrics?.free || 'N/A')}</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress 
                  value={server.currentRamUsagePercent} 
                  className="h-2.5 bg-secondary/50 flex-1" 
                  indicatorClassName={isOffline ? 'bg-slate-500' : 'bg-sky-500'}
                />
                <span className="text-xs font-bold text-muted-foreground min-w-[3ch] text-right">{server.currentRamUsagePercent}%</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                <span>USED: {isOffline ? '0 GB' : (server.ramMetrics?.used || 'N/A')}</span>
                <span>CAPACITY: {isOffline ? '0 GB' : (server.ramMetrics?.capacity || 'N/A')}</span>
              </div>
            </div>

            {/* Storage Metric */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                <span>STORAGE</span>
                <span className="text-foreground/90 font-mono">FREE: {isOffline ? '0 TB' : (server.storageMetrics?.free || 'N/A')}</span>
              </div>
              <div className="flex items-center gap-4">
                <Progress 
                  value={server.currentStorageUsagePercent} 
                  className="h-2.5 bg-secondary/50 flex-1" 
                  indicatorClassName={isOffline ? 'bg-slate-500' : 'bg-cyan-400'}
                />
                <span className="text-xs font-bold text-muted-foreground min-w-[3ch] text-right">{server.currentStorageUsagePercent}%</span>
              </div>
              <div className="flex justify-between text-[9px] font-bold text-muted-foreground uppercase opacity-70">
                <span>USED: {isOffline ? '0 TB' : (server.storageMetrics?.used || 'N/A')}</span>
                <span>CAPACITY: {isOffline ? '0 TB' : (server.storageMetrics?.capacity || 'N/A')}</span>
              </div>
            </div>

            <div className="pt-4 mt-2 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Host Health</span>
                <StatusIndicator status={server.status} />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ServerHealthAssistant serverData={server} />

      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Hosted Virtual Machines
          <div className="h-px flex-1 bg-border/40 ml-4" />
        </h2>
        <Card className={`bg-secondary/5 border-border/50 overflow-hidden backdrop-blur-sm ${isOffline ? 'opacity-30' : ''}`}>
          <Table>
            <TableHeader className="bg-secondary/30">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Status</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground">VM Name</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Guest OS</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground">Hostname</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">vCPU</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground text-center">Memory</TableHead>
                <TableHead className="font-bold text-xs uppercase text-muted-foreground text-right">Storage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {server.virtualMachines.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-muted-foreground font-medium italic">
                    {isOffline ? 'Node is powered off. No VMs active.' : 'No virtual machines hosted on this node.'}
                  </TableCell>
                </TableRow>
              ) : (
                server.virtualMachines.map((vm, i) => (
                  <TableRow key={i} className="border-border/30 hover:bg-primary/5 transition-colors group">
                    <TableCell>
                      <StatusIndicator status={isOffline ? 'Stopped' : vm.status} />
                    </TableCell>
                    <TableCell className="font-bold text-sm group-hover:text-primary transition-colors">{vm.vmName}</TableCell>
                    <TableCell className="text-xs text-muted-foreground font-medium">{vm.guestOs}</TableCell>
                    <TableCell className="text-xs font-mono">{vm.hostname}</TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-background/50 font-mono text-[10px]">{vm.allocatedCpuCores} Cores</Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="secondary" className="bg-background/50 font-mono text-[10px]">{vm.allocatedRamGb} GB</Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-muted-foreground">
                      {vm.usedStorageGb >= 1024 
                        ? `${(vm.usedStorageGb / 1024).toFixed(2)} TB` 
                        : `${vm.usedStorageGb} GB`}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
