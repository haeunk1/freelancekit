<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <div class="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h1 class="text-3xl sm:text-4xl font-bold mb-4">{{ t('about.heroTitle') }}</h1>
        <p class="text-indigo-200 text-lg max-w-xl mx-auto">
          {{ t('about.heroSubtitle') }}
        </p>
      </div>
    </section>

    <!-- Mission -->
    <section class="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">{{ t('about.missionTitle') }}</h2>
        <p class="text-slate-600 leading-relaxed text-base">{{ t('about.missionP1') }}</p>
        <p class="text-slate-600 leading-relaxed text-base mt-4">
          {{ t('about.missionP2') }}
        </p>
      </div>

      <!-- Values -->
      <div class="grid sm:grid-cols-3 gap-6 mb-16">
        <div v-for="v in values" :key="v.key"
          class="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
          <div class="text-3xl mb-3">{{ v.icon }}</div>
          <h3 class="font-semibold text-slate-900 mb-2">{{ t(v.titleKey) }}</h3>
          <p class="text-sm text-slate-500 leading-relaxed">{{ t(v.descKey) }}</p>
        </div>
      </div>

      <!-- What we offer -->
      <div class="mb-16">
        <h2 class="text-2xl font-bold text-slate-900 text-center mb-8">{{ t('about.offerTitle') }}</h2>
        <div class="space-y-4">
          <div v-for="tool in tools" :key="tool.to"
            class="flex items-start gap-4 bg-white border border-slate-200 rounded-xl p-5 hover:border-indigo-200 transition-colors">
            <div class="text-2xl shrink-0">{{ tool.icon }}</div>
            <div>
              <h3 class="font-semibold text-slate-900">{{ t(tool.titleKey) }}</h3>
              <p class="text-sm text-slate-500 mt-0.5 leading-relaxed">{{ t(tool.descKey) }}</p>
            </div>
            <RouterLink :to="tool.to"
              class="ml-auto shrink-0 text-sm font-medium text-indigo-600 hover:text-indigo-800 whitespace-nowrap">
              {{ t('about.tryIt') }}
            </RouterLink>
          </div>
        </div>
      </div>

      <!-- How it works -->
      <div class="bg-indigo-50 border border-indigo-100 rounded-2xl p-8 mb-16">
        <h2 class="text-xl font-bold text-slate-900 mb-6 text-center">{{ t('about.howTitle') }}</h2>
        <div class="grid sm:grid-cols-3 gap-6">
          <div v-for="(step, i) in steps" :key="i" class="text-center">
            <div class="w-10 h-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-lg">
              {{ i + 1 }}
            </div>
            <h3 class="font-semibold text-slate-800 mb-1">{{ t(step.titleKey) }}</h3>
            <p class="text-sm text-slate-500">{{ t(step.descKey) }}</p>
          </div>
        </div>
      </div>

      <!-- Privacy note -->
      <div class="bg-white border border-slate-200 rounded-2xl p-8 mb-16">
        <div class="flex items-start gap-4">
          <div class="text-3xl shrink-0">🔒</div>
          <div>
            <h2 class="text-xl font-bold text-slate-900 mb-2">{{ t('about.privacyTitle') }}</h2>
            <p class="text-slate-600 leading-relaxed text-sm">{{ t('about.privacyP1') }}</p>
            <p class="text-slate-600 leading-relaxed text-sm mt-3">
              {{ t('about.privacyP2Before') }}
              <RouterLink to="/privacy" class="text-indigo-600 hover:underline">{{ t('about.privacyLink') }}</RouterLink>
              {{ t('about.privacyP2After') }}
            </p>
          </div>
        </div>
      </div>

      <!-- Languages -->
      <div class="text-center mb-16">
        <h2 class="text-2xl font-bold text-slate-900 mb-4">{{ t('about.langsTitle') }}</h2>
        <p class="text-slate-500 mb-6">{{ t('about.langsSubtitle') }}</p>
        <div class="flex flex-wrap justify-center gap-3">
          <span v-for="lang in langs" :key="lang.code"
            class="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm font-medium text-slate-700">
            <span class="text-lg">{{ lang.flag }}</span>
            {{ lang.name }}
          </span>
        </div>
      </div>

      <!-- CTA -->
      <div class="bg-indigo-600 rounded-2xl p-10 text-center text-white">
        <h2 class="text-2xl font-bold mb-3">{{ t('about.ctaTitle') }}</h2>
        <p class="text-indigo-200 mb-6">{{ t('about.ctaSubtitle') }}</p>
        <RouterLink to="/invoice"
          class="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
          {{ t('about.ctaButton') }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const values = [
  { key: 'free',    icon: '🆓', titleKey: 'about.val1Title', descKey: 'about.val1Desc' },
  { key: 'privacy', icon: '🔏', titleKey: 'about.val2Title', descKey: 'about.val2Desc' },
  { key: 'instant', icon: '⚡', titleKey: 'about.val3Title', descKey: 'about.val3Desc' },
]

const tools = [
  { icon: '🧾', to: '/invoice',  titleKey: 'about.tool1Title', descKey: 'about.tool1Desc' },
  { icon: '📋', to: '/quote',    titleKey: 'about.tool2Title', descKey: 'about.tool2Desc' },
  { icon: '🗒️', to: '/receipt',  titleKey: 'about.tool3Title', descKey: 'about.tool3Desc' },
  { icon: '✍️', to: '/contract', titleKey: 'about.tool4Title', descKey: 'about.tool4Desc' },
]

const steps = [
  { titleKey: 'about.step1Title', descKey: 'about.step1Desc' },
  { titleKey: 'about.step2Title', descKey: 'about.step2Desc' },
  { titleKey: 'about.step3Title', descKey: 'about.step3Desc' },
]

// Language names stay fixed (always shown in their native language)
const langs = [
  { code: 'en', flag: '🇺🇸', name: 'English' },
  { code: 'ko', flag: '🇰🇷', name: '한국어' },
  { code: 'es', flag: '🇪🇸', name: 'Español' },
  { code: 'pt', flag: '🇧🇷', name: 'Português' },
  { code: 'fr', flag: '🇫🇷', name: 'Français' },
  { code: 'de', flag: '🇩🇪', name: 'Deutsch' },
]
</script>
