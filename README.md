# AI 課堂筆記本

把 AI 課程每週內容整理成「一週一頁」的講義網站。

🔗 網站：https://llonanana.github.io/ai-course-notes/

## 這個專案的重點

這不是只做一個網頁，而是建立一套規則，讓 AI 之後能照同一套方式持續新增講義。規則都寫在 [`AGENTS.md`](./AGENTS.md)。

## 網站功能

- 首頁依單元分組，可搜尋、可篩選，還會顯示學習進度與「繼續閱讀」
- 講義頁有自動目錄、閱讀進度條、週次選單、已讀標記
- 鍵盤 ← → 切換上一週／下一週，首頁按 `/` 直接搜尋
- 支援手機與深色模式

## 怎麼新增一週講義

1. 把上課資料（PDF、筆記）放進 `source/`
2. 對 AI 說：

   > 請先讀 AGENTS.md，再根據 source/ 裡的資料新增第 10 週講義。

3. 檢查 AI 回報的變更，用瀏覽器打開 `index.html` 確認
4. commit 並 push 到 GitHub，網站會自動更新

## 結構

| 路徑 | 用途 |
|------|------|
| `AGENTS.md` | AI 的員工手冊（專案規則） |
| `CLAUDE.md` | 指向 AGENTS.md |
| `index.html` | 首頁，自動列出所有講義 |
| `lessons/` | 每週講義 |
| `templates/lesson-template.html` | 新講義的範本 |
| `assets/style.css` | 全站樣式 |
| `assets/lessons.js` | 單元與講義清單（新增講義只改這裡） |
| `assets/app.js` | 搜尋、學習進度、目錄、深色模式、鍵盤切換等互動功能 |
