"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MarkdownRenderer } from "@/components/ui/MarkdownRenderer";
import { IntentRecognizer } from "@/lib/intentHandler";
import { marketIntent, protocolIntent } from "@/lib/intents";
import { RefreshCw, Send, Sparkles } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

export function Chat() {
  const account = useAccount();

  const publicClient = usePublicClient();

  // 聊天消息
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  // 输入框内容
  const [input, setInput] = useState("");
  // 是否加载中
  const [isLoading, setIsLoading] = useState(false);
  // 错误对象
  const [error, setError] = useState<Error | null>(null);

  const chatParent = useRef<HTMLUListElement>(null);
  const [showError, setShowError] = useState<boolean>(false);

  // 输入框变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  // 提交表单
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    if (account.status !== "connected") {
      setError(new Error("Please connect the wallet first"));
      return;
    }
    // 调用消息处理函数
    messagesHandler(input);
  };

  // 创建意图识别器实例
  const intentRecognizer = useMemo(() => {
    const recognizer = new IntentRecognizer();
    recognizer.registerIntent(protocolIntent);
    recognizer.registerIntent(marketIntent);
    return recognizer;
  }, []);
  const handleExampleClicked = useCallback((example: string) => {
    messagesHandler(example);
  }, []);

  const messagesHandler = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    try {
      // 调用客户端API 获取数据
      const intent = await intentRecognizer.analyzeIntent(message);
      if (!intent) {
        throw new Error("抱歉，我无法理解您的请求。请换个方式提问。");
      }

      const response = await intent.handler(message);
      if (!response) {
        throw new Error("处理请求时发生错误");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response },
      ]);

      setInput("");
    } catch (err: any) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  // 重新加载（重发最后一条用户消息）
  const reload = async () => {
    const lastUserMsg = [...messages].reverse().find((m) => m.role === "user");
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
    <>
      {showError && (
        <Alert variant="destructive" className="w-full max-w-4xl mx-auto mt-2">
          <AlertDescription>
            {error?.message || "Something went wrong. Please try again."}
          </AlertDescription>
        </Alert>
      )}

      {/* Chat messages area */}
      <section className="flex-1 px-4 py-6 overflow-hidden">
        <div className="max-w-4xl mx-auto h-full flex flex-col">
          <ul
            ref={chatParent}
            className="flex-1 mb-4 p-4 bg-white/80 dark:bg-slate-800/70 backdrop-blur-sm rounded-lg shadow-lg border border-purple-100 dark:border-purple-900/30 overflow-y-auto"
          >
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-8">
                <div className="relative mb-6">
                  <Sparkles className="h-16 w-16 text-purple-400" />
                  <div className="absolute -inset-4 bg-purple-300/20 rounded-full blur-md -z-10 animate-pulse"></div>
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-slate-800 dark:text-slate-200">
                  Welcome to ChatDeFi!
                </h2>
                {/* <p className="text-slate-600 dark:text-slate-400 max-w-md">
                  Your intelligent conversation partner. Ask me anything to get
                  started!
                </p> */}
                <div className="mt-6 grid grid-cols-1 gap-2 max-w-md">
                  <div
                    className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors border border-purple-200 dark:border-purple-800/30"
                    onClick={() =>
                      handleExampleClicked(
                        "我希望向 Morpho 协议中的金库提供 USDC 资产"
                      )
                    }
                  >
                    "我希望向 Morpho 协议中的金库提供 USDC 资产"
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
                    className={` mt-4
                                            max-w-[80%] rounded-2xl p-4 shadow-md
                                            ${
                                              m.role === "user"
                                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-tr-none border border-purple-400"
                                                : "bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-tl-none"
                                            }
                                        `}
                  >
                    <div
                      className={`whitespace-pre-wrap ${
                        m.role === "user"
                          ? "text-white"
                          : "text-slate-800 dark:text-slate-100"
                      }`}
                    >
                      {m.role === "assistant" ? (
                        <MarkdownRenderer content={m.content} />
                      ) : (
                        m.content
                      )}
                    </div>
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
    </>
  );
}
