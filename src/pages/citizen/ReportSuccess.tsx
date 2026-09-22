import { useLocation, Link } from 'react-router-dom';
import { useMemo } from 'react';
import { CheckCircle2, Eye, MapPin, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { generateReportId, formatDate } from '@/lib/utils';
import { DemoDataBanner } from '@/components/ui/States';

interface SuccessState {
  type: string;
  lat: number;
  lng: number;
}

export function ReportSuccess() {
  const location = useLocation();
  const { type, lat, lng } = (location.state as SuccessState) ?? {
    type: 'Unknown',
    lat: 0,
    lng: 0,
  };

  const reportId = useMemo(() => generateReportId(), []);
  const timestamp = useMemo(() => Date.now(), []);

  return (
    <div className="max-w-md mx-auto px-4 pt-8 pb-4 min-h-screen flex flex-col">
      <div className="flex-1">
        {/* Success icon */}
        <div className="flex flex-col items-center text-center mb-6 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-teal-50 flex items-center justify-center mb-4">
            <CheckCircle2 size={44} className="text-teal-600" />
          </div>
          <h1 className="text-2xl font-bold text-navy-950 mb-2">Report received</h1>
          <p className="text-sm text-navy-500 max-w-xs">
            Your report is analyzed with other signals to identify recurring safety patterns.
          </p>
        </div>

        {/* Report details */}
        <Card padding="lg" className="mb-4">
          <div className="text-center mb-5">
            <div className="text-xs text-navy-400 uppercase tracking-wide font-medium mb-1">Report ID</div>
            <div className="text-lg font-bold text-navy-900 tabular-nums">{reportId}</div>
          </div>

          <div className="space-y-3 pt-4 border-t border-navy-50">
            <DetailRow icon={<Eye size={16} />} label="Type" value={type} />
            <DetailRow icon={<MapPin size={16} />} label="Location" value={`${lat.toFixed(5)}, ${lng.toFixed(5)}`} />
            <DetailRow icon={<Clock size={16} />} label="Timestamp" value={formatDate(timestamp)} />
            <DetailRow icon={<ShieldCheck size={16} />} label="Identity" value="Anonymous" />
          </div>
        </Card>

        <DemoDataBanner />
      </div>

      {/* Actions */}
      <div className="space-y-2.5 pt-4">
        <Link to="/map">
          <Button fullWidth size="lg">
            View safety signals
            <ArrowRight size={20} />
          </Button>
        </Link>
        <Link to="/">
          <Button fullWidth size="lg" variant="ghost">
            Back to home
          </Button>
        </Link>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs text-navy-400">{label}</div>
        <div className="text-sm font-medium text-navy-800 truncate">{value}</div>
      </div>
    </div>
  );
}
