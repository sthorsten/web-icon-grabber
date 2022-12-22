import { WebIconGrabber } from './icon';
/**
 * Asynchronously grabs available icons from a website using native fetch()
 * @param url url from which icons should be loadded
 * @returns A {@link WebIconGrabber} object containing metadata and found icons
 */
export declare const getIcons: (url: string) => Promise<WebIconGrabber>;
