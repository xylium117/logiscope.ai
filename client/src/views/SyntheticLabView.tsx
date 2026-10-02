import React, { useState, useEffect } from 'react';
import { 
  SyntheticExplainerDoc, 
  SyntheticSimulateResult 
} from '../types';
import { 
  fetchSyntheticExplainer, 
  simulateSyntheticPipeline 
} from '../services/api';
import { LatexMath } from '../components/LatexMath';
import { 
  Cpu, 
  Calculator, 
  Sliders, 
  ShieldCheck, 
  Layers, 
  Code, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Copy, 
  Check, 
  Sparkles, 
  TrendingDown, 
  Mountain, 
  Thermometer, 
  Gauge, 
  Radio 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Area, 
  AreaChart 
} from 'recharts';

export const SyntheticLabView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'SANDBOX' | 'MATH' | 'ARCHITECTURE' | 'OPSEC' | 'RAW_JSON'>('SANDBOX');
  const [explainerDoc, setExplainerDoc] = useState<SyntheticExplainerDoc | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const [altitudeM, setAltitudeM] = useState<number>(3500);
  const [temperatureC, setTemperatureC] = useState<number>(-15);
  const [tempo, setTempo] = useState<string>('HIGH');
  const [weather, setWeather] = useState<string>('SNOW_ICE');
  const [sensorNoisePct, setSensorNoisePct] = useState<number>(3.5);
  const [troops, setTroops] = useState<number>(520);
  const [simResult, setSimResult] = useState<SyntheticSimulateResult | null>(null);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);

  useEffect(() => {
    const loadDoc = async () => {
      try {
        const doc = await fetchSyntheticExplainer();
        setExplainerDoc(doc);
      } catch (err) {
        console.error('Failed to load synthetic explainer doc:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadDoc();
  }, []);

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await simulateSyntheticPipeline({
        altitude_m: altitudeM,
        temperature_c: temperatureC,
        tempo,
        weather,
        sensor_noise_pct: sensorNoisePct,
        troops
      });
      setSimResult(res);
    } catch (err) {
      console.error('Synthetic simulation failed:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [altitudeM, temperatureC, tempo, weather, sensorNoisePct, troops]);

  const handleCopyJson = () => {
    if (!simResult) return;
    navigator.clipboard.writeText(JSON.stringify(simResult, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const chartData = simResult?.simulated_7day_stock_curve.map((stock, idx) => ({
    day: idx === 0 ? 'Day 0 (Now)' : `Day +${idx}`,
    stock: stock,
    safetyThreshold: 200,
  })) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl relative overflow-hidden border-cyan-500/30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center space-x-1">
                <Cpu className="w-3 h-3 text-cyan-400" />
                <span>EXPLAINABLE SYNTHETIC ENGINE</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                100% MATHEMATICAL FIDELITY
              </span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white font-mono">
              SYNTHETIC DATA & MATHEMATICAL FOUNDATIONS LAB
            </h2>
            <p className="text-sm text-slate-300 max-w-3xl">
              Transparent, white-box explanation of LOGISCOPE's synthetic digital twin mechanics, high-altitude environmental stress models, spatio-temporal multivariate forecasting, and virtual IoT telemetry generator.
            </p>
          </div>

          <button
            onClick={runSimulation}
            disabled={isSimulating}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-all shadow-glow-cyan shrink-0"
          >
            <RefreshCw className={`w-4 h-4 ${isSimulating ? 'animate-spin' : ''}`} />
            <span>RE-COMPUTE SYNTHETICS</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'SANDBOX', label: 'Interactive Physics Sandbox', icon: Sliders },
          { id: 'MATH', label: 'Mathematical Formulations', icon: Calculator },
          { id: 'ARCHITECTURE', label: 'Generator Pipeline', icon: Layers },
          { id: 'OPSEC', label: 'Defense & OPSEC Rationale', icon: ShieldCheck },
          { id: 'RAW_JSON', label: 'Raw Synthetic Inspector', icon: Code },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-xs font-mono font-bold tracking-wide transition-all uppercase whitespace-nowrap ${
                isActive
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-500/50 shadow-glow-cyan'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: INTERACTIVE PHYSICS SANDBOX */}
      {activeTab === 'SANDBOX' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Interactive Variable Controls */}
            <div className="lg:col-span-4 glass-panel p-5 rounded-xl font-mono space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2 text-cyan-400">
                  <Sliders className="w-4 h-4" />
                  <h3 className="text-sm font-bold tracking-wider uppercase">SYNTHETIC INPUT MATRIX</h3>
                </div>
                <span className="text-[10px] text-slate-500">LIVE COUPLING</span>
              </div>

              {/* Altitude Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Mountain className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Altitude / Elevation:</span>
                  </span>
                  <span className="text-white font-bold">{altitudeM} meters</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="5545"
                  step="50"
                  value={altitudeM}
                  onChange={(e) => setAltitudeM(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>73m (Tezpur)</span>
                  <span>3500m (Leh)</span>
                  <span>5545m (Mana Pass)</span>
                </div>
              </div>

              {/* Temperature Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 flex items-center space-x-1">
                    <Thermometer className="w-3.5 h-3.5 text-rose-400" />
                    <span>Ambient Temperature:</span>
                  </span>
                  <span className={`font-bold ${temperatureC < 0 ? 'text-cyan-400' : 'text-amber-400'}`}>
                    {temperatureC > 0 ? `+${temperatureC}` : temperatureC}°C
                  </span>
                </div>
                <input
                  type="range"
                  min="-35"
                  max="35"
                  step="1"
                  value={temperatureC}
                  onChange={(e) => setTemperatureC(Number(e.target.value))}
                  className="w-full accent-rose-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>-35°C (Siachen/Drass)</span>
                  <span>0°C (Freeze)</span>
                  <span>+35°C (Valley)</span>
                </div>
              </div>

              {/* Operational Tempo Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block">Operational Tempo Multiplier:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'LOW', label: 'LOW (0.7x)' },
                    { id: 'NORMAL', label: 'NORMAL (1.0x)' },
                    { id: 'HIGH', label: 'HIGH (1.45x)' },
                    { id: 'SURGE', label: 'SURGE (1.90x)' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTempo(t.id)}
                      className={`px-2.5 py-1.5 rounded text-xs font-semibold transition-all ${
                        tempo === t.id
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-glow-cyan'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather Condition */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 block">Weather Severity State:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['CLEAR', 'FOG', 'RAIN', 'HEAVY_STORM', 'SNOW_ICE'].map((w) => (
                    <button
                      key={w}
                      onClick={() => setWeather(w)}
                      className={`px-2 py-1 rounded text-[11px] font-semibold transition-all ${
                        weather === w
                          ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400 font-bold shadow-glow-cyan'
                          : 'bg-slate-800/80 text-slate-400 hover:text-white'
                      }`}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sensor Noise % */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Sensor Gaussian Noise:</span>
                  <span className="text-cyan-400 font-bold">±{sensorNoisePct}%</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="12.0"
                  step="0.5"
                  value={sensorNoisePct}
                  onChange={(e) => setSensorNoisePct(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Troop Count */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Stationed Troop Complement:</span>
                  <span className="text-white font-bold">{troops} Personnel</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="2500"
                  step="50"
                  value={troops}
                  onChange={(e) => setTroops(Number(e.target.value))}
                  className="w-full accent-cyan-400 bg-slate-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Real-Time Calculated Physics & Curves */}
            <div className="lg:col-span-8 space-y-6">
              {/* Calculated Multipliers Row */}
              {simResult && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 font-mono">
                  <div className="glass-panel p-3.5 rounded-xl border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">TEMPO SCALAR</span>
                    <div className="text-lg font-bold text-cyan-400">
                      {simResult.intermediate_multipliers.tempo_multiplier.toFixed(2)}x
                    </div>
                    <span className="text-[10px] text-slate-500">M_tempo factor</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">WEATHER SCALAR</span>
                    <div className="text-lg font-bold text-amber-400">
                      {simResult.intermediate_multipliers.weather_multiplier.toFixed(2)}x
                    </div>
                    <span className="text-[10px] text-slate-500">M_weather factor</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">ALTITUDE SCALAR</span>
                    <div className="text-lg font-bold text-emerald-400">
                      {simResult.intermediate_multipliers.altitude_multiplier.toFixed(2)}x
                    </div>
                    <span className="text-[10px] text-slate-500">M_alt (&gt;2500m)</span>
                  </div>

                  <div className="glass-panel p-3.5 rounded-xl border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">FREEZE STRESS</span>
                    <div className="text-lg font-bold text-rose-400">
                      {simResult.intermediate_multipliers.temperature_freeze_multiplier.toFixed(2)}x
                    </div>
                    <span className="text-[10px] text-slate-500">M_temp sub-zero</span>
                  </div>
                </div>
              )}

              {/* Composite Burn Rate Card */}
              {simResult && (
                <div className="glass-panel p-5 rounded-xl font-mono flex flex-col md:flex-row md:items-center justify-between gap-4 border-cyan-500/20 bg-cyan-950/20">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-cyan-300 tracking-wider">
                      COMPOSITE SYNTHETIC BURN DERIVATION
                    </span>
                    <div className="text-xl font-bold text-white flex items-baseline space-x-2">
                      <span>{simResult.daily_burn_calculated.synthetic_actual_fuel_kL} kL/day</span>
                      <span className="text-xs text-rose-400">({simResult.daily_burn_calculated.delta_pct} vs Nominal {simResult.daily_burn_calculated.base_nominal_fuel_kL} kL)</span>
                    </div>
                    <div className="text-xs text-slate-400">
                      Composite Factor = {simResult.intermediate_multipliers.composite_demand_factor}x applied to base consumption of {troops} troops.
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-center">
                      <span className="text-[10px] text-slate-500 block">Z-SCORE OUTLIER</span>
                      <span className={`text-base font-bold ${Math.abs(simResult.simulated_iot_telemetry.statistical_z_score) >= 2.5 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`}>
                        {simResult.simulated_iot_telemetry.statistical_z_score > 0 ? `+${simResult.simulated_iot_telemetry.statistical_z_score}` : simResult.simulated_iot_telemetry.statistical_z_score}σ
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic 7-Day Stock Depletion Chart */}
              <div className="glass-panel p-5 rounded-xl font-mono space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-white">
                    <TrendingDown className="w-4 h-4 text-cyan-400" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      SYNTHETIC 7-DAY FUEL TRAJECTORY (INITIAL 600 kL)
                    </h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Gaussian Noise ±{sensorNoisePct}%</span>
                </div>

                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="syntheticFuelGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00F0FF" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#00F0FF" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                      <XAxis dataKey="day" stroke="#64748B" tick={{ fontSize: 11 }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11 }} domain={[0, 650]} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0D1525',
                          borderColor: '#334155',
                          borderRadius: '8px',
                          color: '#F8FAFC',
                          fontFamily: 'monospace',
                          fontSize: '11px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="stock"
                        name="Projected Fuel (kL)"
                        stroke="#00F0FF"
                        strokeWidth={2.5}
                        fillOpacity={1}
                        fill="url(#syntheticFuelGrad)"
                      />
                      <Line
                        type="monotone"
                        dataKey="safetyThreshold"
                        name="Safety Reserve (200 kL)"
                        stroke="#FF3366"
                        strokeDasharray="4 4"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Simulated Virtual IoT Telemetry Stream */}
              {simResult && (
                <div className="glass-panel p-5 rounded-xl font-mono space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <div className="flex items-center space-x-2 text-cyan-400">
                      <Radio className="w-4 h-4 animate-pulse" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">
                        VIRTUAL IOT SENSOR STREAM (REAL-TIME COMPUTED READINGS)
                      </h4>
                    </div>
                    <span className="text-[10px] text-emerald-400 flex items-center space-x-1">
                      <Activity className="w-3 h-3" />
                      <span>STREAMING ACTIVE</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">ULTRASONIC FUEL TANK SENSOR</span>
                      <div className="text-base font-bold text-cyan-300">
                        {simResult.simulated_iot_telemetry.ultrasonic_fuel_tank_pct}% Full
                      </div>
                      <p className="text-[10px] text-slate-500">Continuous ultrasonic acoustic echo probe</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">COLD-CHAIN MEDICAL PROBE</span>
                      <div className="text-base font-bold text-amber-300">
                        {simResult.simulated_iot_telemetry.cold_chain_ambient_probe_c}°C
                      </div>
                      <p className="text-[10px] text-slate-500">Blood plasma & insulin storage temp</p>
                    </div>

                    <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase">RFID DISPATCH FLOW RATE</span>
                      <div className="text-base font-bold text-emerald-300">
                        {simResult.simulated_iot_telemetry.rfid_flow_rate_liters_min} L/min
                      </div>
                      <p className="text-[10px] text-slate-500">Automated gate RFID tally rate</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MATHEMATICAL FORMULATIONS */}
      {activeTab === 'MATH' && explainerDoc && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {explainerDoc.mathematical_models.map((model, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl font-mono space-y-4 border-slate-800 hover:border-cyan-500/40 transition-all">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    {model.module}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    FORMULATION
                  </span>
                </div>

                {/* Mathematical Equation Block with Full KaTeX Typesetting */}
                <div className="p-4 rounded-xl bg-slate-950/90 border border-cyan-500/40 text-cyan-200 overflow-x-auto shadow-inner">
                  <LatexMath math={model.formula} displayMode={true} className="text-sm md:text-base font-semibold" />
                </div>

                {model.variables && (
                  <div className="space-y-2">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      VARIABLES & PARAMETERS:
                    </span>
                    <div className="space-y-2 text-xs text-slate-300">
                      {model.variables.map((v, vIdx) => (
                        <div key={vIdx} className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800 flex flex-col space-y-1">
                          <div className="text-cyan-300 font-bold text-xs">
                            <LatexMath math={v.symbol} displayMode={false} />
                          </div>
                          {v.description.startsWith('\\') || v.description.includes('\\frac') || v.description.includes('\\text{ETA}') ? (
                            <div className="text-cyan-200 overflow-x-auto py-1">
                              <LatexMath math={v.description} displayMode={v.description.includes('\\frac')} />
                            </div>
                          ) : (
                            <span className="text-slate-300 text-[11px] leading-relaxed">{v.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Confidence Bounds */}
                {model.confidence_bounds && (
                  <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 space-y-1">
                    <span className="font-bold block text-[10px] uppercase text-cyan-400 tracking-wider">CONFIDENCE INTERVAL (95% CI):</span>
                    <LatexMath math={model.confidence_bounds} displayMode={true} />
                  </div>
                )}

                {/* Constraints */}
                {model.constraints && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      SOLVER CONSTRAINTS:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {model.constraints.map((c, cIdx) => (
                        <li key={cIdx} className="flex items-start space-x-2 text-[11px]">
                          <span className="text-cyan-400 font-bold">•</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Criteria */}
                {model.criteria && (
                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                      STATISTICAL THRESHOLD RULES:
                    </span>
                    <ul className="space-y-1 text-slate-300">
                      {model.criteria.map((cr, crIdx) => (
                        <li key={crIdx} className="flex items-start space-x-2 text-[11px]">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{cr}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: GENERATOR PIPELINE */}
      {activeTab === 'ARCHITECTURE' && explainerDoc && (
        <div className="space-y-6 font-mono">
          <div className="glass-panel p-6 rounded-xl space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center space-x-2">
              <Layers className="w-5 h-5 text-cyan-400" />
              <span>END-TO-END SYNTHETIC DATA GENERATION PIPELINE</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  1
                </div>
                <h4 className="text-xs font-bold text-white uppercase">GIS Spatial Topology</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Extracts authentic coordinates across Kashmir, Ladakh, Uttarakhand, and Arunachal, incorporating accurate pass elevations (up to 5,545m) and terrain classifications.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  2
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Environmental Physics</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Applies high-altitude hypoxia, sub-zero freeze factors (-35°C to 0°C), and precipitation multipliers to dynamically scale baseline consumption curves.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  3
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Stochastic Drift & CI</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Injects time-expanding Gaussian noise over 7-day forecast horizons ($\sigma_t = 0.04 \cdot t$) generating realistic 95% confidence interval bounds.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-2 relative">
                <div className="w-6 h-6 rounded-full bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 flex items-center justify-center text-xs font-bold">
                  4
                </div>
                <h4 className="text-xs font-bold text-white uppercase">Virtual IoT Bus</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Synthesizes 1,000+ streaming sensors (ultrasonic tank level, RFID transit gates, cold-chain temp probes) with simulated anomaly injections and Z-score alerts.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-cyan-400 uppercase">Methodology Notes</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                {explainerDoc.synthetic_generation_methodology.operational_relevance}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: DEFENSE & OPSEC RATIONALE */}
      {activeTab === 'OPSEC' && explainerDoc?.why_synthetic_digital_twins && (
        <div className="space-y-6 font-mono">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {explainerDoc.why_synthetic_digital_twins.map((item, idx) => (
              <div key={idx} className="glass-panel p-6 rounded-xl space-y-3 border-cyan-500/20 hover:border-cyan-500/50 transition-all">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                  {item.heading}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-xl space-y-3 border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              SYNTHETIC VS. CLASSIFIED REAL-WORLD DATA COMPARISON MATRIX
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Dimension</th>
                    <th className="py-2.5 px-3">Live Defense Data (Classified)</th>
                    <th className="py-2.5 px-3 text-cyan-400">LOGISCOPE Synthetic Twin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-200">OPSEC Compliance</td>
                    <td className="py-2.5 px-3 text-rose-400">Restricted (Air-gapped secure facilities only)</td>
                    <td className="py-2.5 px-3 text-emerald-400">100% Unrestricted & Secure (Zero leaks)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-200">Black Swan Simulation</td>
                    <td className="py-2.5 px-3 text-slate-400">Impossible without risking frontline supply</td>
                    <td className="py-2.5 px-3 text-cyan-400">Infinite compound crisis & cutoff testing</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 font-bold text-slate-200">Mathematical Rigor</td>
                    <td className="py-2.5 px-3 text-slate-400">Empirical logs</td>
                    <td className="py-2.5 px-3 text-cyan-400">Physics-based multivariate forecasting</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: RAW JSON INSPECTOR */}
      {activeTab === 'RAW_JSON' && (
        <div className="glass-panel p-6 rounded-xl font-mono space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2 text-white">
              <Code className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                LIVE SYNTHETIC ENGINE COMPUTED PAYLOAD
              </h3>
            </div>

            <button
              onClick={handleCopyJson}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs flex items-center space-x-1.5 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">COPIED JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>COPY JSON</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-cyan-300 text-xs overflow-x-auto max-h-[500px] leading-relaxed">
            {JSON.stringify(simResult || explainerDoc, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};
