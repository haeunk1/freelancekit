<template>
  <footer class="bg-white border-t border-slate-200 mt-12">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-slate-500">
      <p>{{ t('footer.tagline') }}</p>
      <div class="flex items-center gap-4">
        <RouterLink to="/privacy" class="hover:text-indigo-600 transition-colors">{{ t('footer.privacy') }}</RouterLink>
        <span>© {{ year }} FreelanceKit. {{ t('footer.allRights') }}</span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const year = new Date().getFullYear()
</script>
