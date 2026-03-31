export interface VirtualMachine {
  vmName: string;
  status: 'Running' | 'Stopped' | 'Paused';
  usedStorageGb: number;
  allocatedCpuCores: number;
  allocatedRamGb: number;
  guestOs: string;
  hostname: string;
}

export interface ResourceMetrics {
  used: string;
  free: string;
  capacity: string;
}

export interface Server {
  id: string;
  model: string;
  ip: string;
  cpuInfo: string;
  realCores?: string;
  ramInfo: string;
  storageInfo: string;
  raidConfig?: string;
  supportModules?: string;
  exsiVersion: string;
  status: 'Online' | 'Offline' | 'Warning';
  currentCpuUsagePercent: number;
  currentRamUsagePercent: number;
  currentStorageUsagePercent: number;
  cpuMetrics?: ResourceMetrics;
  ramMetrics?: ResourceMetrics;
  storageMetrics?: ResourceMetrics;
  virtualMachines: VirtualMachine[];
}

export const SERVERS: Server[] = [
  {
    id: 'dell-r740',
    model: 'Dell PowerEdge R740',
    ip: '192.168.120.51',
    cpuInfo: '2x Intel Xeon Bronze 3104',
    realCores: '12 Cores',
    ramInfo: '192 GB DDR4 ECC',
    storageInfo: '1 RAID 10 1.8TB, 2 HDD 1 TB',
    supportModules: 'DCM Module, iDRAC9',
    exsiVersion: '6.7.0. update 1 build-11675023',
    status: 'Online',
    currentCpuUsagePercent: 49,
    currentRamUsagePercent: 55,
    currentStorageUsagePercent: 71,
    cpuMetrics: {
      used: '9.9 GHz',
      free: '10.4 GHz',
      capacity: '20.4 GHz'
    },
    ramMetrics: {
      used: '105.33 GB',
      free: '86.13 GB',
      capacity: '191.46 GB'
    },
    storageMetrics: {
      used: '3.86 TB',
      free: '1.59 TB',
      capacity: '5.45 TB'
    },
    virtualMachines: [
      { vmName: 'aptbt-dc1', status: 'Running', usedStorageGb: 55.88, allocatedCpuCores: 4, allocatedRamGb: 4.05, guestOs: 'Windows Server 2012 (64-bit)', hostname: 'APTBT-DC1.ap-tbt.infra' },
      { vmName: 'APTBT-HCM', status: 'Running', usedStorageGb: 387.11, allocatedCpuCores: 8, allocatedRamGb: 32.15, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'APTBT-HCM.ap-tbt.infra' },
      { vmName: 'aptbt-rds', status: 'Running', usedStorageGb: 250, allocatedCpuCores: 8, allocatedRamGb: 12.09, guestOs: 'Windows Server 2012 (64-bit)', hostname: 'APTBT-RDS.ap-tbt.infra' },
      { vmName: 'Dimension_C', status: 'Running', usedStorageGb: 49.02, allocatedCpuCores: 4, allocatedRamGb: 4.07, guestOs: 'Ubuntu Linux (64-bit)', hostname: 'localhost' },
      { vmName: 'PBRQRI-ERP01.ap-tbt', status: 'Running', usedStorageGb: 220, allocatedCpuCores: 8, allocatedRamGb: 9.89, guestOs: 'Windows LEGADO (32-bit)', hostname: 'PBRQRI-ERP01.ap-tbt.infra' },
      { vmName: 'SACTR-SRV01', status: 'Running', usedStorageGb: 218.11, allocatedCpuCores: 4, allocatedRamGb: 16, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SACTR-SRV01.ap-tbt.infra' },
      { vmName: 'SABTM-RDS01', status: 'Running', usedStorageGb: 279.34, allocatedCpuCores: 8, allocatedRamGb: 24, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SABTM-RDS01.ap-tbt.infra' },
    ],
  },
  {
    id: 'dell-r740xd',
    model: 'Dell PowerEdge R740XD',
    ip: '192.168.120.52',
    cpuInfo: '2x Intel Xeon Bronze 3104',
    realCores: '12 Cores',
    ramInfo: '192 GB DDR4 ECC',
    storageInfo: '2 RAID 10 2TB, 2 HDD 1 TB',
    supportModules: 'DCM Module, iDRAC9',
    exsiVersion: '6.7.0. update 1 build-11675023',
    status: 'Online',
    currentCpuUsagePercent: 56,
    currentRamUsagePercent: 48,
    currentStorageUsagePercent: 61,
    cpuMetrics: {
      used: '11,3 GHZ',
      free: '9.1 GHz',
      capacity: '20.4 GHz'
    },
    ramMetrics: {
      used: '91.18 GB',
      free: '99.45 GB',
      capacity: '190.63 GB'
    },
    storageMetrics: {
      used: '4.41 TB',
      free: '2.86 TB',
      capacity: '7.27 TB'
    },
    virtualMachines: [
      { vmName: 'aptbt-fs', status: 'Running', usedStorageGb: 990.15, allocatedCpuCores: 2, allocatedRamGb: 3.93, guestOs: 'Windows Server 2012 (64-bit)', hostname: 'APTBT-FS01.ap-tbt.infra' },
      { vmName: 'SA-TBT-STR-01', status: 'Running', usedStorageGb: 200, allocatedCpuCores: 4, allocatedRamGb: 16, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SATBT-SRV01.APGSA.infra' },
      { vmName: 'SA-HQ-DCO-01', status: 'Running', usedStorageGb: 54.11, allocatedCpuCores: 4, allocatedRamGb: 4.06, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SAHQ-DCO01.APGSA.infra' },
      { vmName: 'SABTM-ERP01', status: 'Running', usedStorageGb: 279.34, allocatedCpuCores: 8, allocatedRamGb: 32, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SABTM-ERP01.ap-tbt.infra' },
      { vmName: 'SATBT-ERP01', status: 'Running', usedStorageGb: 388.11, allocatedCpuCores: 8, allocatedRamGb: 32, guestOs: 'Windows Server 2022 (64-bit)', hostname: 'SATBT-ERP01.ap-tbt.infra' },
    ],
  },
  {
    id: 'dell-r720',
    model: 'Dell PowerEdge R720',
    ip: '192.168.120.53',
    cpuInfo: '2x Intel Xeon E5-2620',
    realCores: '12 cores',
    ramInfo: '128 GB DDR3 ECC',
    storageInfo: '1 RAID 10 1,2TB, 2 HDD 1 TB',
    supportModules: 'DCM Module, iDRAC7',
    exsiVersion: '7.0.1. update 3',
    status: 'Online',
    currentCpuUsagePercent: 48,
    currentRamUsagePercent: 85,
    currentStorageUsagePercent: 75,
    cpuMetrics: {
      used: '9,4 GHZ',
      free: '14.6 GHz',
      capacity: '24 GHz'
    },
    ramMetrics: {
      used: '108.87 GB',
      free: '19.09 GB',
      capacity: '127.96 GB'
    },
    storageMetrics: {
      used: '2.89 TB',
      free: '1,005.36 GB',
      capacity: '3.87 TB'
    },
    virtualMachines: [
      { vmName: 'SA-TBT-SRV03-LEP', status: 'Running', usedStorageGb: 170, allocatedCpuCores: 4, allocatedRamGb: 16.07, guestOs: 'Microsoft Windows Server 2022 (64-bit)', hostname: 'SATBT-SRV02.APGSA.infra' },
      { vmName: 'SACTR-ERP02', status: 'Running', usedStorageGb: 572.62, allocatedCpuCores: 8, allocatedRamGb: 64, guestOs: 'Microsoft Windows Server 2022 (64-bit)', hostname: 'SACTR-ERP02.ap-tbt.infra' },
      { vmName: 'SACTR-RDS01', status: 'Running', usedStorageGb: 148.62, allocatedCpuCores: 8, allocatedRamGb: 24, guestOs: 'Microsoft Windows Server 2022 (64-bit)', hostname: 'SACTR-RDS01.ap-tbt.infra' },
      { vmName: 'SACTR-ERP03', status: 'Running', usedStorageGb: 555.8, allocatedCpuCores: 8, allocatedRamGb: 32, guestOs: 'Microsoft Windows Server 2022 (64-bit)', hostname: 'SACTR-ERP03.ap-tbt.infra' },
    ],
  },
  {
    id: 'dell-r760xd2',
    model: 'Dell PowerEdge R760XD2',
    ip: '192.168.120.54',
    cpuInfo: '2x Intel Xeon Silver 4410Y',
    realCores: '24 Cores',
    ramInfo: '64 GB DDR5 ECC',
    storageInfo: '1 RAID 10 2TB, 1 HDD 2 TB',
    supportModules: 'DCM Module, iDRAC9',
    exsiVersion: '7.0.1. update 3',
    status: 'Offline',
    currentCpuUsagePercent: 0,
    currentRamUsagePercent: 0,
    currentStorageUsagePercent: 0,
    virtualMachines: [],
  },
];