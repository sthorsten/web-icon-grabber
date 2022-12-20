export interface WebIconGrabber {
    title: string;
    baseUrl: string;
    totalIcons: number;
    hasManifest: boolean;
    icons: WebIcon[];
}
export interface WebIcon {
    src: string;
    imageType: string;
    size?: number;
    manifestSizes?: string;
    manifestType?: string;
}
