import { onBeforeUnmount } from "vue";

const useKeydown = keyCombos => {
  let onKeydown = event => {
    let kc = keyCombos.find(kc => kc.key === event.key);
    if (kc) kc.fn();
  };

  window.addEventListener("keydown", onKeydown);

  onBeforeUnmount(() => {
    /* remove event before remove this instance component */
    window.removeEventListener("keydown", onKeydown);
  });
};

export default useKeydown;
