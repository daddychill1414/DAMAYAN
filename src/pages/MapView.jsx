import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useStore } from '../store';
import { Link } from 'react-router-dom';
import { WifiOff, Wifi, Mic, Search } from 'lucide-react';

export const MapView = () => {
  const { centers, needs, isOffline, toggleOffline } = useStore();
  const position = [14.5995, 120.9842];
  const [searchQuery, setSearchQuery] = useState('');
  const [offlineQueue, setOfflineQueue] = useState([]);

  const filteredCenters = searchQuery
    ? centers.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : centers;

  const handleOfflineRequest = () => {
    if (!isOffline) return;
    const newEntry = {
      id: Date.now(),
      type: 'Need Request',
      msg: `Logged offline: Water supply request from user`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setOfflineQueue(prev => [newEntry, ...prev]);
  };

  const handleSync = () => {
    if (offlineQueue.length > 0) {
      setOfflineQueue([]);
      toggleOffline();
    }
  };

  return (
    <div className="pt-32 px-8 md:px-16 pb-24 min-h-[90vh] bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <h1 className="font-sans font-bold text-4xl md:text-5xl text-primary mb-2">Network Map</h1>
            <p className="font-outfit text-dark/70 max-w-2xl text-lg">Interactive map with offline sync capabilities. View evacuation centers, their capacity, and urgent needs.</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search center..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-full border border-primary/20 bg-transparent outline-none focus:border-primary font-outfit text-sm w-48"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
            </div>

            {/* Offline Toggle */}
            <button
              onClick={toggleOffline}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-xs uppercase tracking-wider font-bold border transition-all duration-300 ${
                isOffline
                  ? 'bg-accent/10 text-accent border-accent/30 shadow-lg shadow-accent/10'
                  : 'bg-green-50 text-green-700 border-green-200'
              }`}
            >
              {isOffline ? <WifiOff size={14} /> : <Wifi size={14} />}
              {isOffline ? 'Offline Mode' : 'Online'}
            </button>
          </div>
        </div>

        {/* Offline Banner */}
        {isOffline && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <WifiOff className="text-accent shrink-0" size={20} />
              <div>
                <p className="font-outfit font-semibold text-primary text-sm">Offline Mode Active</p>
                <p className="font-outfit text-dark/60 text-xs">Requests are queued locally. They will sync when connectivity returns.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleOfflineRequest}
                className="bg-primary text-background px-4 py-2 rounded-lg font-outfit text-xs font-bold hover:bg-primary/90 transition-colors"
              >
                + Log Request Offline
              </button>
              {offlineQueue.length > 0 && (
                <button
                  onClick={handleSync}
                  className="bg-accent text-white px-4 py-2 rounded-lg font-outfit text-xs font-bold hover:bg-accent/90 transition-colors"
                >
                  Sync Now ({offlineQueue.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Offline Queue */}
        {offlineQueue.length > 0 && (
          <div className="mb-6 bg-dark text-background rounded-2xl p-4">
            <h4 className="font-mono text-[10px] uppercase tracking-widest text-background/50 mb-3">Queued Offline Requests</h4>
            <div className="space-y-2">
              {offlineQueue.map(entry => (
                <div key={entry.id} className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-yellow-400 animate-pulse">●</span>
                  <span className="text-background/60">{entry.time}</span>
                  <span className="text-background/90">{entry.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        <div className="w-full h-[60vh] rounded-[2rem] overflow-hidden border-2 border-primary/10 shadow-xl relative z-10">
          <MapContainer center={position} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {filteredCenters.map(center => {
              const centerNeeds = needs.filter(n => n.centerId === center.id);
              const urgentNeedsCount = centerNeeds.filter(n => (n.requested - n.pledged - n.delivered) > 0).length;
              const occupancyPct = Math.round((center.current / center.capacity) * 100);

              return (
                <Marker key={center.id} position={[center.lat, center.lng]}>
                  <Popup className="font-outfit">
                    <div className="p-1 min-w-[200px]">
                      <h3 className="font-sans font-bold text-lg text-primary">{center.name}</h3>
                      <div className="text-sm mt-2 mb-1">
                        <span className="font-mono text-xs text-dark/50">Occupancy:</span> {center.current}/{center.capacity} ({occupancyPct}%)
                      </div>
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden mb-2">
                        <div className={`h-full rounded-full ${occupancyPct > 80 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${occupancyPct}%` }}></div>
                      </div>
                      <div className="text-sm mb-2">
                        Status: <span className={`font-bold ${center.status === 'Critical' ? 'text-red-500' : center.status === 'Warning' ? 'text-yellow-600' : 'text-green-600'}`}>{center.status}</span>
                      </div>
                      <h4 className="font-mono text-[10px] text-dark/60 uppercase border-t pt-2 mt-2">Urgent Needs ({urgentNeedsCount})</h4>
                      <ul className="text-xs list-disc pl-4 mt-1 mb-3">
                        {centerNeeds.map(n => {
                          const remaining = Math.max(0, n.requested - n.pledged - n.delivered);
                          if (remaining > 0) {
                            return <li key={n.id}>{remaining}x {n.item}</li>;
                          }
                          return null;
                        })}
                      </ul>
                      <Link to="/needs" className="mt-2 inline-block bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-bold w-full text-center hover:bg-accent/90 transition-colors">
                        Pledge Now →
                      </Link>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        </div>

        {/* Center Legend */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {centers.map(c => {
            const urgentCount = needs.filter(n => n.centerId === c.id && (n.requested - n.pledged - n.delivered) > 0).length;
            return (
              <div key={c.id} className="bg-white rounded-2xl p-4 border border-primary/5 shadow-sm flex items-center gap-4">
                <div className={`w-3 h-3 rounded-full shrink-0 ${c.status === 'Critical' ? 'bg-red-500' : c.status === 'Warning' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                <div>
                  <h4 className="font-outfit font-semibold text-primary text-sm">{c.name}</h4>
                  <p className="font-mono text-[10px] text-dark/50">{urgentCount} urgent need{urgentCount !== 1 ? 's' : ''}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
