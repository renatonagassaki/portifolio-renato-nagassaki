# Renato Nagassaki — Portfolio

Landing page profissional construída com **React + Three.js + SCSS**, replicando o
layout dark/futurista com elementos 3D (cubo do Hero, busto em partículas na seção
Sobre, e rede neural 3D no AI & Observability Lab).

## Seções incluídas
- Header fixo com navegação e botão "Baixar CV"
- Hero com cubo 3D wireframe + cards flutuantes de métricas
- Sobre mim (com timeline "Minha jornada" e avatar 3D em partículas)
- Skills (tabs por categoria: Frontend, Backend, Cloud, DevOps, Observability, AI, Data Engineering)
- Projetos em destaque (grid de cards)
- Experiência profissional (timeline: vivo/Telefônica Brasil + Equifax/BoaVista)
- AI & Observability Lab (esfera de rede neural 3D + painéis de anomalias/logs)
- Blog (grid de artigos)
- Contato (formulário funcional em memória + informações de contato)
- Footer com redes sociais e navegação

## Como rodar

```bash
npm install
npm run dev
```

Abre em `http://localhost:5173`.

## Build de produção

```bash
npm run build
npm run preview
```

## Stack
- **React 18** — componentização das seções
- **Three.js** puro (sem react-three-fiber) — cenas 3D montadas via `useRef` + `useEffect`
  em `src/three/*.js`, reutilizadas pelo componente genérico `Canvas3D`
- **Sass/SCSS** — `src/styles/main.scss` com tokens (cores, radius, fontes) em `:root`
- **Vite** — build tool

## Personalização rápida
- Cores e tokens: topo de `src/styles/main.scss` (`:root { ... }`)
- Conteúdo (textos, projetos, experiências, posts do blog): arrays no topo de `src/App.jsx`
- Link do CV / redes sociais: componentes `Header` e `Footer` em `src/App.jsx`
