import events from "events";

import { Transform } from "../../helpers/stream";

export function filter<Input>(callbackFn: (chunk: Input) => boolean | Promise<boolean>): Transform<Input, Input> {
    const transformStream = new Transform({
        objectMode: true,
        transform: async function (chunk: Input, encoding: BufferEncoding, next: (error?: Error | null, chunk?: Input) => void) {
            if (await callbackFn(chunk)) {
                if (!this.push(chunk)) {
                    await events.once(transformStream, "drain");
                }
            }

            next();
        }
    });

    return transformStream;
}
