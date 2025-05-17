import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Sparkles } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-white/75 dark:bg-slate-900/75 border-b border-slate-200 dark:border-slate-700 shadow-sm">
      <div className="max-w-4xl mx-auto p-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="h-6 w-6 text-purple-500 animate-pulse" />
            <div className="absolute -inset-1 bg-purple-300/30 rounded-full blur-sm -z-10"></div>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-fuchsia-500 to-blue-500 text-transparent bg-clip-text">
            ChatDefi
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </header>
  );
}
