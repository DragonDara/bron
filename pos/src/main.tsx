import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyDocumentLocale, initI18n } from './i18n'
import { initPrinting, startDomI18n } from '@ury/core'
import residualRussianTranslations from './i18n/dom.ru.json'
import residualKazakhTranslations from './i18n/dom.kk.json'

initPrinting({ signKey: '-----BEGIN PRIVATE KEY-----MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDSO4jg65armUQxZRWEyD6xPPI36bSJcQXyKYKK8+/KkdmimHW7XKfG45zG9xdCGT/XYGkfoXx2qHIWUw79qJ2cEOes2pw7LelTmu7Ms5rdcB+CaOUyfWUfUdodk31ngQVwRWo1w/kClSRrNaIoGhtMik6HODXVnxBtf5QYewuYlAq9ic0ERcTJYa4hQm2uo/qqwF6V3Zi2qfl+WfvCxFiTD4rADfgfDPsJ7rW0sYdc/pKQTzq0o1Wg64BwLepBjeceGfgpq2Kys85NIr5qh3Sj3VVcrGFFJJ68tUiHldtGlNhqMIVt/BZJRoPGm7ohEL13UH4Vhj8LssjuPxqxigp3AgMBAAECggEAAM9a6SbvNy0Jfrk5en/9AdjOxBlh6S+myraPOrLS5zBlqsM0nOqv+MuytG+KRuZrAQztisIoBRsECYL7aU3Hgazs/5T+ChpUrk5IAkDk5VqDvJBj5axnAdZiZT/GuWndV//kd12QbYqej80umUH0ffiAcfPs/Sw2N33I18lNk6Jol4YDOsLKqw7o8TrRvtAG6zY4si1ZJSVoOTVySkAvuiU8oE/e+zB6t3yr5Z3Pigi+GxsaHVTQk76VAFjgPMCS9jHHojlbZpMWWw5kJjIb6V+Mb5sCbN1JQZXOND3+TNhf7KldlA0hzla4RIKkxaf1YYElvV1qe8mERj8DaX36/QKBgQD4ChSNFoNdGge4AESLRrCTOC01jbxeNv8ZbhCTiyn+pgvpGCBwaRZkB2EapmtwdoMIXUYjXQIMdh/+ROqac+Rscwe3I2WT6XQFW8vxJgiX03USfC3b5+cZNUrEzQSZFA1vxk4Wr+mSaKuwec86wa2ZnODLULl6nqO30Gl4dHG/owKBgQDY+tRL0VmK0LrI3tNT0yTZQ8uF5yJsLwM2oZqEZ8kC53l4i4rjZ23QU8Z/5YJBo8n43SdIlQpQNEPopAlvnCyOrFjkQJRBa/xvEgoMCe/MnDvYQ+hwM3UpZeVnzJ3jkKQHx5UiyYS4Hu5cceUNAmKYfB5XgjvwUrK+OGj9ewynHQKBgEGkaUvtaVZ6TRClAX7admB/vXcuy2sjot9YAYsKiVKbHwvRFsSpCwPt8ATdhhF9S7Aq/yTcuG4T1OO12WCGyyzoRGJzO66pWcsRQCfRqPSFQbZipsBL3x0MvXzXxR+97tBl6sSWSXo1uTo7AlzKZOcCXXtxIaUR1sIOpdr69h+BAoGAXzwwxBpeH+SfpxzOSqOJL+dmxB3/6NX1phvmMylOe/zXPwaYblluRJsQrAAzXNYkBxwiauQnw649BDZDgf5dPD3/QifqKpDYGnQjfsc5vmfwiGq98clUKlh0CUwxHLnWlSePmNY0b4/79Q10iHI8jkskEiqyXjgeBgnCY0eH9S0CgYB0OFvSTMNz49Ntmqly0S3kHMlrsD81z2qADfRwlRXm/uCYyzHUTQ9QgL51/q2kY6cqqHNXvlD/N6FYd0Pqi2ujHpq/4RYgr3uKGYjeMkfn1+Wle8SEXX6fdZdzCBf0Vj863/GxcYyJk630HjkUh4c5JkyX6bIWBFp+uO3iATJ58w==-----END PRIVATE KEY-----' })

initI18n().then(() => {
  applyDocumentLocale()
  startDomI18n({ ru: residualRussianTranslations, kk: residualKazakhTranslations })
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

