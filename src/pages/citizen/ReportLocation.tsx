import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import { MapPin, Navigation, Check, Loader2 } from 'lucide-react';
import { CitizenBackBar } from '@/components/AuthorityNav';
import { Button } from '@/components/ui/Button';
import { SafetyMap } from '@/components/SafetyMap';
import { MAP_CENTER } from '@/lib/data';
import type { IncidentType } from '@/types';

interface LocationState {
  type: IncidentType;
}

export function ReportLocation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = (location.state as LocationState) ?? { type: 'Other' };

  const [selected, setSelected] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'idle' | 'loading' | 'granted' | 'denied'>('idle');

  const attemptGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    setGeoStatus('loading');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setSelected({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('granted');
      },
      () => {
        setGeoStatus('denied');
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }, []);

  // Auto-attempt geolocation on mount
  useEffect(() => {
    attemptGeolocation();
  }, [attemptGeolocation]);

  const handleMapClick = (lat: number, lng: number) => {
    setSelected({ lat, lng });
  };

  const handleSubmit = () => {
    if (selected) {
      navigate('/report/success', {
        state: {
          type,
          lat: selected.lat,
          lng: selected.lng,
        },
      });
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <CitizenBackBar title="Location" backTo="/report/type" step={{ current: 2, total: 2 }} />

      <div className="flex-1 flex flex-col min-h-0 max-w-md mx-auto w-full px-4 pt-4 pb-4">
        <div className="mb-3 flex-shrink-0">
          <h1 className="text-xl font-bold text-navy-950 mb-1">Where did this happen?</h1>
          <p className="text-sm text-navy-500">
            Tap on the map to pin the location. Your identity is never stored.
          </p>
        </div>

        {/* Geolocation status */}
        {geoStatus === 'loading' && (
          <div className="flex items-center gap-2 text-sm text-navy-500 bg-navy-50 rounded-xl px-3 py-2.5 mb-3 flex-shrink-0">
            <Loader2 size={16} className="animate-spin flex-shrink-0" />
            <span>Detecting your location…</span>
          </div>
        )}
        {geoStatus === 'granted' && selected && (
          <div className="flex items-center gap-2 text-sm text-teal-700 bg-teal-50 rounded-xl px-3 py-2.5 mb-3 flex-shrink-0">
            <Check size={16} className="flex-shrink-0" />
            <span>Location detected. Adjust by tapping the map.</span>
          </div>
        )}
        {geoStatus === 'denied' && (
          <div className="flex items-center justify-between gap-2 text-sm text-navy-600 bg-amber-50 rounded-xl px-3 py-2.5 mb-3 flex-shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <MapPin size={16} className="text-amber-600 flex-shrink-0" />
              <span>Tap the map to pin manually.</span>
            </div>
            <button
              onClick={attemptGeolocation}
              className="btn-touch flex-shrink-0 text-xs font-semibold text-teal-600 px-3 py-1.5 rounded-lg hover:bg-teal-50"
            >
              Retry
            </button>
          </div>
        )}

        {/* Map — flexible height fills available space */}
        <div className="rounded-2xl overflow-hidden shadow-card mb-3 flex-1 min-h-[240px] relative">
          <SafetyMap
            center={selected ? [selected.lat, selected.lng] : MAP_CENTER}
            zoom={16}
            onLocationSelect={handleMapClick}
            selectedLocation={selected}
            className="w-full h-full"
          />
          {!selected && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-xs font-medium text-navy-600 shadow-card flex items-center gap-1.5 pointer-events-none z-[500]">
              <Navigation size={13} className="text-teal-600" />
              Tap to pin location
            </div>
          )}
        </div>

        {/* Selected coords */}
        {selected && (
          <div className="bg-teal-50 rounded-xl px-3 py-2.5 mb-3 flex items-center gap-2 text-xs text-teal-700 flex-shrink-0">
            <MapPin size={14} className="text-teal-600 flex-shrink-0" />
            <span className="tabular-nums">
              {selected.lat.toFixed(5)}, {selected.lng.toFixed(5)}
            </span>
            <Check size={14} className="ml-auto text-teal-600 flex-shrink-0" />
          </div>
        )}

        <Button
          fullWidth
          size="lg"
          disabled={!selected}
          onClick={handleSubmit}
          className="flex-shrink-0"
        >
          {selected ? (
            <>
              <Check size={20} />
              Submit anonymously
            </>
          ) : (
            'Tap map to set location'
          )}
        </Button>
      </div>
    </div>
  );
}
