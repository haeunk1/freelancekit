<template>
  <div id="invoice-preview" class="bg-white p-8 shadow-sm text-sm text-slate-800 min-h-[600px]" style="font-family: 'Arial', sans-serif;">
    <!-- Header: Logo + Label -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <img v-if="form.logo" :src="form.logo" alt="Logo" class="h-16 max-w-[180px] object-contain mb-1" />
        <div v-if="form.from.name" class="font-bold text-lg text-slate-900">{{ form.from.name }}</div>
        <div class="text-slate-500 whitespace-pre-line text-xs">{{ form.from.address }}</div>
        <div class="text-slate-500 text-xs">{{ form.from.email }}</div>
        <div v-if="form.from.phone" class="text-slate-500 text-xs">{{ form.from.phone }}</div>
      </div>
      <div class="text-right">
        <div class="text-3xl font-bold text-indigo-600 tracking-wide">{{ docLabel }}</div>
        <div class="mt-2 text-xs text-slate-500 space-y-0.5">
          <div><span class="font-medium text-slate-700">{{ numberLabel }}:</span> {{ form.invoiceNumber }}</div>
          <div><span class="font-medium text-slate-700">{{ t('invoice.date') }}:</span> {{ form.date }}</div>
          <div v-if="form.dueDate"><span class="font-medium text-slate-700">{{ dueDateLabel }}:</span> {{ form.dueDate }}</div>
        </div>
      </div>
    </div>

    <!-- Bill To -->
    <div class="bg-slate-50 rounded-lg p-4 mb-6">
      <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{{ t('common.to') }}</div>
      <div class="font-semibold text-slate-900">{{ form.to.name || '—' }}</div>
      <div class="text-slate-500 whitespace-pre-line text-xs">{{ form.to.address }}</div>
      <div class="text-slate-500 text-xs">{{ form.to.email }}</div>
    </div>

    <!-- Items table -->
    <table class="w-full mb-6 text-xs">
      <thead>
        <tr class="border-b-2 border-slate-200">
          <th class="text-left pb-2 font-semibold text-slate-600">{{ t('common.description') }}</th>
          <th class="text-right pb-2 font-semibold text-slate-600 w-12">{{ t('common.qty') }}</th>
          <th class="text-right pb-2 font-semibold text-slate-600 w-24">{{ t('common.rate') }}</th>
          <th class="text-right pb-2 font-semibold text-slate-600 w-24">{{ t('common.amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in form.items" :key="item.id" class="border-b border-slate-100">
          <td class="py-2 text-slate-700">{{ item.description || '—' }}</td>
          <td class="py-2 text-right text-slate-600">{{ item.quantity }}</td>
          <td class="py-2 text-right text-slate-600">{{ formatCurrency(item.rate) }}</td>
          <td class="py-2 text-right font-medium">{{ formatCurrency(item.quantity * item.rate) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div class="flex justify-end mb-6">
      <div class="w-56 space-y-1 text-xs">
        <div class="flex justify-between text-slate-600">
          <span>{{ t('common.subtotal') }}</span>
          <span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div v-if="form.discountRate > 0" class="flex justify-between text-green-600">
          <span>{{ t('common.discount') }} ({{ form.discountRate }}%)</span>
          <span>-{{ formatCurrency(discountAmount) }}</span>
        </div>
        <div v-if="form.taxRate > 0" class="flex justify-between text-slate-600">
          <span>{{ t('common.tax') }} ({{ form.taxRate }}%)</span>
          <span>{{ formatCurrency(taxAmount) }}</span>
        </div>
        <div class="flex justify-between font-bold text-base border-t-2 border-slate-800 pt-2 mt-2 text-slate-900">
          <span>{{ t('common.total') }}</span>
          <span class="text-indigo-600">{{ formatCurrency(total) }}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="form.notes" class="border-t border-slate-200 pt-4 mb-6">
      <div class="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Notes</div>
      <p class="text-xs text-slate-600 whitespace-pre-line">{{ form.notes }}</p>
    </div>

    <!-- Signature -->
    <div v-if="form.signature" class="border-t border-slate-200 pt-4">
      <img :src="form.signature" alt="Signature" class="h-12 object-contain" />
      <div class="text-xs text-slate-400 mt-1">Authorized Signature</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps({
  form: { type: Object, required: true },
  docLabel: { type: String, default: 'INVOICE' },
  numberLabel: { type: String, default: 'Invoice #' },
  dueDateLabel: { type: String, default: 'Due Date' },
})

const subtotal = computed(() => props.form.items.reduce((s, i) => s + i.quantity * i.rate, 0))
const discountAmount = computed(() => subtotal.value * (props.form.discountRate / 100))
const taxAmount = computed(() => (subtotal.value - discountAmount.value) * (props.form.taxRate / 100))
const total = computed(() => subtotal.value - discountAmount.value + taxAmount.value)

const symbols = { USD: '$', EUR: '€', GBP: '£', CAD: 'CA$', AUD: 'A$' }
function formatCurrency(val) {
  const sym = symbols[props.form.currency] || '$'
  return `${sym}${Number(val || 0).toFixed(2)}`
}
</script>
