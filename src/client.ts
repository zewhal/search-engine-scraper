import { createCuimpHttp, type CuimpHttp, type CuimpDescriptor, type CuimpOptions } from "cuimp";
import { chromium, type Browser, type LaunchOptions, type Page } from "patchright";

export function createCuimpClient(descriptor?: CuimpDescriptor): CuimpHttp {
    const options: CuimpOptions = {
        descriptor: descriptor ?? { browser: "chrome", version: "123" }
    };
    return createCuimpHttp(options);
}


export async function createPatchrightClient(args: LaunchOptions): Promise<{ page: Page; browser: Browser }> {
    const browser = await chromium.launch(args);
    const page = await browser.newPage();

    return { page, browser };
}