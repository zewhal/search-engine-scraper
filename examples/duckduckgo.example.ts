import { duckduckgo } from "../src/search-engine/duckduckgo";
import { createPatchrightClient } from "../src/client";
import type { SERPQueryParams } from "../src/types/serp";

async function duckduckgo_scrape(){
    const { page, browser } = await createPatchrightClient({headless: false})
    const queryParams: SERPQueryParams = {
        query: "site:instagram.com \"Influencer\"",
        page: 0,
        pageStart: 0,
    }
    const results = await duckduckgo(page, queryParams)

    console.log(results);

    browser.close()
    
}   
duckduckgo_scrape()