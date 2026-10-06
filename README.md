# TechFlow Dashboard

Checkpoint 5 – FrontEnd Design. Dashboard responsivo da empresa fictícia TechFlow para acompanhar projetos, equipes e indicadores.

## Integrantes

- Eduardo Guzeli- RM 571143
- Gabriel Kenzo-  RM 569780

## Tecnologias utilizadas

- HTML5
- Tailwind CSS v4 (via plugin `@tailwindcss/vite`)
- JavaScript puro (sem framework)
- Vite (servidor de desenvolvimento)

## Como rodar

```bash
npm install
npm run dev
```

Depois é só abrir o endereço que o Vite mostrar no terminal (normalmente `http://localhost:5173`).

## Estrutura

```
├── index.html
├── src/
│   ├── style.css    (import do Tailwind + variante dark + animação do modal)
│   └── script.js    (sidebar, dropdown, tema, modal, validação e busca)
├── package.json
├── vite.config.js
└── README.md
```

## Principais recursos implementados

- **Layout:** navbar fixa no topo, sidebar, área principal, campo de busca e informações do usuário.
- **Indicadores:** 4 cards (projetos ativos, concluídos, tarefas pendentes e equipes) em CSS Grid.
- **Projetos:** 7 cards em Grid com tamanhos diferentes usando `col-span-*` e `row-span-*`, além de um feed de atividade recente com Flexbox.
- **Mobile-First:** o layout começa em 1 coluna e vai se expandindo com `sm:`, `md:`, `lg:`, `xl:` e `2xl:`.
- **Sidebar:** aparece normalmente no desktop e vira um menu deslizante com overlay no celular (abre/fecha com JavaScript).
- **Dropdown do usuário:** abre no clique, fecha clicando fora ou com `Esc`.
- **Modal de novo projeto:** campos de nome, responsável, categoria, prioridade, prazo e descrição, com validação visual (borda vermelha + mensagem de erro, borda verde quando está certo). O projeto criado aparece no grid, mas não é salvo em banco.
- **Tema Light | Dark | System:** usa a variante `dark:` do Tailwind, respeita a preferência do sistema no modo System e guarda a escolha no `localStorage`.
- **Estados e microinterações:** `hover:`, `focus:`, `active:`, `disabled:`, `group-hover:` (seta que aparece nos cards) e `peer-checked:` (botões de prioridade), com `transition`, `duration-*` e `ease-*`.
- **Busca:** filtra os cards de projeto enquanto digita.

## Link do GitHub

(https://cp-5-front-end-five.vercel.app/)

## Dificuldades encontradas

- Fazer o `dark:` funcionar pela classe em vez da preferência do sistema, porque no Tailwind v4 é preciso declarar a variante com `@custom-variant` no CSS.
- Montar o grid com cards de tamanhos diferentes sem deixar buracos entre eles nas telas grandes.
- Evitar o "piscão" branco ao carregar a página no tema escuro (resolvido aplicando o tema antes da renderização).
- Deixar o seletor de tema acessível no celular, já que a navbar fica apertada (foi colocado dentro do dropdown do usuário).
