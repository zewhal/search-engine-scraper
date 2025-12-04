import { createCuimpClient } from "../src/client";
import type { SERPQueryParams } from "../src/types/serp";
import { ecosia } from "../src/search-engine/ecosia";

async function scrape_ecosia() {
  // Create a real CuimpHttp client
  const client = createCuimpClient({});

  // Define your query parameters
  const queryParams: SERPQueryParams = {
    query: "site:instagram.com \"collab\" ",
    page: 2,       // number of pages to scrape
    pageStart: 0   // start from page 0 (Ecosia uses zero-index)
  };

  // Optional headers and proxy
  const headers = {
    "User-Agent": "Mozilla/5.0 (Bun/Node)"
  };
  const proxy = ""; // leave empty if not using proxy

  try {
    // Call ecosia scraper
    const result = await ecosia(client, queryParams, headers, proxy);

    // Display results
    console.log(`Engine: ${result.engine}`);
    console.log(`Query: ${result.query}`);
    console.log(`Page count: ${result.page}`);
    console.log("Results:");
    result.results.forEach(r => {
      console.log(`${r.position}. ${r.title} — ${r.url}`);
      if (r.snippet) console.log(`   Snippet: ${r.snippet}`);
    });
  } catch (error) {
    console.error("Error scraping Ecosia:", error);
  }
}

// Run scrape_ecosia
scrape_ecosia();
