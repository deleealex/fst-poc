import * as fastCsv from "fast-csv";

import { SupportedFormat } from "../SupportedTypes";
import { ParseFormats } from "./ParseTypes";
import { Transform } from "../../helpers/stream";

export function parse<Output extends Object>({ format, options }: ParseFormats): Transform<Buffer | string, Output> {
    switch (format) {
        case SupportedFormat.Csv:
            return fastCsv.parse(options) as Transform<Buffer | string, Output>;
        case SupportedFormat.Json:
            return new Transform({
                objectMode: true,
                transform: (chunk: Buffer | string, encoding: BufferEncoding, next: (error?: Error | null, chunk?: Output) => void) => {
                    try {
                        next(null, JSON.parse(chunk.toString()) as Output);
                    } catch (error) {
                        if (options?.ignoreError) {
                            return next();
                        }

                        next(error as Error);
                    }
                }
            });
    }
}
