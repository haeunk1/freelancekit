<template>
  <div id="invoice-preview" style="background:#fff;padding:32px;font-family:Arial,sans-serif;font-size:13px;color:#1e293b;min-height:600px;">

    <!-- Header: Logo + Label -->
    <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
      <div>
        <img v-if="form.logo" :src="form.logo" alt="Logo" style="height:60px;max-width:180px;object-fit:contain;margin-bottom:4px;display:block;" />
        <div v-if="form.from.name" style="font-weight:700;font-size:16px;color:#0f172a;">{{ form.from.name }}</div>
        <div style="color:#64748b;white-space:pre-line;font-size:11px;">{{ form.from.address }}</div>
        <div style="color:#64748b;font-size:11px;">{{ form.from.email }}</div>
        <div v-if="form.from.phone" style="color:#64748b;font-size:11px;">{{ form.from.phone }}</div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:28px;font-weight:700;color:#4f46e5;letter-spacing:2px;">{{ docLabel }}</div>
        <div style="margin-top:8px;font-size:11px;color:#64748b;line-height:1.8;">
          <div><span style="font-weight:600;color:#334155;">{{ numberLabel }}:</span> {{ form.invoiceNumber }}</div>
          <div><span style="font-weight:600;color:#334155;">{{ t('invoice.date') }}:</span> {{ form.date }}</div>
          <div v-if="form.dueDate"><span style="font-weight:600;color:#334155;">{{ dueDateLabel }}:</span> {{ form.dueDate }}</div>
        </div>
      </div>
    </div>

    <!-- Bill To -->
    <div style="background:#f8fafc;border-radius:8px;padding:16px;margin-bottom:24px;">
      <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">{{ t('common.to') }}</div>
      <div style="font-weight:600;color:#0f172a;">{{ form.to.name || '—' }}</div>
      <div style="color:#64748b;white-space:pre-line;font-size:11px;">{{ form.to.address }}</div>
      <div style="color:#64748b;font-size:11px;">{{ form.to.email }}</div>
    </div>

    <!-- Items table -->
    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
      <thead>
        <tr style="border-bottom:2px solid #e2e8f0;">
          <th style="text-align:left;padding-bottom:8px;font-weight:600;color:#475569;">{{ t('common.description') }}</th>
          <th style="text-align:right;padding-bottom:8px;font-weight:600;color:#475569;width:48px;">{{ t('common.qty') }}</th>
          <th style="text-align:right;padding-bottom:8px;font-weight:600;color:#475569;width:96px;">{{ t('common.rate') }}</th>
          <th style="text-align:right;padding-bottom:8px;font-weight:600;color:#475569;width:96px;">{{ t('common.amount') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in form.items" :key="item.id" style="border-bottom:1px solid #f1f5f9;">
          <td style="padding:8px 0;color:#334155;">{{ item.description || '—' }}</td>
          <td style="padding:8px 0;text-align:right;color:#475569;">{{ item.quantity }}</td>
          <td style="padding:8px 0;text-align:right;color:#475569;">{{ formatCurrency(item.rate) }}</td>
          <td style="padding:8px 0;text-align:right;font-weight:500;">{{ formatCurrency(item.quantity * item.rate) }}</td>
        </tr>
      </tbody>
    </table>

    <!-- Totals -->
    <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
      <div style="width:220px;">
        <div style="display:flex;justify-content:space-between;color:#475569;margin-bottom:4px;">
          <span>{{ t('common.subtotal') }}</span><span>{{ formatCurrency(subtotal) }}</span>
        </div>
        <div v-if="form.discountRate > 0" style="display:flex;justify-content:space-between;color:#16a34a;margin-bottom:4px;">
          <span>{{ t('common.discount') }} ({{ form.discountRate }}%)</span><span>-{{ formatCurrency(discountAmount) }}</span>
        </div>
        <div v-if="form.taxRate > 0" style="display:flex;justify-content:space-between;color:#475569;margin-bottom:4px;">
          <span>{{ t('common.tax') }} ({{ form.taxRate }}%)</span><span>{{ formatCurrency(taxAmount) }}</span>
        </div>
        <div style="display:flex;justify-content:space-between;font-weight:700;font-size:16px;border-top:2px solid #1e293b;padding-top:8px;margin-top:8px;color:#0f172a;">
          <span>{{ t('common.total') }}</span>
          <span style="color:#4f46e5;">{{ formatCurrency(total) }}</span>
        </div>
      </div>
    </div>

    <!-- Notes -->
    <div v-if="form.notes" style="border-top:1px solid #e2e8f0;padding-top:16px;margin-bottom:24px;">
      <div style="font-size:10px;font-weight:600;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Notes</div>
      <p style="font-size:11px;color:#475569;white-space:pre-line;">{{ form.notes }}</p>
    </div>

    <!-- Signature -->
    <div v-if="form.signature" style="border-top:1px solid #e2e8f0;padding-top:16px;">
      <img :src="form.signature" alt="Signature" style="height:48px;object-fit:contain;" />
      <div style="font-size:11px;color:#94a3b8;margin-top:4px;">Authorized Signature</div>
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
