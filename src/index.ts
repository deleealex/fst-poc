import { SupportedFormat, SupportedProvider } from "./items/SupportedTypes";
import { FileStreamToolbelt } from "./FileStreamToolbelt";

(async () => {
    interface Sample {
        column1: string;
        column2: string;
    }

    // Sample 1

    const values_sample1 = await FileStreamToolbelt.downloader({ provider: SupportedProvider.Local, options: { filename: "./data/sample.csv" } })
        .parse<Sample>({
            format: SupportedFormat.Csv,
            options: { headers: true, delimiter: ",", ignoreEmpty: true, discardUnmappedColumns: true }
        })
        .collect();

    console.log({ values_sample1 });

    // Sample 2

    const iterable_sample2 = FileStreamToolbelt.downloader({ provider: SupportedProvider.Local, options: { filename: "./data/sample.csv" } })
        .parse({
            format: SupportedFormat.Csv,
            options: { headers: true, delimiter: ",", ignoreEmpty: true, discardUnmappedColumns: true }
        })
        .castAs<Sample>()
        .toIterable();

    // Unlike native streams, chunk is well typed in Sample interface
    for await (const chunk of iterable_sample2) {
        console.log({ chunk_sample2: chunk });
    }
})();
