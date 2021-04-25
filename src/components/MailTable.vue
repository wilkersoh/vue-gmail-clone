<template>
<div>
  <div class="error" v-if="error">{{ error }}</div>
  <table v-else>
    <tbody class="mail-table">
      <tr v-for="email in unarchivedEmails"
        :key="email.id"
        :class="['clickable', email.read ? 'read' : '']"
        @click="openEmail(email)"
      >
        <td>
          <input type="checkbox">
        </td>
        <td>{{ email.from }}</td>
        <td>
          <p><strong>{{ email.subject }}</strong>- {{ email.body }}</p>
        </td>
        <td class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
        <td><button @click="archiveEmail(email)">Archive</button></td>
      </tr>
    </tbody>
  </table>
  <ModalView v-if="openedEmail" @closeModal="openedEmail = null">
    <MailView :email="openedEmail" />
  </ModalView>
</div>
</template>

<script>
  import {computed, reactive, toRefs} from 'vue';
  import {format} from 'date-fns';
  import axios from "axios";
  import MailView from "@/components/MailView.vue"
  import ModalView from "@/components/ModalView.vue"

  const Endpoint = "http://localhost:3000/emails";

  export default {
    components: { MailView, ModalView },
    async setup() {
      const state = reactive({
        emails: [],
        openedEmail: null,
        error: "",
      });
      try {
        await new Promise(res => setTimeout(res, 2000))
        const {data} = await axios(Endpoint);
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

      const updateEmail = (email) =>{
        axios.put(`${Endpoint}/${email.id}`, email)
      }

      const openEmail = (email) => {
        email.read = true;
        updateEmail(email);
        state.openedEmail = email
      }
      const archiveEmail = (email) => {
        email.archived = true;
        updateEmail(email);
      }

      return {
        format,
        unarchivedEmails,
        archiveEmail,
        openEmail,
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