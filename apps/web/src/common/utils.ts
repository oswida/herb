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

export const cardSymbol = [
  "A♠",
  "2♠",
  "3♠",
  "4♠",
  "5♠",
  "6♠",
  "7♠",
  "8♠",
  "9♠",
  "10♠",
  "J♠",
  "Q♠",
  "K♠",
  "A♥",
  "2♥",
  "3♥",
  "4♥",
  "5♥",
  "6♥",
  "7♥",
  "8♥",
  "9♥",
  "10♥",
  "J♥",
  "Q♥",
  "K♥",
  "A♦",
  "2♦",
  "3♦",
  "4♦",
  "5♦",
  "6♦",
  "7♦",
  "8♦",
  "9♦",
  "10♦",
  "J♦",
  "Q♦",
  "K♦",
  "A♣",
  "2♣",
  "3♣",
  "4♣",
  "5♣",
  "6♣",
  "7♣",
  "8♣",
  "9♣",
  "10♣",
  "J♣",
  "Q♣",
  "K♣",
];

export const generateSerialKeys = (length: number, separator: string) => {
  separator = separator || "-";
  var license = new Array(length + 1)
    .join((Math.random().toString(36) + "00000000000000000").slice(2, 18))
    .slice(0, length);
  return license
    .toUpperCase()
    .replace(/(\w{4})/g, "$1" + separator)
    .substring(0, length + Math.round(length / 4) - 1);
};
