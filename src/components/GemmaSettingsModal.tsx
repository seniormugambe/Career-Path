import React, { useState, useEffect } from 'react';
import {
  GemmaConfig,
  getGemmaConfig,
  saveGemmaConfig,
  testLocalGemmaConnection,
} from '../services/gemmaService';
import {
  X,
  Cpu,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Terminal,
  RefreshCw,
  Copy,
  Check,
  Lock,
} from 'lucide-react';

interface GemmaSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange?: (config: GemmaConfig) => void;
}

export const GemmaSettingsModal: React.FC<GemmaSettingsModalProps> = ({
  isOpen,
  onClose,
  onConfigChange,
}) => {
  const [config, setConfig] = useState<GemmaConfig>(getGemmaConfig());
  const [testStatus, setTestStatus] = useState<{
    tested: boolean;
    ok?: boolean;
    message?: string;
    latencyMs?: number;
    loading: boolean;
  }>({
    tested: false,
    loading: false,
  });
  const [copiedCmd, setCopiedCmd] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setConfig(getGemmaConfig());
      setTestStatus({ tested: false, loading: false });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (updated: Partial<GemmaConfig>) => {
    const newConfig = { ...config, ...updated };
    setConfig(newConfig);
    saveGemmaConfig(newConfig);
    if (onConfigChange) onConfigChange(newConfig);
  };

  const handleTestConnection = async () => {
    setTestStatus({ tested: false, loading: true });
    const res = await testLocalGemmaConnection(config.localEndpoint, config.modelName);
    setTestStatus({
      tested: true,
      ok: res.ok,
      message: res.message,
      latencyMs: res.latencyMs,
      loading: false,
    });
  };

  const copyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Gemma AI Engine & Privacy</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-semibold">
                  Gemma 2
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Configure on-device local execution and career drafting
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Private Mode Banner */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-3.5 flex items-start gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0 mt-0.5">
            <Lock className="w-4 h-4" />
          </div>
          <div className="text-xs">
            <h4 className="font-bold text-white mb-0.5 flex items-center gap-1.5 font-mono">
              <span>Local / Private Mode Active</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </h4>
            <p className="text-slate-300 leading-relaxed">
              When Local Mode is enabled, drafting prompts are processed directly on your machine or inside the browser sandbox. No portfolio secrets or personal info are logged externally.
            </p>
          </div>
        </div>

        {/* Execution Engine Selector */}
        <div>
          <label className="text-xs font-semibold text-slate-300 block mb-2 font-mono uppercase tracking-wider">
            Execution Mode
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleSave({ mode: 'local' })}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                config.mode === 'local'
                  ? 'bg-purple-500/15 border-purple-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono text-purple-300">💻 Local Ollama</span>
                {config.mode === 'local' && <CheckCircle2 className="w-4 h-4 text-purple-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Connects to Ollama on localhost for 100% on-device private weights.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSave({ mode: 'cloud' })}
              className={`p-3.5 rounded-xl border text-left transition-colors cursor-pointer ${
                config.mode === 'cloud'
                  ? 'bg-emerald-500/15 border-emerald-500/50 text-white shadow-md'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:bg-slate-800/40'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold font-mono text-emerald-300">⚡ Gemma Engine</span>
                {config.mode === 'cloud' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">
                Built-in zero-setup inference engine with instant turnaround.
              </p>
            </button>
          </div>
        </div>

        {/* Local Configuration Details (if Local selected) */}
        {config.mode === 'local' && (
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 space-y-3.5">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                Local Ollama Endpoint
              </label>
              <input
                type="text"
                value={config.localEndpoint}
                onChange={(e) => handleSave({ localEndpoint: e.target.value })}
                placeholder="http://localhost:11434"
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs font-mono text-slate-200 focus:outline-none focus:border-purple-500/50"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1 font-mono">
                Target Gemma Model
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['gemma2:2b', 'gemma2:9b', 'codegemma'].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleSave({ modelName: m })}
                    className={`py-1.5 px-2.5 rounded-lg text-xs font-mono border transition-colors cursor-pointer ${
                      config.modelName === m
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 font-bold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Connection Button */}
            <div className="pt-1">
              <button
                type="button"
                onClick={handleTestConnection}
                disabled={testStatus.loading}
                className="w-full py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700/80 text-xs font-mono text-slate-200 border border-slate-700 flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${testStatus.loading ? 'animate-spin' : ''}`} />
                <span>{testStatus.loading ? 'Checking Local Ollama...' : 'Test Connection (Ping)'}</span>
              </button>

              {testStatus.tested && (
                <div
                  className={`mt-2.5 p-2.5 rounded-lg border text-xs font-mono flex items-start gap-2 ${
                    testStatus.ok
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  }`}
                >
                  {testStatus.ok ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
                  )}
                  <span className="leading-relaxed">{testStatus.message}</span>
                </div>
              )}
            </div>

            {/* Quick Terminal Guide */}
            <div className="p-3 rounded-lg bg-slate-900/90 border border-slate-800/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-400" />
                  <span>Start Gemma 2 locally in Terminal:</span>
                </span>
                <button
                  type="button"
                  onClick={() => copyCommand(`ollama run ${config.modelName}`)}
                  className="text-[10px] font-mono text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <code className="text-xs font-mono text-emerald-400 bg-slate-950 px-2 py-1 rounded block border border-slate-800">
                ollama run {config.modelName}
              </code>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Current Engine: {config.mode === 'local' ? `Ollama (${config.modelName})` : 'Gemma Engine'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors cursor-pointer"
          >
            Apply & Close
          </button>
        </div>
      </div>
    </div>
  );
};
