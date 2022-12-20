"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIcons = void 0;
const cheerio = require("cheerio");
const getIcons = (url, preferredMinSize = 64) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    let iconGrabber = {};
    // 1. Download and load raw html page
    const html = yield downloadHtml(url);
    const $ = cheerio.load(html, { scriptingEnabled: false });
    iconGrabber.baseUrl = parseBaseUrl(url);
    // 2. Try data from manifest if it exists
    let manifest = $('head').find('link[rel=manifest]');
    if (manifest && manifest.length > 0) {
        const manifestUrl = (_a = iconGrabber.baseUrl + manifest.attr('href')) !== null && _a !== void 0 ? _a : "";
        const manifestData = yield downloadManifest(manifestUrl);
        iconGrabber.hasManifest = true;
        // Parse manifest icons to WebIcons
        if (manifestData === null || manifestData === void 0 ? void 0 : manifestData.icons) {
            const manifestIcons = parseManifestIcons(manifestData.icons);
            iconGrabber.icons = manifestIcons;
        }
    }
    // 3. Read link icon tags
    let iconLinks = $('head').find('link[rel*=icon]');
    const linkIcons = parseLinkIcons(iconLinks);
    linkIcons.forEach(i => { var _a; return (_a = iconGrabber.icons) === null || _a === void 0 ? void 0 : _a.push(i); });
    // 4. Add default favicon if no icon tag was found
    if (iconGrabber.icons == null || iconGrabber.icons.length === 0) {
        iconGrabber.icons = [{
                imageType: 'ico',
                src: iconGrabber.baseUrl + '/favicon.ico'
            }];
    }
    // 5. Additional data
    iconGrabber.totalIcons = (_c = (_b = iconGrabber.icons) === null || _b === void 0 ? void 0 : _b.length) !== null && _c !== void 0 ? _c : 0;
    iconGrabber.title = $('title').text();
    return iconGrabber;
});
exports.getIcons = getIcons;
const downloadHtml = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const html = yield response.text();
    return html;
});
const downloadManifest = (url) => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield fetch(url);
    const manifest = yield response.json();
    return manifest;
});
const parseBaseUrl = (url) => {
    const splitUrl = url.split('/');
    const baseUrl = splitUrl[0] + '//' + splitUrl[2];
    return baseUrl;
};
const parseLinkIcons = (cheerioTags) => {
    const webIcons = [];
    cheerioTags.each((i, element) => {
        let webIcon = {};
        webIcon.src = element.attribs['href'];
        // Image type by file extension    
        const splitSrc = webIcon.src.split('.');
        webIcon.imageType = splitSrc[splitSrc.length - 1];
        webIcons.push(webIcon);
    });
    return webIcons;
};
const parseManifestIcons = (icons) => {
    const webIcons = [];
    icons.forEach((i) => {
        let webIcon = {};
        webIcon.src = i.src;
        webIcon.manifestSizes = i.sizes;
        webIcon.manifestType = i.type;
        if (i.sizes) {
            webIcon.size = parseInt(i.sizes.split("x")[0]);
        }
        // Image type by file extension    
        const splitSrc = i.src.split('.');
        webIcon.imageType = splitSrc[splitSrc.length - 1];
        webIcons.push(webIcon);
    });
    return webIcons;
};
