import { cn } from "@/lib/utils";

type StatusType = 'Good' | 'Warning' | 'Critical' | 'Online' | 'Offline' | 'Running' | 'Stopped' | 'Paused';

export function StatusIndicator({ status }: { status: StatusType }) {
  const getStatusColor = (s: StatusType) => {
    switch (s) {
      case 'Good':
      case 'Online':
      case 'Running':
        return 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]';
      case 'Warning':
      case 'Paused':
        return 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]';
      case 'Critical':
      case 'Offline':
      case 'Stopped':
        return 'bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.5)]';
      default:
        return 'bg-slate-500';
    }
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn("h-2 w-2 rounded-full", getStatusColor(status))} />
      <span className="text-sm font-medium">{status}</span>
    </div>
  );
}