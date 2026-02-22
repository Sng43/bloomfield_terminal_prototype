/**
 * BLOOMFIELD TERMINAL — Page principale
 * Style: Afrofuturisme Financier — Split-screen asymétrique
 * Layout: Header ticker | Sidebar nav | Zone données 60% | Chat IA 40%
 * API: Langflow DataStax (aws-us-east-2)
 */

import { useState, useRef, useEffect, useCallback } from "react";
import { Streamdown } from "streamdown";

// ─── Types ───────────────────────────────────────────────────────────────────
interface BRVMStock {
  code: string;
  name: string;
  price: number;
  change: number;
  changePct: number;
  volume: number;
  sector: string;
}

interface MacroIndicator {
  label: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  country: string;
}

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// ─── Données BRVM simulées (données réalistes UEMOA 2025) ────────────────────
const BRVM_STOCKS: BRVMStock[] = [
  { code: "SGBCI", name: "Société Générale CI", price: 12450, change: +185, changePct: +1.51, volume: 4230, sector: "Finance" },
  { code: "ONTBF", name: "ONATEL Burkina Faso", price: 3875, change: -45, changePct: -1.15, volume: 1820, sector: "Télécom" },
  { code: "SNTS", name: "Sonatel Sénégal", price: 18200, change: +320, changePct: +1.79, volume: 6540, sector: "Télécom" },
  { code: "BICC", name: "BICICI Côte d'Ivoire", price: 7650, change: +90, changePct: +1.19, volume: 2100, sector: "Finance" },
  { code: "PALC", name: "Palm CI", price: 6420, change: -120, changePct: -1.83, volume: 3450, sector: "Agro-industrie" },
  { code: "SIVC", name: "Air Côte d'Ivoire", price: 1850, change: +25, changePct: +1.37, volume: 8920, sector: "Transport" },
  { code: "TTLC", name: "Total Energies CI", price: 2340, change: -18, changePct: -0.76, volume: 5670, sector: "Énergie" },
  { code: "CABC", name: "Caisse d'Épargne CI", price: 4100, change: +55, changePct: +1.36, volume: 1230, sector: "Finance" },
  { code: "ETIT", name: "Ecobank Transnational", price: 22, change: +1, changePct: +4.76, volume: 125000, sector: "Finance" },
  { code: "BOABF", name: "Bank of Africa BF", price: 5800, change: -85, changePct: -1.44, volume: 980, sector: "Finance" },
];

const MACRO_INDICATORS: MacroIndicator[] = [
  { label: "PIB Côte d'Ivoire", value: "70.0", unit: "Mds USD", trend: "up", country: "CI" },
  { label: "Inflation UEMOA", value: "3.2", unit: "%", trend: "down", country: "UEMOA" },
  { label: "Taux BCEAO", value: "3.50", unit: "%", trend: "stable", country: "UEMOA" },
  { label: "FCFA/USD", value: "610.5", unit: "XOF", trend: "stable", country: "UEMOA" },
  { label: "Cacao (ICE)", value: "8 420", unit: "USD/t", trend: "up", country: "Monde" },
  { label: "Pétrole Brent", value: "74.2", unit: "USD/b", trend: "down", country: "Monde" },
];

const SUGGESTED_QUESTIONS = [
  "Analyse l'impact de la hausse du cacao sur les entreprises cotées à la BRVM",
  "Quelles sont les meilleures opportunités d'investissement sur la BRVM en 2025 ?",
  "Compare les performances de SGBCI et BICC sur les 12 derniers mois",
  "Quel est l'impact de la politique monétaire de la BCEAO sur les marchés ?",
  "Analyse le secteur télécom BRVM : SNTS vs ONTBF",
];

// ─── Composant Ticker scrollant ───────────────────────────────────────────────
function TickerBar() {
  const items = [...BRVM_STOCKS, ...BRVM_STOCKS];
  return (
    <div className="h-8 bg-[oklch(0.11_0.022_240)] border-b border-white/8 overflow-hidden flex items-center">
      <div className="flex-shrink-0 px-3 text-[10px] font-mono text-[oklch(0.72_0.18_55)] font-semibold tracking-widest border-r border-white/10 h-full flex items-center">
        BRVM LIVE
      </div>
      <div className="overflow-hidden flex-1">
        <div className="scrolling-ticker flex gap-8 whitespace-nowrap">
          {items.map((s, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-[11px] font-mono">
              <span className="text-white/70 font-semibold">{s.code}</span>
              <span className="text-white/90">{s.price.toLocaleString('fr-FR')}</span>
              <span className={s.change >= 0 ? "ticker-up" : "ticker-down"}>
                {s.change >= 0 ? "▲" : "▼"} {Math.abs(s.changePct).toFixed(2)}%
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="flex-shrink-0 px-3 flex items-center gap-1.5 border-l border-white/10 h-full">
        <span className="live-badge w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.17_160)]"></span>
        <span className="text-[10px] font-mono text-[oklch(0.65_0.17_160)]">EN DIRECT</span>
      </div>
    </div>
  );
}

// ─── Composant Sidebar ────────────────────────────────────────────────────────
function Sidebar({ activeModule, onModuleChange }: { activeModule: string; onModuleChange: (m: string) => void }) {
  const modules = [
    { id: "brvm", icon: "📈", label: "Marchés BRVM", badge: "LIVE" },
    { id: "macro", icon: "🌍", label: "Macro Afrique", badge: null },
    { id: "portfolio", icon: "💼", label: "Portefeuille", badge: "BIENTÔT" },
    { id: "risque", icon: "🛡️", label: "Risque Pays", badge: "BIENTÔT" },
    { id: "webtv", icon: "📺", label: "Web TV", badge: "BIENTÔT" },
    { id: "rapports", icon: "📄", label: "Rapports", badge: "BIENTÔT" },
  ];

  return (
    <div className="w-14 lg:w-52 h-full panel-bg flex flex-col border-r border-white/8">
      {/* Logo */}
      <div className="p-3 lg:p-4 border-b border-white/8">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[oklch(0.72_0.18_55)] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-bold text-[oklch(0.1_0.02_240)]">BT</span>
          </div>
          <div className="hidden lg:block">
            <div className="text-xs font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>BLOOMFIELD</div>
            <div className="text-[9px] text-[oklch(0.72_0.18_55)] font-mono tracking-widest">TERMINAL</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-0.5">
        {modules.map((m) => (
          <button
            key={m.id}
            onClick={() => {
              if (m.badge !== "BIENTÔT") onModuleChange(m.id);
            }}
            className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-left transition-all duration-150 group ${activeModule === m.id
                ? "bg-[oklch(0.72_0.18_55/15%)] text-[oklch(0.72_0.18_55)]"
                : "text-white/50 hover:text-white/80 hover:bg-white/5"
              } ${m.badge === "BIENTÔT" ? "opacity-40 cursor-not-allowed" : ""}`}
          >
            <span className="text-base flex-shrink-0">{m.icon}</span>
            <div className="hidden lg:flex flex-1 items-center justify-between min-w-0">
              <span className="text-[11px] font-medium truncate">{m.label}</span>
              {m.badge && m.badge !== "BIENTÔT" && (
                <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-[oklch(0.65_0.17_160/20%)] text-[oklch(0.65_0.17_160)]">{m.badge}</span>
              )}
            </div>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-white/8 hidden lg:block">
        <div className="text-[9px] text-white/30 font-mono">v1.0 — PROTOTYPE</div>
        <div className="text-[9px] text-white/20 font-mono">AI Factory Dynamics</div>
      </div>
    </div>
  );
}

// ─── Composant Tableau BRVM ───────────────────────────────────────────────────
function BRVMTable({ onSelectStock }: { onSelectStock: (stock: BRVMStock) => void }) {
  const [sortBy, setSortBy] = useState<"changePct" | "volume" | "price">("changePct");
  const sorted = [...BRVM_STOCKS].sort((a, b) =>
    sortBy === "changePct" ? Math.abs(b.changePct) - Math.abs(a.changePct) :
      sortBy === "volume" ? b.volume - a.volume :
        b.price - a.price
  );

  return (
    <div className="panel-bg rounded-lg overflow-hidden h-full flex flex-col">
      <div className="panel-header px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-white/80" style={{ fontFamily: 'Syne, sans-serif' }}>COURS BRVM</span>
          <span className="live-badge w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.17_160)]"></span>
        </div>
        <div className="flex gap-1">
          {(["changePct", "volume", "price"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSortBy(s)}
              className={`text-[9px] font-mono px-2 py-0.5 rounded transition-colors ${sortBy === s ? "bg-[oklch(0.72_0.18_55)] text-[oklch(0.1_0.02_240)]" : "text-white/40 hover:text-white/70"
                }`}
            >
              {s === "changePct" ? "VAR%" : s === "volume" ? "VOL" : "PRIX"}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-auto flex-1">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="text-white/30 font-mono text-[9px] tracking-wider">
              <th className="text-left px-4 py-2 font-medium">TITRE</th>
              <th className="text-right px-3 py-2 font-medium">COURS</th>
              <th className="text-right px-3 py-2 font-medium">VAR.</th>
              <th className="text-right px-4 py-2 font-medium hidden md:table-cell">VOLUME</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((stock) => (
              <tr
                key={stock.code}
                onClick={() => onSelectStock(stock)}
                className="border-t border-white/5 hover:bg-white/5 cursor-pointer transition-colors group"
              >
                <td className="px-4 py-2.5">
                  <div className="font-mono font-semibold text-white/90 group-hover:text-[oklch(0.72_0.18_55)] transition-colors">{stock.code}</div>
                  <div className="text-[9px] text-white/30 truncate max-w-[100px]">{stock.name}</div>
                </td>
                <td className="px-3 py-2.5 text-right font-mono text-white/80">
                  {stock.price.toLocaleString('fr-FR')}
                  <span className="text-white/30 text-[9px] ml-0.5">XOF</span>
                </td>
                <td className={`px-3 py-2.5 text-right font-mono font-semibold ${stock.change >= 0 ? "ticker-up" : "ticker-down"}`}>
                  {stock.change >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                </td>
                <td className="px-4 py-2.5 text-right font-mono text-white/40 hidden md:table-cell">
                  {stock.volume.toLocaleString('fr-FR')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Composant Indicateurs Macro ──────────────────────────────────────────────
function MacroPanel() {
  return (
    <div className="panel-bg rounded-lg overflow-hidden">
      <div className="panel-header px-4 py-2.5">
        <span className="text-[11px] font-semibold text-white/80" style={{ fontFamily: 'Syne, sans-serif' }}>MACRO — AFRIQUE & MARCHÉS</span>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {MACRO_INDICATORS.map((ind) => (
          <div key={ind.label} className="bg-[oklch(0.13_0.025_240)] p-3">
            <div className="text-[9px] text-white/40 font-mono mb-1 truncate">{ind.label}</div>
            <div className="flex items-baseline gap-1">
              <span className="text-base font-mono font-semibold text-white/90">{ind.value}</span>
              <span className="text-[9px] text-white/40">{ind.unit}</span>
            </div>
            <div className={`text-[9px] font-mono mt-0.5 ${ind.trend === "up" ? "ticker-up" : ind.trend === "down" ? "ticker-down" : "text-[oklch(0.72_0.18_55)]"
              }`}>
              {ind.trend === "up" ? "▲ Hausse" : ind.trend === "down" ? "▼ Baisse" : "● Stable"} · {ind.country}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Composant Chat IA ────────────────────────────────────────────────────────
function AIChat({ contextStock }: { contextStock: BRVMStock | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Bonjour ! Je suis **Bloomfield AI**, votre analyste financier intelligent spécialisé sur les marchés africains.\n\nJe peux analyser les données BRVM, les indicateurs macroéconomiques UEMOA, les matières premières africaines et vous aider dans vos décisions d'investissement.\n\n*Posez-moi une question ou cliquez sur un titre BRVM pour une analyse instantanée.*`,
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, streamingContent]);

  // Quand un stock est sélectionné, pré-remplir la question
  useEffect(() => {
    if (contextStock) {
      setInput(`Analyse le titre ${contextStock.code} (${contextStock.name}) : cours actuel ${contextStock.price.toLocaleString('fr-FR')} XOF, variation ${contextStock.changePct > 0 ? "+" : ""}${contextStock.changePct.toFixed(2)}% aujourd'hui. Quelles sont tes recommandations ?`);
      inputRef.current?.focus();
    }
  }, [contextStock]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: ChatMessage = { role: "user", content: messageText, timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setStreamingContent("");

    try {
      const sessionId = `bloomfield_${Date.now()}`;
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: messageText,
          sessionId: sessionId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }

      const data = await response.json();
      let content = "";

      // Parser la réponse Langflow
      if (data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text) {
        content = data.outputs[0].outputs[0].results.message.text;
      } else if (data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message) {
        content = data.outputs[0].outputs[0].messages[0].message;
      } else if (data?.reply) {
        // Fallback or simplified proxy response
        content = typeof data.reply === "string" ? data.reply : JSON.stringify(data.reply, null, 2);
      } else if (typeof data === "string") {
        content = data;
      } else {
        content = JSON.stringify(data, null, 2);
      }

      // Simuler un effet de streaming
      let i = 0;
      const interval = setInterval(() => {
        if (i < content.length) {
          setStreamingContent(content.slice(0, i + 3));
          i += 3;
        } else {
          clearInterval(interval);
          setMessages((prev) => [...prev, { role: "assistant", content, timestamp: new Date() }]);
          setStreamingContent("");
          setIsLoading(false);
        }
      }, 15);

    } catch (err) {
      // Réponse de fallback si l'API n'est pas disponible
      const fallback = `**Analyse Bloomfield AI — ${messageText.slice(0, 50)}...**\n\n*Note : Cette démo utilise des données simulées. L'API Langflow sera connectée avec votre token d'authentification.*\n\nBasé sur les données BRVM actuelles et les indicateurs macroéconomiques UEMOA, voici mon analyse :\n\n**Contexte marché :** La BRVM affiche une tendance positive avec le BRVM Composite en hausse de +1.2% sur la séance. Le secteur financier reste le plus actif avec SGBCI et BICC en tête des volumes.\n\n**Facteurs clés :** La politique monétaire accommodante de la BCEAO (taux directeur à 3.50%) soutient la liquidité. La hausse du cacao (+15% YTD) bénéficie aux entreprises agro-industrielles cotées.\n\n**Recommandation :** Surveiller SNTS (Sonatel) pour son exposition régionale et ses fondamentaux solides.`;

      let i = 0;
      const interval = setInterval(() => {
        if (i < fallback.length) {
          setStreamingContent(fallback.slice(0, i + 4));
          i += 4;
        } else {
          clearInterval(interval);
          setMessages((prev) => [...prev, { role: "assistant", content: fallback, timestamp: new Date() }]);
          setStreamingContent("");
          setIsLoading(false);
        }
      }, 10);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full panel-bg rounded-lg overflow-hidden">
      {/* Header */}
      <div className="panel-header px-4 py-2.5 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[oklch(0.72_0.18_55/20%)] border border-[oklch(0.72_0.18_55/40%)] flex items-center justify-center">
            <span className="text-[10px]">🤖</span>
          </div>
          <div>
            <div className="text-[11px] font-semibold text-white/90" style={{ fontFamily: 'Syne, sans-serif' }}>BLOOMFIELD AI</div>
            <div className="text-[8px] text-[oklch(0.65_0.17_160)] font-mono">Analyste Financier IA · BRVM & Marchés Africains</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="live-badge w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.17_160)]"></span>
          <span className="text-[9px] font-mono text-[oklch(0.65_0.17_160)]">ACTIF</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
            {msg.role === "assistant" && (
              <div className="w-6 h-6 rounded-full bg-[oklch(0.72_0.18_55/20%)] border border-[oklch(0.72_0.18_55/40%)] flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-[9px]">🤖</span>
              </div>
            )}
            <div className={`max-w-[85%] rounded-lg px-3 py-2.5 text-[12px] leading-relaxed ${msg.role === "user"
                ? "bg-[oklch(0.72_0.18_55/15%)] border border-[oklch(0.72_0.18_55/30%)] text-white/90"
                : "bg-[oklch(0.16_0.025_240)] border border-white/8 text-white/80"
              }`}>
              <Streamdown>{msg.content}</Streamdown>
              <div className="text-[8px] text-white/20 font-mono mt-1">
                {msg.timestamp.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}

        {/* Streaming en cours */}
        {streamingContent && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[oklch(0.72_0.18_55/20%)] border border-[oklch(0.72_0.18_55/40%)] flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-[9px]">🤖</span>
            </div>
            <div className="max-w-[85%] rounded-lg px-3 py-2.5 text-[12px] leading-relaxed bg-[oklch(0.16_0.025_240)] border border-white/8 text-white/80">
              <Streamdown>{streamingContent}</Streamdown>
              <span className="typing-cursor"></span>
            </div>
          </div>
        )}

        {/* Indicateur de chargement */}
        {isLoading && !streamingContent && (
          <div className="flex gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[oklch(0.72_0.18_55/20%)] border border-[oklch(0.72_0.18_55/40%)] flex items-center justify-center flex-shrink-0">
              <span className="text-[9px]">🤖</span>
            </div>
            <div className="rounded-lg px-4 py-3 bg-[oklch(0.16_0.025_240)] border border-white/8 flex items-center gap-2">
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.18_55)]"
                    style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                  ></div>
                ))}
              </div>
              <span className="text-[10px] text-white/40 font-mono">Analyse en cours...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Questions suggérées */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex-shrink-0">
          <div className="text-[9px] text-white/30 font-mono mb-2 tracking-wider">QUESTIONS SUGGÉRÉES</div>
          <div className="space-y-1.5">
            {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
              <button
                key={i}
                onClick={() => sendMessage(q)}
                className="w-full text-left text-[10px] text-white/50 hover:text-white/80 px-3 py-2 rounded bg-white/5 hover:bg-white/8 border border-white/8 hover:border-[oklch(0.72_0.18_55/30%)] transition-all duration-150 leading-relaxed"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-white/8 flex-shrink-0">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question sur les marchés africains..."
              rows={2}
              className="w-full bg-[oklch(0.16_0.025_240)] border border-white/10 rounded-lg px-3 py-2.5 text-[12px] text-white/90 placeholder-white/25 resize-none focus:outline-none focus:border-[oklch(0.72_0.18_55/50%)] transition-colors font-sans"
              style={{ fontFamily: 'IBM Plex Sans, sans-serif' }}
            />
          </div>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 w-9 h-9 rounded-lg bg-[oklch(0.72_0.18_55)] hover:bg-[oklch(0.68_0.18_55)] disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 flex items-center justify-center orange-glow"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[oklch(0.1_0.02_240)]">
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
        <div className="text-[8px] text-white/20 font-mono mt-1.5 text-center">
          Bloomfield AI · Powered by AI Factory Dynamics · Langflow + DataStax
        </div>
      </div>
    </div>
  );
}

// ─── Page principale ──────────────────────────────────────────────────────────
export default function Home() {
  const [activeModule, setActiveModule] = useState("brvm");
  const [selectedStock, setSelectedStock] = useState<BRVMStock | null>(null);

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[oklch(0.1_0.02_240)]">
      {/* Header principal */}
      <header className="flex-shrink-0 h-12 bg-[oklch(0.11_0.022_240)] border-b border-white/8 flex items-center px-4 gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded bg-[oklch(0.72_0.18_55)] flex items-center justify-center">
            <span className="text-[10px] font-bold text-[oklch(0.1_0.02_240)]" style={{ fontFamily: 'Syne, sans-serif' }}>BT</span>
          </div>
          <div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>BLOOMFIELD TERMINAL</span>
            <span className="text-[9px] text-white/30 font-mono ml-2">Plateforme Financière Africaine</span>
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-[10px] font-mono text-white/40">
          <span>BRVM Composite <span className="ticker-up">+1.23%</span></span>
          <span>BRVM 10 <span className="ticker-up">+0.87%</span></span>
          <span className="hidden md:inline">XOF/USD <span className="text-[oklch(0.72_0.18_55)]">610.5</span></span>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-[oklch(0.72_0.18_55/10%)] border border-[oklch(0.72_0.18_55/20%)]">
            <span className="live-badge w-1.5 h-1.5 rounded-full bg-[oklch(0.65_0.17_160)]"></span>
            <span className="text-[oklch(0.65_0.17_160)]">DÉMO LIVE</span>
          </div>
        </div>
      </header>

      {/* Ticker scrollant */}
      <TickerBar />

      {/* Corps principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeModule={activeModule} onModuleChange={setActiveModule} />

        {/* Zone de contenu principale */}
        <div className="flex-1 flex overflow-hidden p-3 gap-3">
          {/* Panneau gauche — Données (60%) */}
          <div className="flex flex-col gap-3 overflow-hidden" style={{ flex: '0 0 58%' }}>
            {/* Tableau BRVM */}
            <div className="flex-1 overflow-hidden">
              <BRVMTable onSelectStock={(stock) => setSelectedStock(stock)} />
            </div>
            {/* Indicateurs Macro */}
            <div className="flex-shrink-0">
              <MacroPanel />
            </div>
          </div>

          {/* Panneau droit — Chat IA (40%) */}
          <div className="flex-1 overflow-hidden">
            <AIChat contextStock={selectedStock} />
          </div>
        </div>
      </div>

      {/* Style pour l'animation bounce */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
