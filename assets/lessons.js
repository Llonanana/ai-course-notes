// 講義清單：新增講義時只要在這裡加一筆（依週次排序）
// 首頁卡片與每頁的上一週／下一週導覽都由這份清單自動產生
window.LESSONS = [
  {
    week: 9,
    slug: "09-boss",
    title: "換你當老闆：Agentic Work 與 AI 工作現場",
    summary: "從「問 AI」變成「交辦給 AI」，學會當一個說清楚的好老闆。",
    tags: ["Agentic AI", "Harness", "AGENTS.md"]
  }
];

(function () {
  const pad = (n) => String(n).padStart(2, "0");
  const inLessons = location.pathname.includes("/lessons/");
  const base = inLessons ? "" : "lessons/";

  // 首頁：產生講義卡片
  const list = document.getElementById("lesson-list");
  if (list) {
    list.innerHTML = window.LESSONS.map((l) => `
      <a class="lesson-card" href="${base}${l.slug}.html">
        <span class="week-tag">WEEK ${pad(l.week)}</span>
        <h3>${l.title}</h3>
        <p>${l.summary}</p>
        <ul class="tags">${l.tags.map((t) => `<li>${t}</li>`).join("")}</ul>
      </a>`).join("");
    const count = document.getElementById("lesson-count");
    if (count) count.textContent = window.LESSONS.length;
  }

  // 講義頁：產生上一週／下一週
  const pager = document.querySelector(".pager[data-current]");
  if (pager) {
    const i = window.LESSONS.findIndex((l) => l.slug === pager.dataset.current);
    const prev = window.LESSONS[i - 1];
    const next = window.LESSONS[i + 1];
    pager.innerHTML = `
      ${prev ? `<a href="${prev.slug}.html">← WEEK ${pad(prev.week)}<span>${prev.title}</span></a>` : "<span></span>"}
      <a class="home" href="../index.html">回目錄</a>
      ${next ? `<a href="${next.slug}.html" class="next">WEEK ${pad(next.week)} →<span>${next.title}</span></a>` : "<span></span>"}`;
  }
})();
