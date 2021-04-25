<template>
  <div class="bulk-action-bar">
    <span class="checkbox">
    <input type="checkbox"
      :checked="allEmailsSelected"
      :class="[someEmailsSelected ? 'partial-check' : '']"
      @click="blukSelect"
    />
    </span>
    <span class="buttons">
      <button @click="emailSelection.markRead()"
              :disabled="Array.from(emailSelection.emails).every(e => e.read)"
      >Mark Read</button>
      <button @click="emailSelection.markUnread()"
              :disabled="Array.from(emailSelection.emails).every(e => !e.read)"
      >Mark Unread</button>
      <button @click="emailSelection.archive()"
              :disabled="emailSelection.emails.size === 0"
      >Archive</button>
    </span>
  </div>
</template>

<script>
  import {computed} from 'vue'
  import useEmailSelection from '@/composable/useEmailSelection';

  export default {
    props: {
      emails: {
        type: Array,
        required: true,
      }
    },
    setup(props) {
      const emailSelection = useEmailSelection();
      /*  computed 會 轉換去 ref 所以需要.value */
      const numberSelected = computed(() => emailSelection.emails.size);
      const numberEmails = computed(() => props.emails.length);

      const allEmailsSelected = computed(() => numberSelected.value === numberEmails.value)
      const someEmailsSelected = computed(() => numberSelected.value > 0 && numberSelected .value < numberEmails.value)

      const blukSelect = () => {
        if(allEmailsSelected.value) {
          emailSelection.clear();
        } else {
          emailSelection.addMultiple(props.emails);
        }
      }

      return {
        allEmailsSelected,
        someEmailsSelected,
        blukSelect,
        emailSelection,
      }
    }
  }
</script>

