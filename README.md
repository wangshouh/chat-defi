<div align="center">
  <h1>✨ Chat DeFi✨</h1>
  <p>
    <strong>通过AI对链上协议分析, 协助给出协议交互决策</strong>
  </p>

  <br />

</div>

## 描述

在以太坊 Pectra 升级后，以太坊引入了 EIP7702 特性，该特性允许 EOA 以智能合约的形式对外发起交易。我们意识到 EIP7702 对用户体验有着重大升级。在此认识上，我们认为用户可以与 LLM 进行交流生成一系列动作，并最终由 EOA 对应的 EIP7702 合约一并发起交易。对于任何实现用户与 LLM 交流获得 calldata，我们引入了 Router 架构的 Agent 模型，用户首先向 LLM 描述需求，LLM 会将这些自然语言需求转化为标准动作，比如 Morpho::supply 代表向 Morpho 协议提供资产。LLM 将自然语言转化为标准动作序列后，我们为每一个动作编写了对应的模块，每一个模块都具有协议数据获取、调用数据获取和调用 calldata 生成三部分功能，实现为用户提供协议数据辅助用户决策并最终将用户决策转化为 calldata 的功能。所有动作的 calldata 会最终被聚合用户地址对应的 EIP7702 合约执行。

在未来，我们希望建立更加通用的标准化动作列表和动作对应的模块，由此实现更加通用的链上交互体验。

## 本次黑客松进展
本次黑客松内完成了简单的 EIP7702 账户合约的编写，该合约可以在 [此链接](https://github.com/wangshouh/EIP7702Smplify) 内找到，已在 Base 主网部署，合约地址是 `0x7E60f3282C10f22B0887BB856445f49044E45A60` 完成了 Morpho 的基础交互模块，并完成了项目的前端的编程


## 技术栈

- **Frontend**: TypeScript, Next.js 14+, Tailwind CSS
- **Contract**: solidity
