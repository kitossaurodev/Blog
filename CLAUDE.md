# CLAUDE.md — StatisticsReal

## Project Overview

StatisticsReal é um blog estático para publicação de textos de opinião científica sobre
Ciência e Clima. O design é inspirado no ClimateAudit.org: limpo, tradicional, focado
no conteúdo, com listagem cronológica de posts e navegação por categorias e tags.

## Tech Stack

- **Generator**: Hugo (static site generator)
- **Theme**: PaperMod
- **Deployment**: GitHub Pages
- **Comments**: Disqus
- **Platform**: Linux (WSL2)
- **Shell**: bash

## Installing Hugo (WSL2)

Hugo is not yet installed. Use the official binary for WSL2:

```bash
# Download latest Hugo extended (required for PaperMod SCSS)
wget https://github.com/gohugoio/hugo/releases/latest/download/hugo_extended_linux_amd64.tar.gz
tar -xzf hugo_extended_linux_amd64.tar.gz hugo
sudo mv hugo /usr/local/bin/
hugo version  # verificar instalação
```

## Project Structure

```
StatisticsReal/
├── hugo.toml              # Configuração principal do Hugo
├── content/
│   ├── posts/             # Posts do blog (.md) — conteúdo principal
│   └── about.md           # Página sobre
├── themes/
│   └── PaperMod/          # Git submodule — NÃO editar arquivos dentro desta pasta
├── static/                # Arquivos estáticos (imagens, favicon)
├── layouts/               # Overrides de templates (se necessário)
├── assets/                # Overrides de SCSS/JS (se necessário)
├── .github/
│   └── workflows/
│       └── hugo.yml       # Workflow de deploy para GitHub Pages
└── public/                # Saída do build — NÃO commitar no branch main
```

## Commands

- **Novo post**: `hugo new posts/nome-do-post.md`
- **Servidor local**: `hugo server -D` (inclui rascunhos)
- **Build**: `hugo --minify`
- **Preview com posts futuros**: `hugo server --buildFuture`

## Content Conventions

- Todo o conteúdo dos posts, títulos, descrições e front matter são escritos em **Português**
- Template de front matter para posts:

```yaml
---
title: "Título do Post"
date: 2026-01-01
draft: false
tags: ["clima", "ciência"]
categories: ["Opinião"]
description: "Breve descrição do post."
author: "Questioner"
---
```

- Slugs (URLs) usam letras minúsculas com hífens: `como-o-clima-muda.md`
- Posts ficam em `content/posts/`
- Imagens dos posts ficam em `static/images/posts/nome-do-post/`

## Hugo Configuration (hugo.toml)

Configurações principais para o `hugo.toml`:

```toml
baseURL = "https://<username>.github.io/StatisticsReal/"
languageCode = "pt-br"
title = "StatisticsReal"
theme = "PaperMod"
defaultContentLanguage = "pt-br"
hasCJKLanguage = false
paginate = 10

[params]
  ShowReadingTime = true
  ShowPostNavLinks = true
  ShowBreadCrumbs = true
  disqusShortname = "<your-disqus-shortname>"

[menu]
  [[menu.main]]
    name = "Posts"
    url = "/posts/"
    weight = 1
  [[menu.main]]
    name = "Categorias"
    url = "/categories/"
    weight = 2
  [[menu.main]]
    name = "Tags"
    url = "/tags/"
    weight = 3
  [[menu.main]]
    name = "Sobre"
    url = "/about/"
    weight = 4
```

## GitHub Pages Deployment

O site é publicado via GitHub Actions a cada push para o branch `main`.

Arquivo de workflow: `.github/workflows/hugo.yml`

```yaml
name: Deploy Hugo to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          submodules: true
          fetch-depth: 0
      - uses: peaceiris/actions-hugo@v3
        with:
          hugo-version: "latest"
          extended: true
      - run: hugo --minify
      - uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./public
```

## Disqus Comments

- O Disqus é configurado via o parâmetro `disqusShortname` no `hugo.toml`
- O PaperMod suporta Disqus nativamente — nenhum template customizado é necessário
- Para desabilitar comentários em um post específico, adicionar `comments: false` no front matter

## Author & Anonymity

- O autor do blog mantém identidade anônima
- Usar sempre um pseudônimo ou codinome no campo `author` do front matter e na configuração do Hugo
- Nunca incluir nome real, localização, afiliação institucional ou qualquer informação identificável no conteúdo, configuração ou metadados
- O campo `author` em `hugo.toml` e nos posts deve conter apenas o pen name escolhido
- A página `about.md` pode existir, mas não deve revelar a identidade real do autor

## Code Style & Conventions

- Arquivos de template Hugo (`.html`) usam indentação de 2 espaços
- Arquivos de configuração TOML usam indentação de 2 espaços
- Comentários de código em templates são escritos em **Português**
- Preferir `hugo.toml` em vez de `config.yaml` ou `config.json`
- O PaperMod é instalado como **git submodule** — nunca editar arquivos dentro de `themes/PaperMod/`
- Para sobrescrever templates do PaperMod, copiar o arquivo para `layouts/` e editar a cópia

## Rules & Boundaries

### ALWAYS:
- Escrever conteúdo, front matter e menus em Português
- Usar Hugo extended (necessário para compilação SCSS do PaperMod)
- Instalar PaperMod como git submodule: `git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod`
- Manter `public/` no `.gitignore` — o deploy é feito pelo GitHub Actions
- Usar `draft: true` em posts que ainda não estão prontos para publicação
- Usar sempre o pen name/pseudônimo do autor — nunca o nome real

### NEVER:
- Editar arquivos dentro de `themes/PaperMod/` diretamente
- Commitar o diretório `public/` no branch `main`
- Usar `config.yaml` — manter `hugo.toml`
- Adicionar conteúdo em inglês, a menos que explicitamente solicitado
- Incluir nome real, localização, e-mail, afiliação ou qualquer dado identificável do autor no conteúdo, configuração ou metadados do site

## Additional Context

- Objetivo de design: limpo, legível, focado no conteúdo — similar ao ClimateAudit.org
- Tópicos: Ciência e Clima — não limitado a sustentabilidade
- Público-alvo: leitores de língua portuguesa interessados em opinião científica
- O diretório `public/` é gerado no build e publicado via branch `gh-pages`
