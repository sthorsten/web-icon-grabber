export interface WebManifest {
  icons: WebManifestIcon[]
}

export interface WebManifestIcon {
  src: string
  type?: string
  sizes?: string
}


export const downloadManifest = async (url: string) => {
  const response = await fetch(url)
  const manifest = await response.json()
  return manifest
}