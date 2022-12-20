interface WebIconGrabber {
    title: string;
    baseUrl: string;
    totalIcons: number;
    hasManifest: boolean;
    icons: WebIcon[];
}
interface WebIcon {
    src: string;
    imageType: string;
    size?: number;
    manifestSizes?: string;
    manifestType?: string;
}
export { WebIconGrabber, WebIcon };
