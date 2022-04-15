import stream from "stream";
import util from "util";

export function finished<Input, Output>(typedStream: Readable<Output> | Transform<Input, Output> | Writable<Input>): Promise<void> {
    return util.promisify(stream.finished)(typedStream as stream.Readable | stream.Transform | stream.Writable);
}

export class Readable<Output> extends stream.Readable {
    public static from<Output>(iterable: Iterable<Output> | AsyncIterable<Output>, options?: stream.ReadableOptions): Readable<Output> {
        return stream.Readable.from(iterable);
    }

    public read(size?: number): Output {
        return super.read(size);
    }

    public unshift(chunk: Output, encoding?: BufferEncoding): void {
        return super.unshift(chunk, encoding);
    }

    public push(chunk: Output, encoding?: BufferEncoding): boolean {
        return super.push(chunk, encoding);
    }

    public [Symbol.asyncIterator](): AsyncIterableIterator<Output> {
        return super[Symbol.asyncIterator]();
    }
}

type TransformCallback<Output> = (error?: Error | null | undefined, data?: Output) => void;

export class Transform<Input, Output> extends stream.Transform {
    public read(size?: number): Output {
        return super.read(size);
    }

    public unshift(chunk: Output, encoding?: BufferEncoding): void {
        return super.unshift(chunk, encoding);
    }

    public push(chunk: Output, encoding?: BufferEncoding): boolean {
        return super.push(chunk, encoding);
    }

    public [Symbol.asyncIterator](): AsyncIterableIterator<Output> {
        return super[Symbol.asyncIterator]();
    }

    public _transform(chunk: Input, encoding: BufferEncoding, callback: TransformCallback<Output>): void {
        return super._transform(chunk, encoding, callback);
    }

    public _write(chunk: Input, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        return super._write(chunk, encoding, callback);
    }

    public _writev?(
        chunks: Array<{
            chunk: Input;
            encoding: BufferEncoding;
        }>,
        callback: (error?: Error | null) => void
    ): void {
        return super._writev?.(chunks, callback);
    }

    public write(chunk: Input, callback?: WritableCallback): boolean;
    public write(chunk: Input, encoding: BufferEncoding, callback?: WritableCallback): boolean;
    public write(chunk: Input, encoding?: BufferEncoding | WritableCallback, callback?: WritableCallback): boolean {
        if (encoding) {
            return super.write(chunk, encoding as BufferEncoding, callback);
        }

        return super.write(chunk, encoding as unknown as WritableCallback);
    }
}

type WritableCallback = (error: Error | null | undefined) => void;

export class Writable<Input> extends stream.Writable {
    public _write(chunk: Input, encoding: BufferEncoding, callback: (error?: Error | null) => void): void {
        return super._write(chunk, encoding, callback);
    }

    public _writev?(
        chunks: Array<{
            chunk: Input;
            encoding: BufferEncoding;
        }>,
        callback: (error?: Error | null) => void
    ): void {
        return super._writev?.(chunks, callback);
    }

    public write(chunk: Input, callback?: WritableCallback): boolean;
    public write(chunk: Input, encoding: BufferEncoding, callback?: WritableCallback): boolean;
    public write(chunk: Input, encoding?: BufferEncoding | WritableCallback, callback?: WritableCallback): boolean {
        if (encoding) {
            return super.write(chunk, encoding as BufferEncoding, callback);
        }

        return super.write(chunk, encoding as unknown as WritableCallback);
    }
}
