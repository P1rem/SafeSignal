import { MapContainer, TileLayer, Marker, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useMemo } from 'react';
import type { Pattern, Report } from '@/types';
import { STATUS_COLORS } from '@/types';
import { MAP_CENTER } from '@/lib/data';

interface SafetyMapProps {
  patterns?: Pattern[];
  reports?: Report[];
  center?: [number, number];
  zoom?: number;
  selectedPatternId?: string | null;
  onPatternClick?: (pattern: Pattern) => void;
  onLocationSelect?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
  className?: string;
  interactive?: boolean;
  showReportPins?: boolean;
}

function createPatternIcon(status: Pattern['status'], count: number): L.DivIcon {
  const color = STATUS_COLORS[status].marker;
  const size = count > 15 ? 38 : count > 10 ? 32 : 26;
  return L.divIcon({
    className: 'pattern-marker-wrapper',
    html: `<div class="pattern-marker" style="width:${size}px;height:${size}px;background:${color};font-size:${size > 30 ? '11px' : '10px'};font-weight:700;color:white;">${count}</div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

function createReportIcon(): L.DivIcon {
  return L.divIcon({
    className: 'report-pin-wrapper',
    html: '<div class="report-pin" style="width:12px;height:12px;background:#5c7ba0;"></div>',
    iconSize: [12, 12],
    iconAnchor: [6, 6],
  });
}

function createSelectionIcon(): L.DivIcon {
  return L.divIcon({
    className: 'selection-pin-wrapper',
    html: '<div style="width:24px;height:24px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:#16a687;border:3px solid white;box-shadow:0 2px 8px rgba(29,42,61,0.3);"></div>',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
}

function MapResizer() {
  const map = useMap();
  setTimeout(() => map.invalidateSize(), 100);
  return null;
}

function ClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  const map = useMap();
  if (onClick) {
    map.on('click', (e: L.LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    });
  }
  return null;
}

export function SafetyMap({
  patterns = [],
  reports = [],
  center = MAP_CENTER,
  zoom = 14,
  selectedPatternId,
  onPatternClick,
  onLocationSelect,
  selectedLocation,
  className = '',
  interactive = true,
  showReportPins = false,
}: SafetyMapProps) {
  const mapKey = useMemo(() => `${center[0]}-${center[1]}-${zoom}`, [center, zoom]);

  return (
    <div className={className} style={{ minHeight: '200px' }}>
      <MapContainer
        key={mapKey}
        center={center}
        zoom={zoom}
        className="w-full h-full"
        style={{ minHeight: '200px', height: '100%' }}
        zoomControl={false}
        attributionControl={true}
        dragging={interactive}
        scrollWheelZoom={interactive}
        doubleClickZoom={interactive}
        touchZoom={interactive}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; OpenStreetMap contributors'
        />
        <MapResizer />
        {onLocationSelect && <ClickHandler onClick={onLocationSelect} />}

        {/* Report pins (background) */}
        {showReportPins &&
          reports.map((r) => (
            <Marker
              key={r.id}
              position={[r.lat, r.lng]}
              icon={createReportIcon()}
              interactive={false}
            />
          ))}

        {/* Pattern markers */}
        {patterns.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={createPatternIcon(p.status, p.reportCount)}
            eventHandlers={{
              click: () => onPatternClick?.(p),
            }}
            zIndexOffset={p.id === selectedPatternId ? 1000 : 0}
          >
          </Marker>
        ))}

        {/* Selection marker for report flow */}
        {selectedLocation && (
          <Marker
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={createSelectionIcon()}
          />
        )}

        {/* Influence circles for selected pattern */}
        {patterns
          .filter((p) => p.id === selectedPatternId)
          .map((p) => (
            <Circle
              key={`circle-${p.id}`}
              center={[p.lat, p.lng]}
              radius={150}
              pathOptions={{
                color: STATUS_COLORS[p.status].marker,
                fillColor: STATUS_COLORS[p.status].marker,
                fillOpacity: 0.1,
                weight: 1,
              }}
            />
          ))}
      </MapContainer>
    </div>
  );
}
