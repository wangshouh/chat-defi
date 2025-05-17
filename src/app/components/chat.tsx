"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useChat } from "ai/react";
import { RefreshCw, Send, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export function Chat() {

  // 聊天消息
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant', content: string }[]>([]);
    // 输入框内容
    const [input, setInput] = useState('');
    // 是否加载中
    const [isLoading, setIsLoading] = useState(false);
    // 错误对象
    const [error, setError] = useState<Error | null>(null);

    const chatParent = useRef<HTMLUListElement>(null)
    const [showError, setShowError] = useState<boolean>(false);

    // 输入框变化
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value);
    };

    // 提交表单
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;
        messagesHandler(input);
    };

    const messagesHandler = async (message: string) => {
        setIsLoading(true);
        setMessages(prev => [...prev, { role: 'user', content: message }]);
        try {
            // 调用客户端API 获取数据
            setMessages(prev => [...prev, { role: 'assistant', content: message }]);
            setInput('');
        } catch (err: any) {
            setError(err);
        } finally {
            setIsLoading(false);
        }
    }

    // 重新加载（重发最后一条用户消息）
    const reload = async () => {
        const lastUserMsg = [...messages].reverse().find(m => m.role === 'user');
        if (!lastUserMsg) return;
        messagesHandler(lastUserMsg.content);
    };

  useEffect(() => {
    const domNode = chatParent.current;
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (error) {
      setShowError(true);
      const timer = setTimeout(() => setShowError(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  return (
    <main className="flex flex-col w-full min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      {/* Header with upgraded gradient and logo */}
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

      {showError && (
        <Alert variant="destructive" className="w-full max-w-4xl mx-auto mt-2">
          <AlertDescription>
            {error?.message || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Chat messages area */}
      <section className="flex-grow px-4 py-6">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ul
            ref={chatParent}
            className="flex-grow mb-4 p-4 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100 dark:border-purple-900/30 overflow-y-auto flex flex-col gap-6"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="relative mb-6">
                  <Sparkles className="h-16 w-16 text-purple-400" />
                  <div className="absolute -inset-4 bg-purple-300/20 rounded-full blur-md -z-10 animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  Welcome to ChatDefi!
                </h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Your intelligent conversation partner. Ask me anything to get
                  started!
                </p>
                <div className="mt-6 grid grid-cols-2 gap-2 max-w-md">
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800/30">
                    "Explain quantum computing"
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800/30">
                    "Write a short poem"
                  </div>
                </div>
              </div>
            ) : (
              messages.map((m, index) => (
                <li
                  key={index}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`
                                            max-w-[80%] rounded-2xl p-4 shadow-md
                                            ${
                                              m.role === "user"
                                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-tr-none border border-purple-400"
                                                : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-none"
                                            }
                                        `}
                  >
                    <p
                      className={`whitespace-pre-wrap ${
                        m.role === "user"
                          ? "text-white"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {m.content}
                    </p>
                  </div>
                </li>
              ))
            )}
            {isLoading && (
              <li className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-2xl rounded-tl-none p-4 max-w-[80%] shadow-md">
                  <div className="flex items-center space-x-2">
                    <div
                      className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                      style={{ animationDelay: "600ms" }}
                    ></div>
                  </div>
                </div>
              </li>
            )}
          </ul>

          {/* Input form with enhanced design */}
          <div className="sticky bottom-0 p-4 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100 dark:border-purple-800/30">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <Input
                className="flex-1 bg-purple-50/70 dark:bg-slate-700/80 border-slate-200 dark:border-slate-600 focus-visible:ring-purple-500 rounded-lg py-2 px-4"
                placeholder="Ask anything..."
                value={input}
                onChange={handleInputChange}
                disabled={isLoading}
              />
              {messages.length > 0 && (
                <Button
                  type="button"
                  onClick={() => reload()}
                  className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200"
                  size="icon"
                >
                  <RefreshCw className="h-5 w-5" />
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white shadow-md"
              >
                {isLoading ? (
                  "Thinking..."
                ) : (
                  <>
                    <Send className="h-5 w-5" /> Send
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
