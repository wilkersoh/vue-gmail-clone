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
  <ModalView
    v-if="openedEmail"
    @closeModal="openedEmail = null"
  >
    <MailView :email="openedEmail" @changeEmail="changeEmail" />
  </ModalView>
</div>
</template>

<script>
  import {computed, reactive, toRefs} from 'vue';
  import {format} from 'date-fns';
  import axios from "axios";
  import MailView from "@/components/MailView.vue"
  import ModalView from "@/components/ModalView.vue"
  import Endpoint from "@/utils/endpoint";


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
        state.openedEmail = email
        if(email) {
          email.read = true;
          updateEmail(email);
        }
      }

      const archiveEmail = (email) => {
        email.archived = true;
        updateEmail(email);
      }

      const changeEmail = ({toggleRead, toggleArchive, save, closeModal, changeIndex}) => {
        let email = state.openedEmail;
        if(toggleRead) email.read = !email.read;
        if(toggleArchive) email.archived = !email.archived;
        if(save) updateEmail(email)
        if(closeModal) state.openedEmail = null;

        if(changeIndex) {
          let emails = unarchivedEmails;
          let currentIndex = emails.value.findIndex(mail => mail.id === state.openedEmail.id)

          const newEmail = emails.value[currentIndex + changeIndex]

          openEmail(newEmail);
        }
      }

      return {
        format,
        unarchivedEmails,
        archiveEmail,
        openEmail,
        changeEmail,
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