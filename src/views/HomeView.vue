<template>
  <div>
    <!-- Hero -->
    <section class="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-20 text-center">
        <div class="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
          <span class="w-2 h-2 bg-green-400 rounded-full"></span>
          Free · No Login · No Watermark
        </div>
        <h1 class="text-4xl sm:text-5xl font-bold leading-tight mb-4">
          Free Tools for<br />
          <span class="text-indigo-200">Freelancers Worldwide</span>
        </h1>
        <p class="text-indigo-100 text-lg sm:text-xl max-w-xl mx-auto mb-10">
          Create professional invoices, quotes, receipts, and contracts in seconds.
          Download as PDF instantly — no account needed.
        </p>
        <div class="flex flex-wrap justify-center gap-3">
          <RouterLink to="/invoice"
            class="bg-white text-indigo-600 font-semibold px-6 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
            Create Invoice →
          </RouterLink>
          <RouterLink to="/contract"
            class="bg-indigo-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-indigo-400 transition-colors border border-indigo-400">
            Create Contract
          </RouterLink>
        </div>

        <!-- Language badges -->
        <div class="flex flex-wrap justify-center gap-2 mt-8">
          <span v-for="lang in langs" :key="lang" class="bg-white/10 rounded-full px-3 py-1 text-xs font-medium">
            {{ lang }}
          </span>
        </div>
      </div>
    </section>

    <!-- Tools grid -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="text-2xl font-bold text-slate-900 text-center mb-2">Everything you need</h2>
      <p class="text-slate-500 text-center mb-10">Pick a tool and get started in seconds</p>

      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <RouterLink v-for="tool in tools" :key="tool.to" :to="tool.to"
          class="group bg-white border border-slate-200 rounded-2xl p-6 hover:border-indigo-300 hover:shadow-md transition-all">
          <div class="w-11 h-11 rounded-xl flex items-center justify-center mb-4 transition-colors"
            :style="`background:${tool.color}18;`">
            <span class="text-2xl">{{ tool.icon }}</span>
          </div>
          <h3 class="font-semibold text-slate-900 mb-1">{{ tool.title }}</h3>
          <p class="text-sm text-slate-500 leading-relaxed">{{ tool.desc }}</p>
          <div class="mt-4 text-sm font-medium text-indigo-600 group-hover:translate-x-1 transition-transform inline-block">
            Open →
          </div>
        </RouterLink>
      </div>
    </section>

    <!-- Why FreelanceKit -->
    <section class="bg-slate-50 border-y border-slate-200">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <h2 class="text-2xl font-bold text-slate-900 text-center mb-10">Why FreelanceKit?</h2>
        <div class="grid sm:grid-cols-3 gap-6">
          <div v-for="f in features" :key="f.title" class="text-center">
            <div class="w-14 h-14 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span class="text-3xl">{{ f.icon }}</span>
            </div>
            <h3 class="font-semibold text-slate-900 mb-2">{{ f.title }}</h3>
            <p class="text-sm text-slate-500 leading-relaxed">{{ f.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Templates preview -->
    <section class="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      <h2 class="text-2xl font-bold text-slate-900 text-center mb-2">Beautiful Templates</h2>
      <p class="text-slate-500 text-center mb-10">Choose from 3 designs and customize the color to match your brand</p>
      <div class="grid sm:grid-cols-3 gap-4">
        <div v-for="tpl in templates" :key="tpl.name"
          class="border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <!-- Mini document preview -->
          <div class="h-40 relative" :style="`background:${tpl.bg};`">
            <div v-if="tpl.hasHeader" class="w-full h-10 absolute top-0" style="background:#4f46e5;"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="w-28 bg-white rounded shadow-sm p-2 mt-4" :style="tpl.hasHeader ? 'margin-top:28px;' : ''">
                <div class="h-1.5 rounded mb-1" :style="`background:#4f46e5;width:60%;`"></div>
                <div class="h-1 rounded bg-slate-200 w-full mb-1"></div>
                <div class="h-1 rounded bg-slate-200 w-4/5 mb-1"></div>
                <div class="h-1 rounded bg-slate-200 w-3/5 mb-2"></div>
                <div class="h-1.5 rounded" :style="`background:#4f46e5;width:40%;margin-left:auto;`"></div>
              </div>
            </div>
          </div>
          <div class="p-4 bg-white border-t border-slate-100">
            <p class="font-semibold text-slate-900 text-sm">{{ tpl.name }}</p>
            <p class="text-xs text-slate-400 mt-0.5">{{ tpl.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="bg-indigo-600 text-white">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
        <h2 class="text-3xl font-bold mb-4">Start for free, right now</h2>
        <p class="text-indigo-200 mb-8">No account. No credit card. No watermarks. Just download and send.</p>
        <RouterLink to="/invoice"
          class="inline-block bg-white text-indigo-600 font-semibold px-8 py-3 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg">
          Create Your First Invoice →
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script setup>
const langs = ['🇺🇸 English', '🇰🇷 한국어', '🇪🇸 Español', '🇧🇷 Português', '🇫🇷 Français', '🇩🇪 Deutsch']

const tools = [
  {
    to: '/invoice', icon: '🧾', title: 'Invoice Generator', color: '#4f46e5',
    desc: 'Create and send professional invoices. Add line items, tax, and discount.',
  },
  {
    to: '/quote', icon: '📋', title: 'Quote Generator', color: '#0891b2',
    desc: 'Send polished quotes to clients before the project begins.',
  },
  {
    to: '/receipt', icon: '🗒️', title: 'Receipt Generator', color: '#059669',
    desc: 'Issue receipts for completed payments quickly and easily.',
  },
  {
    to: '/contract', icon: '✍️', title: 'Contract Generator', color: '#7c3aed',
    desc: 'Generate freelance contracts with legal-friendly templates.',
  },
]

const features = [
  {
    icon: '🆓', title: '100% Free',
    desc: 'All tools are completely free. No hidden fees, no premium tier, no watermarks.',
  },
  {
    icon: '🔒', title: 'No Login Required',
    desc: 'Jump straight in. Your data never leaves your browser — we store nothing.',
  },
  {
    icon: '⚡', title: 'Instant PDF',
    desc: 'Download a professional PDF in one click. Ready to send to your client.',
  },
  {
    icon: '🎨', title: 'Fully Customizable',
    desc: 'Upload your logo, add your signature, pick your brand color and template.',
  },
  {
    icon: '🌍', title: '6 Languages',
    desc: 'Available in English, Korean, Spanish, Portuguese, French, and German.',
  },
  {
    icon: '💼', title: 'Multi-Currency',
    desc: 'Supports USD, EUR, GBP, CAD, AUD and more for international clients.',
  },
]

const templates = [
  { name: 'Classic', desc: 'Clean layout with colored table header', bg: '#f8fafc', hasHeader: false },
  { name: 'Modern', desc: 'Bold colored banner with two-column layout', bg: '#fff', hasHeader: true },
  { name: 'Minimal', desc: 'Spacious and typographic, distraction-free', bg: '#fff', hasHeader: false },
]
</script>
