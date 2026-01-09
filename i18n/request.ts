import { getRequestConfig } from 'next-intl/server'

export default getRequestConfig(async () => {
  // For now, default to French. Can be expanded later with locale detection
  const locale = 'fr'

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default
  }
})
