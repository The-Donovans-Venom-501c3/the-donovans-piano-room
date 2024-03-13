"use client";

import Image from "next/image";
import Slider from "@mui/material/Slider";
import { useState } from "react";

interface TempoSettingProps {
  beatsNum: number;
  setBeats: React.Dispatch<React.SetStateAction<number>>;
  tempoNum: number;
  setTempo: React.Dispatch<React.SetStateAction<number>>;
  beatEmp: number;
  setBeatEmp: React.Dispatch<React.SetStateAction<number>>;
  setAnimation: React.Dispatch<React.SetStateAction<boolean>>;
}

const TempoSetting = ({
  beatsNum,
  setBeats,
  tempoNum,
  setTempo,
  beatEmp,
  setBeatEmp,
  setAnimation,
}: TempoSettingProps) => {
  const [note, setNote] = useState<number>(2);
  const [time, setTime] = useState<number>(0);

  const handleTempo = (num: number): void => {
    if ((tempoNum < 30 && num === -5) || (tempoNum < 26 && num === -1)) {
      setTempo(25);
    } else if ((tempoNum > 163 && num === 5) || (tempoNum > 167 && num === 1)) {
      setTempo(168);
    } else {
      setTempo((prev) => prev + num);
    }
  };

  const handleChangeTempo = (event: Event, value: number | number[]): void => {
    if (typeof value === "number") {
      setTempo(value);
    }
  };

  const handleBeats = (num: number): void => {
    if ((beatsNum < 7 && num === -5) || (beatsNum < 3 && num === -1)) {
      setBeats(2);
    } else if ((beatsNum > 5 && num === 5) || (beatsNum > 9 && num === 1)) {
      setBeats(10);
    } else {
      setBeats((prev) => prev + num);
    }
  };

  const handleChangeBeats = (event: Event, value: number | number[]): void => {
    if (typeof value === "number") {
      setBeats(value);
    }
  };

  const handleBeatEmp = (num: number): void => {
    if ((beatEmp < 4 && num === -5) || (beatEmp < 0 && num === -1)) {
      setBeatEmp(-1);
    } else {
      setBeatEmp((prev) => prev + num);
    }
  };

  const calculateTempo = (): void => {
    if (time === 0) {
      const d = new Date();
      const t = d.getTime();
      setTime(t);
    } else {
      const d = new Date();
      const t = d.getTime();
      const tempCal = Math.floor(60 / ((t - time) / 1000));

      if (tempCal < 20) {
        setTempo(20);
      } else if (tempCal > 168) {
        setTempo(168);
      } else {
        setTempo(tempCal);
      }
      setTime(t);
    }
  };

  const handleNote = (num: number): void => {
    if (note === 2 && num === -1) {
      setNote(2);
    } else if (note === 16 && num === 1) {
      setNote(16);
    } else if (num === -1) {
      setNote((prev) => prev / 2);
    } else {
      setNote((prev) => prev * 2);
    }
  };

  return (
    <div className="flex basis-3/5 flex-col justify-around px-10">
      <div className="tempo__container flex flex-col desktop:gap-5">
        <div className="flex flex-col items-center gap-5">
          <h2 className="text-4xl font-semibold desktop:text-6xl">Tempo</h2>
          <h2 className="text-5xl font-semibold desktop:text-8xl">
            {tempoNum}
          </h2>
        </div>

        <div className="flex gap-10">
          <div className="flex gap-5">
            <button
              onClick={() => handleTempo(-5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              -5
            </button>

            <button
              onClick={() => handleTempo(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              -
            </button>
          </div>
          <Slider
            min={25}
            max={168}
            step={1}
            value={tempoNum}
            onChange={handleChangeTempo}
            sx={{
              color: "#E98427",
            }}
          />
          <div className="flex gap-5">
            <button
              onClick={() => handleTempo(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              +
            </button>
            <button
              onClick={() => handleTempo(5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              +5
            </button>
          </div>
        </div>
      </div>

      <div className="beats__container flex flex-col desktop:gap-5">
        <div className="flex items-center justify-center gap-5">
          <h2 className="text-4xl font-semibold desktop:text-6xl">Beats</h2>
          <h2 className="text-4xl font-semibold desktop:text-7xl">
            {beatsNum}
          </h2>
        </div>

        <div className="flex gap-10">
          <div className="flex gap-5">
            <button
              onClick={() => handleBeats(-5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              -5
            </button>

            <button
              onClick={() => handleBeats(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              -
            </button>
          </div>
          <Slider
            min={2}
            max={10}
            step={1}
            value={beatsNum}
            onChange={handleChangeBeats}
            sx={{
              color: "#E98427",
            }}
          />
          <div className="flex gap-5">
            <button
              onClick={() => handleBeats(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              +
            </button>
            <button
              onClick={() => handleBeats(5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold desktop:scale-125"
            >
              +5
            </button>
          </div>
        </div>
      </div>

      <div className="beatEmphasis__container flex flex-col gap-5 desktop:gap-10">
        <div className="flex items-center justify-center gap-5">
          <h2 className="text-3xl font-semibold desktop:text-5xl">
            Beat Emphasis
          </h2>
        </div>

        <div className="flex items-center justify-center gap-10 desktop:scale-125">
          <div className="flex gap-5">
            <button
              onClick={() => handleBeatEmp(-5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
            >
              -5
            </button>

            <button
              onClick={() => handleBeatEmp(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
            >
              -
            </button>
          </div>

          <h2 className="text-5xl font-semibold">
            {beatEmp < 0 ? 0 : beatEmp + 1}
          </h2>

          <div className="flex gap-5">
            <button
              onClick={() => handleBeatEmp(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
            >
              +
            </button>
            <button
              onClick={() => handleBeatEmp(5)}
              className="flex h-12 w-16 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
            >
              +5
            </button>
          </div>
        </div>
      </div>

      <div className="timeSignature__container flex flex-col items-center space-y-5 desktop:scale-125 desktop:gap-4">
        <div className="flex justify-center">
          <h2 className="text-3xl font-semibold desktop:text-4xl">
            Time Signature
          </h2>
        </div>
        <div className="flex justify-center">
          <div className="flex gap-5">
            <div className="flex">
              <button
                onClick={() => handleBeats(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
              >
                -
              </button>
            </div>
            <h2 className="text-5xl font-semibold">{beatsNum}</h2>
            <div className="flex">
              <button
                onClick={() => handleBeats(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>
        <hr className="h-1 w-3/12 bg-yellow-500"></hr>
        <div className="flex justify-center">
          <div className="flex gap-5">
            <div className="flex">
              <button
                onClick={() => handleNote(-1)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
              >
                -
              </button>
            </div>
            <h2 className="text-5xl font-semibold">{note}</h2>
            <div className="flex">
              <button
                onClick={() => handleNote(1)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-light-orange text-2xl font-semibold"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="tapTempo__container flex justify-center gap-10 desktop:scale-125">
        <div className="flex cursor-pointer items-center justify-center rounded-full bg-primary-yellow p-5">
          <Image
            src="PlayButton.svg"
            width={80}
            height={80}
            alt="PlayButton"
            className="ml-2 h-24 w-24"
            onClick={() => setAnimation((prev) => !prev)}
          />
        </div>

        <button
          onClick={() => calculateTempo()}
          className="rounded-full bg-primary-yellow px-16 text-6xl font-semibold"
        >
          Tap Tempo
        </button>
      </div>

      <div className="metronomePresets__container flex justify-between">
        <div className="flex items-center gap-4 text-3xl font-semibold desktop:text-5xl">
          <p>Metronome Presets</p>
          <button className="h-12 w-12 rounded-full border-2 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl">
            1
          </button>
          <button className="h-12 w-12 rounded-full border-2 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl">
            2
          </button>
          <button className="h-12 w-12 rounded-full border-2 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl">
            3
          </button>
          <button className="h-12 w-12 rounded-full border-2 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl">
            4
          </button>
        </div>
        <button className="rounded-lg border-2 border-solid border-orange-400 px-4 py-2 text-lg font-semibold desktop:text-5xl">
          Clear
        </button>
      </div>
    </div>
  );
};

export default TempoSetting;
