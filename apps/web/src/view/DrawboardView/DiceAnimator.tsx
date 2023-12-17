import { diceAnimatorRootStyle } from "./style.css";
import React, { useEffect, useState } from "react";
import DiceBox from "@3d-dice/dice-box-threejs";
import { useAtom } from "jotai";
import { animatedRollNotation } from "../../common";
import useLocalStorage from "use-local-storage";

const diceConfig = {
  framerate: 1 / 60,
  sounds: false,
  volume: 100,
  color_spotlight: 0xffffff, // 0xefdfd5,
  shadows: true,
  theme_surface: "green-felt",
  sound_dieMaterial: "plastic",
  theme_customColorset: null,
  theme_colorset: "none", // see available colorsets in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/colorsets.js
  theme_texture: "none", // see available textures in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/texturelist.js
  theme_material: "plastic", // "none" | "metal" | "wood" | "glass" | "plastic"
  gravity_multiplier: 400,
  light_intensity: 0.8,
  baseScale: 100,
  strength: 2, // toss strength of dice
  onRollComplete: () => {},
};

// metal, wood, paper, stone

export const DiceAnimator = () => {
  const [db, setDb] = useState<any>(undefined);
  const [arn, setArn] = useAtom(animatedRollNotation);
  const [diceColor] = useLocalStorage("herbDiceColor", "necrotic");
  const [diceMaterial] = useLocalStorage("herbDiceMaterial", "plastic");
  const [animateDice] = useLocalStorage("herbDiceAnimate", "false");

  useEffect(() => {
    if (db !== undefined) return;
    const Box = new DiceBox("#dice-table", {
      ...diceConfig,
      baseScale: 75,
      gravity_multiplier: 400,
      theme_colorset: diceColor,
      theme_material: diceMaterial,
    });
    Box.initialize()
      .then(() => {})
      .catch((err: any) => {
        console.log("box initialize", err);
      });
    // Box.onRollComplete = (results: any) => {
    //   console.log("Roll complete ", results);
    // };
    setDb(Box);
  }, [db]);

  useEffect(() => {
    if (!db) return;
    db.loadTheme({
      theme_colorset: diceColor,
      theme_material: diceMaterial,
    });
  }, [diceColor, diceMaterial]);

  useEffect(() => {
    if (!db || arn.trim() === "" || animateDice !== "true") return;
    try {
      db.roll(arn);
      setArn("");
    } catch (e) {
      // Silent skip, some dice is not supported
    }
  }, [arn]);

  return <div className={diceAnimatorRootStyle} id="dice-table"></div>;
};
