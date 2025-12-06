import { createCuimpClient } from "../src/client";
import type { SERPQueryParams, SERPResponse } from "../src/types/serp";
import { brave } from "../src/search-engine/brave";

async function brave_scrape(){

    const client = createCuimpClient()

    const query: SERPQueryParams = {
        query: "Is Agartha real?",
        page:3,
        pageStart:0
    }

    const result: SERPResponse = await brave(client,query)

    console.log(result);
    

}
brave_scrape()