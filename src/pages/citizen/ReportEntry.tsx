import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Eye, Lock, Zap, Info } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { CitizenBackBar } from '@/components/AuthorityNav';

export function ReportEntry() {
  return (
    <div>
      <CitizenBackBar title="Report" backTo="/" />
      <div className="max-w-md mx-auto px-4 pt-6 pb-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-navy-950 mb-2">Report an incident</h1>
          <p className="text-sm text-navy-500">
            Share what happened in a few seconds. Your report is completely anonymous.
          </p>
        </div>

        {/* Privacy assurances */}
        <Card padding="md" className="mb-5">
          <div className="space-y-3">
            <PrivacyRow icon={<Eye size={18} />} title="Anonymous" desc="No name, email, or account linked." />
            <PrivacyRow icon={<Lock size={18} />} title="No tracking" desc="Your identity is never stored with the report." />
            <PrivacyRow icon={<Zap size={18} />} title="Takes seconds" desc="Select a type, pin a location, submit." />
          </div>
        </Card>

        {/* What happens next */}
        <Card padding="md" className="mb-6 bg-navy-50 border border-navy-100">
          <div className="flex items-start gap-3">
            <Info size={18} className="text-navy-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-semibold text-navy-800 mb-1">What happens after I report?</h3>
              <p className="text-xs text-navy-500 leading-relaxed">
                Your report is combined with other anonymous signals to identify recurring safety patterns.
                Individual reports are never shown — only aggregated patterns become visible.
              </p>
            </div>
          </div>
        </Card>

        <Link to="/report/type">
          <Button fullWidth size="lg">
            Start report
            <ArrowRight size={20} />
          </Button>
        </Link>
      </div>
    </div>
  );
}

function PrivacyRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
        {icon}
      </div>
      <div>
        <div className="text-sm font-semibold text-navy-800">{title}</div>
        <div className="text-xs text-navy-500">{desc}</div>
      </div>
    </div>
  );
}
