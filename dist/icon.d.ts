/**
 * JSON like object containing metadata and a list of {@link WebIcon}s
 */
export interface WebIconGrabber {
    title: string;
    baseUrl: string;
    totalIcons: number;
    hasManifest: boolean;
    icons: WebIcon[];
}
/**
 * A simple object representing an icon of any type found in the web
 */
export interface WebIcon {
    src: string;
    imageType: string;
    size?: number;
    manifestSizes?: string;
    manifestType?: string;
}
