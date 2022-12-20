interface WebManifest {
  icons: WebManifestIcon[]
}

interface WebManifestIcon {
  src: string
  type?: string
  sizes?: string
}

export { WebManifest, WebManifestIcon }