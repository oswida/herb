import { diceAnimatorRootStyle } from "./style.css";
import React, { useEffect, useState } from "react";
import DiceBox from "@3d-dice/dice-box-threejs";
import { useAtom } from "jotai";
import { animatedRollNotation } from "../../common";

const diceConfig = {
  framerate: 1 / 60,
  sounds: false,
  volume: 100,
  color_spotlight: 0xffffff, // 0xefdfd5,
  shadows: true,
  theme_surface: "green-felt",
  sound_dieMaterial: "plastic",
  theme_customColorset: null,
  theme_colorset: "white", // see available colorsets in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/colorsets.js
  theme_texture: "none", // see available textures in https://github.com/3d-dice/dice-box-threejs/blob/main/src/const/texturelist.js
  theme_material: "none", // "none" | "metal" | "wood" | "glass" | "plastic"
  gravity_multiplier: 400,
  light_intensity: 0.8,
  baseScale: 100,
  strength: 2, // toss strength of dice
  onRollComplete: () => {},
};

export const DiceAnimator = () => {
  const [db, setDb] = useState<any>(undefined);
  const [arn, setArn] = useAtom(animatedRollNotation);

  useEffect(() => {
    if (db !== undefined) return;
    const Box = new DiceBox("#dice-table", {
      ...diceConfig,
      baseScale: 75,
      gravity_multiplier: 400,
    });
    Box.initialize()
      .then(() => {
        // Box.loadTheme({
        //   colorset: loggedUser() ? loggedUser()?.settings.diceColor : "white",
        //   texture: loggedUser() ? loggedUser()?.settings.diceMaterial : "none",
        //   material: "none",
        // });
      })
      .catch((err: any) => {
        console.log("box initialize", err);
      });
    // Box.onRollComplete = (results: any) => {
    //   console.log("Roll complete ", results);
    // };
    setDb(Box);
  }, [db]);

  useEffect(() => {
    if (!db || arn.trim() === "") return;
    try {
      db.roll(arn);
      setArn("");
    } catch (e) {
      // Silent skip, some dice is not supported
    }
  }, [arn]);

  return <div className={diceAnimatorRootStyle} id="dice-table"></div>;
};
