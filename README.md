# 🔍 search-engine-scraper

A lightweight search engine scraping library for Bun projects.  
Uses Cuimp + Cheerio for fast, non-JS sites and Patchright for real browser automation.

---

## ✨ Features

- Fast HTML scraping using Cuimp + Cheerio  
- Browser automation via Patchright  
- TypeScript project  
- Easy to extend and customize

---

## 🚀 Installation

Clone and install:

```bash
git clone https://github.com/zewhal/search-engine-scraper
cd search-engine-scraper
bun install
```

Use directly in another Bun project:

```bash
bun add https://github.com/zewhal/search-engine-scraper
```

---

## 📁 Structure

```
.
├─ index.ts              # Root entry file
├─ examples/             # Working example scripts
├─ src/
│  ├─ search-engine/     # Individual search engine scrapers
│  ├─ types/             # Shared TypeScript types
│  ├─ utils/             # Helpers (URL builder, etc.)
│  └─ client.ts          # Cuimp + Patchright client factories
└─ tests/                # Unit + optional integration tests
```

---

## 📌 Notes

- Integration tests using Patchright are skipped in CI due to browser dependency requirements.
- Run unit tests with:

```bash
bun test
```