import axios from "axios";
import { reactive } from "vue";
import Endpoint from "@/utils/endpoint";

const emails = reactive(new Set()); /* can use multiple all point to this emails */

const useEmailSelection = () => {
  const togger = email => {
    if (emails.has(email)) {
      emails.delete(email);
    } else {
      emails.add(email);
    }
    console.log("emails:", emails);
  };

  const clear = () => {
    emails.clear();
  };

  const addMultiple = newEmails => {
    newEmails.forEach(email => {
      emails.add(email);
    });
  };

  const forSelected = fn => {
    console.log("fn: ", fn);
    emails.forEach(email => {
      fn(email);
      axios.put(`${Endpoint}/${email.id}`, email);
    });
  };

  /* Transform to below code, more clean
  const markRead = () => {
    emails.forEach(email => {
      email.read = true;
      axios.put()
    })
  }
  */

  const markRead = () => forSelected(email => (email.read = true));

  const markUnread = () => forSelected(email => (email.read = false));

  const archive = () => {
    forSelected(email => (email.archived = true));
    clear();
  };

  return {
    emails,
    togger,
    clear,
    addMultiple,
    markRead,
    markUnread,
    archive
  };
};

export default useEmailSelection;
