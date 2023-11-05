const HIDDEN_CLASS_NAME = "hidden_tlui";

export const hideStylePanel = (hide: boolean) => {
  const el = document.getElementsByClassName("tlui-style-panel__wrapper");
  if (!el) return;
  let elem = undefined;
  for (let i = 0; i < el.length; i++) {
    if (
      el.item(i)?.id !== "csviewer" &&
      el.item(i)?.id !== "diceroller" &&
      el.item(i)?.id !== "notesviewer"
    ) {
      elem = el.item(i);
      break;
    }
  }
  if (!elem) return;
  if (hide) elem.classList.add(HIDDEN_CLASS_NAME);
  else elem.classList.remove(HIDDEN_CLASS_NAME);
};

export const hideRestUi = (hide: boolean) => {
  console.log("hideRestUi", hide);
  const zones = ["tlui-navigation-zone", "tlui-menu-zone", "tlui-toolbar"];
  zones.forEach((z) => {
    const el = document.getElementsByClassName(z);
    if (!el) return;
    let elem = el[0];
    if (!elem) return;
    if (hide) elem.classList.add(HIDDEN_CLASS_NAME);
    else elem.classList.remove(HIDDEN_CLASS_NAME);
  });
};

export const prettyNow = () => {
  var date = new Date();
  return date.toLocaleTimeString(navigator.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const prettyToday = () => {
  var date = new Date();
  return date
    .toLocaleTimeString(navigator.language, {
      day: "2-digit",
      month: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
    .replaceAll(",", "_")
    .replaceAll(" ", "_");
};
