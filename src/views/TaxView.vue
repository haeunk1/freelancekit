<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">{{ t('tax.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('tax.subtitle') }}</p>
    </div>

    <AdBanner size="leaderboard" />

    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <!-- Inputs -->
      <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
        <div>
          <label class="label">{{ t('tax.annualIncome') }}</label>
          <div class="flex">
            <span class="border border-r-0 border-slate-200 rounded-l-lg px-3 py-2 bg-slate-50 text-slate-500 text-sm">$</span>
            <input v-model.number="inputs.income" type="number" min="0" placeholder="80000" class="input rounded-l-none" />
          </div>
        </div>
        <div>
          <label class="label">{{ t('tax.expenses') }}</label>
          <div class="flex">
            <span class="border border-r-0 border-slate-200 rounded-l-lg px-3 py-2 bg-slate-50 text-slate-500 text-sm">$</span>
            <input v-model.number="inputs.expenses" type="number" min="0" placeholder="5000" class="input rounded-l-none" />
          </div>
        </div>
        <div>
          <label class="label">{{ t('tax.filingStatus') }}</label>
          <select v-model="inputs.filingStatus" class="input">
            <option value="single">{{ t('tax.single') }}</option>
            <option value="married">{{ t('tax.married') }}</option>
          </select>
        </div>
        <div>
          <label class="label">{{ t('tax.state') }}</label>
          <select v-model="inputs.state" class="input">
            <option v-for="s in states" :key="s.code" :value="s.code">{{ s.name }} ({{ s.rate }}%)</option>
          </select>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-3">
        <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">Net Self-Employment Income</span>
            <span class="font-medium">${{ fmt(result.netIncome) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('tax.selfEmploymentTax') }}</span>
            <span class="font-medium text-red-600">${{ fmt(result.seTax) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('tax.federalTax') }}</span>
            <span class="font-medium text-red-600">${{ fmt(result.federalTax) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('tax.stateTax') }}</span>
            <span class="font-medium text-red-600">${{ fmt(result.stateTax) }}</span>
          </div>
          <div class="flex justify-between py-2 border-b-2 border-slate-300 font-bold text-base">
            <span>{{ t('tax.totalTax') }}</span>
            <span class="text-red-600">${{ fmt(result.totalTax) }}</span>
          </div>
          <div class="flex justify-between py-2 bg-amber-50 rounded-lg px-3">
            <span class="text-sm font-medium text-amber-700">{{ t('tax.quarterlyPayment') }}</span>
            <span class="font-bold text-amber-700">${{ fmt(result.quarterly) }}</span>
          </div>
        </div>

        <!-- Set aside suggestion -->
        <div class="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <p class="text-sm text-indigo-700 font-medium">{{ t('tax.setSaside') }}</p>
          <p class="text-3xl font-bold text-indigo-600 mt-1">{{ result.setAsidePct }}%</p>
          <p class="text-xs text-indigo-500 mt-1">≈ ${{ fmt(result.setAsideMonthly) }} / month to save</p>
        </div>

        <AdBanner size="rectangle" />

        <p class="text-xs text-slate-400 italic">{{ t('tax.disclaimer') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdBanner from '@/components/common/AdBanner.vue'

const { t } = useI18n()

const states = [
  { code: 'TX', name: 'Texas', rate: 0 }, { code: 'FL', name: 'Florida', rate: 0 },
  { code: 'WA', name: 'Washington', rate: 0 }, { code: 'NV', name: 'Nevada', rate: 0 },
  { code: 'CA', name: 'California', rate: 9.3 }, { code: 'NY', name: 'New York', rate: 6.85 },
  { code: 'IL', name: 'Illinois', rate: 4.95 }, { code: 'GA', name: 'Georgia', rate: 5.75 },
  { code: 'NC', name: 'North Carolina', rate: 4.5 }, { code: 'AZ', name: 'Arizona', rate: 2.5 },
  { code: 'CO', name: 'Colorado', rate: 4.4 }, { code: 'VA', name: 'Virginia', rate: 5.75 },
  { code: 'Other', name: 'Other', rate: 5 },
]

const inputs = reactive({ income: 80000, expenses: 5000, filingStatus: 'single', state: 'TX' })

// 2025 US Federal tax brackets (single)
const bracketsSingle = [
  { max: 11925, rate: 0.10 }, { max: 48475, rate: 0.12 }, { max: 103350, rate: 0.22 },
  { max: 197300, rate: 0.24 }, { max: 250525, rate: 0.32 }, { max: 626350, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
]
const bracketsMarried = [
  { max: 23850, rate: 0.10 }, { max: 96950, rate: 0.12 }, { max: 206700, rate: 0.22 },
  { max: 394600, rate: 0.24 }, { max: 501050, rate: 0.32 }, { max: 751600, rate: 0.35 },
  { max: Infinity, rate: 0.37 },
]

function calcFederalTax(taxable, status) {
  const brackets = status === 'married' ? bracketsMarried : bracketsSingle
  const deduction = status === 'married' ? 29200 : 14600
  const agi = Math.max(0, taxable - deduction)
  let tax = 0, prev = 0
  for (const b of brackets) {
    if (agi <= prev) break
    tax += (Math.min(agi, b.max) - prev) * b.rate
    prev = b.max
  }
  return tax
}

const result = computed(() => {
  const gross = inputs.income || 0
  const expenses = inputs.expenses || 0
  const netIncome = Math.max(0, gross - expenses)
  const seTax = netIncome * 0.9235 * 0.153
  const seDeduction = seTax / 2
  const federalTaxable = netIncome - seDeduction
  const federalTax = calcFederalTax(federalTaxable, inputs.filingStatus)
  const stateRate = (states.find(s => s.code === inputs.state)?.rate || 0) / 100
  const stateTax = netIncome * stateRate
  const totalTax = seTax + federalTax + stateTax
  const quarterly = totalTax / 4
  const setAsidePct = gross > 0 ? Math.round((totalTax / gross) * 100) : 0
  const setAsideMonthly = totalTax / 12
  return { netIncome, seTax, federalTax, stateTax, totalTax, quarterly, setAsidePct, setAsideMonthly }
})

const fmt = (n) => Math.round(n || 0).toLocaleString()
</script>

