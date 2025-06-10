import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

interface EdgeLocation {
  id: string;
  city: string;
  country: string;
  code: string;
  lat: number;
  lng: number;
  responseTime: number;
  status: 'healthy' | 'degraded' | 'offline';
  requests: number;
  cacheHitRate: number;
  bandwidth: number;
}

interface PerformanceData {
  locations: EdgeLocation[];
  globalStats: {
    totalRequests: number;
    avgResponseTime: number;
    globalCacheHitRate: number;
    totalBandwidth: number;
  };
  timestamp: number;
}

const EdgePerformanceVisualizer: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState<EdgeLocation | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list' | 'metrics'>('map');
  const mapRef = useRef<HTMLDivElement>(null);

  const { data: performanceData, isLoading } = useQuery<PerformanceData>({
    queryKey: ['/api/edge-performance'],
    refetchInterval: 5000, // Update every 5 seconds
    staleTime: 0
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'degraded': return '#f59e0b';
      case 'offline': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getResponseTimeColor = (responseTime: number) => {
    if (responseTime < 50) return '#10b981';
    if (responseTime < 100) return '#3b82f6';
    if (responseTime < 200) return '#f59e0b';
    return '#ef4444';
  };

  const formatBandwidth = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = bytes;
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  useEffect(() => {
    if (!performanceData?.locations || !mapRef.current) return;

    // Create SVG world map visualization
    const container = mapRef.current;
    container.innerHTML = '';

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 1000 500');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '400');
    svg.style.background = '#0f172a';

    // Add world map outline (simplified)
    const worldPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    worldPath.setAttribute('d', 'M100,100 L900,100 L900,400 L100,400 Z M200,150 L300,150 L300,250 L200,250 Z M400,150 L700,150 L700,350 L400,350 Z M750,120 L850,120 L850,180 L750,180 Z');
    worldPath.setAttribute('fill', 'none');
    worldPath.setAttribute('stroke', '#334155');
    worldPath.setAttribute('stroke-width', '1');
    svg.appendChild(worldPath);

    // Add edge locations as circles
    performanceData.locations.forEach((location) => {
      // Convert lat/lng to SVG coordinates (simplified projection)
      const x = ((location.lng + 180) / 360) * 1000;
      const y = ((90 - location.lat) / 180) * 500;

      // Create location circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', x.toString());
      circle.setAttribute('cy', y.toString());
      circle.setAttribute('r', Math.max(3, Math.min(12, location.requests / 100)).toString());
      circle.setAttribute('fill', getStatusColor(location.status));
      circle.setAttribute('opacity', '0.8');
      circle.style.cursor = 'pointer';

      // Add pulse animation for active locations
      if (location.status === 'healthy') {
        const pulse = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pulse.setAttribute('cx', x.toString());
        pulse.setAttribute('cy', y.toString());
        pulse.setAttribute('r', '3');
        pulse.setAttribute('fill', 'none');
        pulse.setAttribute('stroke', getStatusColor(location.status));
        pulse.setAttribute('stroke-width', '2');
        pulse.setAttribute('opacity', '0.6');

        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '3;15;3');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('repeatCount', 'indefinite');
        pulse.appendChild(animate);

        const animateOpacity = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animateOpacity.setAttribute('attributeName', 'opacity');
        animateOpacity.setAttribute('values', '0.6;0;0.6');
        animateOpacity.setAttribute('dur', '2s');
        animateOpacity.setAttribute('repeatCount', 'indefinite');
        pulse.appendChild(animateOpacity);

        svg.appendChild(pulse);
      }

      // Add click handler
      circle.addEventListener('click', () => {
        setSelectedLocation(location);
      });

      // Add tooltip
      const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      title.textContent = `${location.city}, ${location.country}\nResponse Time: ${location.responseTime}ms\nStatus: ${location.status}`;
      circle.appendChild(title);

      svg.appendChild(circle);
    });

    container.appendChild(svg);
  }, [performanceData]);

  if (isLoading) {
    return (
      <div className="bg-surface border border-border rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-border rounded w-1/4 mb-4"></div>
          <div className="h-64 bg-border rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      {/* Header */}
      <div className="border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-text">Real-time Edge Performance</h3>
            <p className="text-sm text-text-muted">
              Global edge location monitoring across {performanceData?.locations.length || 0} data centers
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'map' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-light text-text-muted hover:text-text'
              }`}
            >
              Map
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-light text-text-muted hover:text-text'
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode('metrics')}
              className={`px-3 py-1 rounded text-sm ${
                viewMode === 'metrics' 
                  ? 'bg-primary text-white' 
                  : 'bg-surface-light text-text-muted hover:text-text'
              }`}
            >
              Metrics
            </button>
          </div>
        </div>
      </div>

      {/* Global Stats */}
      {performanceData && (
        <div className="border-b border-border p-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">
                {performanceData.globalStats.avgResponseTime}ms
              </div>
              <div className="text-sm text-text-muted">Avg Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-success">
                {performanceData.globalStats.globalCacheHitRate.toFixed(1)}%
              </div>
              <div className="text-sm text-text-muted">Cache Hit Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-text">
                {performanceData.globalStats.totalRequests.toLocaleString()}
              </div>
              <div className="text-sm text-text-muted">Total Requests</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-warning">
                {formatBandwidth(performanceData.globalStats.totalBandwidth)}
              </div>
              <div className="text-sm text-text-muted">Total Bandwidth</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-4">
        {viewMode === 'map' && (
          <div className="space-y-4">
            <div ref={mapRef} className="bg-background rounded border border-border"></div>
            
            {selectedLocation && (
              <div className="bg-surface-light rounded-lg p-4 border border-border">
                <h4 className="font-semibold text-text mb-2">
                  {selectedLocation.city}, {selectedLocation.country} ({selectedLocation.code})
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-text-muted">Response Time:</span>
                    <div 
                      className="font-semibold"
                      style={{ color: getResponseTimeColor(selectedLocation.responseTime) }}
                    >
                      {selectedLocation.responseTime}ms
                    </div>
                  </div>
                  <div>
                    <span className="text-text-muted">Status:</span>
                    <div 
                      className="font-semibold capitalize"
                      style={{ color: getStatusColor(selectedLocation.status) }}
                    >
                      {selectedLocation.status}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-muted">Requests:</span>
                    <div className="font-semibold text-text">
                      {selectedLocation.requests.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-text-muted">Cache Hit Rate:</span>
                    <div className="font-semibold text-success">
                      {selectedLocation.cacheHitRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {viewMode === 'list' && performanceData && (
          <div className="space-y-2">
            {performanceData.locations
              .sort((a, b) => a.responseTime - b.responseTime)
              .map((location) => (
                <div
                  key={location.id}
                  className="flex items-center justify-between p-3 bg-surface-light rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                  onClick={() => setSelectedLocation(location)}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getStatusColor(location.status) }}
                    ></div>
                    <div>
                      <div className="font-medium text-text">
                        {location.city}, {location.country}
                      </div>
                      <div className="text-sm text-text-muted">{location.code}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div 
                      className="font-semibold"
                      style={{ color: getResponseTimeColor(location.responseTime) }}
                    >
                      {location.responseTime}ms
                    </div>
                    <div className="text-sm text-text-muted">
                      {location.requests.toLocaleString()} req
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}

        {viewMode === 'metrics' && performanceData && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Response Time Distribution */}
            <div className="bg-surface-light rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-text mb-4">Response Time Distribution</h4>
              <div className="space-y-2">
                {[
                  { range: '< 50ms', color: '#10b981', count: performanceData.locations.filter(l => l.responseTime < 50).length },
                  { range: '50-100ms', color: '#3b82f6', count: performanceData.locations.filter(l => l.responseTime >= 50 && l.responseTime < 100).length },
                  { range: '100-200ms', color: '#f59e0b', count: performanceData.locations.filter(l => l.responseTime >= 100 && l.responseTime < 200).length },
                  { range: '> 200ms', color: '#ef4444', count: performanceData.locations.filter(l => l.responseTime >= 200).length }
                ].map((item) => (
                  <div key={item.range} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-text-muted flex-1">{item.range}</span>
                    <span className="text-sm font-medium text-text">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="bg-surface-light rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-text mb-4">Status Distribution</h4>
              <div className="space-y-2">
                {[
                  { status: 'Healthy', color: '#10b981', count: performanceData.locations.filter(l => l.status === 'healthy').length },
                  { status: 'Degraded', color: '#f59e0b', count: performanceData.locations.filter(l => l.status === 'degraded').length },
                  { status: 'Offline', color: '#ef4444', count: performanceData.locations.filter(l => l.status === 'offline').length }
                ].map((item) => (
                  <div key={item.status} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-text-muted flex-1">{item.status}</span>
                    <span className="text-sm font-medium text-text">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Performing Locations */}
            <div className="bg-surface-light rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-text mb-4">Top Performing Locations</h4>
              <div className="space-y-2">
                {performanceData.locations
                  .filter(l => l.status === 'healthy')
                  .sort((a, b) => a.responseTime - b.responseTime)
                  .slice(0, 5)
                  .map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-muted">#{index + 1}</span>
                        <span className="text-sm text-text">{location.city}</span>
                      </div>
                      <span className="text-sm font-medium text-success">
                        {location.responseTime}ms
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Cache Performance */}
            <div className="bg-surface-light rounded-lg p-4 border border-border">
              <h4 className="font-semibold text-text mb-4">Cache Performance</h4>
              <div className="space-y-2">
                {performanceData.locations
                  .sort((a, b) => b.cacheHitRate - a.cacheHitRate)
                  .slice(0, 5)
                  .map((location, index) => (
                    <div key={location.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-text-muted">#{index + 1}</span>
                        <span className="text-sm text-text">{location.city}</span>
                      </div>
                      <span className="text-sm font-medium text-success">
                        {location.cacheHitRate.toFixed(1)}%
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-border p-3 bg-surface-light">
        <div className="flex items-center justify-between text-sm text-text-muted">
          <span>
            Last updated: {performanceData ? new Date(performanceData.timestamp).toLocaleTimeString() : 'Loading...'}
          </span>
          <span>Refreshes every 5 seconds</span>
        </div>
      </div>
    </div>
  );
};

export default EdgePerformanceVisualizer;