import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  UserX,
  MessageSquareWarning,
  Footprints,
  AlertTriangle,
  Lightbulb,
  Eye,
  CircleAlert,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { INCIDENT_TYPES, type IncidentType } from '@/types';
import { CitizenBackBar } from '@/components/AuthorityNav';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { LucideIcon } from 'lucide-react';

const iconMap: Record<IncidentType, LucideIcon> = {
  Harassment: UserX,
  'Following/Stalking': Footprints,
  Catcalling: MessageSquareWarning,
  Intimidation: AlertTriangle,
  'Unsafe Area': Lightbulb,
  'Suspicious Activity': Eye,
  Other: CircleAlert,
};

export function ReportType() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<IncidentType | null>(null);

  const handleContinue = () => {
    if (selected) {
      navigate('/report/location', { state: { type: selected } });
    }
  };

  return (
    <div>
      <CitizenBackBar title="Report" backTo="/" step={{ current: 1, total: 2 }} />
      <div className="max-w-md mx-auto px-4 pt-5 pb-4">
        <div className="mb-4">
          <h1 className="text-xl font-bold text-navy-950 mb-1">What happened?</h1>
          <p className="text-sm text-navy-500">Choose the type that best describes the incident.</p>
        </div>

        <div className="space-y-2 mb-5">
          {INCIDENT_TYPES.map((type) => {
            const Icon = iconMap[type];
            const isSelected = selected === type;
            return (
              <button
                key={type}
                onClick={() => setSelected(type)}
                className={`w-full text-left bg-white rounded-2xl shadow-card p-4 border-2 transition-all btn-touch ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50/50'
                    : 'border-navy-100 hover:border-navy-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-teal-100 text-teal-700' : 'bg-navy-100 text-navy-600'
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span className={`font-medium text-sm flex-1 ${isSelected ? 'text-teal-800' : 'text-navy-800'}`}>
                    {type}
                  </span>
                  {isSelected && (
                    <div className="w-5 h-5 rounded-full bg-teal-600 flex items-center justify-center flex-shrink-0">
                      <ShieldCheck size={14} className="text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <Button
          fullWidth
          size="lg"
          disabled={!selected}
          onClick={handleContinue}
        >
          Continue
          <ChevronRight size={20} />
        </Button>
      </div>
    </div>
  );
}
