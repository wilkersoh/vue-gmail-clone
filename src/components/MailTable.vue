<template>
<div>
  <div class="error" v-if="error">{{ error }}</div>
  <table v-else>
    <tbody class="mail-table">
      <tr v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="email.read = true"
      >
        <td>
          <input type="checkbox">
        </td>
        <td>{{ email.from }}</td>
        <td>
          <p><strong>{{ email.subject }}</strong>- {{ email.body }}</p>
        </td>
        <td class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td><button @click="email.archived = true">Archive</button></td>
      </tr>
    </tbody>
  </table>
  </div>
</template>

<script>
  import {computed, reactive, toRefs} from 'vue';
  import {format} from 'date-fns';
  import axios from "axios";

  export default {
    async setup() {
      const state = reactive({
        emails: [],
        error: "",
      });
      try {
        await new Promise(res => setTimeout(res, 2000))
        const {data} = await axios("http://localhost:3000/emails");
        state.emails = data;
      } catch (error) {
        state.error = error.message;
      }

      const unarchivedEmails = computed(() => {
        const filtered = state.emails.sort((e1, e2) => {
          return e1.sendAt < e2.sentAt ? 1 : -1;
        }).filter(e => !e.archived)

        return filtered;
      })

      return {
        format,
        unarchivedEmails,
        ...toRefs(state),
      }
    },
  }
</script>


<style scoped>
.error {
  color: rgb(201, 56, 56)
}
</style>