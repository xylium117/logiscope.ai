import React, { useState, useEffect } from 'react';
import { 
  LogisticsNode, 
  RouteSegment, 
  TransportAsset, 
  ShortageAlert, 
  Recommendation, 
  Anomaly, 
  TheaterMetadata, 
  NetworkVariation 
} from './types';
import { Smartphone, RotateCcw } from 'lucide-react';
import { 
  fetchOverview, 
  fetchNodes, 
  fetchRoutes, 
  fetchFleet, 
  fetchShortages, 
  fetchRecommendations, 
  fetchAnomalies,
  fetchTheaters,
  fetchNetworkVariations
} from './services/api';

import { Navbar } from './components/Navbar';
import { Sidebar, TabType } from './components/Sidebar';
import { RunForecastModal } from './components/RunForecastModal';
import { ExplainableModal } from './components/ExplainableModal';

import { DashboardView } from './views/DashboardView';
import { GISMapView } from './views/GISMapView';
import { ForecastView } from './views/ForecastView';
import { RouteIntelligenceView } from './views/RouteIntelligenceView';
import { SimulationLabView } from './views/SimulationLabView';
import { HistoricalCasesView } from './views/HistoricalCasesView';
import { TelemetryView } from './views/TelemetryView';
import { SyntheticLabView } from './views/SyntheticLabView';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [theaters, setTheaters] = useState<TheaterMetadata[]>([]);
  const [networkVariations, setNetworkVariations] = useState<NetworkVariation[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<string>('ALL');
  const [selectedVariation, setSelectedVariation] = useState<string>('STANDARD');

  const [overviewData, setOverviewData] = useState<any>(null);
  const [nodes, setNodes] = useState<LogisticsNode[]>([]);
  const [routes, setRoutes] = useState<RouteSegment[]>([]);
  const [fleet, setFleet] = useState<TransportAsset[]>([]);
  const [shortages, setShortages] = useState<ShortageAlert[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);

  const [selectedNode, setSelectedNode] = useState<LogisticsNode | null>(null);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isForecastModalOpen, setIsForecastModalOpen] = useState<boolean>(false);
  const [isForecastRunning, setIsForecastRunning] = useState<boolean>(false);
  const [injectedSimParams, setInjectedSimParams] = useState<any>(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const [th, nv] = await Promise.all([
          fetchTheaters(),
          fetchNetworkVariations(),
        ]);
        setTheaters(th);
        setNetworkVariations(nv);
      } catch (err) {
        console.error('Error loading metadata:', err);
      }
    };
    loadMetadata();
  }, []);

  const loadAllData = async (theaterId: string = selectedTheater, variationId: string = selectedVariation) => {
    try {
      const [ov, nd, rt, fl, sh, rc, an] = await Promise.all([
        fetchOverview(theaterId, variationId),
        fetchNodes(theaterId, variationId),
        fetchRoutes(theaterId, variationId),
        fetchFleet(theaterId, variationId),
        fetchShortages(theaterId, variationId),
        fetchRecommendations(theaterId, variationId),
        fetchAnomalies(),
      ]);
      setOverviewData(ov);
      setNodes(nd);
      setRoutes(rt);
      setFleet(fl);
      setShortages(sh);
      setRecommendations(rc);
      setAnomalies(an);
      if (nd.length > 0) {
        const forwardUnit = nd.find((n) => n.type === 'FORWARD_UNIT') || nd[0];
        setSelectedNode(forwardUnit);
      }
    } catch (err) {
      console.error('Error loading Digital Twin data:', err);
    }
  };

  useEffect(() => {
    loadAllData(selectedTheater, selectedVariation);
  }, [selectedTheater, selectedVariation]);

  const handleTheaterChange = (newTheater: string) => {
    setSelectedTheater(newTheater);
  };

  const handleVariationChange = (newVariation: string) => {
    setSelectedVariation(newVariation);
  };

  const handleTriggerForecast = () => {
    setIsForecastRunning(true);
    setTimeout(() => {
      setIsForecastRunning(false);
      setIsForecastModalOpen(true);
    }, 600);
  };

  const handleRecommendationApplied = (recId: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== recId));
    loadAllData(selectedTheater, selectedVariation);
  };

  return (
    <div className="min-h-screen flex flex-col bg-command-bg text-slate-100 font-sans tactical-grid-bg selection:bg-cyan-500 selection:text-black relative">
      <div className="portrait-lock-overlay fixed inset-0 z-[999999] bg-[#070B12] flex-col items-center justify-center p-6 text-center text-slate-100 font-mono hidden select-none">
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-cyan-950/60 border-2 border-cyan-400/80 flex items-center justify-center shadow-glow-cyan">
            <Smartphone className="w-10 h-10 text-cyan-400 animate-pulse transform rotate-90" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping"></div>
        </div>
        <div className="inline-block px-3 py-1 rounded bg-rose-500/20 text-rose-400 border border-rose-500/40 text-xs font-bold uppercase tracking-widest mb-3">
          TACTICAL C2 DISPLAY RESTRICTED
        </div>
        <h2 className="text-xl font-bold text-white mb-2">
          ROTATE DEVICE TO LANDSCAPE
        </h2>
        <p className="text-xs text-slate-400 max-w-sm leading-relaxed mb-6 font-sans">
          Logiscope.ai command and control maps, telemetry matrices, and multi-echelon twin analytics require widescreen landscape mode (16:9 / 16:10).
        </p>
        <div className="flex items-center space-x-2 text-[10px] text-cyan-400/80 border border-cyan-500/30 rounded-lg px-3 py-1.5 bg-cyan-950/30">
          <RotateCcw className="w-3.5 h-3.5 animate-spin" />
          <span>ORIENTATION LOCK ACTIVE • ROTATE SCREEN</span>
        </div>
      </div>

      <div className="app-main-content min-h-screen flex flex-col flex-1">
        <Navbar
          theaters={theaters}
          selectedTheater={selectedTheater}
          onSelectTheater={handleTheaterChange}
          variations={networkVariations}
          selectedVariation={selectedVariation}
          onSelectVariation={handleVariationChange}
          onTriggerForecast={handleTriggerForecast}
          isForecastRunning={isForecastRunning}
          activeRiskCount={shortages.length}
        />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar
            currentTab={currentTab}
            onSelectTab={setCurrentTab}
            shortagesCount={shortages.length}
            anomalyCount={anomalies.length}
          />

          <main className="flex-1 overflow-y-auto p-3 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-4 md:space-y-6">
              {currentTab === 'dashboard' && (
                <DashboardView
                  overviewData={overviewData}
                  nodes={nodes}
                  routes={routes}
                  shortages={shortages}
                  recommendations={recommendations}
                  onSelectNode={(node) => {
                    setSelectedNode(node);
                    setCurrentTab('map');
                  }}
                  onOpenExplainable={(rec) => setSelectedRecommendation(rec)}
                  onNavigateTab={(tab) => setCurrentTab(tab)}
                />
              )}

              {currentTab === 'map' && (
                <GISMapView
                  nodes={nodes}
                  routes={routes}
                  fleet={fleet}
                  selectedNode={selectedNode}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
              )}

              {currentTab === 'forecast' && (
                <ForecastView
                  nodes={nodes}
                  selectedNode={selectedNode}
                  onSelectNode={(node) => setSelectedNode(node)}
                />
              )}

              {currentTab === 'routes' && (
                <RouteIntelligenceView initialRoutes={routes} />
              )}

              {currentTab === 'simulation' && (
                <SimulationLabView routes={routes} initialParams={injectedSimParams} />
              )}

              {currentTab === 'historical' && (
                <HistoricalCasesView
                  onLoadScenarioIntoSimulation={(caseItem) => {
                    setInjectedSimParams({
                      ...caseItem.simulation_params,
                      case_title: `${caseItem.year} ${caseItem.title}`
                    });
                    setCurrentTab('simulation');
                  }}
                  onNavigateToMapWithNodes={(theater, nodeIds) => {
                    setSelectedTheater(theater);
                    if (nodeIds && nodeIds.length > 0) {
                      const matchedNode = nodes.find((n) => n.id === nodeIds[0]);
                      if (matchedNode) setSelectedNode(matchedNode);
                    }
                    setCurrentTab('map');
                  }}
                />
              )}

              {currentTab === 'telemetry' && <TelemetryView />}

              {currentTab === 'synthetic' && <SyntheticLabView />}
            </div>
          </main>
        </div>

        <RunForecastModal
          isOpen={isForecastModalOpen}
          onClose={() => setIsForecastModalOpen(false)}
          onNavigateToRecommendations={() => setCurrentTab('dashboard')}
          shortages={shortages}
          recommendations={recommendations}
        />

        <ExplainableModal
          recommendation={selectedRecommendation}
          onClose={() => setSelectedRecommendation(null)}
          onApplied={handleRecommendationApplied}
        />
      </div>
    </div>
  );
};

export default App;
