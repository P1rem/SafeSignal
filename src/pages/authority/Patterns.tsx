import { useState } from 'react';
import { Filter, ShieldCheck } from 'lucide-react';
import { PatternCard } from '@/components/PatternCard';
import { Card } from '@/components/ui/Card';
import { DemoDataBanner } from '@/components/ui/States';
import { PATTERNS } from '@/lib/data';
import type { PatternStatus } from '@/types';

type FilterValue = 'all' | PatternStatus;

const filterOptions: { value: FilterValue; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Emerging', label: 'Emerging' },
  { value: 'Repeated concern', label: 'Repeated concern' },
  { value: 'Rising pattern', label: 'Rising pattern' },
];

export function AuthorityPatterns() {
  const [filter, setFilter] = useState<FilterValue>('all');

  const filteredPatterns =
    filter === 'all' ? PATTERNS : PATTERNS.filter((p) => p.status === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-navy-950">Safety Patterns</h1>
        <p className="text-sm text-navy-500 mt-0.5">
          {PATTERNS.length} active patterns across {new Set(PATTERNS.map((p) => p.locationName)).size} locations
        </p>
      </div>

      <div className="mb-4">
        <DemoDataBanner />
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        <Filter size={16} className="text-navy-400 flex-shrink-0" />
        {filterOptions.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setFilter(opt.value)}
            className={`btn-touch whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex-shrink-0 ${
              filter === opt.value
                ? 'bg-teal-600 text-white'
                : 'bg-white text-navy-600 border border-navy-200 hover:bg-navy-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Pattern grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredPatterns.map((p) => (
          <PatternCard key={p.id} pattern={p} to={`/authority/patterns/${p.id}`} />
        ))}
      </div>

      {filteredPatterns.length === 0 && (
        <Card padding="lg" className="text-center">
          <ShieldCheck size={32} className="text-navy-300 mx-auto mb-2" />
          <p className="text-sm text-navy-500">No patterns matching this filter.</p>
        </Card>
      )}
    </div>
  );
}
