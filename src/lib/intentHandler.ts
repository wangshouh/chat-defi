export interface Intent<T> {
  name: string;
  confidence: number;
  handler: (message: string) => Promise<T>;
}

export class IntentRecognizer {
  private intents: Intent<any>[] = [];

  // 注册意图处理器
  registerIntent(intent: Intent<any>) {
    this.intents.push(intent);
  }

  // 分析消息意图
  async analyzeIntent(message: string): Promise<Intent<any> | null> {
    if (!this.intents.length) {
      return null;
    }

    const recognizedIntents = this.intents.map((intent) => ({
      ...intent,
      confidence: this.calculateConfidence(message, intent.name),
    }));

    // 选择置信度最高的意图
    const bestIntent = recognizedIntents.reduce((prev, current) =>
      current.confidence > prev.confidence ? current : prev
    );

    // 确保返回值始终是 Intent 或 null
    return bestIntent && bestIntent.confidence > 0.5 ? bestIntent : null;
  }

  private calculateConfidence(message: string, intentName: string): number {
    // 关键词组和权重配置
    const keywordPatterns = {
      protocol: {
        keywords: ["defi", "protocol", "协议", "向", "使用"],
        compounds: ["向.*协议", "使用.*协议"],
        platforms: ["morpho", "aave", "compound"],
        weight: {
          basic: 0.3,
          compound: 0.5,
          platform: 0.2,
        },
      },
      market: {
        keywords: ["market", "price", "市场", "价格", "利率", "收益"],
        compounds: ["市场.*情况", "当前.*利率"],
        platforms: ["市场", "金库"],
        weight: {
          basic: 0.4,
          compound: 0.4,
          platform: 0.2,
        },
      },
      supply: {
        keywords: ["supply", "deposit", "存款", "供应", "提供", "存入"],
        compounds: ["存入.*资产", "提供.*资产", "向.*提供"],
        assets: ["eth", "usdc", "usdt", "dai"],
        weight: {
          basic: 0.3,
          compound: 0.5,
          asset: 0.2,
        },
      },
    };

    const pattern = keywordPatterns[intentName as keyof typeof keywordPatterns];
    if (!pattern) return 0;

    let score = 0;
    const normalizedMessage = message.toLowerCase();

    // 基础关键词匹配
    const basicMatch = pattern.keywords.some((keyword) =>
      normalizedMessage.includes(keyword)
    );
    if (basicMatch) score += pattern.weight.basic;

    // 复合短语匹配
    const compoundMatch = pattern.compounds.some((compound) =>
      new RegExp(compound).test(normalizedMessage)
    );
    if (compoundMatch) score += pattern.weight.compound;

    // 平台/资产匹配
    const platformOrAssetMatch = (
      "platforms" in pattern
        ? pattern.platforms
        : "assets" in pattern
        ? pattern.assets
        : []
    ).some((item: string) => normalizedMessage.includes(item.toLowerCase()));
    if (platformOrAssetMatch)
      score +=
        "platform" in pattern.weight
          ? pattern.weight.platform
          : pattern.weight.asset;

    // 上下文相关性判断
    if (
      intentName === "supply" &&
      normalizedMessage.includes("向") &&
      normalizedMessage.includes("提供")
    ) {
      score += 0.2;
    }

    return Math.min(score, 1); // 确保分数不超过1
  }
}
