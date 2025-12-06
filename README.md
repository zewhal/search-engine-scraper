# search-engine-scraper

⚠️ **Responsible Usage Warning**  
This library **does not handle rate limiting**. You are responsible for using it **ethically and respectfully**, following the terms of service of any website you scrape.  

**Important:** Search engines may block your IP if you send too many requests too quickly. Use responsibly and consider spreading out requests over time.

---

A lightweight search engine scraping library for Bun projects.  
Uses Cuimp + Cheerio

---

## Features

- Fast HTML scraping using Cuimp + Cheerio  
- TypeScript project  
- Easy to extend and customize

---

## Installation

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

## Structure

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

## Notes

- Run unit tests with:

```bash
bun test
```