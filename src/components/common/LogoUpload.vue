<template>
  <div>
    <div v-if="modelValue" class="flex items-center gap-3 mb-2">
      <img :src="modelValue" alt="Logo" class="h-14 max-w-[160px] object-contain border border-slate-200 rounded p-1 bg-white" />
      <button @click="$emit('update:modelValue', null)" type="button"
        class="text-xs text-red-500 hover:text-red-700 underline">
        {{ t('common.removeLogo') }}
      </button>
    </div>
    <label v-else class="flex items-center gap-2 cursor-pointer group">
      <div class="border-2 border-dashed border-slate-300 group-hover:border-indigo-400 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        {{ t('common.uploadLogo') }}
      </div>
      <input type="file" accept="image/*" class="hidden" @change="onFile" />
    </label>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps({ modelValue: { type: String, default: null } })
const emit = defineEmits(['update:modelValue'])

function onFile(e) {
  const file = e.target.files[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => emit('update:modelValue', ev.target.result)
  reader.readAsDataURL(file)
}
</script>
