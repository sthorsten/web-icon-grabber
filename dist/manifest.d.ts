export interface WebManifest {
    icons: WebManifestIcon[];
}
export interface WebManifestIcon {
    src: string;
    type?: string;
    sizes?: string;
}
export declare const downloadManifest: (url: string) => Promise<any>;
