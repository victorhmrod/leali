/* LEALI — comportamento do site: cabeçalho/rodapé, catálogo, carrinho, formulários. */
(function () {
  "use strict";
  const { LINES, PRODUCTS, byId, money, packSVG } = window.LEALI;
  const CFG = window.LEALI_CONFIG || {};
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const page = document.body.dataset.page || "home";
  document.documentElement.classList.add("js");

  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const params = new URLSearchParams(location.search);
  const currentLine = LINES[params.get("linha")] ? params.get("linha") : "";

  /* ---------------- Cabeçalho e rodapé ---------------- */
  const ICON_BAG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg>';
  const ICON_MENU = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 8h16M4 16h16"/></svg>';
  const ICON_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  function renderHeader() {
    const host = $("#site-header");
    if (!host) return;
    const lineLinks = Object.values(LINES).map((l) =>
      `<a href="colecoes.html?linha=${l.key}"${page === "colecoes" && currentLine === l.key ? ' aria-current="page"' : ""}>${l.nome}</a>`).join("");
    host.innerHTML = `
      <a class="skip" href="#conteudo">Pular para o conteúdo</a>
      <header class="site-header">
        <div class="container header-inner">
          <a class="brand" href="index.html" aria-label="LEALI Cosméticos — página inicial"><img src="assets/logo-sm.png" alt="LEALI Cosméticos" width="72" height="68"></a>
          <nav class="main-nav" id="main-nav" aria-label="Principal">
            ${lineLinks}
            <a class="nav-extra" href="sobre.html"${page === "sobre" ? ' aria-current="page"' : ""}>Sobre</a>
            <a class="nav-extra" href="contato.html"${page === "contato" ? ' aria-current="page"' : ""}>Contato</a>
          </nav>
          <div class="header-actions">
            <div class="header-links">
              <a href="sobre.html"${page === "sobre" ? ' aria-current="page"' : ""}>Sobre</a>
              <a href="contato.html"${page === "contato" ? ' aria-current="page"' : ""}>Contato</a>
            </div>
            <button class="icon-btn" type="button" id="open-cart" aria-label="Abrir sacola" aria-haspopup="dialog">${ICON_BAG}<span class="cart-count" data-n="0" aria-hidden="true">0</span></button>
            <button class="icon-btn menu-btn" type="button" id="menu-btn" aria-label="Abrir menu" aria-expanded="false" aria-controls="main-nav">${ICON_MENU}</button>
          </div>
        </div>
      </header>`;
    const btn = $("#menu-btn"), nav = $("#main-nav");
    btn.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", open);
      btn.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      btn.innerHTML = open ? ICON_X : ICON_MENU;
    });
    nav.addEventListener("click", (e) => { if (e.target.closest("a")) nav.classList.remove("is-open"); });
  }

  function renderFooter() {
    const host = $("#site-footer");
    if (!host) return;
    const lines = Object.values(LINES).map((l) => `<li><a href="colecoes.html?linha=${l.key}">${l.nome} · ${l.categoria}</a></li>`).join("");
    const contacts = [
      CFG.email ? `<li><a href="mailto:${esc(CFG.email)}">${esc(CFG.email)}</a></li>` : "",
      CFG.instagram ? `<li><a href="${esc(CFG.instagram)}" target="_blank" rel="noopener">Instagram</a></li>` : "",
      CFG.whatsapp ? `<li><a href="https://wa.me/${esc(CFG.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a></li>` : ""
    ].join("");
    host.innerHTML = `
      <footer class="site-footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-brand">
              <div class="footer-logo"><img src="assets/logo-sm.png" alt="LEALI Cosméticos" width="114" height="107" loading="lazy"></div>
              <p>Beleza com identidade. Uma marca de beleza contemporânea para acompanhar diferentes formas de expressão, autocuidado e rotina.</p>
              <p class="footer-tag">Sua beleza. Sua essência.</p>
            </div>
            <div class="footer-col"><h4>Linhas</h4><ul>${lines}</ul></div>
            <div class="footer-col"><h4>A marca</h4><ul>
              <li><a href="sobre.html">Sobre a LEALI</a></li>
              <li><a href="sobre.html#voz">Nossa voz</a></li>
              <li><a href="sobre.html#identidade">Identidade</a></li>
            </ul></div>
            <div class="footer-col"><h4>Atendimento</h4><ul>
              <li><a href="contato.html">Fale conosco</a></li>
              <li><a href="contato.html#duvidas">Dúvidas frequentes</a></li>
              ${contacts}
            </ul></div>
          </div>
          <div class="footer-bottom">
            <div class="row"><span>© ${CFG.ano || new Date().getFullYear()} LEALI Cosméticos</span><span>Todos os direitos reservados</span></div>
            <p>Catálogo, volumes e preços ilustrativos. Alegações como “hipoalergênico” ou “dermatologicamente testado” só são utilizadas quando a formulação e a documentação permitem.</p>
          </div>
        </div>
      </footer>`;
  }

  /* ---------------- Toast ---------------- */
  let toastEl, toastT;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement("div"); toastEl.className = "toast"; toastEl.setAttribute("role", "status"); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add("is-visible");
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove("is-visible"), 2600);
  }

  /* ---------------- Carrinho ---------------- */
  const KEY = "leali-cart-v1";
  let cart = [];
  try { cart = (JSON.parse(localStorage.getItem(KEY)) || []).filter((i) => byId[i.id] && i.qty > 0); } catch (e) { cart = []; }
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(cart)); } catch (e) { /* sem armazenamento */ } };
  const count = () => cart.reduce((n, i) => n + i.qty, 0);
  const total = () => cart.reduce((n, i) => n + i.qty * byId[i.id].preco, 0);
  let view = "cart";

  const overlay = document.createElement("div"); overlay.className = "overlay";
  const drawer = document.createElement("aside"); drawer.className = "drawer"; drawer.setAttribute("role", "dialog"); drawer.setAttribute("aria-modal", "true"); drawer.setAttribute("aria-label", "Sua sacola"); drawer.setAttribute("aria-hidden", "true");
  drawer.innerHTML = `
    <div class="drawer-head"><h2 id="drawer-title">Sua sacola</h2><button class="icon-btn" type="button" id="close-cart" aria-label="Fechar sacola">${ICON_X}</button></div>
    <div class="drawer-body" id="drawer-body"></div>
    <div class="drawer-foot" id="drawer-foot"></div>`;
  document.body.append(overlay, drawer);
  let lastFocus = null;

  function openCart() {
    lastFocus = document.activeElement; view = view === "done" ? "cart" : view;
    renderCart(); overlay.classList.add("is-open"); drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); document.body.classList.add("no-scroll");
    setTimeout(() => $("#close-cart").focus(), 50);
  }
  function closeCart() {
    overlay.classList.remove("is-open"); drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); document.body.classList.remove("no-scroll");
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  overlay.addEventListener("click", closeCart);
  $("#close-cart").addEventListener("click", closeCart);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });

  function updateBadge() {
    const n = count();
    $$(".cart-count").forEach((b) => { b.textContent = n; b.dataset.n = n; });
    const btn = $("#open-cart"); if (btn) btn.setAttribute("aria-label", `Abrir sacola (${n} ${n === 1 ? "item" : "itens"})`);
  }

  function addToCart(id, qty = 1, open = true) {
    const it = cart.find((i) => i.id === id);
    if (it) it.qty = Math.min(20, it.qty + qty); else cart.push({ id, qty });
    save(); updateBadge(); view = "cart";
    if (open) openCart(); else toast("Adicionado à sacola");
  }

  function orderText(nome) {
    const lines = cart.map((i) => { const p = byId[i.id]; return `• ${i.qty}x ${p.nome} (LEALI ${LINES[p.linha].nome}, ${p.volume}) — ${money(i.qty * p.preco)}`; });
    return `Olá! Gostaria de fazer o pedido abaixo:\n\n${lines.join("\n")}\n\nTotal: ${money(total())}\n\nNome: ${nome}`;
  }

  function renderCart() {
    const bodyEl = $("#drawer-body"), foot = $("#drawer-foot"), title = $("#drawer-title");
    title.textContent = view === "checkout" ? "Finalizar pedido" : view === "done" ? "Obrigada!" : "Sua sacola";

    if (view === "done") {
      bodyEl.innerHTML = `<div class="cart-empty"><p class="h3">Obrigada por escolher a LEALI.</p><p>Abrimos seu e-mail com o resumo do pedido para você enviar à nossa equipe. Esta é uma vitrine de demonstração: ainda não há pagamento online.</p></div>`;
      foot.innerHTML = `<button class="btn btn--primary btn--block" type="button" id="done-close">Continuar explorando</button>`;
      $("#done-close").onclick = () => { view = "cart"; closeCart(); };
      return;
    }
    if (!cart.length) {
      bodyEl.innerHTML = `<div class="cart-empty"><p class="h3">Sua sacola está vazia.</p><p>Explore as cinco linhas LEALI e escolha o que combina com a sua rotina.</p><a class="btn btn--primary" href="colecoes.html">Explorar coleções</a></div>`;
      foot.innerHTML = ""; foot.style.display = "none"; return;
    }
    foot.style.display = "";

    if (view === "checkout") {
      bodyEl.innerHTML = `
        <form class="checkout-form" id="checkout-form" novalidate>
          <button class="back-link" type="button" id="back-cart">← Voltar à sacola</button>
          <div class="field"><label for="co-nome">Nome</label><input class="input" id="co-nome" name="nome" autocomplete="name" required></div>
          <div class="field"><label for="co-email">E-mail</label><input class="input" id="co-email" name="email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="co-tel">WhatsApp (opcional)</label><input class="input" id="co-tel" name="tel" type="tel" autocomplete="tel"></div>
          <p class="form-note">Ao enviar, abrimos seu e-mail com o resumo do pedido. Pagamento e entrega são combinados com a equipe LEALI.</p>
        </form>`;
      foot.innerHTML = `<div class="sum-row"><span>Total</span><strong>${money(total())}</strong></div><button class="btn btn--primary btn--block" type="submit" form="checkout-form">Enviar pedido por e-mail</button>`;
      $("#back-cart").onclick = () => { view = "cart"; renderCart(); };
      $("#checkout-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const f = e.target, nome = f.nome.value.trim(), email = f.email.value.trim();
        if (!nome || !/^\S+@\S+\.\S+$/.test(email)) { toast("Preencha nome e e-mail válidos."); (!nome ? f.nome : f.email).focus(); return; }
        let text = orderText(nome) + `\nE-mail: ${email}` + (f.tel.value.trim() ? `\nWhatsApp: ${f.tel.value.trim()}` : "");
        const to = CFG.email || "";
        location.href = `mailto:${to}?subject=${encodeURIComponent("Pedido LEALI")}&body=${encodeURIComponent(text.replace(/\n/g, "\r\n"))}`;
        cart = []; save(); updateBadge(); view = "done"; renderCart();
      });
      return;
    }

    bodyEl.innerHTML = cart.map((i) => {
      const p = byId[i.id], L = LINES[p.linha];
      return `<div class="cart-item" data-id="${p.id}">
        <div class="cart-thumb" style="--t:${L.tint}">${packSVG(p)}</div>
        <div><div class="ci-name">${esc(p.nome)}</div><div class="ci-meta">LEALI ${L.nome} · ${esc(p.volume)}</div>
          <div class="qty qty--sm" role="group" aria-label="Quantidade de ${esc(p.nome)}"><button type="button" data-act="dec" aria-label="Diminuir">−</button><output>${i.qty}</output><button type="button" data-act="inc" aria-label="Aumentar">+</button></div><br>
          <button class="ci-remove" type="button" data-act="rm">Remover</button></div>
        <div class="ci-price">${money(i.qty * p.preco)}</div></div>`;
    }).join("");
    foot.innerHTML = `<div class="sum-row"><span>Subtotal</span><strong>${money(total())}</strong></div><button class="btn btn--primary btn--block" type="button" id="go-checkout">Finalizar pedido</button><button class="back-link" type="button" id="keep-shopping" style="justify-self:center">Continuar comprando</button>`;
    $("#go-checkout").onclick = () => { view = "checkout"; renderCart(); };
    $("#keep-shopping").onclick = closeCart;
  }

  drawer.addEventListener("click", (e) => {
    const b = e.target.closest("[data-act]"); if (!b) return;
    const row = b.closest(".cart-item"); if (!row) return;
    const it = cart.find((i) => i.id === row.dataset.id); if (!it) return;
    if (b.dataset.act === "inc") it.qty = Math.min(20, it.qty + 1);
    if (b.dataset.act === "dec") it.qty = Math.max(1, it.qty - 1);
    if (b.dataset.act === "rm") cart = cart.filter((i) => i !== it);
    save(); updateBadge(); renderCart();
  });

  /* ---------------- Cards e diálogo de produto ---------------- */
  function cardHTML(p) {
    const L = LINES[p.linha];
    return `<article class="card reveal" data-id="${p.id}">
      <button class="card-visual" type="button" data-open="${p.id}" style="--t:${L.tint}" aria-label="Ver detalhes de ${esc(p.nome)}">${packSVG(p)}<span class="card-tag">${L.nome}</span></button>
      <div class="card-body">
        <button class="card-title" type="button" data-open="${p.id}">${esc(p.nome)}</button>
        <div class="card-meta">${esc(p.funcao)} · ${esc(p.volume)}</div>
        <p class="card-desc">${esc(p.desc)}</p>
        <div class="card-foot"><span class="price">${money(p.preco)}</span><button class="btn btn--primary btn--sm" type="button" data-add="${p.id}">Adicionar</button></div>
      </div></article>`;
  }

  const pd = document.createElement("dialog"); pd.setAttribute("aria-label", "Detalhes do produto"); document.body.appendChild(pd);
  function openProduct(id) {
    const p = byId[id]; if (!p) return; const L = LINES[p.linha]; let qty = 1;
    pd.innerHTML = `<div class="pd">
      <button class="icon-btn pd-close" type="button" aria-label="Fechar">${ICON_X}</button>
      <div class="pd-visual" style="--t:${L.tint}">${packSVG(p)}</div>
      <div class="pd-info">
        <span class="eyebrow">LEALI ${L.nome} · ${esc(L.categoria)}</span>
        <h3>${esc(p.nome)}</h3>
        <p class="lead" style="font-size:1rem">${esc(p.desc)}</p>
        <ul class="pd-list">${p.notas.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>
        <div class="card-meta">${esc(p.funcao)} · ${esc(p.volume)}</div>
        <div class="pd-buy">
          <div class="pd-price">${money(p.preco)}</div>
          <div class="pd-row">
            <div class="qty" role="group" aria-label="Quantidade"><button type="button" data-q="-1" aria-label="Diminuir">−</button><output id="pd-qty">1</output><button type="button" data-q="1" aria-label="Aumentar">+</button></div>
            <button class="btn btn--primary" type="button" id="pd-add" style="flex:1">Adicionar à sacola</button>
          </div>
          <p class="pd-fine">Imagem ilustrativa. Volume, composição e alegações dependem de fornecedores e regularização.</p>
        </div></div></div>`;
    pd.showModal();
    $(".pd-close", pd).onclick = () => pd.close();
    $$("[data-q]", pd).forEach((b) => b.onclick = () => { qty = Math.max(1, Math.min(20, qty + Number(b.dataset.q))); $("#pd-qty", pd).textContent = qty; });
    $("#pd-add", pd).onclick = () => { pd.close(); addToCart(id, qty); };
  }
  pd.addEventListener("click", (e) => { if (e.target === pd) pd.close(); });

  document.addEventListener("click", (e) => {
    const add = e.target.closest("[data-add]"); if (add) { addToCart(add.dataset.add, 1, true); return; }
    const op = e.target.closest("[data-open]"); if (op) { openProduct(op.dataset.open); return; }
    if (e.target.closest("#open-cart")) openCart();
  });

  /* ---------------- Revelar ao rolar ---------------- */
  let io;
  function observe(scope = document) {
    const els = $$(".reveal:not(.is-in)", scope);
    if (!("IntersectionObserver" in window)) { els.forEach((el) => el.classList.add("is-in")); return; }
    io = io || new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------- Páginas ---------------- */
  function initHome() {
    const u = $("#universes");
    if (u) u.innerHTML = Object.values(LINES).map((l) => `
      <a class="universe reveal" href="colecoes.html?linha=${l.key}" style="--c:${l.cor}">
        <div class="universe-bar"></div>
        <div class="universe-body"><span class="brandword">LEALI</span><span class="lname">${l.nome}</span><span class="cat">${l.categoria}</span><span class="desc">${l.desc}</span><span class="tick"></span></div>
      </a>`).join("");
    const f = $("#featured-grid");
    if (f) f.innerHTML = PRODUCTS.filter((p) => p.destaque).slice(0, 4).map(cardHTML).join("");
  }

  function initShop() {
    const grid = $("#shop-grid"); if (!grid) return;
    let line = currentLine, sort = "rel";
    const chips = $("#chips"), banner = $("#line-banner"), sortEl = $("#sort");
    chips.innerHTML = `<button class="chip" type="button" data-line="" aria-pressed="false">Todos</button>` +
      Object.values(LINES).map((l) => `<button class="chip" type="button" data-line="${l.key}" style="--c:${l.cor}" aria-pressed="false"><i></i>${l.nome}</button>`).join("");

    function render() {
      $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", String(c.dataset.line === line)));
      let list = PRODUCTS.filter((p) => !line || p.linha === line);
      if (sort === "asc") list = list.slice().sort((a, b) => a.preco - b.preco);
      if (sort === "desc") list = list.slice().sort((a, b) => b.preco - a.preco);
      if (sort === "az") list = list.slice().sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
      const L = LINES[line];
      banner.hidden = !L;
      if (L) { banner.style.setProperty("--t", L.tint); banner.style.setProperty("--c", L.cor);
        banner.innerHTML = `<div><span class="eyebrow">${L.categoria}</span><h2>LEALI ${L.nome}</h2><p>${L.frase} ${L.desc}.</p></div><span class="stamp">${list.length} ${list.length === 1 ? "produto" : "produtos"}</span>`; }
      grid.innerHTML = list.length ? list.map(cardHTML).join("") : `<p class="empty">Nenhum produto encontrado.</p>`;
      $("#count").textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
      document.title = L ? `LEALI ${L.nome} · ${L.categoria} — LEALI Cosméticos` : "Coleções — LEALI Cosméticos";
      $$("#main-nav a").forEach((a) => { if (a.href.includes("colecoes.html")) { const k = new URL(a.href).searchParams.get("linha"); k === line ? a.setAttribute("aria-current", "page") : a.removeAttribute("aria-current"); } });
      observe(grid);
    }
    chips.addEventListener("click", (e) => {
      const c = e.target.closest(".chip"); if (!c) return; line = c.dataset.line;
      history.replaceState(null, "", line ? `?linha=${line}` : location.pathname); render();
    });
    sortEl.addEventListener("change", () => { sort = sortEl.value; render(); });
    render();
  }

  function initForms() {
    $$("form[data-form='newsletter']").forEach((f) => f.addEventListener("submit", (e) => {
      e.preventDefault(); const em = f.email.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(em)) { toast("Digite um e-mail válido."); f.email.focus(); return; }
      f.reset(); const ok = $(".form-ok", f.parentElement); if (ok) ok.classList.add("is-visible");
    }));
    const c = $("#contact-form");
    if (c) c.addEventListener("submit", (e) => {
      e.preventDefault();
      const nome = c.nome.value.trim(), email = c.email.value.trim(), msg = c.msg.value.trim();
      if (!nome || !/^\S+@\S+\.\S+$/.test(email) || !msg) { toast("Preencha nome, e-mail e mensagem."); return; }
      const assunto = c.assunto.value || "Contato pelo site";
      const body = `${msg}\n\n— ${nome}\n${email}` + (c.tel.value.trim() ? `\n${c.tel.value.trim()}` : "");
      location.href = `mailto:${CFG.email || ""}?subject=${encodeURIComponent("LEALI · " + assunto)}&body=${encodeURIComponent(body.replace(/\n/g, "\r\n"))}`;
      $("#contact-ok").classList.add("is-visible"); c.reset();
    });
    $$("[data-email]").forEach((el) => { el.textContent = CFG.email || ""; if (el.tagName === "A") el.href = `mailto:${CFG.email}`; });
  }

  renderHeader(); renderFooter(); updateBadge();
  if (page === "home") initHome();
  if (page === "colecoes") initShop();
  initForms(); observe();
})();
