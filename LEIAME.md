# Site LEALI Cosméticos

Site estático (HTML, CSS e JavaScript puros), baseado no Manual de Identidade Visual (Edição 02).

- **Tipografia:** Cormorant Garamond (títulos) e Manrope (interface), carregadas do Google Fonts.
- **Cores:** somente a paleta do manual (ameixa, marfim, cacau, cobre rosado, lavanda e champagne), sem neons.
- **Páginas:** `index.html`, `colecoes.html` (loja com filtro por linha), `sobre.html`, `contato.html`.

## Como ver
Abra `index.html` no navegador, ou rode um servidor local nesta pasta:

    python -m http.server 5173

e acesse http://localhost:5173.

## O que editar
- `js/config.js`: e-mail, Instagram e WhatsApp reais da marca.
- `js/products.js`: linhas, produtos, volumes e preços (hoje são **ilustrativos**).
- `assets/logo.svg` e `assets/logo-sm.png`: assinatura oficial (não redesenhar).

## Observações
- A sacola e os formulários funcionam sem servidor: o pedido e a mensagem de contato abrem o e-mail do cliente com o texto preenchido. Para pagamento online ou envio automático, é preciso integrar um serviço.
- Para publicar, envie a pasta inteira para qualquer hospedagem estática (Vercel, Netlify, GitHub Pages etc.).
