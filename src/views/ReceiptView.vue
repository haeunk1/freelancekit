<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">{{ t('receipt.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('receipt.subtitle') }}</p>
    </div>

    <AdBanner size="leaderboard" />

    <div class="flex flex-col lg:flex-row gap-6 mt-4">
      <div class="lg:w-[480px] shrink-0 space-y-4">
        <!-- Template + Color -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
          <div>
            <label class="label mb-2">Design Template</label>
            <div class="grid grid-cols-3 gap-2">
              <button v-for="tpl in templates" :key="tpl.id" @click="form.template = tpl.id" type="button"
                :class="['border-2 rounded-lg p-2 text-center transition-all', form.template === tpl.id ? 'border-indigo-500 bg-indigo-50' : 'border-slate-200 hover:border-slate-300']">
                <div class="w-full h-10 rounded mb-1.5 overflow-hidden" :style="`background:${tpl.bg};`">
                  <div class="w-full h-3" :style="`background:${form.color};opacity:${tpl.headerOpacity};`"></div>
                  <div class="mx-2 mt-1 space-y-0.5">
                    <div class="h-1 rounded" :style="`background:${form.color};opacity:0.3;width:60%;`"></div>
                    <div class="h-0.5 rounded bg-slate-200 w-full"></div>
                    <div class="h-0.5 rounded bg-slate-200 w-4/5"></div>
                  </div>
                </div>
                <span class="text-xs font-medium" :class="form.template === tpl.id ? 'text-indigo-600' : 'text-slate-500'">{{ tpl.label }}</span>
              </button>
            </div>
          </div>
          <div>
            <label class="label mb-2">Accent Color</label>
            <div class="flex items-center gap-2 flex-wrap">
              <button v-for="c in presetColors" :key="c" @click="form.color = c" type="button"
                :style="`background:${c};width:28px;height:28px;border-radius:50%;border:3px solid ${form.color === c ? '#1e293b' : 'transparent'};transition:all 0.15s;`"></button>
              <label class="relative cursor-pointer">
                <div class="w-7 h-7 rounded-full border-2 border-dashed border-slate-300 flex items-center justify-center hover:border-slate-500 transition-colors overflow-hidden">
                  <div class="w-full h-full" :style="`background:${isPreset ? 'transparent' : form.color}`"></div>
                  <svg v-if="isPreset" class="w-3.5 h-3.5 text-slate-400 absolute" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                </div>
                <input type="color" v-model="form.color" class="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
              </label>
            </div>
          </div>
        </div>
        <div class="bg-white rounded-xl border border-slate-200 p-4"><LogoUpload v-model="form.logo" /></div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('common.from') }}</h2>
          <input v-model="form.from.name" :placeholder="t('common.name')" class="input" />
          <input v-model="form.from.email" :placeholder="t('common.email')" type="email" class="input" />
          <textarea v-model="form.from.address" :placeholder="t('common.address')" rows="2" class="input resize-none" />
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('common.to') }}</h2>
          <input v-model="form.to.name" :placeholder="t('common.name')" class="input" />
          <input v-model="form.to.email" :placeholder="t('common.email')" type="email" class="input" />
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <div class="grid grid-cols-2 gap-3">
            <div><label class="label">{{ t('receipt.number') }}</label><input v-model="form.invoiceNumber" class="input" /></div>
            <div><label class="label">{{ t('common.currency') }}</label>
              <select v-model="form.currency" class="input">
                <option v-for="c in currencies" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
            <div><label class="label">{{ t('receipt.date') }}</label><input v-model="form.date" type="date" class="input" /></div>
            <div><label class="label">{{ t('receipt.dueDate') }}</label><input v-model="form.dueDate" type="date" class="input" /></div>
          </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <div class="space-y-2">
            <div v-for="item in form.items" :key="item.id" class="flex gap-2 items-start">
              <input v-model="item.description" :placeholder="t('common.description')" class="input flex-1" />
              <input v-model.number="item.quantity" type="number" min="0" class="input w-14 text-center" />
              <input v-model.number="item.rate" type="number" min="0" class="input w-24 text-right" />
              <button @click="store.removeItem(form, item.id)" type="button" class="mt-1 text-slate-400 hover:text-red-500">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
          </div>
          <button @click="store.addItem(form)" type="button" class="mt-3 text-sm text-indigo-600 hover:text-indigo-800 font-medium">{{ t('common.addItem') }}</button>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4 grid grid-cols-2 gap-3">
          <div><label class="label">{{ t('common.tax') }} %</label><input v-model.number="form.taxRate" type="number" min="0" max="100" class="input" /></div>
          <div><label class="label">{{ t('common.discount') }} %</label><input v-model.number="form.discountRate" type="number" min="0" max="100" class="input" /></div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <label class="label">{{ t('common.notes') }}</label>
          <textarea v-model="form.notes" rows="2" class="input resize-none mt-1" />
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-4"><SignaturePad v-model="form.signature" /></div>

        <div class="flex gap-3">
          <button @click="downloadPdf" :disabled="generating"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {{ generating ? t('common.generating') : t('common.downloadPdf') }}
          </button>
          <button @click="store.resetForm(form)" type="button" class="px-4 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 text-sm font-medium">{{ t('common.reset') }}</button>
        </div>
        <AdBanner size="rectangle" />
      </div>

      <div class="flex-1 min-w-0">
        <div class="sticky top-20">
          <p class="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">{{ t('common.preview') }}</p>
          <div class="border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <DocumentPreview :form="form" :docLabel="t('receipt.label')" :numberLabel="t('receipt.number')" :dueDateLabel="t('receipt.dueDate')" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDocumentStore } from '@/stores/documentStore'
import AdBanner from '@/components/common/AdBanner.vue'
import LogoUpload from '@/components/common/LogoUpload.vue'
import SignaturePad from '@/components/common/SignaturePad.vue'
import DocumentPreview from '@/components/invoice/DocumentPreview.vue'
import { exportToPdf } from '@/utils/pdfExport'

const { t } = useI18n()
const store = useDocumentStore()
const form = store.receiptForm
const generating = ref(false)
const presetColors = ['#4f46e5', '#2563eb', '#0891b2', '#059669', '#65a30d', '#d97706', '#ea580c', '#e11d48', '#7c3aed', '#475569']
const templates = [
  { id: 'classic', label: 'Classic', bg: '#f8fafc', headerOpacity: '1' },
  { id: 'modern',  label: 'Modern',  bg: '#fff',    headerOpacity: '1' },
  { id: 'minimal', label: 'Minimal', bg: '#fff',    headerOpacity: '0.15' },
]
const isPreset = computed(() => presetColors.includes(form.color))
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD']

async function downloadPdf() {
  generating.value = true
  try { await exportToPdf('invoice-preview', `receipt-${form.invoiceNumber}.pdf`) }
  finally { generating.value = false }
}
</script>

