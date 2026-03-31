"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { SERVERS, Server, VirtualMachine } from '@/lib/server-data';
import { toast } from '@/hooks/use-toast';

interface InfrastructureContextType {
  servers: Server[];
  toggleVmPower: (serverId: string, vmName: string) => void;
  toggleServerPower: (serverId: string) => void;
  resetToDefault: () => void;
}

const InfrastructureContext = createContext<InfrastructureContextType | undefined>(undefined);

// Mapeamento de origem das VMs migradas para migração reversa
const VM_ORIGINS: Record<string, string> = {
  'SATBT-ERP01': 'dell-r740xd',
  'SABTM-ERP01': 'dell-r740xd',
  'APTBT-HCM': 'dell-r740',
  'SACTR-ERP03': 'dell-r720',
  'SACTR-ERP02': 'dell-r720',
};

export function InfrastructureProvider({ children }: { children: ReactNode }) {
  const [servers, setServers] = useState<Server[]>(SERVERS);

  const resetToDefault = () => {
    setServers(JSON.parse(JSON.stringify(SERVERS)));
    toast({
      title: "Configuração Restaurada",
      description: "Toda a infraestrutura retornou ao estado padrão (Default).",
    });
  };

  const toggleServerPower = (serverId: string) => {
    setServers((prevServers) => {
      const newServers = JSON.parse(JSON.stringify(prevServers)) as Server[];
      const server = newServers.find(s => s.id === serverId);
      
      if (server) {
        const isOnline = server.status === 'Online';
        server.status = isOnline ? 'Offline' : 'Online';
        
        // Quando o servidor é desligado, as métricas de uso devem ser 0%
        if (server.status === 'Offline') {
          server.currentCpuUsagePercent = 0;
          server.currentRamUsagePercent = 0;
          server.currentStorageUsagePercent = 0;
        } else if (serverId === 'dell-r760xd2' && server.status === 'Online') {
          // Valores base para quando o R760XD2 é ligado sem VMs
          server.currentCpuUsagePercent = 5;
          server.currentRamUsagePercent = 12;
          server.currentStorageUsagePercent = 8;
        }
        
        toast({
          title: `Host ${isOnline ? 'Desativado' : 'Ativado'}`,
          description: `O servidor ${server.model} (${server.ip}) agora está ${server.status.toLowerCase()}.`,
        });
      }
      
      return newServers;
    });
  };

  const toggleVmPower = (serverId: string, vmName: string) => {
    setServers((prevServers) => {
      const newServers = JSON.parse(JSON.stringify(prevServers)) as Server[];
      const sourceServer = newServers.find(s => s.id === serverId);
      
      if (!sourceServer) return prevServers;

      const vmIndex = sourceServer.virtualMachines.findIndex(v => v.vmName === vmName);
      if (vmIndex === -1) return prevServers;

      const vm = sourceServer.virtualMachines[vmIndex];
      const isRunning = vm.status === 'Running';

      // Lógica de migração reversa: Se estiver no R760XD2 e for "desligar", ela retorna à origem ligada
      if (serverId === 'dell-r760xd2' && isRunning) {
        const originId = VM_ORIGINS[vmName];
        const targetServer = newServers.find(s => s.id === originId);

        if (targetServer) {
          sourceServer.virtualMachines.splice(vmIndex, 1);
          vm.status = 'Running';
          targetServer.virtualMachines.push(vm);

          toast({
            title: "Migração Reversa Concluída",
            description: `A VM ${vmName} retornou ligada para o host de origem ${targetServer.ip}.`,
          });
        }
      } else {
        vm.status = isRunning ? 'Stopped' : 'Running';
      }

      // Atualizar carga do servidor R760XD2 com base nas VMs
      if (serverId === 'dell-r760xd2') {
        const totalVmRam = sourceServer.virtualMachines.reduce((acc, v) => acc + (v.status === 'Running' ? v.allocatedRamGb : 0), 0);
        const hostCapacityRam = 64; 
        sourceServer.currentRamUsagePercent = Math.round((totalVmRam / hostCapacityRam) * 100) + 12; // 12% baseline hypervisor
        
        const runningVms = sourceServer.virtualMachines.filter(v => v.status === 'Running').length;
        sourceServer.currentCpuUsagePercent = (runningVms * 15) + 5; // 15% por VM + 5% baseline
      }

      return newServers;
    });
  };

  return (
    <InfrastructureContext.Provider value={{ servers, toggleVmPower, toggleServerPower, resetToDefault }}>
      {children}
    </InfrastructureContext.Provider>
  );
}

export function useInfrastructure() {
  const context = useContext(InfrastructureContext);
  if (context === undefined) {
    throw new Error('useInfrastructure must be used within an InfrastructureProvider');
  }
  return context;
}
