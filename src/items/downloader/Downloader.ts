import fs from "fs";

import { SupportedProvider } from "../SupportedTypes";
import { DownloaderProviders } from "./DownloaderTypes";
import { Readable } from "../../helpers/stream";

export function downloader({ provider, options }: DownloaderProviders): Readable<Buffer | string> {
    switch (provider) {
        case SupportedProvider.Local:
            return fs.createReadStream(options.filename);
        case SupportedProvider.Aws:
            // TODO: returns true Readable stream
            return Readable.from(["fake", "value"]);
        // case SupportedProvider.Gcp:
        // case SupportedProvider.Sftp:
    }
}
