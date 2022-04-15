import { ParseCsvFormat, ParseJsonFormat } from "./parse/ParseTypes";

export interface Pipeline<Input> {
    parse<Output extends Object>(_: ParseCsvFormat): PipelineWithCompletion<Output>;
    parse<Output extends Object>(_: ParseJsonFormat): PipelineWithCompletion<Output>;
    castAs<Output extends Input>(_?: { force?: false }): PipelineWithCompletion<Output>;
    castAs<Output>(_: { force: true }): PipelineWithCompletion<Output>;
    transform<Output>(callbackFn: (chunk: Input) => Output | Promise<Output>): PipelineWithCompletion<Output>;
    transform<Output>(
        callbackFn: (chunk: Input) => Generator<Output, void, void> | AsyncGenerator<Output, void, void>
    ): PipelineWithCompletion<Output>;
    filter(callbackFn: (chunk: Input) => boolean | Promise<boolean>): PipelineWithCompletion<Input>;
}

export interface ResolvablePipeline {
    wait(): Promise<void>;
}

export interface CollectResolvablePipeline<Input> {
    toIterable(): AsyncIterable<Input>;
    reduceOf<Aggregate>(
        callbackFn: (accumulator: Aggregate, value: Input) => Aggregate | Promise<Aggregate>,
        initialValue: Aggregate
    ): Promise<Aggregate>;
    collect(): Promise<Input[]>;
}

export type PipelineWithCompletion<Input> = Pipeline<Input> & ResolvablePipeline & CollectResolvablePipeline<Input>;
