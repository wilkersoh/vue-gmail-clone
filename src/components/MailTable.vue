<template>
<div>
  <div class="error" v-if="error">{{ error }}</div>
  <div v-else>
    <button @click="selectScreen('inbox')"
            :disabled="selectedScreen == 'inbox'"
    >Inbox</button>
    <button @click="selectScreen('archive')"
            :disabled="selectedScreen === 'archive'"
    >Archived</button>
    <bulk-action-bar
      :emails="filteredEmails"
    />
    <table>
      <tbody class="mail-table">
        <tr v-for="email in filteredEmails"
          :key="email.id"
          :class="['clickable', email.read ? 'read' : '']"
        >
          <td>
            <input
              type="checkbox"
              @click="emailSelection.togger(email)"
              :checked="emailSelection.emails.has(email)"
            />
          </td>
          <td @click="openEmail(email)">{{ email.from }}</td>
          <td @click="openEmail(email)">
            <p><strong>{{ email.subject }}</strong>- {{ email.body }}</p>
          </td>
          <td @click="openEmail(email)" class="date">{{ format(new Date(email.sentAt), 'MMM do yyyy') }}</td>
          <td><button @click="archiveEmail(email)">Archive</button></td>
        </tr>
      </tbody>
    </table>
  </div>
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
  import BulkActionBar from './BulkActionBar.vue';

  import useEmailSelection from '@/composable/useEmailSelection'

  import Endpoint from "@/utils/endpoint";

  export default {
    components: { MailView, ModalView, BulkActionBar },
    async setup() {
      const emailSelection = useEmailSelection();

      const state = reactive({
        emails: [],
        openedEmail: null,
        selectedScreen: 'inbox',
        error: "",
      });


      try {
        await new Promise(res => setTimeout(res, 2000))
        const {data} = await axios(Endpoint);
        state.emails = data;
      } catch (error) {
        state.error = error.message;
      }

      const selectScreen = (newScreen) => {
        state.selectedScreen = newScreen;
        emailSelection.clear();
      }

      const filteredEmails = computed(() => {
        let filtered = null;
        const sorted = state.emails.sort((e1, e2) => {
          return e1.sendAt < e2.sentAt ? 1 : -1;
        })

        if(state.selectedScreen === 'inbox') {
          filtered = sorted.filter(e => !e.archived)
        } else {
          filtered = sorted.filter(e => e.archived)
        }

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
          let emails = filteredEmails;
          let currentIndex = emails.value.findIndex(mail => mail.id === state.openedEmail.id)

          const newEmail = emails.value[currentIndex + changeIndex]

          openEmail(newEmail);
        }
      }

      return {
        format,
        filteredEmails,
        archiveEmail,
        openEmail,
        changeEmail,
        emailSelection,
        selectScreen,
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