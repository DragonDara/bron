import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { applyDocumentLocale, initI18n } from './i18n'
import { initPrinting, startDomI18n } from '@ury/core'
import residualRussianTranslations from './i18n/dom.ru.json'
import residualKazakhTranslations from './i18n/dom.kk.json'

async function bootPrinting() {
  const envKey = import.meta.env.VITE_QZ_SIGN_KEY
  if (typeof envKey === 'string' && envKey.trim()) {
    initPrinting({ signKey: envKey.trim() })
    return
  }
}
void bootPrinting()

initI18n().then(() => {
  applyDocumentLocale()
  startDomI18n({ ru: residualRussianTranslations, kk: residualKazakhTranslations })
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})

