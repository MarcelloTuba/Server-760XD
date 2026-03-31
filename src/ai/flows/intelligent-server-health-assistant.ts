'use server';
/**
 * @fileOverview An AI assistant that analyzes server and virtual machine metrics to provide recommendations, identify bottlenecks, and suggest updates.
 *
 * - analyzeServerHealth - A function that handles the server health analysis process.
 * - AnalyzeServerHealthInput - The input type for the analyzeServerHealth function.
 * - AnalyzeServerHealthOutput - The return type for the analyzeServerHealth function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema Definition
const VirtualMachineMetricsSchema = z.object({
  vmName: z.string().describe('The name of the virtual machine.'),
  status: z.string().describe('The current operational status of the VM (e.g., "Running", "Stopped", "Paused").'),
  usedStorageGb: z.number().describe('The amount of storage space (in GB) currently used by the VM.'),
  allocatedCpuCores: z.number().describe('The number of CPU cores allocated to the VM.'),
  allocatedRamGb: z.number().describe('The amount of RAM (in GB) allocated to the VM.'),
  guestOs: z.string().describe('The operating system running inside the VM.'),
  hostname: z.string().describe('The hostname of the virtual machine.'),
});

const AnalyzeServerHealthInputSchema = z.object({
  serverModel: z.string().describe('The model of the server (e.g., "Dell PowerEdge R740").'),
  serverIp: z.string().describe('The IP address of the server.'),
  cpuInfo: z.string().describe('A descriptive string of the server CPUs (e.g., "2x Intel Xeon Bronze 3104").'),
  ramInfo: z.string().describe('A descriptive string of the server RAM configuration (e.g., "4x RAM 16GB, 4x RAM 32GB").'),
  storageInfo: z.string().describe('A descriptive string of the server storage configuration (e.g., "5x HDD 1TB, 2x HDD 1TB").'),
  exsiVersion: z.string().describe('The VMware ESXi version running on the server (e.g., "6.7.0. update 1 build-11675023").'),
  currentCpuUsagePercent: z.number().min(0).max(100).describe('The current CPU utilization percentage of the server.'),
  currentRamUsagePercent: z.number().min(0).max(100).describe('The current RAM utilization percentage of the server.'),
  currentStorageUsagePercent: z.number().min(0).max(100).describe('The current storage utilization percentage of the server.'),
  virtualMachines: z.array(VirtualMachineMetricsSchema).describe('A list of virtual machines hosted on this server with their respective metrics.'),
});
export type AnalyzeServerHealthInput = z.infer<typeof AnalyzeServerHealthInputSchema>;

// Output Schema Definition
const AnalyzeServerHealthOutputSchema = z.object({
  overallHealthStatus: z.enum(['Good', 'Warning', 'Critical']).describe('An overall health status for the server based on the analysis.'),
  recommendations: z.string().describe('A detailed summary of actionable recommendations to optimize performance, address bottlenecks, or suggest updates.'),
  potentialBottlenecks: z.array(z.string()).describe('A list of identified potential bottlenecks (e.g., "High CPU usage", "Low disk space on specific volume").'),
  suggestedUpdates: z.array(z.string()).describe('A list of suggested updates (e.g., "Upgrade ESXi version", "Apply security patches", "Firmware update").'),
});
export type AnalyzeServerHealthOutput = z.infer<typeof AnalyzeServerHealthOutputSchema>;

// Exported wrapper function
export async function analyzeServerHealth(input: AnalyzeServerHealthInput): Promise<AnalyzeServerHealthOutput> {
  return analyzeServerHealthFlow(input);
}

// Genkit Prompt Definition
const analyzeServerHealthPrompt = ai.definePrompt({
  name: 'analyzeServerHealthPrompt',
  input: { schema: AnalyzeServerHealthInputSchema },
  output: { schema: AnalyzeServerHealthOutputSchema },
  prompt: `You are an intelligent server health assistant. Your task is to analyze the provided server and virtual machine metrics, then generate actionable recommendations, identify potential bottlenecks, and suggest necessary updates.\n\nConsider the following server details and its hosted virtual machines:\n\n---\n**Server Details:**\n- Model: {{{serverModel}}}\n- IP Address: {{{serverIp}}}\n- CPU Information: {{{cpuInfo}}}\n- RAM Information: {{{ramInfo}}}\n- Storage Information: {{{storageInfo}}}\n- ESXi Version: {{{exsiVersion}}}\n- Current CPU Usage: {{{currentCpuUsagePercent}}}%\n- Current RAM Usage: {{{currentRamUsagePercent}}}%\n- Current Storage Usage: {{{currentStorageUsagePercent}}}%\n\n**Virtual Machine Metrics:**\n{{#if virtualMachines}}\n  {{#each virtualMachines}}\n- VM Name: {{{vmName}}}\n  - Status: {{{status}}}\n  - Used Storage: {{{usedStorageGb}}} GB\n  - Allocated CPU Cores: {{{allocatedCpuCores}}}\n  - Allocated RAM: {{{allocatedRamGb}}} GB\n  - Guest OS: {{{guestOs}}}\n  - Hostname: {{{hostname}}}\n  ---\n  {{/each}}\n{{else}}\n  No virtual machines reported for this server.\n{{/if}}\n---\n\nBased on this data, provide an analysis in JSON format, adhering strictly to the AnalyzeServerHealthOutputSchema.\nDetermine the 'overallHealthStatus' as 'Good', 'Warning', or 'Critical'.\nThe 'recommendations' field should be a comprehensive, detailed text explaining your findings and actionable steps.\nThe 'potentialBottlenecks' and 'suggestedUpdates' fields should be lists of specific, concise items.`,
});

// Genkit Flow Definition
const analyzeServerHealthFlow = ai.defineFlow(
  {
    name: 'analyzeServerHealthFlow',
    inputSchema: AnalyzeServerHealthInputSchema,
    outputSchema: AnalyzeServerHealthOutputSchema,
  },
  async (input) => {
    const { output } = await analyzeServerHealthPrompt(input);
    return output!;
  }
);