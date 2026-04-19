<template>
  <div>
    <p class="text-sm font-medium text-slate-700 mb-2">{{ t('common.signature') }}</p>

    <!-- Mode selector -->
    <div class="flex gap-1 mb-3">
      <button v-for="mode in modes" :key="mode"
        @click="activeMode = mode"
        type="button"
        :class="['px-3 py-1 text-xs rounded-md font-medium transition-colors border',
          activeMode === mode
            ? 'bg-indigo-600 text-white border-indigo-600'
            : 'bg-white text-slate-600 border-slate-300 hover:border-indigo-400']">
        {{ t(`common.${mode}`) }}
      </button>
    </div>

    <!-- Draw mode -->
    <div v-if="activeMode === 'draw'">
      <canvas ref="canvas"
        class="border border-slate-300 rounded-lg w-full bg-white cursor-crosshair touch-none"
        style="height:100px"
        @mousedown="startDraw" @mousemove="draw" @mouseup="endDraw" @mouseleave="endDraw"
        @touchstart.prevent="startTouch" @touchmove.prevent="moveTouch" @touchend="endDraw">
      </canvas>
    </div>

    <!-- Type mode -->
    <div v-if="activeMode === 'type'">
      <input v-model="typedName" type="text" :placeholder="t('common.typeYourName')"
        @input="renderTyped"
        class="w-full border border-slate-300 rounded-lg px-3 py-2 text-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        style="font-family: 'Dancing Script', cursive, Georgia, serif;" />
    </div>

    <!-- Upload mode -->
    <div v-if="activeMode === 'upload'">
      <label class="flex items-center gap-2 cursor-pointer group">
        <div class="border-2 border-dashed border-slate-300 group-hover:border-indigo-400 rounded-lg px-4 py-2 text-sm text-slate-500 group-hover:text-indigo-600 transition-colors">
          {{ t('common.upload') }} signature image
        </div>
        <input type="file" accept="image/*" class="hidden" @change="onUpload" />
      </label>
    </div>

    <!-- Preview & Clear -->
    <div v-if="modelValue" class="mt-2 flex items-center gap-3">
      <img :src="modelValue" alt="signature" class="h-10 border border-slate-200 rounded bg-white px-2" />
      <button @click="clearSig" type="button" class="text-xs text-red-500 hover:text-red-700 underline">
        {{ t('common.clearSignature') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps({ modelValue: { type: String, default: null } })
const emit = defineEmits(['update:modelValue'])

const modes = ['draw', 'type', 'upload']
const activeMode = ref('draw')
const canvas = ref(null)
const typedName = ref('')
let painting = false
let ctx = null

onMounted(() => setupCanvas())
watch(activeMode, () => { if (activeMode.value === 'draw') setTimeout(setupCanvas, 50) })

function setupCanvas() {
  if (!canvas.value) return
  const c = canvas.value
  c.width = c.offsetWidth * window.devicePixelRatio
  c.height = c.offsetHeight * window.devicePixelRatio
  ctx = c.getContext('2d')
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
  ctx.strokeStyle = '#1e293b'
  ctx.lineWidth = 2
  ctx.lineCap = 'round'
}

function getPos(e) {
  const r = canvas.value.getBoundingClientRect()
  return { x: e.clientX - r.left, y: e.clientY - r.top }
}

function startDraw(e) { painting = true; const p = getPos(e); ctx.beginPath(); ctx.moveTo(p.x, p.y) }
function draw(e) {
  if (!painting) return
  const p = getPos(e)
  ctx.lineTo(p.x, p.y); ctx.stroke()
  emit('update:modelValue', canvas.value.toDataURL())
}
function endDraw() { painting = false }

function startTouch(e) {
  painting = true
  const t = e.touches[0]
  const r = canvas.value.getBoundingClientRect()
  ctx.beginPath(); ctx.moveTo(t.clientX - r.left, t.clientY - r.top)
}
function moveTouch(e) {
  if (!painting) return
  const touch = e.touches[0]
  const r = canvas.value.getBoundingClientRect()
  ctx.lineTo(touch.clientX - r.left, touch.clientY - r.top); ctx.stroke()
  emit('update:modelValue', canvas.value.toDataURL())
}

function renderTyped() {
  if (!typedName.value) { emit('update:modelValue', null); return }
  const c = document.createElement('canvas'); c.width = 400; c.height = 80
  const cx = c.getContext('2d')
  cx.font = "italic 40px 'Georgia', serif"
  cx.fillStyle = '#1e293b'
  cx.fillText(typedName.value, 10, 55)
  emit('update:modelValue', c.toDataURL())
}

function onUpload(e) {
  const file = e.target.files[0]; if (!file) return
  const reader = new FileReader()
  reader.onload = (ev) => emit('update:modelValue', ev.target.result)
  reader.readAsDataURL(file)
}

function clearSig() {
  if (ctx && canvas.value) { ctx.clearRect(0, 0, canvas.value.width, canvas.value.height) }
  typedName.value = ''
  emit('update:modelValue', null)
}
</script>
