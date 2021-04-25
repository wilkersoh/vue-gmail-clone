<template>
  <div class="modal">
    <div class="overlay" @click="$emit('closeModal')"></div>
    <div class="modal-card">
      <slot />
    </div>
  </div>
</template>

<script>
import useKeydown from '@/composable/useKeydown';

  export default {
    setup(props, {emit}) {
      useKeydown([
        /* 需要 cb， 因為 是過後 才call的，
          如果沒有 cb, 根本 就是 不對的 javascript
          fn: console.log('dsds');
        */
        {key: 'Escape', fn: () => emit('closeModal')},
        {key: 'Enter', fn: () => console.log("tryrys")}
      ]);
    }
  }
</script>
