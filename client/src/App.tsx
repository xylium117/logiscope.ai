import React, { useState, useEffect } from 'react';
import { 
  LogisticsNode, 
  RouteSegment, 
  TransportAsset, 
  ShortageAlert, 
  Recommendation, 
  Anomaly,
  TheaterMetadata,
  NetworkVariation,
  HistoricalCase
} from './types';
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
    <div className="min-h-screen flex flex-col bg-command-bg text-slate-100 font-sans tactical-grid-bg selection:bg-cyan-500 selection:text-black">
      {/* Top Tactical Navigation Bar */}
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

      {/* Main Workspace Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Tactical Left Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          shortagesCount={shortages.length}
          anomalyCount={anomalies.length}
        />

        {/* Central Tactical Content Workspace */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
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

      {/* Modals */}
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
  );
};

export default App;
