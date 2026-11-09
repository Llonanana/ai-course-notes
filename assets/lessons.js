// ===== 講義清單（全站唯一的資料來源）=====
// 新增講義：在 LESSONS 加一筆，依週次由小到大排列。
// unit 必須是 UNITS 裡的其中一個 id。
// 首頁卡片、搜尋、進度、週次選單、上一週／下一週都會自動更新。

window.UNITS = [
  { id: "start",  name: "起步",       desc: "為什麼要懂原理、課程怎麼上" },
  { id: "theory", name: "AI 原理",    desc: "神經網路、生成模型、LLM、Transformer" },
  { id: "build",  name: "動手應用",   desc: "打造對話機器人、RAG 與知識庫" },
  { id: "agent",  name: "AI Agent",   desc: "教 AI 用我們的方法做事" }
];

window.LESSONS = [
  {
    week: 1, slug: "01-no-anxiety", unit: "start",
    title: "如何不焦慮地學 AI",
    summary: "懂原理就不焦慮：現代 AI 只是一個呆萌型 AI 機器人。",
    tags: ["學習地圖", "呆萌型 AI", "Colab"]
  },
  {
    week: 2, slug: "02-neural-network", unit: "theory",
    title: "神經網路的概念",
    summary: "神經網路是一台函數學習機，靠 loss 與梯度下降慢慢學會。",
    tags: ["神經元", "Softmax", "梯度下降"]
  },
  {
    week: 3, slug: "03-randomness", unit: "theory",
    title: "AI 為什麼每次都不一樣？",
    summary: "生成式 AI 的隨機性，來自「依機率抽樣」與隨機的潛在向量。",
    tags: ["GAN", "Cross Entropy", "機率抽樣"]
  },
  {
    week: 4, slug: "04-next-token", unit: "theory",
    title: "LLM 只是在猜下一個字？",
    summary: "LLM 是看過超多文字的接話高手，溫度與 top-p 決定它怎麼選字。",
    tags: ["LLM", "Temperature", "Embedding"]
  },
  {
    week: 5, slug: "05-attention", unit: "theory",
    title: "AI 怎麼記得前面說過什麼？",
    summary: "從 RNN 到 Transformer：注意力機制讓每個字都能回頭看全文。",
    tags: ["RNN", "Attention", "Transformer"]
  },
  {
    week: 6, slug: "06-chatbot", unit: "build",
    title: "打造自己的對話機器人",
    summary: "用 system prompt 給 AI 人設，再用 AISuite 寫出自己的聊天機器人。",
    tags: ["System Prompt", "AISuite", "負責任使用"]
  },
  {
    week: 7, slug: "07-rag", unit: "build",
    title: "讓 AI 看懂你的世界",
    summary: "用 RAG 把你的資料找出來塞進 prompt，讓 AI 根據事實回答。",
    tags: ["RAG", "向量資料庫", "LLM Wiki"]
  },
  {
    week: 8, slug: "08-agent-patterns", unit: "agent",
    title: "教 AI 做事的方法",
    summary: "AI Agent 的四種設計模式：反思、工具、規劃、多代理合作。",
    tags: ["AI Agent", "Tool Use", "Vibe Coding"]
  },
  {
    week: 9, slug: "09-boss", unit: "agent",
    title: "換你當老闆：Agentic Work 與 AI 工作現場",
    summary: "從「問 AI」變成「交辦給 AI」，學會當一個說清楚的好老闆。",
    tags: ["Agentic AI", "Harness", "AGENTS.md"]
  }
];
