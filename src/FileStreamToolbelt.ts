import { finished } from "./helpers/stream";
import { Pipeline, ResolvablePipeline, CollectResolvablePipeline, PipelineWithCompletion } from "./items/InternalTypes";
import { DownloaderLocalProvider, DownloaderAwsProvider, DownloaderProviders } from "./items/downloader/DownloaderTypes";
import { downloader } from "./items/downloader/Downloader";
import { ParseCsvFormat, ParseJsonFormat, ParseFormats } from "./items/parse/ParseTypes";
import { parse } from "./items/parse/Parse";
import { transform } from "./items/transform/Transform";
import { filter } from "./items/filter/Filter";
import { Readable, Transform } from "./helpers/stream";

export class FileStreamToolbelt<Input, Output> implements PipelineWithCompletion<Output> {
    private constructor(private readonly stream: Readable<Output> | Transform<Input, Output>) {}

    public static downloader(_: DownloaderLocalProvider): Pipeline<Buffer | string>;
    public static downloader(_: DownloaderAwsProvider): Pipeline<Buffer | string>;
    public static downloader(configuration: DownloaderProviders): Pipeline<Buffer | string> {
        return new FileStreamToolbelt(downloader(configuration));
    }

    public castAs<NewOutput extends Input>(_?: { force?: false }): PipelineWithCompletion<NewOutput>;
    public castAs<NewOutput>(_: { force: true }): PipelineWithCompletion<NewOutput>;
    public castAs<NewOutput>(_?: { force?: boolean }): PipelineWithCompletion<NewOutput> {
        return new FileStreamToolbelt<Input, NewOutput>(this.stream);
    }

    public parse<NewOutput extends Object>(_: ParseCsvFormat): PipelineWithCompletion<NewOutput>;
    public parse<NewOutput extends Object>(_: ParseJsonFormat): PipelineWithCompletion<NewOutput>;
    public parse<NewOutput extends Object>(configuration: ParseFormats): PipelineWithCompletion<NewOutput> {
        return new FileStreamToolbelt(this.stream.pipe(parse<NewOutput>(configuration)));
    }

    public transform<NewOutput>(callbackFn: (chunk: Output) => NewOutput | Promise<NewOutput>): PipelineWithCompletion<NewOutput>;
    public transform<NewOutput>(
        callbackFn: (chunk: Output) => Generator<NewOutput, void, void> | AsyncGenerator<NewOutput, void, void>
    ): PipelineWithCompletion<NewOutput>;
    public transform<NewOutput>(
        callbackFn:
            | ((chunk: Output) => NewOutput | Promise<NewOutput>)
            | ((chunk: Output) => Generator<NewOutput, void, void> | AsyncGenerator<NewOutput, void, void>)
    ): PipelineWithCompletion<NewOutput> {
        return new FileStreamToolbelt(this.stream.pipe(transform<Output, NewOutput>(callbackFn)));
    }

    public filter(callbackFn: (chunk: Output) => boolean | Promise<boolean>): PipelineWithCompletion<Output> {
        return new FileStreamToolbelt(this.stream.pipe(filter<Output>(callbackFn)));
    }

    public wait(): Promise<void> {
        return finished(this.stream);
    }

    public toIterable(): AsyncIterable<Output> {
        return this.stream;
    }

    public async reduceOf<Aggregate>(
        callbackFn: (accumulator: Aggregate, value: Output) => Aggregate | Promise<Aggregate>,
        initialValue: Aggregate
    ): Promise<Aggregate> {
        let accumulator = initialValue;

        for await (const value of this.stream) {
            accumulator = await callbackFn(accumulator, value);
        }

        return accumulator;
    }

    public collect(): Promise<Output[]> {
        return this.reduceOf((accumulator, value) => {
            accumulator.push(value);
            return accumulator;
        }, new Array<Output>());
    }
}
