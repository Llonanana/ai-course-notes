// ===== 全站互動功能（不需要為新講義修改這個檔案）=====
// 首頁：學習進度、搜尋、標籤篩選、單元分組卡片
// 講義頁：週次選單、閱讀進度條、自動目錄、已讀標記、上一週／下一週、鍵盤 ← →、回到頂端
// 共用：深色／淺色切換
(function () {
  const L = window.LESSONS || [];
  const U = window.UNITS || [];
  const pad = (n) => String(n).padStart(2, "0");
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  // --- 瀏覽器儲存（失敗時安靜略過）---
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const readSet = () => new Set(store.get("acn-read", []));
  const saveRead = (set) => store.set("acn-read", [...set]);

  const inLessons = location.pathname.includes("/lessons/");
  const lessonHref = (slug) => (inLessons ? "" : "lessons/") + slug + ".html";
  const homeHref = inLessons ? "../index.html" : "index.html";

  // --- 主題切換 ---
  const root = document.documentElement;
  const savedTheme = store.get("acn-theme", null);
  if (savedTheme) root.dataset.theme = savedTheme;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  const nav = $(".topbar nav");
  if (nav) {
    const btn = document.createElement("button");
    btn.className = "icon-btn";
    const paint = () => { btn.textContent = isDark() ? "☀" : "☾"; btn.setAttribute("aria-label", isDark() ? "切換成淺色" : "切換成深色"); btn.title = btn.getAttribute("aria-label"); };
    btn.addEventListener("click", () => { root.dataset.theme = isDark() ? "light" : "dark"; store.set("acn-theme", root.dataset.theme); paint(); });
    paint();
    nav.appendChild(btn);
  }

  // ================= 首頁 =================
  const units = $("#units");
  if (units) {
    const done = readSet();
    const last = store.get("acn-last", null);

    // 學習進度
    const n = L.filter((l) => done.has(l.slug)).length;
    const setText = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    setText("stat-done", n);
    setText("stat-total", L.length);
    const bar = $("#stat-bar"); if (bar) bar.style.width = (L.length ? (n / L.length) * 100 : 0) + "%";
    const dots = $("#stat-dots");
    if (dots) dots.innerHTML = L.map((l) => `<a href="${lessonHref(l.slug)}" class="${done.has(l.slug) ? "done" : ""}" title="WEEK ${pad(l.week)} ${esc(l.title)}${done.has(l.slug) ? "（已讀）" : ""}">${pad(l.week)}</a>`).join("");

    // 繼續閱讀按鈕
    const cont = $("#continue");
    if (cont) {
      const target = L.find((l) => l.slug === last) || L.find((l) => !done.has(l.slug)) || L[0];
      if (target) {
        cont.href = lessonHref(target.slug);
        cont.innerHTML = `${last ? "繼續閱讀" : "從這裡開始"}：WEEK ${pad(target.week)} →`;
      }
    }

    // 卡片
    units.innerHTML = U.map((u) => {
      const items = L.filter((l) => l.unit === u.id);
      if (!items.length) return "";
      return `<section class="unit" data-unit="${u.id}">
        <div class="unit-head"><h2>${esc(u.name)}</h2><span>${esc(u.desc)}</span></div>
        <div class="lesson-grid">${items.map((l) => `
          <a class="lesson-card${done.has(l.slug) ? " done" : ""}" href="${lessonHref(l.slug)}" data-search="${esc((l.title + " " + l.summary + " " + l.tags.join(" ")).toLowerCase())}" data-tags="${esc(l.tags.join("|"))}">
            <span class="num">${pad(l.week)}</span>
            <h3>${esc(l.title)}</h3>
            <p>${esc(l.summary)}</p>
            <ul class="tags">${l.tags.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>
            <span class="check">✓ 已讀</span>
          </a>`).join("")}
        </div></section>`;
    }).join("");

    // 篩選：搜尋＋單元
    const input = $("#q");
    const chips = $("#chips");
    let unitFilter = "all";
    if (chips) {
      chips.innerHTML = [`<button class="chip" data-u="all" aria-pressed="true">全部</button>`]
        .concat(U.map((u) => `<button class="chip" data-u="${u.id}" aria-pressed="false">${esc(u.name)}</button>`)).join("");
      chips.addEventListener("click", (e) => {
        const b = e.target.closest(".chip"); if (!b) return;
        unitFilter = b.dataset.u;
        $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
        apply();
      });
    }
    function apply() {
      const q = (input ? input.value : "").trim().toLowerCase();
      let shown = 0;
      $$(".unit", units).forEach((sec) => {
        let vis = 0;
        $$(".lesson-card", sec).forEach((c) => {
          const ok = (unitFilter === "all" || sec.dataset.unit === unitFilter) && (!q || q.split(/\s+/).every((w) => c.dataset.search.includes(w)));
          c.hidden = !ok; if (ok) vis++;
        });
        sec.hidden = vis === 0; shown += vis;
      });
      const empty = $("#empty"); if (empty) empty.style.display = shown ? "none" : "block";
    }
    if (input) {
      input.addEventListener("input", apply);
      document.addEventListener("keydown", (e) => {
        if (e.key === "/" && document.activeElement !== input) { e.preventDefault(); input.focus(); }
        if (e.key === "Escape" && document.activeElement === input) { input.value = ""; apply(); input.blur(); }
      });
    }
  }

  // ================= 講義頁 =================
  const pager = $(".pager[data-current]");
  if (pager) {
    const slug = pager.dataset.current;
    const i = L.findIndex((l) => l.slug === slug);
    const cur = L[i];
    const prev = L[i - 1];
    const next = L[i + 1];
    store.set("acn-last", slug);

    // 週次選單（放在頂部列）
    if (nav) {
      const sel = document.createElement("select");
      sel.className = "week-select";
      sel.setAttribute("aria-label", "切換週次");
      sel.innerHTML = L.map((l) => `<option value="${l.slug}"${l.slug === slug ? " selected" : ""}>W${pad(l.week)} ${esc(l.title)}</option>`).join("");
      sel.addEventListener("change", () => { location.href = sel.value + ".html"; });
      nav.insertBefore(sel, nav.firstChild);
    }

    // 閱讀進度條
    const topbar = $(".topbar");
    if (topbar) {
      const p = document.createElement("div"); p.className = "progress"; topbar.appendChild(p);
      const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; p.style.width = (h > 0 ? (scrollY / h) * 100 : 0) + "%"; };
      addEventListener("scroll", upd, { passive: true }); upd();
    }

    // 頁首加上單元與閱讀時間
    const head = $(".lesson-head");
    const main = $("main.lesson");
    if (head && cur) {
      const unit = U.find((u) => u.id === cur.unit);
      const crumb = document.createElement("div");
      crumb.className = "crumb";
      crumb.innerHTML = `<a href="${homeHref}">所有講義</a> / ${esc(unit ? unit.name : "")}`;
      head.insertBefore(crumb, head.firstChild);
      const chars = (main ? main.innerText : "").replace(/\s/g, "").length;
      const meta = document.createElement("div");
      meta.className = "meta";
      meta.innerHTML = `<span>⏱ 約 ${Math.max(3, Math.round(chars / 400))} 分鐘讀完</span><span>📖 第 ${i + 1} / ${L.length} 篇</span>`;
      head.appendChild(meta);
    }

    // 自動目錄（讀取每個區塊的 h2）
    const blocks = $$("main section.block[id]");
    if (main && blocks.length) {
      const toc = document.createElement("nav");
      toc.className = "toc"; toc.setAttribute("aria-label", "本頁目錄");
      toc.innerHTML = `<h4>本頁目錄</h4><ol>${blocks.map((b) => {
        const h = $("h2", b); const t = h ? h.textContent.replace(/^\s*\d+\s*/, "") : b.id;
        return `<li><a href="#${b.id}" data-id="${b.id}">${esc(t)}</a></li>`;
      }).join("")}</ol>`;
      main.insertBefore(toc, head ? head.nextSibling : main.firstChild);
      const links = $$("a", toc);
      const io = new IntersectionObserver((ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            links.forEach((a) => a.classList.toggle("active", a.dataset.id === en.target.id));
            const act = links.find((a) => a.dataset.id === en.target.id);
            if (act && getComputedStyle(toc).position === "sticky" && act.scrollIntoView && innerWidth <= 1060) {
              const ol = act.closest("ol"); ol.scrollTo({ left: act.offsetLeft - 16, behavior: "smooth" });
            }
          }
        });
      }, { rootMargin: "-30% 0px -60% 0px" });
      blocks.forEach((b) => io.observe(b));
    }

    // 測驗：全部展開／收起
    const quiz = $("#quiz");
    if (quiz) {
      const tools = document.createElement("div");
      tools.className = "quiz-tools";
      tools.innerHTML = `<button class="link-btn" type="button">全部展開答案</button>`;
      const btn = $("button", tools);
      btn.addEventListener("click", () => {
        const ds = $$("details", quiz); const open = !ds.every((d) => d.open);
        ds.forEach((d) => (d.open = open)); btn.textContent = open ? "全部收起" : "全部展開答案";
      });
      const h = $("h2", quiz); h.after(tools);
    }

    // 已讀按鈕
    const finish = document.createElement("div");
    finish.className = "finish";
    const doneBtn = document.createElement("button");
    doneBtn.className = "done-btn"; doneBtn.type = "button";
    const paintDone = () => { const on = readSet().has(slug); doneBtn.setAttribute("aria-pressed", String(on)); doneBtn.textContent = on ? "✓ 已讀完這一週" : "標記為已讀"; };
    doneBtn.addEventListener("click", () => { const s = readSet(); s.has(slug) ? s.delete(slug) : s.add(slug); saveRead(s); paintDone(); });
    paintDone();
    finish.appendChild(doneBtn);
    pager.before(finish);

    // 上一週／下一週
    pager.innerHTML = `
      ${prev ? `<a href="${prev.slug}.html" class="prev">← WEEK ${pad(prev.week)}<span>${esc(prev.title)}</span></a>` : ""}
      ${next ? `<a href="${next.slug}.html" class="next">WEEK ${pad(next.week)} →<span>${esc(next.title)}</span></a>` : `<a href="${homeHref}" class="next">回到目錄 →<span>你已經看到最新一週了</span></a>`}
      <div class="hint">小技巧：按鍵盤 <kbd>←</kbd> <kbd>→</kbd> 切換上一週／下一週</div>`;
    document.addEventListener("keydown", (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey || /input|select|textarea/i.test(document.activeElement.tagName)) return;
      if (e.key === "ArrowLeft" && prev) location.href = prev.slug + ".html";
      if (e.key === "ArrowRight" && next) location.href = next.slug + ".html";
    });
  }

  // --- 回到頂端 ---
  const top = document.createElement("button");
  top.className = "to-top"; top.type = "button"; top.setAttribute("aria-label", "回到頂端"); top.textContent = "↑";
  top.addEventListener("click", () => scrollTo({ top: 0 }));
  document.body.appendChild(top);
  addEventListener("scroll", () => top.classList.toggle("show", scrollY > 600), { passive: true });
})();
