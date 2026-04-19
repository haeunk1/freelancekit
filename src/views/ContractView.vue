<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <div class="mb-4">
      <h1 class="text-2xl font-bold text-slate-900">{{ t('contract.title') }}</h1>
      <p class="text-sm text-slate-500">{{ t('contract.subtitle') }}</p>
    </div>

    <AdBanner size="leaderboard" />

    <div class="flex flex-col lg:flex-row gap-6 mt-4">
      <!-- Form -->
      <div class="lg:w-[440px] shrink-0 space-y-4">

        <!-- Contract Type -->
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <label class="label">{{ t('contract.type') }}</label>
          <select v-model="form.type" class="input">
            <option value="general">{{ t('contract.types.general') }}</option>
            <option value="web">{{ t('contract.types.web') }}</option>
            <option value="design">{{ t('contract.types.design') }}</option>
            <option value="writing">{{ t('contract.types.writing') }}</option>
          </select>
        </div>

        <!-- Freelancer -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('contract.freelancer') }}</h2>
          <input v-model="form.freelancerName" :placeholder="t('common.name')" class="input" />
          <textarea v-model="form.freelancerAddress" :placeholder="t('common.address')" rows="2" class="input resize-none" />
          <input v-model="form.freelancerEmail" :placeholder="t('common.email')" type="email" class="input" />
        </div>

        <!-- Client -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">{{ t('contract.client') }}</h2>
          <input v-model="form.clientName" :placeholder="t('common.name')" class="input" />
          <textarea v-model="form.clientAddress" :placeholder="t('common.address')" rows="2" class="input resize-none" />
          <input v-model="form.clientEmail" :placeholder="t('common.email')" type="email" class="input" />
        </div>

        <!-- Project -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Project</h2>
          <textarea v-model="form.projectDescription" :placeholder="t('contract.projectDescription')" rows="3" class="input resize-none" />
          <div class="grid grid-cols-2 gap-3">
            <div><label class="label">{{ t('contract.startDate') }}</label><input v-model="form.startDate" type="date" class="input" /></div>
            <div><label class="label">{{ t('contract.endDate') }}</label><input v-model="form.endDate" type="date" class="input" /></div>
          </div>
        </div>

        <!-- Payment -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Payment</h2>
          <div class="grid grid-cols-2 gap-3">
            <div>
              <label class="label">{{ t('contract.paymentAmount') }}</label>
              <div class="flex">
                <span class="border border-r-0 border-slate-200 rounded-l-lg px-3 py-2 bg-slate-50 text-slate-500 text-sm">$</span>
                <input v-model.number="form.paymentAmount" type="number" min="0" class="input rounded-l-none" />
              </div>
            </div>
            <div>
              <label class="label">{{ t('contract.paymentSchedule') }}</label>
              <select v-model="form.paymentSchedule" class="input">
                <option value="milestone">{{ t('contract.schedules.milestone') }}</option>
                <option value="monthly">{{ t('contract.schedules.monthly') }}</option>
                <option value="upfront">{{ t('contract.schedules.upfront') }}</option>
                <option value="completion">{{ t('contract.schedules.completion') }}</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Terms -->
        <div class="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
          <h2 class="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terms</h2>
          <div>
            <label class="label">{{ t('contract.revisions') }}</label>
            <select v-model="form.revisions" class="input">
              <option v-for="n in [1,2,3,5,10]" :key="n" :value="n">{{ n }}</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
          <div>
            <label class="label">{{ t('contract.ipRights') }}</label>
            <select v-model="form.ipRights" class="input">
              <option value="client">{{ t('contract.ipOptions.client') }}</option>
              <option value="freelancer">{{ t('contract.ipOptions.freelancer') }}</option>
              <option value="shared">{{ t('contract.ipOptions.shared') }}</option>
            </select>
          </div>
          <div>
            <label class="label">{{ t('contract.governingLaw') }}</label>
            <input v-model="form.governingLaw" placeholder="e.g. New York, USA" class="input" />
          </div>
        </div>

        <!-- Signature -->
        <div class="bg-white rounded-xl border border-slate-200 p-4">
          <SignaturePad v-model="form.signature" />
        </div>

        <div class="flex gap-3">
          <button @click="downloadPdf" :disabled="generating"
            class="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
            {{ generating ? t('common.generating') : t('contract.generate') }}
          </button>
        </div>
        <AdBanner size="rectangle" />
      </div>

      <!-- Preview -->
      <div class="flex-1 min-w-0">
        <div class="sticky top-20">
          <p class="text-xs text-slate-400 mb-2 font-medium uppercase tracking-wider">{{ t('common.preview') }}</p>
          <div id="contract-preview" class="bg-white border border-slate-200 rounded-xl p-8 shadow-sm text-sm text-slate-800 space-y-5" style="font-family: Arial, sans-serif;">
            <div class="text-center border-b border-slate-200 pb-4">
              <h2 class="text-xl font-bold text-slate-900 uppercase tracking-wide">{{ contractTitle }}</h2>
              <p class="text-xs text-slate-400 mt-1">Effective Date: {{ form.startDate || '___________' }}</p>
            </div>

            <section>
              <p class="font-semibold text-slate-700 mb-1">1. Parties</p>
              <p class="text-xs text-slate-600 leading-relaxed">
                This agreement is between <strong>{{ form.freelancerName || '[Freelancer Name]' }}</strong>
                ("Contractor"), located at {{ form.freelancerAddress || '[Address]' }},
                and <strong>{{ form.clientName || '[Client Name]' }}</strong> ("Client"),
                located at {{ form.clientAddress || '[Address]' }}.
              </p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">2. Scope of Work</p>
              <p class="text-xs text-slate-600 leading-relaxed">{{ form.projectDescription || 'The Contractor agrees to provide the following services: [describe project]' }}</p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">3. Timeline</p>
              <p class="text-xs text-slate-600">
                Project Start: <strong>{{ form.startDate || '___________' }}</strong> &nbsp;|&nbsp;
                Project End: <strong>{{ form.endDate || '___________' }}</strong>
              </p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">4. Payment</p>
              <p class="text-xs text-slate-600">
                Total Fee: <strong>${{ form.paymentAmount?.toLocaleString() || '0' }}</strong>.
                Payment schedule: {{ scheduleText }}.
              </p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">5. Revisions</p>
              <p class="text-xs text-slate-600">Client is entitled to {{ form.revisions }} revision(s). Additional revisions will be billed at the Contractor's standard hourly rate.</p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">6. Intellectual Property</p>
              <p class="text-xs text-slate-600">{{ ipText }}</p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">7. Termination</p>
              <p class="text-xs text-slate-600">Either party may terminate this agreement with 14 days written notice. Client shall pay for all work completed up to the termination date.</p>
            </section>

            <section>
              <p class="font-semibold text-slate-700 mb-1">8. Governing Law</p>
              <p class="text-xs text-slate-600">This agreement shall be governed by the laws of {{ form.governingLaw || '[State / Country]' }}.</p>
            </section>

            <!-- Signatures -->
            <div class="border-t border-slate-200 pt-4 grid grid-cols-2 gap-8">
              <div>
                <p class="text-xs font-semibold text-slate-600 mb-3">Contractor Signature</p>
                <div v-if="form.signature" class="mb-1"><img :src="form.signature" alt="sig" class="h-10 object-contain" /></div>
                <div v-else class="h-10 border-b border-slate-400 mb-1"></div>
                <p class="text-xs text-slate-500">{{ form.freelancerName || '_________________' }}</p>
              </div>
              <div>
                <p class="text-xs font-semibold text-slate-600 mb-3">Client Signature</p>
                <div class="h-10 border-b border-slate-400 mb-1"></div>
                <p class="text-xs text-slate-500">{{ form.clientName || '_________________' }}</p>
              </div>
            </div>

            <p class="text-xs text-slate-400 italic border-t border-slate-100 pt-3">{{ t('contract.disclaimer') }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import AdBanner from '@/components/common/AdBanner.vue'
import SignaturePad from '@/components/common/SignaturePad.vue'
import { exportToPdf } from '@/utils/pdfExport'

const { t } = useI18n()
const generating = ref(false)

const form = reactive({
  type: 'general',
  freelancerName: '', freelancerAddress: '', freelancerEmail: '',
  clientName: '', clientAddress: '', clientEmail: '',
  projectDescription: '',
  startDate: '', endDate: '',
  paymentAmount: null,
  paymentSchedule: 'milestone',
  revisions: 2,
  ipRights: 'client',
  governingLaw: '',
  signature: null,
})

const contractTitle = computed(() => {
  const map = { general: 'Freelance Service Agreement', web: 'Web Development Contract', design: 'Design Contract', writing: 'Writing & Content Contract' }
  return map[form.type] || 'Freelance Service Agreement'
})

const scheduleText = computed(() => {
  const map = { milestone: 'by agreed milestones', monthly: 'monthly', upfront: '50% upfront, 50% upon completion', completion: 'upon project completion' }
  return map[form.paymentSchedule]
})

const ipText = computed(() => {
  const map = {
    client: 'Upon receipt of full payment, the Client shall own all intellectual property rights to the deliverables.',
    freelancer: 'The Contractor retains all intellectual property rights. Client receives a non-exclusive license to use the deliverables.',
    shared: 'Intellectual property rights shall be shared equally between both parties.',
  }
  return map[form.ipRights]
})

async function downloadPdf() {
  generating.value = true
  try { await exportToPdf('contract-preview', `contract-${form.clientName || 'draft'}.pdf`) }
  finally { generating.value = false }
}
</script>

