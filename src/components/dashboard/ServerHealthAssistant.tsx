"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle, CheckCircle2, Info, Power, PowerOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnalyzeServerHealthOutput, analyzeServerHealth } from "@/ai/flows/intelligent-server-health-assistant";
import { StatusIndicator } from "./StatusIndicator";
import { cn } from "@/lib/utils";
import { Server } from "@/lib/server-data";
import { useInfrastructure } from "@/context/InfrastructureContext";

interface Props {
  serverData: Server;
}

export function ServerHealthAssistant({ serverData }: Props) {
  const { toggleVmPower } = useInfrastructure();
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<AnalyzeServerHealthOutput | null>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const result = await analyzeServerHealth({
        serverModel: serverData.model,
        serverIp: serverData.ip,
        cpuInfo: serverData.cpuInfo,
        ramInfo: serverData.ramInfo,
        storageInfo: serverData.storageInfo,
        exsiVersion: serverData.exsiVersion,
        currentCpuUsagePercent: serverData.currentCpuUsagePercent,
        currentRamUsagePercent: serverData.currentRamUsagePercent,
        currentStorageUsagePercent: serverData.currentStorageUsagePercent,
        virtualMachines: serverData.virtualMachines
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Health analysis failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-primary/20 bg-secondary/30 backdrop-blur-sm overflow-hidden">
      <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent" />
            Health Insight Assistant
          </CardTitle>
          <CardDescription>Monitoramento proativo e otimização inteligente</CardDescription>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          {!analysis && (
            <Button 
              onClick={handleAnalyze} 
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white font-semibold flex-1 md:flex-none"
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" />
              )}
              Analisar Saúde do Host
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* VM Control Center */}
        <div className="p-4 rounded-xl bg-background/40 border border-border/40 space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
            <Power className="h-3 w-3" />
            VM Power Control Center
          </h4>
          <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {serverData.virtualMachines.map((vm) => {
              const isRunning = vm.status === 'Running';
              return (
                <div 
                  key={vm.vmName} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded-lg border transition-all duration-300",
                    isRunning ? "bg-emerald-500/5 border-emerald-500/20" : "bg-rose-500/5 border-rose-500/20 opacity-70"
                  )}
                >
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-bold truncate">{vm.vmName}</span>
                    <span className={cn("text-[10px] font-medium uppercase", isRunning ? "text-emerald-400" : "text-rose-400")}>
                      {vm.status}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => {
                      toggleVmPower(serverData.id, vm.vmName);
                      setAnalysis(null);
                    }}
                    className={cn(
                      "h-8 w-8 rounded-full transition-all",
                      isRunning ? "hover:bg-rose-500/20 text-rose-400" : "hover:bg-emerald-500/20 text-emerald-400"
                    )}
                  >
                    {isRunning ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-muted-foreground animate-pulse font-medium">Processando análise profunda do hardware e VMs...</p>
          </div>
        )}

        {analysis && (
          <div className="animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between mb-6 p-4 rounded-lg bg-background/50 border border-border/50">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Estado Geral</span>
                <StatusIndicator status={analysis.overallHealthStatus} />
              </div>
              <Button variant="ghost" size="sm" onClick={() => setAnalysis(null)} className="text-muted-foreground hover:text-foreground">
                Reiniciar Análise
              </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <h4 className="flex items-center gap-2 font-semibold text-accent">
                  <Info className="h-4 w-4" />
                  Recomendações
                </h4>
                <div className="text-sm leading-relaxed text-muted-foreground bg-background/40 p-4 rounded-lg border border-border/20 whitespace-pre-wrap">
                  {analysis.recommendations}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-rose-400">
                    <AlertCircle className="h-4 w-4" />
                    Gargalos Detectados
                  </h4>
                  <ul className="space-y-2">
                    {analysis.potentialBottlenecks.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-rose-400 shrink-0 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="flex items-center gap-2 font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    Ações Sugeridas
                  </h4>
                  <ul className="space-y-2">
                    {analysis.suggestedUpdates.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {!analysis && !loading && (
          <div className="py-8 text-center bg-background/20 border border-dashed border-border rounded-lg">
            <Info className="h-8 w-8 mx-auto mb-3 text-muted-foreground opacity-20" />
            <p className="text-muted-foreground text-sm">
              Inicie a ferramenta de análise para obter insights inteligentes sobre o desempenho deste host.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
