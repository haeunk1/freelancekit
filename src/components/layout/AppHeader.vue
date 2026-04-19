<template>
  <header class="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-14">
        <!-- Logo -->
        <RouterLink to="/" class="flex items-center gap-2 font-bold text-lg text-indigo-600 shrink-0">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          FreelanceKit
        </RouterLink>

        <!-- Nav (desktop) -->
        <nav class="hidden md:flex items-center gap-1">
          <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
            class="px-3 py-1.5 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            active-class="text-indigo-600 bg-indigo-50">
            {{ t(item.label) }}
          </RouterLink>
        </nav>

        <!-- Right: Language selector + mobile menu -->
        <div class="flex items-center gap-2">
          <!-- Language Selector -->
          <select v-model="currentLocale" @change="changeLocale"
            class="text-sm border border-slate-200 rounded-md px-2 py-1 bg-white text-slate-600 cursor-pointer hover:border-indigo-400 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option v-for="lang in languages" :key="lang.code" :value="lang.code">
              {{ lang.flag }} {{ lang.name }}
            </option>
          </select>

          <!-- Mobile menu button -->
          <button @click="mobileOpen = !mobileOpen" class="md:hidden p-1.5 rounded-md text-slate-500 hover:bg-slate-100">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!mobileOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile nav -->
      <div v-if="mobileOpen" class="md:hidden py-2 border-t border-slate-100">
        <RouterLink v-for="item in navItems" :key="item.to" :to="item.to"
          @click="mobileOpen = false"
          class="block px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
          active-class="text-indigo-600 bg-indigo-50">
          {{ t(item.label) }}
        </RouterLink>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const mobileOpen = ref(false)
const currentLocale = ref(locale.value)

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
]

const navItems = [
  { to: '/invoice', label: 'nav.invoice' },
  { to: '/quote', label: 'nav.quote' },
  { to: '/receipt', label: 'nav.receipt' },
  { to: '/contract', label: 'nav.contract' },
  { to: '/about', label: 'nav.about' },
]

function changeLocale() {
  locale.value = currentLocale.value
  localStorage.setItem('locale', currentLocale.value)
}
</script>
