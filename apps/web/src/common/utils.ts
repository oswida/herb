import { DiceRoll } from "@dice-roller/rpg-dice-roller";
import { Editor, TLBaseShape, TLShapePartial } from "@tldraw/tldraw";

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

export const rollNotationWithResults = (result: DiceRoll) => {
  try {
    const values: number[] = [];
    const dice = result.notation.split("+");
    const tr = result.rolls.filter((r: any) => r !== "+");
    const faces: string[] = [];
    dice.forEach((d) => {
      const idx = d.indexOf("d");
      if (idx) faces.push(d.substring(idx + 1));
    });
    for (let i = 0; i < faces.length; i++) {
      if (typeof tr[i] === "object" && faces[i] !== "52" && faces[i] !== "F") {
        if (faces[i] === "100") {
          const tens: number[] = [];
          const ones: number[] = [];
          (tr[i] as any).rolls.forEach((it: any) => {
            const num = Number.parseInt(it.value);
            if (num > 10) {
              const tns = Math.floor(num / 10);
              tens.push(10 * tns);
              ones.push(num - 10 * tns);
            } else {
              tens.push(0);
              ones.push(it.value);
            }
          });
          values.push(...tens);
          values.push(...ones);
        } else {
          (tr[i] as any).rolls.forEach((it: any) => values.push(it.value));
        }
      }
    }

    const nots: string[] = [];
    dice.forEach((d) => {
      const parts = d.split("d");
      if (parts[1] === "F" || parts[1] === "52") return;
      if (parts[1] === "100") {
        nots.push(d);
        nots.push(`${parts[0]}d10`);
      } else nots.push(d);
    });
    return `${nots.join("+")}@${values.join(",")}`;
  } catch (e: any) {
    console.error(e);
    return result.notation;
  }
};

export type RollValue = {
  dice: string;
  value: number;
  valueStr: string;
  color: string;
  isMax: boolean;
  isMin: boolean;
};

export const rollValues = (
  color: string,
  roll: DiceRoll | undefined,
  markers?: string[] | undefined
) => {
  const markerValue = (val: number, marker?: string) => {
    if (marker === "d2") return `${val - 1}`;
    if (marker == "card") return cardSymbol[val - 1];
    return `${val}`;
  };

  const rslt: RollValue[][] = [];
  if (!roll) return rslt;
  const dice = roll.notation.replaceAll("-", "+").split("+");
  const tr = roll.rolls.filter((r) => (r as any) !== "+" && (r as any) !== "-");
  if (dice.length !== tr.length) {
    console.error(
      "Bad roll results. Dice length=",
      dice.length,
      ", tr.length=",
      tr.length,
      roll
    );
    return rslt;
  }
  const faces: string[] = [];
  dice.forEach((d) => {
    const idx = d.indexOf("d");
    if (idx) faces.push(d.substring(idx));
  });

  for (let i = 0; i < faces.length; i++) {
    if (faces[i].toLowerCase().includes("d")) {
      if (typeof tr[i] === "object") {
        const a: RollValue[] = [];
        let min = Number.MAX_SAFE_INTEGER;
        let max = -1;
        (tr[i] as any).rolls.forEach((e: any) => {
          const val: RollValue = {
            dice: faces[i].toLowerCase(),
            value: e.value,
            valueStr: markerValue(e.value, markers ? markers[i] : ""),
            isMax: false,
            isMin: false,
            color: color,
          };
          if (val.value >= max) max = val.value;
          if (val.value <= min) min = val.value;
          a.push(val);
        });
        a.forEach((it) => {
          it.isMax = it.value === max && faces[i] !== "d52";
          it.isMin = it.value === min && faces[i] !== "d52";
        });
        rslt.push(a);
      }
    }
  }

  return rslt;
};

export function shuffleArray<T>(array: T[]): T[] {
  const length = array.length;
  for (let i = length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export const isImage = (mime: string) => {
  return [
    "image/jpeg",
    "image/png",
    "image/gif",
    "image/svg+xml",
    "image/webp",
  ].includes(mime);
};

export const isPdf = (mime: string) => {
  return ["application/pdf"].includes(mime);
};

export const isMarkdown = (mime: string) => {
  return ["text/markdown"].includes(mime);
};

export const compactColors = [
  "#f44336",
  "#e91e63",
  "#9c27b0",
  "#673ab7",
  "#3f51b5",
  "#2196f3",
  "#03a9f4",
  "#00bcd4",
  "#009688",
  "#4caf50",
  "#8bc34a",
  "#cddc39",
  "#ffeb3b",
  "#ffc107",
  "#ff9800",
  "#ff5722",
  "#795548",
  "#607d8b",
  "#ffffff",
  "#000000",
];

export const updateShapeFields = (
  editor: Editor,
  shape: TLBaseShape<any, any>,
  values: object
) => {
  const shapeUpdate: TLShapePartial<any> = {
    id: shape.id,
    type: shape.type,
    props: {
      ...values,
    },
  };
  editor.updateShapes([shapeUpdate]);
};
