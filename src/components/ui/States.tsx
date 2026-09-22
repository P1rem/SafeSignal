import { type ReactNode } from 'react';
import { Loader2, Inbox, AlertCircle } from 'lucide-react';

export function LoadingState({ message = 'Loading…' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Loader2 size={32} className="text-teal-600 animate-spin mb-3" />
      <p className="text-sm text-navy-500">{message}</p>
    </div>
  );
}

export function EmptyState({
  title,
  message,
  icon,
  action,
}: {
  title: string;
  message: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-navy-50 flex items-center justify-center mb-4 text-navy-400">
        {icon ?? <Inbox size={28} />}
      </div>
      <h3 className="text-base font-semibold text-navy-800 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-xs mb-4">{message}</p>
      {action}
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again in a moment.',
  action,
}: {
  title?: string;
  message?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
        <AlertCircle size={28} />
      </div>
      <h3 className="text-base font-semibold text-navy-800 mb-1">{title}</h3>
      <p className="text-sm text-navy-500 max-w-xs mb-4">{message}</p>
      {action}
    </div>
  );
}

export function DemoDataBanner() {
  return (
    <div className="flex items-start gap-2 rounded-xl bg-navy-50 border border-navy-100 px-3 py-2.5 text-xs text-navy-500">
      <span className="flex-shrink-0 mt-0.5 w-2 h-2 rounded-full bg-teal-500" />
      <span>
        <span className="font-semibold text-navy-700">Demo data.</span> All reports and patterns shown are synthetic, for prototype demonstration only.
      </span>
    </div>
  );
}
