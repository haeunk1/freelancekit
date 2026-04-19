<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">{{ t('hourlyRate.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('hourlyRate.subtitle') }}</p>
    </div>

    <AdBanner size="leaderboard" />

    <div class="mt-6 grid md:grid-cols-2 gap-6">
      <!-- Inputs -->
      <div class="space-y-4">
        <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <div>
            <label class="label">{{ t('hourlyRate.annualIncome') }}</label>
            <div class="flex">
              <span class="border border-r-0 border-slate-200 rounded-l-lg px-3 py-2 bg-slate-50 text-slate-500 text-sm">$</span>
              <input v-model.number="inputs.annualIncome" type="number" min="0" placeholder="60000" class="input rounded-l-none" />
            </div>
          </div>
          <div>
            <label class="label">{{ t('hourlyRate.hoursPerWeek') }}</label>
            <input v-model.number="inputs.hoursPerWeek" type="number" min="1" max="80" placeholder="40" class="input" />
          </div>
          <div>
            <label class="label">{{ t('hourlyRate.vacationWeeks') }}</label>
            <input v-model.number="inputs.vacationWeeks" type="number" min="0" max="52" placeholder="2" class="input" />
          </div>
          <div>
            <label class="label">{{ t('hourlyRate.nonBillable') }} <span class="text-slate-400 font-normal">({{ t('hourlyRate.nonBillableHint') }})</span></label>
            <input v-model.number="inputs.nonBillable" type="number" min="0" max="90" placeholder="20" class="input" />
          </div>
          <div>
            <label class="label">{{ t('hourlyRate.taxRate') }}</label>
            <input v-model.number="inputs.taxRate" type="number" min="0" max="60" placeholder="25" class="input" />
          </div>
        </div>
      </div>

      <!-- Results -->
      <div class="space-y-4">
        <div class="bg-indigo-600 rounded-xl p-6 text-white">
          <p class="text-indigo-200 text-sm mb-1">{{ t('hourlyRate.result') }}</p>
          <p class="text-5xl font-bold">${{ result.hourly }}</p>
          <p class="text-indigo-200 text-sm mt-1">per hour</p>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-3">
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('hourlyRate.perDay') }}</span>
            <span class="font-semibold text-slate-900">${{ result.daily }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('hourlyRate.perWeek') }}</span>
            <span class="font-semibold text-slate-900">${{ result.weekly }}</span>
          </div>
          <div class="flex justify-between items-center py-2 border-b border-slate-100">
            <span class="text-sm text-slate-600">{{ t('hourlyRate.perMonth') }}</span>
            <span class="font-semibold text-slate-900">${{ result.monthly }}</span>
          </div>
          <div class="flex justify-between items-center py-2 bg-amber-50 rounded-lg px-3">
            <span class="text-sm text-amber-700 font-medium">{{ t('hourlyRate.withTax') }}</span>
            <span class="font-bold text-amber-700">${{ result.withTax }}</span>
          </div>
        </div>

        <AdBanner size="rectangle" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdBanner from '@/components/common/AdBanner.vue'

const { t } = useI18n()

const inputs = reactive({
  annualIncome: 60000,
  hoursPerWeek: 40,
  vacationWeeks: 2,
  nonBillable: 20,
  taxRate: 25,
})

const result = computed(() => {
  const workWeeks = 52 - (inputs.vacationWeeks || 0)
  const totalHours = workWeeks * (inputs.hoursPerWeek || 40)
  const billableHours = totalHours * (1 - (inputs.nonBillable || 0) / 100)
  const hourly = billableHours > 0 ? (inputs.annualIncome || 0) / billableHours : 0
  const withTax = hourly / (1 - (inputs.taxRate || 0) / 100)
  const fmt = (n) => n.toFixed(2)
  return {
    hourly: fmt(hourly),
    daily: fmt(hourly * 8),
    weekly: fmt(hourly * (inputs.hoursPerWeek || 40)),
    monthly: fmt(hourly * (inputs.hoursPerWeek || 40) * workWeeks / 12),
    withTax: fmt(withTax),
  }
})
</script>

