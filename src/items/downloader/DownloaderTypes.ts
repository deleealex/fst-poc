import { SupportedProvider } from "../SupportedTypes";

export interface DownloaderLocalProvider {
    provider: SupportedProvider.Local;
    options: { filename: string };
}

export interface DownloaderAwsProvider {
    provider: SupportedProvider.Aws;
    options: { a: string; b: number };
}

export type DownloaderProviders = DownloaderLocalProvider | DownloaderAwsProvider;
