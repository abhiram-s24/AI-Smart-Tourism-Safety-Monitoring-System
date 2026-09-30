/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import {
  Shield,
  ShieldAlert,
  AlertTriangle,
  Bell,
  MapPin,
  TrendingUp,
  PhoneCall,
  User,
  LogOut,
  LogIn,
  CheckCircle2,
  X,
  Compass,
  Radio,
  Eye,
  Github,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Send,
  Navigation,
  Activity,
  Layers,
  Info,
  Clock,
  Sparkles
} from 'lucide-react';

// Types
interface AlertItem {
  id: string;
  title: string;
  description: string;
  time: string;
  type: 'warning' | 'info' | 'danger';
  read: boolean;
  location: string;
}

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  bloodGroup: string;
  touristId: string;
  verified: boolean;
}

interface ZoneInfo {
  id: string;
  name: string;
  density: number; // 0 - 100
  headcount: number;
  capacity: number;
  status: 'low' | 'moderate' | 'high';
  trend: 'rising' | 'stable' | 'declining';
  x: number;
  y: number;
  radius: number;
  advisory: string;
}

const INITIAL_ZONES: ZoneInfo[] = [
  {
    id: 'city-center',
    name: 'City Center Plaza',
    density: 68,
    headcount: 1420,
    capacity: 2000,
    status: 'moderate',
    trend: 'rising',
    x: 48,
    y: 42,
    radius: 36,
    advisory: 'Moderate congestion around main fountain. Average transit delay: 4 mins.'
  },
  {
    id: 'main-square',
    name: 'Main Cultural Square',
    density: 88,
    headcount: 2850,
    capacity: 3200,
    status: 'high',
    trend: 'rising',
    x: 74,
    y: 35,
    radius: 40,
    advisory: 'High crowd density near entrance gate 2. Use East bypass route.'
  },
  {
    id: 'riverfront',
    name: 'Riverfront Promenade',
    density: 32,
    headcount: 480,
    capacity: 1500,
    status: 'low',
    trend: 'stable',
    x: 24,
    y: 72,
    radius: 32,
    advisory: 'Optimal flow and peaceful conditions. Safe for family transit.'
  },
  {
    id: 'heritage-fort',
    name: 'Heritage Fort Complex',
    density: 46,
    headcount: 920,
    capacity: 2000,
    status: 'moderate',
    trend: 'declining',
    x: 78,
    y: 76,
    radius: 34,
    advisory: 'Ticket queue cleared. Security checkpoints operating at standard speed.'
  },
  {
    id: 'old-bazaar',
    name: 'Old Bazaar Market',
    density: 82,
    headcount: 1890,
    capacity: 2300,
    status: 'high',
    trend: 'rising',
    x: 35,
    y: 28,
    radius: 34,
    advisory: 'Narrow lanes congested. Watch personal belongings and follow lane markers.'
  }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'alerts' | 'safety-status' | 'emergency' | 'predictions' | 'location' | 'profile'>('dashboard');
  const [user, setUser] = useState<UserProfile | null>({
    name: 'Abhiram Sikakolli',
    email: 'abhiramsikakolli2005@gmail.com',
    phone: '+91 98765 43210',
    emergencyContact: '+91 91234 56789',
    bloodGroup: 'O+',
    touristId: 'SIH-IND-2026-9042',
    verified: true
  });

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showGithubModal, setShowGithubModal] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ZoneInfo>(INITIAL_ZONES[0]);
  const [isEmergencyActive, setIsEmergencyActive] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [emergencyDispatched, setEmergencyDispatched] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isSharingLocation, setIsSharingLocation] = useState(true);

  const [alerts, setAlerts] = useState<AlertItem[]>([
    {
      id: 'alt-1',
      title: 'High Crowd Density at Main Square',
      description: 'Main Square area is experiencing peak footfall of 88% capacity. Consider alternative scenic routes via East promenade.',
      time: '10 mins ago',
      type: 'warning',
      read: false,
      location: 'Main Cultural Square'
    },
    {
      id: 'alt-2',
      title: 'Monsoon Rain & Wet Pavement Warning',
      description: 'Moderate rain expected in the next 35 minutes. Walking surfaces on stone promenades may be slippery.',
      time: '45 mins ago',
      type: 'info',
      read: false,
      location: 'City-wide'
    },
    {
      id: 'alt-3',
      title: 'Temporary Geo-Fenced Perimeter Restriction',
      description: 'Heritage Fort ramparts section B is temporarily restricted for scheduled maintenance.',
      time: '1 hour ago',
      type: 'danger',
      read: true,
      location: 'Heritage Fort'
    },
    {
      id: 'alt-4',
      title: 'Medical Post #4 Operational',
      description: 'First aid and hydration center is now fully staffed next to Central Clock Tower.',
      time: '2 hours ago',
      type: 'info',
      read: true,
      location: 'Central Plaza'
    }
  ]);

  // Audio beep generator using Web Audio API
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playBeep = (freq = 880, type: OscillatorType = 'sine', duration = 0.2) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Audio autoplay policy fallback
    }
  };

  // Emergency countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isEmergencyActive && countdown > 0) {
      playBeep(650 + (5 - countdown) * 120, 'square', 0.25);
      timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    } else if (isEmergencyActive && countdown === 0) {
      setEmergencyDispatched(true);
      playBeep(980, 'sawtooth', 0.5);
    }
    return () => clearTimeout(timer);
  }, [isEmergencyActive, countdown]);

  const handleStartEmergency = () => {
    setIsEmergencyActive(true);
    setEmergencyDispatched(false);
    setCountdown(5);
  };

  const handleCancelEmergency = () => {
    setIsEmergencyActive(false);
    setEmergencyDispatched(false);
    setCountdown(5);
  };

  const handleLogin = (userData: Partial<UserProfile>) => {
    setUser({
      name: userData.name || 'Abhiram Sikakolli',
      email: userData.email || 'abhiramsikakolli2005@gmail.com',
      phone: userData.phone || '+91 98765 43210',
      emergencyContact: userData.emergencyContact || '+91 91234 56789',
      bloodGroup: userData.bloodGroup || 'O+',
      touristId: 'SIH-IND-2026-9042',
      verified: true
    });
    setIsLoggedIn(true);
    setShowLoginModal(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const markAlertAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, read: true } : a))
    );
  };

  const unreadCount = alerts.filter((a) => !a.read).length;

  return (
    <div className="app">
      {/* Top Navbar */}
      <Navbar
        currentView={currentView}
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
        user={user}
        isLoggedIn={isLoggedIn}
        onShowLogin={() => setShowLoginModal(true)}
        onShowGithub={() => setShowGithubModal(true)}
        unreadCount={unreadCount}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {currentView === 'dashboard' && (
          <Dashboard
            user={user}
            isLoggedIn={isLoggedIn}
            onShowLogin={() => setShowLoginModal(true)}
            onNavigate={setCurrentView}
            selectedZone={selectedZone}
            setSelectedZone={setSelectedZone}
            zones={INITIAL_ZONES}
            alerts={alerts}
            onMarkRead={markAlertAsRead}
            onEmergencyClick={() => setCurrentView('emergency')}
          />
        )}

        {currentView === 'alerts' && (
          <AlertSystem
            alerts={alerts}
            onMarkRead={markAlertAsRead}
            onClearAll={() => setAlerts((prev) => prev.map((a) => ({ ...a, read: true })))}
            onAddSimulatedAlert={() => {
              const newAlert: AlertItem = {
                id: `alt-${Date.now()}`,
                title: 'Surge Warning: Riverfront Gate East',
                description: 'Sudden influx of 250+ tourists detected by vision camera node #8. Recommended to pace entry.',
                time: 'Just now',
                type: 'warning',
                read: false,
                location: 'Riverfront Promenade'
              };
              setAlerts((prev) => [newAlert, ...prev]);
            }}
          />
        )}

        {currentView === 'safety-status' && (
          <SafetyStatus
            selectedZone={selectedZone}
            zones={INITIAL_ZONES}
            onSelectZone={setSelectedZone}
          />
        )}

        {currentView === 'emergency' && (
          <EmergencyButton
            isEmergencyActive={isEmergencyActive}
            countdown={countdown}
            emergencyDispatched={emergencyDispatched}
            onStartEmergency={handleStartEmergency}
            onCancelEmergency={handleCancelEmergency}
            soundEnabled={soundEnabled}
            setSoundEnabled={setSoundEnabled}
            user={user}
          />
        )}

        {currentView === 'predictions' && (
          <CrowdPredictions
            selectedZone={selectedZone}
            zones={INITIAL_ZONES}
            onSelectZone={setSelectedZone}
          />
        )}

        {currentView === 'location' && (
          <LocationSharing
            isSharing={isSharingLocation}
            setIsSharing={setIsSharingLocation}
            user={user}
            selectedZone={selectedZone}
          />
        )}

        {currentView === 'profile' && (
          <ProfileManagement
            user={user}
            setUser={setUser}
            isLoggedIn={isLoggedIn}
            onShowLogin={() => setShowLoginModal(true)}
          />
        )}
      </main>

      {/* Login / Signup Modal */}
      {showLoginModal && (
        <LoginSignupModal
          onLogin={handleLogin}
          onClose={() => setShowLoginModal(false)}
        />
      )}

      {/* GitHub Push Helper Modal */}
      {showGithubModal && (
        <GithubPushModal onClose={() => setShowGithubModal(false)} />
      )}
    </div>
  );
}

// -------------------------------------------------------------
// Component: Navbar
// -------------------------------------------------------------
function Navbar({
  currentView,
  setCurrentView,
  onLogout,
  user,
  isLoggedIn,
  onShowLogin,
  onShowGithub,
  unreadCount
}: {
  currentView: string;
  setCurrentView: (view: any) => void;
  onLogout: () => void;
  user: UserProfile | null;
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onShowGithub: () => void;
  unreadCount: number;
}) {
  return (
    <header className="navbar">
      <div className="nav-brand" onClick={() => setCurrentView('dashboard')}>
        <div className="brand-icon">
          <Shield className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1>SafeTour</h1>
          <div className="nav-tagline">Smart Crowd Safety Management</div>
        </div>
      </div>

      <nav className="nav-menu">
        <button
          type="button"
          className={`nav-item ${currentView === 'dashboard' ? 'active' : ''}`}
          onClick={() => setCurrentView('dashboard')}
        >
          <Activity className="w-4 h-4" />
          <span>Dashboard</span>
        </button>
        <button
          type="button"
          className={`nav-item ${currentView === 'alerts' ? 'active' : ''}`}
          onClick={() => setCurrentView('alerts')}
        >
          <Bell className="w-4 h-4" />
          <span>Alerts</span>
          {unreadCount > 0 && (
            <span className="ml-1 px-1.5 py-0.2 bg-rose-500 text-white text-xs font-bold rounded-full">
              {unreadCount}
            </span>
          )}
        </button>
        <button
          type="button"
          className={`nav-item ${currentView === 'safety-status' ? 'active' : ''}`}
          onClick={() => setCurrentView('safety-status')}
        >
          <ShieldAlert className="w-4 h-4" />
          <span>Safety</span>
        </button>
        <button
          type="button"
          className={`nav-item ${currentView === 'emergency' ? 'active' : ''}`}
          onClick={() => setCurrentView('emergency')}
        >
          <PhoneCall className="w-4 h-4 text-rose-300" />
          <span className="font-semibold text-rose-200">SOS Emergency</span>
        </button>
        <button
          type="button"
          className={`nav-item ${currentView === 'predictions' ? 'active' : ''}`}
          onClick={() => setCurrentView('predictions')}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Predictions</span>
        </button>
        <button
          type="button"
          className={`nav-item ${currentView === 'location' ? 'active' : ''}`}
          onClick={() => setCurrentView('location')}
        >
          <MapPin className="w-4 h-4" />
          <span>Location</span>
        </button>
      </nav>

      <div className="nav-user">
        <button
          type="button"
          className="github-guide-btn"
          onClick={onShowGithub}
          title="Push to GitHub Instructions"
        >
          <Github className="w-4 h-4" />
          <span>GitHub</span>
        </button>

        {isLoggedIn ? (
          <>
            <button
              type="button"
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
              onClick={() => setCurrentView('profile')}
              title="View Profile"
            >
              <div className="user-avatar">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-medium hidden sm:inline">
                {user?.name?.split(' ')[0] || 'User'}
              </span>
            </button>
            <button
              type="button"
              className="logout-btn"
              onClick={onLogout}
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button type="button" className="login-btn" onClick={onShowLogin}>
            <LogIn className="w-4 h-4 inline mr-1" />
            Login / Signup
          </button>
        )}
      </div>
    </header>
  );
}

// -------------------------------------------------------------
// Component: Dashboard
// -------------------------------------------------------------
function Dashboard({
  user,
  isLoggedIn,
  onShowLogin,
  onNavigate,
  selectedZone,
  setSelectedZone,
  zones,
  alerts,
  onMarkRead,
  onEmergencyClick
}: {
  user: UserProfile | null;
  isLoggedIn: boolean;
  onShowLogin: () => void;
  onNavigate: (view: any) => void;
  selectedZone: ZoneInfo;
  setSelectedZone: (zone: ZoneInfo) => void;
  zones: ZoneInfo[];
  alerts: AlertItem[];
  onMarkRead: (id: string) => void;
  onEmergencyClick: () => void;
}) {
  return (
    <div>
      {/* Top Banner Card */}
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              {isLoggedIn ? `Welcome back, ${user?.name}!` : 'Welcome to SafeTour!'}
            </h2>
            <p className="text-slate-500 text-sm mt-0.5">
              Live AI-monitored crowd density, real-time geo-fencing, and emergency assistance.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Monitoring Active
            </span>
            <button
              onClick={onEmergencyClick}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              SOS Trigger
            </button>
          </div>
        </div>

        {!isLoggedIn && (
          <div className="guest-notice">
            <div className="flex items-center gap-2 text-sm text-slate-700">
              <Info className="w-4 h-4 text-sky-600 flex-shrink-0" />
              <span>
                Browsing in Guest Mode. Connect your tourist account to sync emergency contacts and digital credentials.
              </span>
            </div>
            <button
              onClick={onShowLogin}
              className="text-xs font-bold text-sky-800 bg-sky-100 hover:bg-sky-200 px-3 py-1.5 rounded-md transition-colors"
            >
              Sign In
            </button>
          </div>
        )}
      </div>

      {/* Grid: Map + Recent Alerts */}
      <div className="dashboard-grid">
        {/* Interactive Crowd Map */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Compass className="w-5 h-5 text-sky-600" />
              Crowd Density Heatmap
            </h2>
            <span className="text-xs text-slate-500 font-medium">Click any zone to inspect</span>
          </div>

          <div className="crowd-map-container">
            {/* SVG Visual Map */}
            <svg
              className="map-svg-viewport"
              viewBox="0 0 500 320"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Map Grid */}
              <defs>
                <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />
                </pattern>
                {/* Gradients */}
                <radialGradient id="highDensityGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#ef4444" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="modDensityGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.75" />
                  <stop offset="70%" stopColor="#f59e0b" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>
                <radialGradient id="lowDensityGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.7" />
                  <stop offset="70%" stopColor="#10b981" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
                </radialGradient>
              </defs>

              <rect width="100%" height="100%" fill="#f8fafc" />
              <rect width="100%" height="100%" fill="url(#grid)" />

              {/* Waterway / River graphic */}
              <path
                d="M 0 210 Q 150 250, 300 210 T 500 240 L 500 320 L 0 320 Z"
                fill="#e0f2fe"
                stroke="#bae6fd"
                strokeWidth="1.5"
              />
              <text x="20" y="290" fill="#0284c7" fontSize="12" fontWeight="600" opacity="0.7">
                Scenic River Corridor
              </text>

              {/* Primary Road Arteries */}
              <path
                d="M 50 0 L 240 140 L 450 140 L 500 190"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M 240 140 L 240 320"
                fill="none"
                stroke="#cbd5e1"
                strokeWidth="8"
                strokeLinecap="round"
              />
              <path
                d="M 380 0 L 240 140 L 100 260"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="6"
                strokeLinecap="round"
              />

              {/* Heatmap density circular zones */}
              {zones.map((zone) => {
                const cx = (zone.x / 100) * 500;
                const cy = (zone.y / 100) * 320;
                const gradId =
                  zone.status === 'high'
                    ? 'highDensityGrad'
                    : zone.status === 'moderate'
                    ? 'modDensityGrad'
                    : 'lowDensityGrad';
                const isSelected = selectedZone.id === zone.id;

                return (
                  <g
                    key={zone.id}
                    onClick={() => setSelectedZone(zone)}
                    style={{ cursor: 'pointer' }}
                  >
                    {/* Pulsing zone circle */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={zone.radius + (isSelected ? 6 : 0)}
                      fill={`url(#${gradId})`}
                    />
                    <circle
                      cx={cx}
                      cy={cy}
                      r={zone.radius * 0.4}
                      fill={
                        zone.status === 'high'
                          ? '#dc2626'
                          : zone.status === 'moderate'
                          ? '#d97706'
                          : '#059669'
                      }
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                    <text
                      x={cx}
                      y={cy + 4}
                      fill="#ffffff"
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {zone.density}%
                    </text>
                    {/* Zone name badge */}
                    <rect
                      x={cx - 50}
                      y={cy + zone.radius * 0.5 + 4}
                      width="100"
                      height="20"
                      rx="4"
                      fill="#ffffff"
                      stroke={isSelected ? '#005599' : '#e2e8f0'}
                      strokeWidth={isSelected ? '2' : '1'}
                    />
                    <text
                      x={cx}
                      y={cy + zone.radius * 0.5 + 18}
                      fill="#1e293b"
                      fontSize="10"
                      fontWeight="600"
                      textAnchor="middle"
                    >
                      {zone.name.split(' ')[0]} ({zone.density}%)
                    </text>
                  </g>
                );
              })}
            </svg>

            {/* Selected Zone floating info */}
            <div className="map-overlay">
              <div className="flex items-center justify-between">
                <h3>{selectedZone.name}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                    selectedZone.status === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : selectedZone.status === 'moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {selectedZone.density}% Density
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                {selectedZone.advisory}
              </p>
              <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
                <span>Headcount: <strong>{selectedZone.headcount.toLocaleString()}</strong> / {selectedZone.capacity}</span>
                <span className="capitalize font-semibold text-slate-700">Trend: {selectedZone.trend}</span>
              </div>

              <div className="density-legend">
                <div className="legend-item">
                  <div className="legend-color low-density"></div>
                  <span>&lt;40% Safe</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color medium-density"></div>
                  <span>40-75% Moderate</span>
                </div>
                <div className="legend-item">
                  <div className="legend-color high-density"></div>
                  <span>&gt;75% High</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Live Safety Alerts */}
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Bell className="w-5 h-5 text-amber-600" />
              Active Safety Alerts
            </h2>
            <button
              onClick={() => onNavigate('alerts')}
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold"
            >
              View All ({alerts.length})
            </button>
          </div>

          <div className="alert-list">
            {alerts.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className={`alert-item ${
                  item.type === 'danger'
                    ? 'alert-danger'
                    : item.type === 'warning'
                    ? 'alert-warning'
                    : 'alert-info'
                } ${!item.read ? 'unread' : ''}`}
              >
                <div className="alert-header">
                  <span className="alert-title">
                    {item.type === 'danger' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                    ) : item.type === 'warning' ? (
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                    ) : (
                      <Info className="w-4 h-4 text-sky-600" />
                    )}
                    {item.title}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="alert-time">{item.time}</span>
                    {!item.read && (
                      <button
                        className="mark-read-btn"
                        onClick={() => onMarkRead(item.id)}
                      >
                        Dismiss
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {item.description}
                </p>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.location}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid: Safety Meter & Predictions Teaser */}
      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <Shield className="w-5 h-5 text-emerald-600" />
              City Safety Index
            </h2>
            <span className="text-xs font-semibold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
              Condition: Stable
            </span>
          </div>

          <div className="safety-status">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-slate-800">Overall Area Risk: Moderate (58/100)</h3>
              <span className="text-xs text-slate-500">Updated 2m ago</span>
            </div>
            <div className="safety-meter">
              <div
                className="meter-fill"
                style={{ width: '58%', background: 'linear-gradient(90deg, #10b981 0%, #f59e0b 60%, #ef4444 100%)' }}
              ></div>
            </div>

            <div className="safety-indicators">
              <div className="indicator">
                <span className="text-emerald-600">Low (0-39)</span>
              </div>
              <div className="indicator">
                <span className="text-amber-600">Moderate (40-75)</span>
              </div>
              <div className="indicator">
                <span className="text-rose-600">Surge Risk (76+)</span>
              </div>
            </div>

            {/* Quick breakdown */}
            <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Active Evac Routes</div>
                <div className="text-sm font-bold text-slate-800">12 Clear</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Medical Stations</div>
                <div className="text-sm font-bold text-emerald-600">4 Active</div>
              </div>
              <div className="p-2 bg-slate-50 rounded-lg">
                <div className="text-xs text-slate-500">Patrol Teams</div>
                <div className="text-sm font-bold text-sky-700">8 Units</div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h2 className="card-title">
              <TrendingUp className="w-5 h-5 text-sky-600" />
              Crowd Forecast: {selectedZone.name}
            </h2>
            <button
              onClick={() => onNavigate('predictions')}
              className="text-xs text-sky-700 hover:text-sky-800 font-semibold"
            >
              Full Forecast
            </button>
          </div>

          <div className="prediction-chart">
            <div className="chart-bar-col">
              <div className="chart-bar" style={{ height: '45%' }}>
                <span className="bar-value">45%</span>
              </div>
              <span className="bar-label">Now</span>
            </div>
            <div className="chart-bar-col">
              <div className="chart-bar med-peak" style={{ height: '65%' }}>
                <span className="bar-value">65%</span>
              </div>
              <span className="bar-label">+1h</span>
            </div>
            <div className="chart-bar-col">
              <div className="chart-bar high-peak" style={{ height: '88%' }}>
                <span className="bar-value">88%</span>
              </div>
              <span className="bar-label">+2h</span>
            </div>
            <div className="chart-bar-col">
              <div className="chart-bar high-peak" style={{ height: '78%' }}>
                <span className="bar-value">78%</span>
              </div>
              <span className="bar-label">+3h</span>
            </div>
            <div className="chart-bar-col">
              <div className="chart-bar" style={{ height: '48%' }}>
                <span className="bar-value">48%</span>
              </div>
              <span className="bar-label">+4h</span>
            </div>
          </div>

          <div className="prediction-summary">
            <h4>AI Advisory: Peak expected in 2 hours</h4>
            <p className="text-xs text-slate-600">
              Historical trends indicate religious procession and sunset sightseeing will raise density to 88%. Plan departure or relocate before 17:30.
            </p>
          </div>
        </div>
      </div>

      {/* SIH Features Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <Sparkles className="w-5 h-5 text-sky-600" />
            SafeTour Architecture & SIH Innovations
          </h2>
          <span className="text-xs text-slate-500 font-medium">Smart India Hackathon</span>
        </div>
        <div className="feature-list-horizontal">
          <div className="feature-item">
            <div className="feature-icon">🛰️</div>
            <div className="feature-text">
              <h4>Real-time Monitoring</h4>
              <p>AI computer vision telemetry analyzing footfall count & bottleneck detection.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🚨</div>
            <div className="feature-text">
              <h4>Predictive Risk Alerts</h4>
              <p>Proactive push notifications before critical crowd density thresholds are reached.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">📍</div>
            <div className="feature-text">
              <h4>Geo-Fenced Corridors</h4>
              <p>Dynamic virtual boundaries with warnings when approaching restricted heritage zones.</p>
            </div>
          </div>
          <div className="feature-item">
            <div className="feature-icon">🛡️</div>
            <div className="feature-text">
              <h4>Cryptographic Tourist ID</h4>
              <p>Tamper-proof digital credentials protecting tourist identity and medical alerts.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: AlertSystem
// -------------------------------------------------------------
function AlertSystem({
  alerts,
  onMarkRead,
  onClearAll,
  onAddSimulatedAlert
}: {
  alerts: AlertItem[];
  onMarkRead: (id: string) => void;
  onClearAll: () => void;
  onAddSimulatedAlert: () => void;
}) {
  const [filter, setFilter] = useState<'all' | 'warning' | 'danger' | 'info'>('all');

  const filteredAlerts = alerts.filter((a) => {
    if (filter === 'all') return true;
    return a.type === filter;
  });

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <Bell className="w-5 h-5 text-sky-600" />
            Safety Alert Broadcast Center
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Real-time emergency bulletins dispatched by Municipal Crowd Management Command.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddSimulatedAlert}
            className="btn btn-outline text-xs py-1.5 px-3"
          >
            + Simulate Sensor Alert
          </button>
          <button
            onClick={onClearAll}
            className="btn btn-primary text-xs py-1.5 px-3"
          >
            Mark All Read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-4">
        {(['all', 'warning', 'danger', 'info'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
              filter === tab
                ? 'bg-sky-700 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {tab === 'all' ? 'All Alerts' : tab}
          </button>
        ))}
      </div>

      <div className="alert-list">
        {filteredAlerts.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2" />
            <p className="text-sm">No active alerts matching filter. All sectors operating safely.</p>
          </div>
        ) : (
          filteredAlerts.map((item) => (
            <div
              key={item.id}
              className={`alert-item ${
                item.type === 'danger'
                  ? 'alert-danger'
                  : item.type === 'warning'
                  ? 'alert-warning'
                  : 'alert-info'
              } ${!item.read ? 'unread' : ''}`}
            >
              <div className="alert-header">
                <span className="alert-title">
                  {item.type === 'danger' ? (
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                  ) : item.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Info className="w-4 h-4 text-sky-600" />
                  )}
                  {item.title}
                </span>
                <div className="flex items-center gap-2">
                  <span className="alert-time">{item.time}</span>
                  {!item.read ? (
                    <button
                      className="mark-read-btn"
                      onClick={() => onMarkRead(item.id)}
                    >
                      Acknowledge
                    </button>
                  ) : (
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" /> Read
                    </span>
                  )}
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed mt-1">
                {item.description}
              </p>
              <div className="text-[11px] text-slate-500 mt-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" />
                  Location: <strong>{item.location}</strong>
                </span>
                <span className="font-mono text-[10px] text-slate-400">ID: {item.id}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: SafetyStatus
// -------------------------------------------------------------
function SafetyStatus({
  selectedZone,
  zones,
  onSelectZone
}: {
  selectedZone: ZoneInfo;
  zones: ZoneInfo[];
  onSelectZone: (zone: ZoneInfo) => void;
}) {
  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <ShieldAlert className="w-5 h-5 text-sky-600" />
              Safety Index & Zone Risk Matrix
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Aggregated safety score calculating real-time crowd dynamics, heat exhaustion risk, and rapid evacuation bandwidth.
            </p>
          </div>
          <span className="badge badge-success">Live Sensors: 18 Nodes</span>
        </div>

        {/* Selected Zone Deep Dive */}
        <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Focus Zone Analysis</span>
              <h3 className="text-lg font-bold text-slate-800">{selectedZone.name}</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-sky-800">{selectedZone.density}%</div>
              <div className="text-[11px] text-slate-500">Current Occupancy</div>
            </div>
          </div>
          <p className="text-xs text-slate-600 mt-2">{selectedZone.advisory}</p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-xs">
            <div className="p-3 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-500">Tourist Density:</span>
              <div className="font-bold text-slate-800 mt-0.5">{selectedZone.headcount} / {selectedZone.capacity} persons</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-500">Flow Vector:</span>
              <div className="font-bold text-emerald-700 mt-0.5 capitalize">{selectedZone.trend} Footfall</div>
            </div>
            <div className="p-3 bg-white rounded-lg border border-sky-100">
              <span className="text-slate-500">Est. Evac Duration:</span>
              <div className="font-bold text-slate-800 mt-0.5">3.2 minutes</div>
            </div>
          </div>
        </div>

        {/* All Zones List */}
        <h4 className="text-sm font-bold text-slate-700 mb-3">All Monitored Tourism Corridors</h4>
        <div className="area-safety-list">
          {zones.map((zone) => (
            <div
              key={zone.id}
              onClick={() => onSelectZone(zone)}
              className={`area-safety-item cursor-pointer hover:border-sky-300 transition-all ${
                selectedZone.id === zone.id ? 'border-sky-500 bg-sky-50/50 ring-1 ring-sky-500' : ''
              }`}
            >
              <div className="area-name">
                <div className="font-semibold text-slate-800">{zone.name}</div>
                <div className="text-[11px] text-slate-500">{zone.headcount} tourists detected</div>
              </div>

              <div className="area-meter">
                <div
                  className="meter-fill"
                  style={{
                    width: `${zone.density}%`,
                    background:
                      zone.density > 75
                        ? '#ef4444'
                        : zone.density > 40
                        ? '#f59e0b'
                        : '#10b981'
                  }}
                ></div>
              </div>

              <div className="area-status">
                <div
                  className="status-indicator"
                  style={{
                    background:
                      zone.density > 75
                        ? '#ef4444'
                        : zone.density > 40
                        ? '#f59e0b'
                        : '#10b981'
                  }}
                ></div>
                <span className="font-mono font-bold text-xs">{zone.density}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: EmergencyButton (SOS)
// -------------------------------------------------------------
function EmergencyButton({
  isEmergencyActive,
  countdown,
  emergencyDispatched,
  onStartEmergency,
  onCancelEmergency,
  soundEnabled,
  setSoundEnabled,
  user
}: {
  isEmergencyActive: boolean;
  countdown: number;
  emergencyDispatched: boolean;
  onStartEmergency: () => void;
  onCancelEmergency: () => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  user: UserProfile | null;
}) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <PhoneCall className="w-5 h-5 text-rose-600" />
            Emergency SOS Dispatch Hub
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Pressing SOS initiates an instant 5-second countdown to dispatch your GPS coordinates to Tourist Police & Emergency First Responders.
          </p>
        </div>
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className="btn btn-outline text-xs py-1.5 px-3"
          title="Toggle Siren Audio"
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-4 h-4 text-emerald-600" /> Siren Audio On
            </>
          ) : (
            <>
              <VolumeX className="w-4 h-4 text-slate-400" /> Siren Audio Muted
            </>
          )}
        </button>
      </div>

      <div className="emergency-container">
        {!isEmergencyActive && !emergencyDispatched && (
          <div>
            <button
              onClick={onStartEmergency}
              className="emergency-btn pulse-active"
            >
              <PhoneCall className="w-8 h-8 mb-1" />
              <span>SOS</span>
              <span className="text-[10px] font-normal tracking-normal opacity-90">TAP TO TRIGGER</span>
            </button>
            <p className="text-xs text-slate-500 mt-4 max-w-sm mx-auto">
              Accidental taps can be cancelled during the 5-second safety grace window.
            </p>
          </div>
        )}

        {isEmergencyActive && !emergencyDispatched && (
          <div className="emergency-countdown">
            <div className="text-sm font-bold text-rose-700 uppercase tracking-widest animate-pulse">
              Dispatching Emergency Units in
            </div>
            <div className="countdown-number">{countdown}</div>
            <p className="text-xs text-slate-600 max-w-xs">
              Transmitting GPS location (28.6139° N, 77.2090° E) and Tourist ID #{user?.touristId || 'SIH-IND-2026-9042'}...
            </p>
            <button onClick={onCancelEmergency} className="cancel-btn">
              Cancel Dispatch
            </button>
          </div>
        )}

        {emergencyDispatched && (
          <div className="p-6 bg-rose-50 border-2 border-rose-300 rounded-2xl max-w-md mx-auto text-left">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-lg mb-2">
              <CheckCircle2 className="w-6 h-6 text-rose-600 flex-shrink-0" />
              SOS Alert Dispatched!
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mb-4">
              Your exact coordinates, medical profile (Blood: {user?.bloodGroup}), and emergency contact ({user?.emergencyContact}) have been transmitted to the nearest Tourist Police response unit.
            </p>
            <div className="bg-white p-3 rounded-lg border border-rose-200 text-xs text-slate-700 space-y-1 mb-4">
              <div><strong>GPS Coordinates:</strong> 28.6139° N, 77.2090° E</div>
              <div><strong>Assigned Response:</strong> Sector 3 Rapid Response Patrol</div>
              <div><strong>Estimated Arrival:</strong> 4 - 6 minutes</div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={onCancelEmergency}
                className="btn btn-outline text-xs flex-1 justify-center"
              >
                Reset / False Alarm
              </button>
              <a
                href="tel:112"
                className="btn btn-primary text-xs flex-1 justify-center bg-rose-600 hover:bg-rose-700 text-white"
              >
                Call 112 Directly
              </a>
            </div>
          </div>
        )}

        {/* Quick Emergency Helplines */}
        <div className="emergency-contacts">
          <h3>National & Tourist Emergency Helplines</h3>
          <div className="contact-list">
            <a href="tel:112" className="contact-item">
              <div className="contact-icon text-rose-600 bg-rose-50">🚨</div>
              <span className="font-bold text-slate-800 text-sm">National SOS</span>
              <span className="text-xs text-slate-500 font-mono font-bold">112</span>
            </a>
            <a href="tel:100" className="contact-item">
              <div className="contact-icon">👮</div>
              <span className="font-bold text-slate-800 text-sm">Police</span>
              <span className="text-xs text-slate-500 font-mono font-bold">100</span>
            </a>
            <a href="tel:108" className="contact-item">
              <div className="contact-icon">🚑</div>
              <span className="font-bold text-slate-800 text-sm">Ambulance</span>
              <span className="text-xs text-slate-500 font-mono font-bold">108</span>
            </a>
            <a href="tel:101" className="contact-item">
              <div className="contact-icon">🚒</div>
              <span className="font-bold text-slate-800 text-sm">Fire Force</span>
              <span className="text-xs text-slate-500 font-mono font-bold">101</span>
            </a>
            <a href="tel:1363" className="contact-item">
              <div className="contact-icon text-sky-600 bg-sky-50">🧭</div>
              <span className="font-bold text-slate-800 text-sm">Tourist Helpline</span>
              <span className="text-xs text-slate-500 font-mono font-bold">1363 (24/7)</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: CrowdPredictions
// -------------------------------------------------------------
function CrowdPredictions({
  selectedZone,
  zones,
  onSelectZone
}: {
  selectedZone: ZoneInfo;
  zones: ZoneInfo[];
  onSelectZone: (zone: ZoneInfo) => void;
}) {
  const [forecastTimeframe, setForecastTimeframe] = useState<'hourly' | 'daily'>('hourly');

  return (
    <div className="card">
      <div className="card-header">
        <div>
          <h2 className="card-title">
            <TrendingUp className="w-5 h-5 text-sky-600" />
            AI Predictive Crowd Modeling
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Machine learning forecasts powered by historical tourist traffic, holiday schedules, and transit telemetry.
          </p>
        </div>
        {/* Zone Selector */}
        <select
          value={selectedZone.id}
          onChange={(e) => {
            const found = zones.find((z) => z.id === e.target.value);
            if (found) onSelectZone(found);
          }}
          className="text-xs font-semibold px-3 py-1.5 border border-slate-300 rounded-lg bg-white text-slate-700"
        >
          {zones.map((z) => (
            <option key={z.id} value={z.id}>
              {z.name}
            </option>
          ))}
        </select>
      </div>

      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-700" />
            <span className="text-xs font-bold text-slate-800">Forecast for: {selectedZone.name}</span>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
            Best Visiting Window: 08:30 - 11:00 AM
          </span>
        </div>

        {/* Prediction Chart */}
        <div className="prediction-chart">
          <div className="chart-bar-col">
            <div className="chart-bar" style={{ height: `${selectedZone.density}%` }}>
              <span className="bar-value">{selectedZone.density}%</span>
            </div>
            <span className="bar-label">Now</span>
          </div>
          <div className="chart-bar-col">
            <div
              className={`chart-bar ${selectedZone.density + 10 > 75 ? 'high-peak' : 'med-peak'}`}
              style={{ height: `${Math.min(96, selectedZone.density + 10)}%` }}
            >
              <span className="bar-value">{Math.min(96, selectedZone.density + 10)}%</span>
            </div>
            <span className="bar-label">+1h</span>
          </div>
          <div className="chart-bar-col">
            <div
              className="chart-bar high-peak"
              style={{ height: `${Math.min(98, selectedZone.density + 18)}%` }}
            >
              <span className="bar-value">{Math.min(98, selectedZone.density + 18)}%</span>
            </div>
            <span className="bar-label">+2h</span>
          </div>
          <div className="chart-bar-col">
            <div
              className="chart-bar med-peak"
              style={{ height: `${Math.max(30, selectedZone.density - 8)}%` }}
            >
              <span className="bar-value">{Math.max(30, selectedZone.density - 8)}%</span>
            </div>
            <span className="bar-label">+3h</span>
          </div>
          <div className="chart-bar-col">
            <div
              className="chart-bar"
              style={{ height: `${Math.max(25, selectedZone.density - 24)}%` }}
            >
              <span className="bar-value">{Math.max(25, selectedZone.density - 24)}%</span>
            </div>
            <span className="bar-label">+4h</span>
          </div>
          <div className="chart-bar-col">
            <div
              className="chart-bar"
              style={{ height: `${Math.max(20, selectedZone.density - 35)}%` }}
            >
              <span className="bar-value">{Math.max(20, selectedZone.density - 35)}%</span>
            </div>
            <span className="bar-label">+5h</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-sky-50 border border-sky-100 rounded-xl">
          <h4 className="text-sm font-bold text-sky-900 mb-1">Queue & Delay Expectation</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Main entrance security lanes currently average <strong>6.5 minutes</strong> wait time. Estimated to peak at <strong>18 minutes</strong> during the evening rush.
          </p>
        </div>
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
          <h4 className="text-sm font-bold text-amber-900 mb-1">Recommended Alternate Route</h4>
          <p className="text-xs text-slate-600 leading-relaxed">
            Take the Riverfront Promenade walkway via Arch Gate 4 to bypass Main Square bottlenecks. Shaded and 40% less foot traffic.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: LocationSharing & Geo-Fencing
// -------------------------------------------------------------
function LocationSharing({
  isSharing,
  setIsSharing,
  user,
  selectedZone
}: {
  isSharing: boolean;
  setIsSharing: (val: boolean) => void;
  user: UserProfile | null;
  selectedZone: ZoneInfo;
}) {
  const [contacts, setContacts] = useState([
    { name: 'Family Contact (Paternal)', phone: '+91 91234 56789', status: 'connected', lastPing: '1m ago' },
    { name: 'Tour Guide (Ramesh Kumar)', phone: '+91 98111 22334', status: 'connected', lastPing: '5m ago' },
    { name: 'Tourist Police Help Desk', phone: '1363', status: 'active', lastPing: 'Continuous sync' }
  ]);
  const [pingSent, setPingSent] = useState(false);

  const handleSendPing = () => {
    setPingSent(true);
    setTimeout(() => setPingSent(false), 3000);
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <div>
            <h2 className="card-title">
              <MapPin className="w-5 h-5 text-sky-600" />
              Geo-Fencing & Live Location Sharing
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Maintains virtual perimeter protection and shares continuous GPS breadcrumbs with verified emergency contacts.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-700">
              {isSharing ? 'Sharing Active' : 'Sharing Paused'}
            </span>
            <label className="switch">
              <input
                type="checkbox"
                checked={isSharing}
                onChange={(e) => setIsSharing(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>
          </div>
        </div>

        {/* Current Location Badge */}
        <div className="location-card mb-4">
          <div className="location-icon">
            <Navigation className="w-6 h-6 text-sky-700" />
          </div>
          <div className="location-info">
            <div className="location-name flex items-center gap-2">
              <span>{selectedZone.name}</span>
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full">
                Inside Safe Tourist Corridor
              </span>
            </div>
            <div className="location-status-text">
              GPS Coordinates: 28.6139° N, 77.2090° E · Accuracy: ±4 meters · Altitude: 216m
            </div>
          </div>
          <button
            onClick={handleSendPing}
            className="btn btn-primary text-xs py-2 px-3 whitespace-nowrap"
          >
            {pingSent ? (
              <>
                <Check className="w-3.5 h-3.5" /> Ping Sent!
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Send Check-in Ping
              </>
            )}
          </button>
        </div>

        {/* Geo-fence status */}
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-emerald-900 text-sm">
              <Shield className="w-4 h-4 text-emerald-600" />
              Geo-Fence Status: Safe Perimeter
            </div>
            <span className="text-xs text-emerald-700">Distance to restricted boundary: 450m</span>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            You are positioned comfortably within the certified tourism safety zone. Automated alert will trigger if you approach the riverbank barrier or construction perimeter.
          </p>
        </div>

        {/* Shared with list */}
        <h4 className="text-sm font-bold text-slate-800 mb-3">Live Location Observers</h4>
        <div className="contact-list">
          {contacts.map((c, idx) => (
            <div key={idx} className="contact-item">
              <div className="user-avatar text-sm">
                {c.name.charAt(0)}
              </div>
              <div className="contact-details">
                <div className="contact-name text-sm text-slate-800">{c.name}</div>
                <div className="text-xs text-slate-500">{c.phone} · Last synced: {c.lastPing}</div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                Connected
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: ProfileManagement & Blockchain Tourist ID
// -------------------------------------------------------------
function ProfileManagement({
  user,
  setUser,
  isLoggedIn,
  onShowLogin
}: {
  user: UserProfile | null;
  setUser: React.Dispatch<React.SetStateAction<UserProfile | null>>;
  isLoggedIn: boolean;
  onShowLogin: () => void;
}) {
  if (!isLoggedIn) {
    return (
      <div className="card text-center p-8">
        <User className="w-12 h-12 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800 mb-1">Please Sign In to Access Your Tourist Profile</h3>
        <p className="text-xs text-slate-500 mb-4 max-w-sm mx-auto">
          Log in or register to customize emergency contacts, update medical allergies, and view your cryptographic tourist ID.
        </p>
        <button onClick={onShowLogin} className="btn btn-primary text-xs py-2 px-5 mx-auto">
          Sign In Now
        </button>
      </div>
    );
  }

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    emergencyContact: user?.emergencyContact || '',
    bloodGroup: user?.bloodGroup || 'O+'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser((prev) => (prev ? { ...prev, ...formData } : null));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Profile Form */}
      <div className="lg:col-span-2 card">
        <div className="card-header">
          <h2 className="card-title">
            <User className="w-5 h-5 text-sky-600" />
            Tourist Safety Profile
          </h2>
          {savedSuccess && (
            <span className="text-xs text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Changes Saved
            </span>
          )}
        </div>

        <form onSubmit={handleSubmit} className="profile-form">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-input"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Primary Mobile Phone</label>
              <input
                type="tel"
                className="form-input"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Emergency Next of Kin Contact</label>
              <input
                type="tel"
                className="form-input"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Blood Group / Medical Note</label>
              <select
                className="form-input"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A Positive (A+)</option>
                <option value="A-">A Negative (A-)</option>
                <option value="B+">B Positive (B+)</option>
                <option value="B-">B Negative (B-)</option>
                <option value="AB+">AB Positive (AB+)</option>
                <option value="AB-">AB Negative (AB-)</option>
                <option value="O+">O Positive (O+)</option>
                <option value="O-">O Negative (O-)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Safety Language</label>
              <select className="form-input" defaultValue="English">
                <option value="English">English</option>
                <option value="Hindi">Hindi (हिंदी)</option>
                <option value="Telugu">Telugu (తెలుగు)</option>
                <option value="Tamil">Tamil (தமிழ்)</option>
                <option value="Bengali">Bengali (বাংলা)</option>
              </select>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
            <button type="submit" className="btn btn-primary text-xs py-2 px-5">
              Update Profile Details
            </button>
          </div>
        </form>
      </div>

      {/* Digital Tourist Identity Credential */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title text-base">
            <Shield className="w-4 h-4 text-emerald-600" />
            Verified Tourist Credential
          </h3>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">
            SIH Verified
          </span>
        </div>

        <div className="p-4 bg-gradient-to-br from-slate-900 to-sky-950 text-white rounded-xl shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[10px] tracking-widest text-sky-400 uppercase font-mono">Ministry of Tourism · SafeTour</div>
              <div className="font-bold text-base">{user?.name}</div>
            </div>
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs text-sky-300">
              SIH
            </div>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300 font-mono mb-4">
            <div>ID: <strong className="text-white">{user?.touristId}</strong></div>
            <div>Blood: <strong className="text-white">{user?.bloodGroup}</strong></div>
            <div>SOS Contact: <strong className="text-white">{user?.emergencyContact}</strong></div>
          </div>

          {/* Cryptographic hash badge */}
          <div className="p-2 bg-black/40 rounded border border-white/10 text-[10px] text-slate-400 font-mono truncate">
            Hash: 0x7f9a2b8e4c194a02...89d1
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="w-32 h-32 mx-auto bg-slate-100 border border-slate-300 rounded-lg p-2 flex flex-col items-center justify-center">
            {/* Mock QR SVG */}
            <div className="grid grid-cols-4 gap-1 w-24 h-24 p-1 bg-white border border-slate-200">
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-200 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-200 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-200 rounded-sm"></div>
              <div className="bg-slate-200 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-200 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
              <div className="bg-slate-900 rounded-sm"></div>
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Scan at entry turnstiles for paperless fast-track admission.
          </p>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: Login / Signup Modal
// -------------------------------------------------------------
function LoginSignupModal({
  onLogin,
  onClose
}: {
  onLogin: (data: Partial<UserProfile>) => void;
  onClose: () => void;
}) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('Abhiram Sikakolli');
  const [email, setEmail] = useState('abhiramsikakolli2005@gmail.com');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [password, setPassword] = useState('password123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({ name, email, phone });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="login-header">
          <h2 className="login-title">SafeTour</h2>
          <p className="login-subtitle">Smart Crowd Safety Management System</p>
        </div>

        <div className="toggle-container">
          <button
            type="button"
            className={`toggle-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            type="button"
            className={`toggle-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Mobile Number</label>
              <input
                type="tel"
                className="form-input"
                placeholder="e.g. +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn">
            {isLogin ? 'Sign In to SafeTour' : 'Create Tourist Account'}
          </button>
        </form>

        <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-500">
          Demo Mode: You can sign in with any email and password.
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// Component: GitHub Push Helper Modal
// -------------------------------------------------------------
function GithubPushModal({ onClose }: { onClose: () => void }) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const gitSnippet = `git init
git add .
git commit -m "feat: SafeTour Smart Crowd Safety Management System (SIH)"
git branch -M main
git remote add origin https://github.com/<YOUR-USERNAME>/<YOUR-REPO>.git
git push -u origin main`;

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center">
            <Github className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">Push Project to GitHub</h2>
            <p className="text-xs text-slate-500">SafeTour SIH Project Source Code</p>
          </div>
        </div>

        <div className="space-y-4 text-xs text-slate-700">
          {/* Method 1 */}
          <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl">
            <div className="font-bold text-sky-900 text-sm mb-1 flex items-center gap-1.5">
              <span>Method 1: 1-Click AI Studio Export (Fastest)</span>
            </div>
            <p className="text-xs text-slate-600 mb-2">
              In the top navigation header of this Google AI Studio workspace window, look for the <strong>GitHub</strong> icon button or the project menu <strong>Export / Push to GitHub</strong>.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-600">
              <li>Click the <strong>GitHub</strong> button in the AI Studio top toolbar.</li>
              <li>Authorize your GitHub account.</li>
              <li>Type a repository name (e.g. <code>safetour-sih-project</code>) and click <strong>Create & Push</strong>.</li>
            </ol>
          </div>

          {/* Method 2 */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="font-bold text-slate-900 text-sm mb-1 flex items-center justify-between">
              <span>Method 2: Standard Git Terminal Commands</span>
              <button
                onClick={() => copyToClipboard(gitSnippet, 1)}
                className="text-sky-700 hover:text-sky-900 flex items-center gap-1 font-semibold text-xs"
              >
                {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedIndex === 1 ? 'Copied!' : 'Copy Commands'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-2">
              Download the ZIP from the project menu or clone locally, then run:
            </p>
            <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-lg font-mono text-[11px] overflow-x-auto whitespace-pre">
              {gitSnippet}
            </pre>
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <button onClick={onClose} className="btn btn-primary text-xs py-2 px-5">
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
