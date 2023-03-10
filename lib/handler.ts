
import * as cheerio from 'cheerio'
import { WebIcon, WebIconGrabber } from './icon'
import { WebManifest, WebManifestIcon, downloadManifest } from './manifest'


/**
 * Asynchronously grabs available icons from a website using native fetch()
 * @param url url from which icons should be loadded
 * @returns A {@link WebIconGrabber} object containing metadata and found icons 
 */
export const getIcons = async (url: string): Promise<WebIconGrabber> => {
  let iconGrabber: Partial<WebIconGrabber> = {}

  // 1. Download and load raw html page
  const html = await downloadHtml(url)
  const $ = cheerio.load(html, { scriptingEnabled: false })

  iconGrabber.baseUrl = parseBaseUrl(url)

  // 2. Try data from manifest if it exists
  let manifest = $('head').find('link[rel=manifest]')
  if (manifest && manifest.length > 0) {
    const manifestUrl = iconGrabber.baseUrl + manifest.attr('href') ?? ""
    const manifestData: WebManifest = await downloadManifest(manifestUrl)

    iconGrabber.hasManifest = true

    // Parse manifest icons to WebIcons
    if (manifestData?.icons) {
      const manifestIcons = parseManifestIcons(manifestData.icons)
      iconGrabber.icons = manifestIcons
    }
  }

  // 3. Read link icon tags
  let iconLinks = $('head').find('link[rel*=icon]')
  const linkIcons = parseLinkIcons(iconLinks)
  linkIcons.forEach(i => iconGrabber.icons?.push(i))

  // 4. Add default favicon if no icon tag was found
  if (iconGrabber.icons == null || iconGrabber.icons.length === 0) {
    iconGrabber.icons = [{
      imageType: 'ico',
      src: iconGrabber.baseUrl + '/favicon.ico'
    }]
  }

  // 5. Additional data
  iconGrabber.totalIcons = iconGrabber.icons?.length ?? 0
  iconGrabber.title = $('title').text()

  return iconGrabber as WebIconGrabber
}


const downloadHtml = async (url: string) => {
  const response = await fetch(url)
  const html = await response.text()
  return html
}


const parseBaseUrl = (url: string) => {
  const splitUrl = url.split('/')
  const baseUrl = splitUrl[0] + '//' + splitUrl[2]
  return baseUrl
}


const parseLinkIcons = (cheerioTags: cheerio.Cheerio<cheerio.Element>) => {
  const webIcons: WebIcon[] = []

  cheerioTags.each((i, element) => {
    let webIcon: Partial<WebIcon> = {}

    webIcon.src = element.attribs['href']

    // Image type by file extension    
    const splitSrc = webIcon.src.split('.')
    webIcon.imageType = splitSrc[splitSrc.length - 1]

    webIcons.push(webIcon as WebIcon)
  })

  return webIcons
}

const parseManifestIcons = (icons: WebManifestIcon[]) => {
  const webIcons: WebIcon[] = []

  icons.forEach((i) => {
    let webIcon: Partial<WebIcon> = {}

    webIcon.src = i.src
    webIcon.manifestSizes = i.sizes
    webIcon.manifestType = i.type

    if (i.sizes) {
      webIcon.size = parseInt(i.sizes.split("x")[0])
    }

    // Image type by file extension    
    const splitSrc = i.src.split('.')
    webIcon.imageType = splitSrc[splitSrc.length - 1]

    webIcons.push(webIcon as WebIcon)
  })

  return webIcons
}
