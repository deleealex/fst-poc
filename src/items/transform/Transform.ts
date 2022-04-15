import events from "events";

import { Transform } from "../../helpers/stream";

export function transform<Input, Output>(
    callbackFn: (chunk: Input) => Output | Promise<Output> | Generator<Output, void, void> | AsyncGenerator<Output, void, void>
): Transform<Input, Output> {
    const transformStream = new Transform({
        objectMode: true,
        transform: async function (chunk: Input, encoding: BufferEncoding, next: (error?: Error | null, chunk?: Output) => void) {
            // @ts-ignore
            switch (callbackFn[Symbol.toStringTag]) {
                case "GeneratorFunction":
                case "AsyncGeneratorFunction":
                    const callbackResult = callbackFn as (chunk: Input) => Generator<Output, void, void> | AsyncGenerator<Output, void, void>;
                    for await (const value of callbackResult(chunk)) {
                        if (!this.push(value)) {
                            await events.once(transformStream, "drain");
                        }
                    }
                    break;
                case "AsyncFunction":
                default:
                    const value = (await callbackFn(chunk)) as Output;
                    if (!this.push(value)) {
                        await events.once(transformStream, "drain");
                    }
            }

            next();
        }
    });

    return transformStream;
}
