<template>
  <div id="invoice-preview" style="background:#fff;font-family:Arial,sans-serif;font-size:13px;color:#1e293b;">

    <!-- ==================== CLASSIC ==================== -->
    <div v-if="form.template === 'classic'" style="padding:36px;">
      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:32px;">
        <div>
          <img v-if="form.logo" :src="form.logo" alt="Logo" style="height:56px;max-width:160px;object-fit:contain;display:block;margin-bottom:8px;" />
          <div v-if="form.from.name" style="font-weight:700;font-size:15px;color:#0f172a;">{{ form.from.name }}</div>
          <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.6;">{{ form.from.address }}</div>
          <div style="color:#64748b;font-size:11px;">{{ form.from.email }}</div>
          <div v-if="form.from.phone" style="color:#64748b;font-size:11px;">{{ form.from.phone }}</div>
        </div>
        <div style="text-align:right;">
          <div :style="`font-size:30px;font-weight:800;letter-spacing:2px;color:${form.color};`">{{ docLabel }}</div>
          <div style="margin-top:10px;font-size:11px;color:#64748b;line-height:1.9;">
            <div><span style="font-weight:600;color:#334155;">{{ numberLabel }}:</span> {{ form.invoiceNumber }}</div>
            <div><span style="font-weight:600;color:#334155;">Date:</span> {{ form.date }}</div>
            <div v-if="form.dueDate"><span style="font-weight:600;color:#334155;">{{ dueDateLabel }}:</span> {{ form.dueDate }}</div>
          </div>
        </div>
      </div>

      <!-- Bill To -->
      <div :style="`background:#f8fafc;border-left:4px solid ${form.color};border-radius:4px;padding:14px 16px;margin-bottom:24px;`">
        <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Bill To</div>
        <div style="font-weight:700;color:#0f172a;font-size:14px;">{{ form.to.name || '—' }}</div>
        <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.6;">{{ form.to.address }}</div>
        <div style="color:#64748b;font-size:11px;">{{ form.to.email }}</div>
      </div>

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
        <thead>
          <tr :style="`background:${form.color};color:#fff;`">
            <th style="text-align:left;padding:9px 12px;border-radius:4px 0 0 4px;">Description</th>
            <th style="text-align:right;padding:9px 12px;width:52px;">Qty</th>
            <th style="text-align:right;padding:9px 12px;width:96px;">Rate</th>
            <th style="text-align:right;padding:9px 12px;width:96px;border-radius:0 4px 4px 0;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in form.items" :key="item.id" :style="i % 2 === 1 ? 'background:#f8fafc;' : ''">
            <td style="padding:9px 12px;color:#334155;">{{ item.description || '—' }}</td>
            <td style="padding:9px 12px;text-align:right;color:#64748b;">{{ item.quantity }}</td>
            <td style="padding:9px 12px;text-align:right;color:#64748b;">{{ fmt(item.rate) }}</td>
            <td style="padding:9px 12px;text-align:right;font-weight:600;">{{ fmt(item.quantity * item.rate) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
        <div style="width:230px;">
          <div style="display:flex;justify-content:space-between;color:#64748b;padding:4px 0;">
            <span>Subtotal</span><span>{{ fmt(subtotal) }}</span>
          </div>
          <div v-if="form.discountRate > 0" style="display:flex;justify-content:space-between;color:#16a34a;padding:4px 0;">
            <span>Discount ({{ form.discountRate }}%)</span><span>-{{ fmt(discountAmount) }}</span>
          </div>
          <div v-if="form.taxRate > 0" style="display:flex;justify-content:space-between;color:#64748b;padding:4px 0;">
            <span>Tax ({{ form.taxRate }}%)</span><span>{{ fmt(taxAmount) }}</span>
          </div>
          <div :style="`display:flex;justify-content:space-between;font-weight:800;font-size:16px;border-top:2px solid ${form.color};padding-top:10px;margin-top:6px;`">
            <span style="color:#0f172a;">Total</span>
            <span :style="`color:${form.color};`">{{ fmt(total) }}</span>
          </div>
        </div>
      </div>

      <NotesSig :form="form" />
    </div>

    <!-- ==================== MODERN ==================== -->
    <div v-else-if="form.template === 'modern'">
      <!-- Colored header bar -->
      <div :style="`background:${form.color};padding:28px 36px;`">
        <div style="display:flex;justify-content:space-between;align-items:center;">
          <div>
            <img v-if="form.logo" :src="form.logo" alt="Logo" style="height:48px;max-width:150px;object-fit:contain;display:block;margin-bottom:8px;filter:brightness(0) invert(1);" />
            <div style="color:rgba(255,255,255,0.95);font-weight:800;font-size:18px;">{{ form.from.name || 'Your Company' }}</div>
            <div style="color:rgba(255,255,255,0.7);font-size:11px;margin-top:2px;">{{ form.from.email }}</div>
          </div>
          <div style="text-align:right;">
            <div style="color:#fff;font-size:28px;font-weight:800;letter-spacing:3px;opacity:0.9;">{{ docLabel }}</div>
            <div style="color:rgba(255,255,255,0.8);font-size:11px;margin-top:6px;line-height:1.8;">
              <div>{{ numberLabel }}: {{ form.invoiceNumber }}</div>
              <div>Date: {{ form.date }}</div>
              <div v-if="form.dueDate">{{ dueDateLabel }}: {{ form.dueDate }}</div>
            </div>
          </div>
        </div>
      </div>

      <div style="padding:32px 36px;">
        <!-- From / To row -->
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;margin-bottom:28px;">
          <div>
            <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">From</div>
            <div style="font-weight:600;color:#0f172a;">{{ form.from.name || '—' }}</div>
            <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.6;">{{ form.from.address }}</div>
            <div v-if="form.from.phone" style="color:#64748b;font-size:11px;">{{ form.from.phone }}</div>
          </div>
          <div>
            <div style="font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:6px;">Bill To</div>
            <div style="font-weight:600;color:#0f172a;">{{ form.to.name || '—' }}</div>
            <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.6;">{{ form.to.address }}</div>
            <div style="color:#64748b;font-size:11px;">{{ form.to.email }}</div>
          </div>
        </div>

        <!-- Table -->
        <table style="width:100%;border-collapse:collapse;margin-bottom:24px;font-size:12px;">
          <thead>
            <tr style="border-bottom:2px solid #e2e8f0;">
              <th style="text-align:left;padding:8px 0;font-weight:700;color:#475569;font-size:10px;text-transform:uppercase;letter-spacing:0.5px;">Description</th>
              <th style="text-align:right;padding:8px 0;font-weight:700;color:#475569;font-size:10px;text-transform:uppercase;width:52px;">Qty</th>
              <th style="text-align:right;padding:8px 0;font-weight:700;color:#475569;font-size:10px;text-transform:uppercase;width:96px;">Rate</th>
              <th style="text-align:right;padding:8px 0;font-weight:700;color:#475569;font-size:10px;text-transform:uppercase;width:96px;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in form.items" :key="item.id" style="border-bottom:1px solid #f1f5f9;">
              <td style="padding:10px 0;color:#334155;">{{ item.description || '—' }}</td>
              <td style="padding:10px 0;text-align:right;color:#64748b;">{{ item.quantity }}</td>
              <td style="padding:10px 0;text-align:right;color:#64748b;">{{ fmt(item.rate) }}</td>
              <td style="padding:10px 0;text-align:right;font-weight:600;color:#0f172a;">{{ fmt(item.quantity * item.rate) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Totals -->
        <div style="display:flex;justify-content:flex-end;margin-bottom:24px;">
          <div style="width:230px;">
            <div style="display:flex;justify-content:space-between;color:#64748b;padding:4px 0;font-size:12px;">
              <span>Subtotal</span><span>{{ fmt(subtotal) }}</span>
            </div>
            <div v-if="form.discountRate > 0" style="display:flex;justify-content:space-between;color:#16a34a;padding:4px 0;font-size:12px;">
              <span>Discount ({{ form.discountRate }}%)</span><span>-{{ fmt(discountAmount) }}</span>
            </div>
            <div v-if="form.taxRate > 0" style="display:flex;justify-content:space-between;color:#64748b;padding:4px 0;font-size:12px;">
              <span>Tax ({{ form.taxRate }}%)</span><span>{{ fmt(taxAmount) }}</span>
            </div>
            <div :style="`display:flex;justify-content:space-between;font-weight:800;font-size:17px;background:${form.color}18;border-radius:8px;padding:10px 14px;margin-top:8px;`">
              <span style="color:#0f172a;">Total</span>
              <span :style="`color:${form.color};`">{{ fmt(total) }}</span>
            </div>
          </div>
        </div>

        <NotesSig :form="form" />
      </div>
    </div>

    <!-- ==================== MINIMAL ==================== -->
    <div v-else-if="form.template === 'minimal'" style="padding:48px;">
      <!-- Top: label only -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:48px;">
        <div>
          <img v-if="form.logo" :src="form.logo" alt="Logo" style="height:44px;max-width:140px;object-fit:contain;display:block;margin-bottom:12px;" />
          <div :style="`font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:${form.color};`">{{ docLabel }}</div>
        </div>
        <div style="text-align:right;font-size:11px;color:#94a3b8;line-height:2;">
          <div>{{ numberLabel }}: <span style="color:#334155;font-weight:600;">{{ form.invoiceNumber }}</span></div>
          <div>Date: <span style="color:#334155;font-weight:600;">{{ form.date }}</span></div>
          <div v-if="form.dueDate">{{ dueDateLabel }}: <span style="color:#334155;font-weight:600;">{{ form.dueDate }}</span></div>
        </div>
      </div>

      <!-- From / To -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;margin-bottom:40px;">
        <div>
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;">From</div>
          <div style="font-weight:600;color:#0f172a;font-size:13px;">{{ form.from.name || '—' }}</div>
          <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.8;margin-top:2px;">{{ form.from.address }}</div>
          <div style="color:#64748b;font-size:11px;">{{ form.from.email }}</div>
        </div>
        <div>
          <div style="font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#94a3b8;margin-bottom:8px;">Bill To</div>
          <div style="font-weight:600;color:#0f172a;font-size:13px;">{{ form.to.name || '—' }}</div>
          <div style="color:#64748b;white-space:pre-line;font-size:11px;line-height:1.8;margin-top:2px;">{{ form.to.address }}</div>
          <div style="color:#64748b;font-size:11px;">{{ form.to.email }}</div>
        </div>
      </div>

      <!-- Table -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:32px;font-size:12px;">
        <thead>
          <tr :style="`border-bottom:1px solid ${form.color};`">
            <th style="text-align:left;padding:6px 0;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;">Description</th>
            <th style="text-align:right;padding:6px 0;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;width:52px;">Qty</th>
            <th style="text-align:right;padding:6px 0;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;width:96px;">Rate</th>
            <th style="text-align:right;padding:6px 0;font-size:10px;font-weight:600;color:#94a3b8;letter-spacing:1.5px;text-transform:uppercase;width:96px;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in form.items" :key="item.id" style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:11px 0;color:#334155;">{{ item.description || '—' }}</td>
            <td style="padding:11px 0;text-align:right;color:#94a3b8;">{{ item.quantity }}</td>
            <td style="padding:11px 0;text-align:right;color:#94a3b8;">{{ fmt(item.rate) }}</td>
            <td style="padding:11px 0;text-align:right;font-weight:600;color:#334155;">{{ fmt(item.quantity * item.rate) }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:32px;">
        <div style="width:220px;">
          <div style="display:flex;justify-content:space-between;color:#94a3b8;padding:3px 0;font-size:11px;">
            <span>Subtotal</span><span>{{ fmt(subtotal) }}</span>
          </div>
          <div v-if="form.discountRate > 0" style="display:flex;justify-content:space-between;color:#16a34a;padding:3px 0;font-size:11px;">
            <span>Discount ({{ form.discountRate }}%)</span><span>-{{ fmt(discountAmount) }}</span>
          </div>
          <div v-if="form.taxRate > 0" style="display:flex;justify-content:space-between;color:#94a3b8;padding:3px 0;font-size:11px;">
            <span>Tax ({{ form.taxRate }}%)</span><span>{{ fmt(taxAmount) }}</span>
          </div>
          <div :style="`display:flex;justify-content:space-between;font-weight:700;font-size:18px;border-top:1px solid #e2e8f0;padding-top:12px;margin-top:8px;`">
            <span style="color:#0f172a;">Total</span>
            <span :style="`color:${form.color};`">{{ fmt(total) }}</span>
          </div>
        </div>
      </div>

      <NotesSig :form="form" />
    </div>

  </div>
</template>

<script setup>
import { computed, defineComponent, h } from 'vue'
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
function fmt(val) {
  const sym = symbols[props.form.currency] || '$'
  return `${sym}${Number(val || 0).toFixed(2)}`
}

// Shared Notes + Signature block
const NotesSig = defineComponent({
  props: ['form'],
  setup(p) {
    return () => [
      p.form.notes ? h('div', { style: 'border-top:1px solid #e2e8f0;padding-top:16px;margin-bottom:16px;' }, [
        h('div', { style: 'font-size:10px;font-weight:700;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;' }, 'Notes'),
        h('p', { style: 'font-size:11px;color:#475569;white-space:pre-line;margin:0;' }, p.form.notes),
      ]) : null,
      p.form.signature ? h('div', { style: 'border-top:1px solid #e2e8f0;padding-top:14px;' }, [
        h('img', { src: p.form.signature, alt: 'Signature', style: 'height:44px;object-fit:contain;' }),
        h('div', { style: 'font-size:11px;color:#94a3b8;margin-top:4px;' }, 'Authorized Signature'),
      ]) : null,
    ]
  }
})
</script>
