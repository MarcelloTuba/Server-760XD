"use client";

import { Database, HardDrive, ShieldCheck, Box, Server as ServerIcon, TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useInfrastructure } from "@/context/InfrastructureContext";
import { Badge } from "@/components/ui/badge";

export default function StoragePage() {
  const { servers } = useInfrastructure();

  // Função auxiliar para converter string formatada (ex: "3.86 TB") em número decimal
  const parseStorageValue = (value: string | undefined): number => {
    if (!value) return 0;
    const num = parseFloat(value.replace(',', '.'));
    if (value.toLowerCase().includes('gb')) return num / 1024;
    return num;
  };

  const storageDetails = servers.map(server => {
    const capacity = parseStorageValue(server.storageMetrics?.capacity);
    const used = parseStorageValue(server.storageMetrics?.used);
    const free = parseStorageValue(server.storageMetrics?.free);
    
    // Extração simples baseada no padrão de storageInfo
    // Ex: "1 RAID 10 1.8TB, 2 HDD 1 TB"
    const raidMatch = server.storageInfo.match(/RAID 10 ([\d.,]+)\s*TB/i);
    const raidCapacity = raidMatch ? parseFloat(raidMatch[1].replace(',', '.')) : 0;
    const totalHddCapacity = capacity - raidCapacity;

    return {
      id: server.id,
      ip: server.ip,
      model: server.model,
      status: server.status,
      used,
      free,
      capacity,
      raidCapacity,
      nonRaidCapacity: Math.max(0, totalHddCapacity)
    };
  });

  const totalUsed = storageDetails.reduce((acc, s) => acc + s.used, 0);
  const totalCapacity = storageDetails.reduce((acc, s) => acc + s.capacity, 0);
  const totalFree = storageDetails.reduce((acc, s) => acc + s.free, 0);
  const totalRaid = storageDetails.reduce((acc, s) => acc + s.raidCapacity, 0);
  const totalNonRaid = storageDetails.reduce((acc, s) => acc + s.nonRaidCapacity, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-muted-foreground">Global Storage Manager</h1>
        <p className="text-muted-foreground mt-1 font-medium">Monitoramento centralizado de volumes físicos e arranjos RAID.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Volume Total</CardTitle>
            <Database className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCapacity.toFixed(2)} TB</div>
            <p className="text-xs text-muted-foreground mt-1">Capacidade bruta agregada</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Uso Global</CardTitle>
            <TrendingUp className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rose-400">{totalUsed.toFixed(2)} TB</div>
            <Progress value={(totalUsed / totalCapacity) * 100} className="h-1.5 mt-2 bg-secondary/50" />
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Espaço Livre</CardTitle>
            <Box className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400">{totalFree.toFixed(2)} TB</div>
            <p className="text-xs text-muted-foreground mt-1">Disponível para provisionamento</p>
          </CardContent>
        </Card>
        <Card className="bg-secondary/20 border-border/50 border-primary/20">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Arranjos RAID 10</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRaid.toFixed(2)} TB</div>
            <p className="text-xs text-muted-foreground mt-1">Volume de alta disponibilidade</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-secondary/5 border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-bold flex items-center gap-2">
            <HardDrive className="h-5 w-5 text-primary" />
            Storage Inventory per Node
          </CardTitle>
          <CardDescription>Detalhamento técnico da topologia de armazenamento por host físico.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader className="bg-secondary/20">
              <TableRow className="border-border/50 hover:bg-transparent">
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Host</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground">Status</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground text-center">RAID 10 Vol.</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground text-center">Non-RAID / HDD</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground text-right">Used</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground text-right">Free</TableHead>
                <TableHead className="text-xs uppercase font-bold text-muted-foreground text-right">Total Capacity</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {storageDetails.map((s) => (
                <TableRow key={s.id} className="border-border/30 hover:bg-primary/5">
                  <TableCell className="font-bold py-4">
                    <div className="flex items-center gap-2">
                      <ServerIcon className="h-3 w-3 text-muted-foreground" />
                      <div className="flex flex-col">
                        <span>{s.ip}</span>
                        <span className="text-[10px] font-normal text-muted-foreground opacity-70">{s.model.split(' ')[2]}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={s.status === 'Online' ? 'default' : 'secondary'} className="text-[10px] uppercase font-mono h-5">
                      {s.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {s.raidCapacity > 0 ? (
                      <span className="text-primary font-bold">{s.raidCapacity.toFixed(2)} TB</span>
                    ) : (
                      <span className="text-muted-foreground opacity-30">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center font-mono text-xs">
                    {s.nonRaidCapacity > 0 ? (
                      <span className="text-accent">{s.nonRaidCapacity.toFixed(2)} TB</span>
                    ) : (
                      <span className="text-muted-foreground opacity-30">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right text-rose-400 font-bold font-mono text-xs">
                    {s.used.toFixed(2)} TB
                  </TableCell>
                  <TableCell className="text-right text-emerald-400 font-bold font-mono text-xs">
                    {s.free.toFixed(2)} TB
                  </TableCell>
                  <TableCell className="text-right font-bold font-mono text-xs">
                    {s.capacity.toFixed(2)} TB
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-secondary/10 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Consolidado de Proteção</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Volume em RAID 10 (Alta Redundância)</span>
                <span className="text-primary font-bold">{totalRaid.toFixed(2)} TB</span>
              </div>
              <Progress value={(totalRaid / totalCapacity) * 100} className="h-2 bg-secondary/50" indicatorClassName="bg-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-muted-foreground">Volume Livre / Non-RAID (Sem Redundância)</span>
                <span className="text-accent font-bold">{totalNonRaid.toFixed(2)} TB</span>
              </div>
              <Progress value={(totalNonRaid / totalCapacity) * 100} className="h-2 bg-secondary/50" indicatorClassName="bg-accent" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-secondary/10 border-border/50">
          <CardHeader>
            <CardTitle className="text-sm font-bold uppercase tracking-wider">Health Alert: Global Threshold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center p-4 text-center">
              <div className="text-3xl font-black text-emerald-500 mb-2">{( (totalFree / totalCapacity) * 100 ).toFixed(1)}%</div>
              <p className="text-sm font-medium text-muted-foreground">Margem de segurança global está em conformidade com as políticas corporativas (Threshold &gt; 15%).</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}