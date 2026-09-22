import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, MapPin, Clock, X, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import { CitizenBackBar } from '@/components/AuthorityNav';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { playSosSound } from '@/lib/sosSound';
import { generateReportId, formatDate } from '@/lib/utils';

type SosPhase = 'countdown' | 'sent' | 'cancelled';

export function SosPage() {
  const [phase, setPhase] = useState<SosPhase>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [geoStatus, setGeoStatus] = useState<'loading' | 'granted' | 'denied'>('loading');
  const [sosId] = useState(() => generateReportId());
  const [timestamp] = useState(() => Date.now());

  // Try to get geolocation immediately on mount
  const attemptGeo = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoStatus('denied');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGeoStatus('granted');
      },
      () => setGeoStatus('denied'),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }, []);

  useEffect(() => {
    attemptGeo();
  }, [attemptGeo]);

  // Countdown timer
  useEffect(() => {
    if (phase !== 'countdown') return;
    if (countdown <= 0) {
      playSosSound();
      setPhase('sent');
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [phase, countdown]);

  const triggerSosNow = () => {
    playSosSound();
    setPhase('sent');
  };

  const cancelSos = () => setPhase('cancelled');

  if (phase === 'cancelled') {
    return (
      <div>
        <CitizenBackBar title="SOS" backTo="/" />
        <div className="max-w-md mx-auto px-4 pt-12 pb-4 flex flex-col items-center text-center min-h-[60vh] justify-center">
          <div className="w-16 h-16 rounded-full bg-navy-100 flex items-center justify-center mb-4">
            <X size={32} className="text-navy-500" />
          </div>
          <h1 className="text-xl font-bold text-navy-900 mb-2">SOS cancelled</h1>
          <p className="text-sm text-navy-500 mb-6">No alert was sent. You can report an incident instead.</p>
          <div className="w-full space-y-2.5">
            <Link to="/report/type">
              <Button fullWidth size="lg">Report an incident</Button>
            </Link>
            <Link to="/">
              <Button fullWidth size="lg" variant="ghost">Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'sent') {
    return (
      <div className="max-w-md mx-auto px-4 pt-8 pb-4 min-h-screen flex flex-col">
        <div className="flex-1 flex flex-col items-center text-center">
          {/* Alert icon with pulsing ring */}
          <div className="relative mb-6 animate-fade-in">
            <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center">
              <AlertTriangle size={48} className="text-red-600" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-red-400 animate-ping opacity-30" />
          </div>

          <h1 className="text-2xl font-bold text-red-700 mb-2">SOS ALERT SENT</h1>
          <p className="text-sm text-navy-600 mb-6">Emergency workflow initiated. Location captured.</p>

          {/* Details card */}
          <Card padding="lg" className="w-full mb-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-red-50 flex items-center justify-center text-red-600">
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-navy-400">SOS ID</div>
                  <div className="text-sm font-bold text-navy-900 tabular-nums">{sosId}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500">
                  <MapPin size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-navy-400">Approximate Location</div>
                  <div className="text-sm font-medium text-navy-800 tabular-nums">
                    {location ? `${location.lat.toFixed(5)}, ${location.lng.toFixed(5)}` : 'Location unavailable'}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-navy-50 flex items-center justify-center text-navy-500">
                  <Clock size={18} />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-navy-400">Time</div>
                  <div className="text-sm font-medium text-navy-800">{formatDate(timestamp)}</div>
                </div>
              </div>
            </div>
          </Card>

          <div className="w-full bg-amber-50 rounded-xl px-3 py-2.5 text-xs text-amber-700 mb-4 flex items-start gap-2">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>
              This prototype does not automatically contact police or emergency services.
              In a real emergency, call 112 directly.
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2.5 pt-4">
          <Link to="/map">
            <Button fullWidth size="lg">
              View Safety Map
              <ArrowRight size={20} />
            </Button>
          </Link>
          <Button fullWidth size="lg" variant="ghost" onClick={cancelSos}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  // Countdown phase
  return (
    <div className="max-w-md mx-auto px-4 pt-12 pb-4 min-h-screen flex flex-col items-center justify-center">
      <div className="text-center mb-6">
        <p className="text-sm text-navy-500 mb-1">Sending SOS alert in</p>
        <div className="text-7xl font-bold text-red-600 tabular-nums my-4 animate-fade-in" key={countdown}>
          {countdown}
        </div>
        <p className="text-sm text-navy-500">Tap cancel to stop</p>
      </div>

      {/* Location status */}
      <div className="flex items-center gap-2 text-xs mb-8">
        {geoStatus === 'loading' && (
          <span className="flex items-center gap-1.5 text-navy-500">
            <Loader2 size={14} className="animate-spin" />
            Capturing location…
          </span>
        )}
        {geoStatus === 'granted' && (
          <span className="flex items-center gap-1.5 text-teal-600">
            <MapPin size={14} />
            Location captured
          </span>
        )}
        {geoStatus === 'denied' && (
          <span className="flex items-center gap-1.5 text-amber-600">
            <MapPin size={14} />
            Location unavailable — alert will still send
          </span>
        )}
      </div>

      <Button fullWidth size="lg" variant="ghost" onClick={cancelSos} className="text-red-600">
        <X size={20} />
        Cancel
      </Button>

      <button
        onClick={triggerSosNow}
        className="btn-touch mt-3 text-xs text-teal-600 font-medium"
      >
        Send immediately
      </button>
    </div>
  );
}
