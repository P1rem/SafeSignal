import { useEffect, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end justify-center">
      <div
        className="absolute inset-0 bg-navy-950/40 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-card-lg',
          'max-h-[85vh] overflow-y-auto no-scrollbar animate-slide-up sm:animate-fade-in',
          'pt-3 pb-8 px-5'
        )}
        style={{ paddingBottom: 'max(2rem, env(safe-area-inset-bottom))' }}
      >
        {/* Drag handle — always visible on mobile */}
        <div className="flex justify-center mb-3 sm:hidden">
          <div className="w-10 h-1.5 bg-navy-200 rounded-full" />
        </div>

        {title && (
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-navy-900 pr-2">{title}</h3>
            <button
              onClick={onClose}
              className="btn-touch flex items-center justify-center w-9 h-9 rounded-lg text-navy-400 hover:bg-navy-100 hover:text-navy-700 flex-shrink-0"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>
  );
}
