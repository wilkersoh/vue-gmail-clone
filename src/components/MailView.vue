<template>
  <div class="email-display">
    <h2 class="mb-0">Subject: <strong>{{ email.subject }}</strong></h2>
    <div><em>{{ email.from }} on {{ format(new Date(email.sentAt), 'MMM do yyy') }}</em></div>
    <div v-html="marked(email.body)" />
  </div>
</template>

<script>
  import { format } from 'date-fns';
  import marked from 'marked'

  export default {
    props: {
      email: {
        type: Object,
        required: true
      }
    },
    setup(props) {
      return {
        format,
        marked
      }
    }
  }
</script>

<style scoped>

</style>