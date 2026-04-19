<template>
  <!-- AdSense 승인 전: placeholder 표시, 승인 후 ins 태그로 교체 -->
  <div v-if="show" :class="wrapClass">
    <div class="bg-slate-100 border border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 text-xs" :class="sizeClass">
      Advertisement
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  size: { type: String, default: 'leaderboard' }, // leaderboard | rectangle
  show: { type: Boolean, default: true },
})

const wrapClass = computed(() => props.size === 'rectangle' ? 'flex justify-center my-2' : 'flex justify-center my-3')
const sizeClass = computed(() => props.size === 'rectangle' ? 'w-[300px] h-[250px]' : 'w-full max-w-[728px] h-[90px]')
</script>
