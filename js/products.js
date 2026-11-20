/* Catálogo ilustrativo LEALI — linhas, produtos e ilustrações de embalagem.
   Produtos, volumes e preços são exemplos (conforme o manual: "ilustrativos"). */
(function () {
  "use strict";

  const LINES = {
    color: { key: "color", nome: "Color", categoria: "Maquiagem", desc: "Gloss, batons e blushes", frase: "Cor para expressar quem você é.", cor: "#8E4C6A", tint: "#EBD9DF" },
    skin:  { key: "skin",  nome: "Skin",  categoria: "Cuidados faciais", desc: "Limpeza, hidratação e séruns", frase: "Cuidado que acompanha sua rotina.", cor: "#B4A3BD", tint: "#E8DFE6" },
    body:  { key: "body",  nome: "Body",  categoria: "Cuidados corporais", desc: "Loções, sabonetes e esfoliantes", frase: "Rituais simples para o corpo todo.", cor: "#B99D83", tint: "#EBDACF" },
    scent: { key: "scent", nome: "Scent", categoria: "Perfumaria", desc: "Perfumes e body mists", frase: "Uma presença que permanece.", cor: "#40263D", tint: "#E4DAD6" },
    hair:  { key: "hair",  nome: "Hair",  categoria: "Cuidados capilares", desc: "Shampoo, máscara e finalização", frase: "Cabelo cuidado, do jeito que é.", cor: "#8E8180", tint: "#E5DFDC" }
  };

  // tipo = forma da embalagem | tom = cor da tampa / produto
  const PRODUCTS = [
    { id: "color-gloss", linha: "color", nome: "Gloss Cobre", tipo: "lip", tom: "#CF947C", funcao: "Gloss labial", volume: "5 ml", preco: 39.9,
      desc: "Brilho confortável com acabamento cetinado.", destaque: true,
      notas: ["Aplicação fácil, sem pressa", "Tom rosado-cobre que combina com tudo", "Cabe na bolsa e na rotina"] },
    { id: "color-batom", linha: "color", nome: "Batom Cetim Ameixa", tipo: "stick", tom: "#7A3F5E", funcao: "Batom", volume: "3,5 g", preco: 49.9,
      desc: "Cor profunda, textura macia e acabamento cetim.",
      notas: ["Acabamento cetim", "Pigmento intenso em poucas camadas", "Tom inspirado na ameixa imperial"] },
    { id: "color-blush", linha: "color", nome: "Blush Cremoso Rosado", tipo: "compact", tom: "#CF947C", funcao: "Blush", volume: "6 g", preco: 54.9, destaque: true,
      desc: "Textura cremosa que se esfuma com os dedos.",
      notas: ["Esfuma com facilidade", "Efeito natural e luminoso, sem brilho exagerado", "Estojo prático para levar"] },
    { id: "color-fosco", linha: "color", nome: "Batom Líquido Nude", tipo: "lip", tom: "#B99D83", funcao: "Batom líquido", volume: "4 ml", preco: 44.9,
      desc: "Nude quente com acabamento aveludado.",
      notas: ["Acabamento aveludado", "Tom nude versátil", "Aplicador de precisão"] },

    { id: "skin-serum", linha: "skin", nome: "Sérum Hidratante", tipo: "serum", tom: "#40263D", funcao: "Sérum facial", volume: "30 ml", preco: 89.9, destaque: true,
      desc: "Textura leve para a rotina de cuidado diário.",
      notas: ["Textura leve", "Uso diário, manhã e noite", "Frasco com conta-gotas"] },
    { id: "skin-hidratante", linha: "skin", nome: "Hidratante Facial", tipo: "jar", tom: "#B4A3BD", funcao: "Hidratante facial", volume: "50 g", preco: 69.9, destaque: true,
      desc: "Textura leve para o uso diário.",
      notas: ["Textura leve", "Uso diário", "Pote de 50 g"] },
    { id: "skin-limpeza", linha: "skin", nome: "Gel de Limpeza Facial", tipo: "tube", tom: "#B4A3BD", funcao: "Limpeza facial", volume: "120 ml", preco: 49.9,
      desc: "O primeiro passo de uma rotina simples.",
      notas: ["Espuma suave", "Para usar todos os dias", "Bisnaga prática"] },

    { id: "body-locao", linha: "body", nome: "Loção Corporal", tipo: "pump", tom: "#B99D83", funcao: "Loção hidratante", volume: "250 ml", preco: 59.9, destaque: true,
      desc: "Absorção rápida e toque macio depois do banho.",
      notas: ["Textura fluida", "Embalagem com válvula pump", "Perfume suave"] },
    { id: "body-sabonete", linha: "body", nome: "Sabonete Líquido", tipo: "pump", tom: "#CF947C", funcao: "Sabonete líquido", volume: "300 ml", preco: 34.9,
      desc: "Limpeza cuidadosa com espuma cremosa.",
      notas: ["Espuma cremosa", "Perfume suave", "Válvula pump"] },
    { id: "body-esfoliante", linha: "body", nome: "Esfoliante Corporal", tipo: "jar", tom: "#B99D83", funcao: "Esfoliante", volume: "200 g", preco: 64.9,
      desc: "Um ritual de textura para renovar o toque da pele.",
      notas: ["Partículas suaves", "Uso semanal", "Pote com 200 g"] },
    { id: "body-creme", linha: "body", nome: "Creme Corporal", tipo: "jar", tom: "#B99D83", funcao: "Creme corporal", volume: "200 g", preco: 74.9,
      desc: "Conforto cremoso para o corpo todo.",
      notas: ["Textura cremosa", "Toque macio", "Pote com 200 g"] },

    { id: "scent-edp", linha: "scent", nome: "Eau de Parfum", tipo: "perfume", tom: "#CF947C", funcao: "Perfume", volume: "50 ml", preco: 189.9, destaque: true,
      desc: "Uma presença que permanece, sem exageros.",
      notas: ["Fragrância sofisticada e envolvente", "Fixação para o dia todo", "Frasco com tampa em cobre rosado"] },
    { id: "scent-hydramist", linha: "scent", nome: "Hydra Mist", tipo: "perfume", tom: "#B4A3BD", funcao: "Body mist hidratante", volume: "100 ml", preco: 69.9, destaque: true,
      img: "assets/produtos/hydra-mist.webp", tint: "#E1D6EE",
      desc: "Perfume hidratante corporal com Aloe Vera e Pantenol: fragrância delicada e sensação de pele fresca, hidratada e perfumada ao longo do dia.",
      notas: ["Hidrata a pele, sem ressecar", "Com Aloe Vera & Pantenol", "Spray fino e leve, para uso diário", "Vegano e não testado em animais"],
      mais: {
        fragrancia: "Floral frutado suave · doce leve · fresco e delicado",
        piramide: [["Topo", "Bergamota, chá branco, pêra"], ["Corpo", "Aloe Vera, lavanda, flor de lírio"], ["Fundo", "Baunilha, musk, sândalo"]],
        uso: "Borrife sobre o corpo sempre que desejar.",
        precaucoes: "Uso externo. Manter fora do alcance de crianças. Evitar contato com os olhos. Em caso de irritação, suspender o uso.",
        composicao: "Alcohol, Aqua, Parfum, Aloe Barbadensis Leaf Juice, Panthenol, Polysorbate 20, Glycerin, Phenoxyethanol, Ethylhexylglycerin, Citric Acid, Linalool, Limonene, Coumarin."
      } },
    { id: "scent-mist", linha: "scent", nome: "Body Mist", tipo: "perfume", tom: "#B4A3BD", funcao: "Body mist", volume: "200 ml", preco: 79.9,
      desc: "Leveza perfumada para usar quando quiser.",
      notas: ["Borrife após o banho", "Perfume leve", "Frasco de 200 ml"] },

    { id: "hair-shampoo", linha: "hair", nome: "Shampoo", tipo: "pump", tom: "#8E8180", funcao: "Shampoo", volume: "300 ml", preco: 54.9,
      desc: "Limpeza cuidadosa para o dia a dia.",
      notas: ["Espuma macia", "Uso frequente", "Válvula pump"] },
    { id: "hair-mascara", linha: "hair", nome: "Máscara Capilar", tipo: "jar", tom: "#8E8180", funcao: "Máscara", volume: "250 g", preco: 74.9,
      desc: "Um momento de cuidado depois da lavagem.",
      notas: ["Textura cremosa", "Uso semanal", "Pote com 250 g"] },
    { id: "hair-finalizador", linha: "hair", nome: "Finalizador", tipo: "tube", tom: "#8E8180", funcao: "Finalizador", volume: "120 ml", preco: 59.9,
      desc: "Acabamento leve para os fios.",
      notas: ["Toque leve", "Para cabelo seco ou úmido", "Bisnaga de 120 ml"] }
  ];

  const byId = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
  const money = (v) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(v);

  /* ---------- Ilustrações de embalagem (SVG inline, cores planas) ---------- */
  const IV = "#FEF8F3", STROKE = "#D9CEC4", CACAU = "#35251E", AMEIXA = "#40263D", CHAMP = "#B99D83";
  const LOGO = "assets/logo-sm.png";
  const logoImg = (x, y, w) => `<image href="${LOGO}" x="${x}" y="${y}" width="${w}" height="${(w * 0.939).toFixed(1)}" preserveAspectRatio="xMidYMid meet"/>`;
  const txt = (x, y, s, size, extra = "") => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Manrope, system-ui, sans-serif" font-weight="700" font-size="${size}" letter-spacing="${(size * 0.3).toFixed(1)}" fill="${AMEIXA}" ${extra}>${s}</text>`;
  const body = (x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${IV}" stroke="${STROKE}" stroke-width="1.5"/>`;

  function packSVG(p) {
    if (p.img) return `<img src="${p.img}" alt="${p.nome} — ${p.funcao}, ${p.volume}" loading="lazy">`;
    const L = LINES[p.linha], tom = p.tom, name = L.nome.toUpperCase();
    let g = "";
    switch (p.tipo) {
      case "serum":
        g = `<rect x="94" y="46" width="52" height="26" rx="4" fill="${AMEIXA}"/><rect x="102" y="32" width="36" height="18" rx="3" fill="${CACAU}"/>` +
          body(60, 68, 120, 164, 18) + logoImg(80, 90, 80) +
          `<rect x="88" y="172" width="64" height="2" fill="${L.cor}"/>` + txt(120, 193, name, 10) + txt(120, 210, "SÉRUM", 7);
        break;
      case "jar":
        g = `<rect x="44" y="112" width="152" height="38" rx="9" fill="${tom}"/><rect x="44" y="140" width="152" height="10" fill="rgba(53,37,30,.10)"/>` +
          body(54, 146, 132, 86, 14) + logoImg(88, 152, 64) + txt(120, 226, name, 8);
        break;
      case "perfume":
        g = `<rect x="94" y="30" width="52" height="38" rx="5" fill="${tom}"/><rect x="108" y="66" width="24" height="22" fill="${CACAU}"/>` +
          body(54, 86, 132, 146, 14) + logoImg(78, 102, 84) + txt(120, 205, name, 10) + txt(120, 220, p.funcao === "Body mist" ? "BODY MIST" : "EAU DE PARFUM", 6.5);
        break;
      case "pump":
        g = `<rect x="106" y="78" width="28" height="22" fill="${CACAU}"/><rect x="92" y="60" width="64" height="20" rx="4" fill="${tom}"/><rect x="148" y="65" width="28" height="9" rx="3" fill="${tom}"/>` +
          body(62, 98, 116, 134, 16) + logoImg(82, 110, 76) + txt(120, 203, name, 9.5) + txt(120, 218, p.funcao.toUpperCase(), 6);
        break;
      case "tube":
        g = `<path d="M72 54 H168 L160 206 H80 Z" fill="${IV}" stroke="${STROKE}" stroke-width="1.5" stroke-linejoin="round"/>` +
          `<rect x="70" y="40" width="100" height="16" rx="3" fill="#EFE6DC" stroke="${STROKE}" stroke-width="1.5"/>` +
          `<rect x="80" y="204" width="80" height="28" rx="6" fill="${tom}"/>` +
          logoImg(90, 72, 60) + txt(120, 150, name, 9) + txt(120, 166, p.funcao.toUpperCase(), 6) + `<rect x="100" y="176" width="40" height="2" fill="${L.cor}"/>`;
        break;
      case "lip":
        g = `<rect x="98" y="40" width="44" height="50" rx="8" fill="${tom}"/><rect x="98" y="82" width="44" height="8" fill="rgba(53,37,30,.12)"/>` +
          body(94, 88, 52, 144, 10) +
          `<text transform="translate(125 210) rotate(-90)" font-family="Cormorant Garamond, Georgia, serif" font-size="15" letter-spacing="5" fill="${CACAU}">LEALI</text>`;
        break;
      case "stick":
        g = `<path d="M100 120 V80 Q100 60 120 54 Q140 60 140 80 V120 Z" fill="${tom}"/><rect x="96" y="118" width="48" height="14" rx="3" fill="${CHAMP}"/>` +
          `<rect x="92" y="130" width="56" height="102" rx="7" fill="${CACAU}"/><rect x="92" y="146" width="56" height="3" fill="${CHAMP}"/>` +
          `<text transform="translate(125 218) rotate(-90)" font-family="Cormorant Garamond, Georgia, serif" font-size="14" letter-spacing="4.5" fill="${CHAMP}">LEALI</text>`;
        break;
      case "compact":
        g = `<circle cx="120" cy="128" r="84" fill="${IV}" stroke="${STROKE}" stroke-width="1.5"/><circle cx="120" cy="128" r="68" fill="#EFE6DC"/><circle cx="120" cy="128" r="58" fill="${tom}"/>` +
          `<circle cx="120" cy="128" r="58" fill="none" stroke="rgba(254,248,243,.35)" stroke-width="1"/>` +
          `<text x="120" y="133" text-anchor="middle" font-family="Cormorant Garamond, Georgia, serif" font-size="17" letter-spacing="5" fill="${IV}">LEALI</text>`;
        break;
    }
    const ground = p.tipo === "compact" ? "" : `<ellipse cx="120" cy="234" rx="72" ry="5" fill="rgba(53,37,30,.10)"/>`;
    return `<svg viewBox="0 0 240 245" role="img" aria-label="Embalagem ilustrativa: ${p.nome}" xmlns="http://www.w3.org/2000/svg">${ground}${g}</svg>`;
  }

  window.LEALI = Object.assign(window.LEALI || {}, { LINES, PRODUCTS, byId, money, packSVG });
})();
