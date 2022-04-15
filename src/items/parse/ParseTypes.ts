import { ParserOptionsArgs } from "fast-csv";

import { SupportedFormat } from "../SupportedTypes";

export interface ParseCsvFormat {
    format: SupportedFormat.Csv;
    options?: ParserOptionsArgs;
}

export interface ParseJsonFormat {
    format: SupportedFormat.Json;
    options?: {
        ignoreError?: boolean;
    };
}

export type ParseFormats = ParseCsvFormat | ParseJsonFormat;
