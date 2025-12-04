import { createCuimpHttp, type CuimpHttp, type CuimpDescriptor, type CuimpOptions } from "cuimp";

export function createClient(descriptor?: CuimpDescriptor): CuimpHttp {
    const options: CuimpOptions = {
        descriptor: descriptor ?? { browser: "chrome", version: "123" }
    };
    return createCuimpHttp(options);
}
