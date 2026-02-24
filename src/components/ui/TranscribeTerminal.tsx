import React, { useEffect, useRef } from "react";
import { Terminal, Loader2, Check } from "lucide-react";

export interface TerminalLog {
  id: string;
  message: string;
  status: "pending" | "success" | "error" | "info";
  progress?: number;
}

interface TranscribeTerminalProps {
  logs: TerminalLog[];
  liveText: string;
}

export default function TranscribeTerminal({
  logs,
  liveText,
}: TranscribeTerminalProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom as logs/text arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs, liveText]);

  return (
    <div className="bg-[#0f172a] rounded-3xl overflow-hidden border-2 border-[#355872]/20 shadow-2xl font-mono flex flex-col w-full max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4">
      {/* Terminal Header */}
      <div className="bg-[#1e293b] px-4 py-3 flex items-center gap-3 border-b border-slate-700/50">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
        </div>
        <div className="flex items-center gap-2 text-slate-400 text-xs ml-2 font-bold uppercase tracking-widest">
          <Terminal className="w-4 h-4" />
          AI Engine Status
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-6 text-sm flex flex-col gap-3 text-slate-300 max-h-[400px] overflow-y-auto">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col gap-1">
            <div className="flex items-start gap-3">
              <span className="text-slate-500 mt-0.5 whitespace-nowrap">
                [
                {new Date().toLocaleTimeString([], {
                  hour12: false,
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
                ]
              </span>

              {log.status === "pending" && (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin mt-0.5 shrink-0" />
              )}
              {log.status === "success" && (
                <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              )}
              {log.status === "error" && (
                <span className="text-red-400 font-bold mt-0.5 shrink-0">
                  ERR
                </span>
              )}
              {log.status === "info" && (
                <span className="text-blue-400 font-bold mt-0.5 shrink-0">
                  SYS
                </span>
              )}

              <span
                className={`${log.status === "success" ? "text-emerald-400" : log.status === "error" ? "text-red-400" : "text-slate-200"}`}
              >
                {log.message}
              </span>
            </div>

            {/* Sub-progress bar for model downloading */}
            {typeof log.progress === "number" && log.status === "pending" && (
              <div className="ml-16 mt-1 flex items-center gap-3 max-w-xs">
                <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${log.progress}%` }}
                  />
                </div>
                <span className="text-xs text-blue-400 font-bold">
                  {log.progress}%
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Live Typing Text for Transcription */}
        {liveText && (
          <div className="mt-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700 text-emerald-300/90 leading-relaxed shadow-inner">
            <span className="text-slate-500 mr-2 border-r border-slate-600 pr-2 select-none">
              Output
            </span>
            {liveText}
            <span className="inline-block w-2 h-4 ml-1 bg-emerald-400 animate-pulse align-middle" />
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
