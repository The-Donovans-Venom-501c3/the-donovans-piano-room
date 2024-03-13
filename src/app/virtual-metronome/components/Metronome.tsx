import Image from "next/image";
import Slider from "@mui/material/Slider";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface MetronomeProps {
  beatsNum: number;
  tempoNum: number;
  beatEmp: number;
  animation: boolean;
}

const Metronome = ({
  beatsNum,
  tempoNum,
  beatEmp,
  animation,
}: MetronomeProps) => {
  const [soundState, setSoundState] = useState<string[]>([
    "Bongo.mp3",
    "BongoEmp.mp3",
  ]);
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);
  const [animatedImage, setAnimatedImage] = useState<number>(0);
  const [vol, setVol] = useState<number>(5);

  useEffect(() => {
    if (animation) {
      setAnimatedIndex(0);
      setAnimatedImage((prev) => prev + 1);
      const sound = new Audio(soundState[0]);
      const soundEmp = new Audio(soundState[1]);
      let index = 0;

      if (beatEmp === index) {
        soundEmp.volume = vol / 10;
        soundEmp.play();
        index = (index + 1) % beatsNum;
      } else {
        sound.volume = vol / 10;
        sound.play();
        index = (index + 1) % beatsNum;
      }

      const interval = setInterval(
        () => {
          if (beatEmp === index) {
            soundEmp.volume = vol / 10;
            soundEmp.play();
            index = (index + 1) % beatsNum;
            setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
          } else {
            sound.volume = vol / 10;
            sound.play();
            index = (index + 1) % beatsNum;
            setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
          }
        },
        (60 / tempoNum) * 1000,
      );

      // Clear the interval on component unmount to avoid memory leaks
      return () => clearInterval(interval);
    }
  }, [animation, beatsNum, tempoNum, beatEmp, vol]);

  const handleVol = (event: Event, value: number | number[]): void => {
    if (typeof value === "number") {
      setVol(value);
    }
  };

  function MarkingCalc(tempo: number): string {
    if (tempo >= 25 && tempo < 40) return "Grave";
    else if (tempo >= 40 && tempo < 60) return "Lento-Largo";
    else if (tempo >= 60 && tempo < 66) return "Larghetto";
    else if (tempo >= 66 && tempo < 76) return "Adagio";
    else if (tempo >= 76 && tempo < 108) return "Andante";
    else if (tempo >= 108 && tempo < 120) {
      if (tempo >= 112) return "Moderato-Allegretto";
      return "Moderato";
    } else return "Allegro";
  }

  return (
    <div className="flex basis-2/5 flex-col justify-between">
      <div className="metronome__container flex flex-col items-center border-2 p-10">
        <div className="ml-auto">
          <Image
            src="FullScreen.svg"
            width={200}
            height={200}
            alt="full screen icon"
            className="h-8 w-8"
          />
        </div>

        <h1
          className="text-5xl font-semibold text-black
                      desktop:text-7xl
                      "
        >
          {MarkingCalc(tempoNum)}
        </h1>
        <div className="mb-12 mt-6 flex w-72 gap-2 desktop:w-96">
          {Array.from({ length: beatsNum }, (_, index) => {
            if (index === beatEmp)
              if (animation) {
                return (
                  <motion.div
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 30,
                      border: `5px solid #FFA500`,
                    }}
                    animate={{
                      backgroundColor:
                        index === animatedIndex ? "rgb(186,85,211)" : "#D4D8D4",
                    }}
                  >
                    <div key={index}></div>
                  </motion.div>
                );
              } else
                return (
                  <div
                    key={index}
                    className="h-12 w-12 rounded-full border-4 border-solid text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl"
                    style={{
                      borderColor: "#FFA500",
                    }}
                  ></div>
                );

            if (animation) {
              return (
                <motion.div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 30,
                  }}
                  animate={{
                    backgroundColor:
                      index === animatedIndex ? "rgb(186,85,211)" : "#D4D8D4",
                  }}
                >
                  <div key={index}></div>
                </motion.div>
              );
            } else
              return (
                <div
                  key={index}
                  className="h-12 w-12 rounded-full border-2 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-20 desktop:w-20 desktop:text-5xl"
                ></div>
              );
          })}
        </div>
        <div
          className="relative h-[35rem] w-[30rem] bg-[url('/MetronomeMelody.svg')] bg-contain bg-center 
                        bg-no-repeat
                        laptop:h-[45rem]
                        desktop:h-[55rem] desktop:w-[35rem]
                      "
        >
          {animation ? (
            <motion.div
              key={animatedImage}
              animate={{
                rotate: Array.from({ length: 150 }, (_, index) => {
                  if (index < 76) {
                    return index;
                  } else return 150 - index;
                }),
              }}
              transition={{ repeat: Infinity, duration: 120 / tempoNum }}
              style={{ originX: 0.5, originY: 0.6 }}
            >
              <Image
                src="MetronomePendulum.svg"
                alt="metronome pendulum"
                width={200}
                height={200}
                className="z-1 relative left-[-4.5rem]
                        top-[-2.5rem]
                        h-[35rem] w-[40rem]
                        laptop:top-[-2rem] laptop:h-[45rem]
                        desktop:top-[1rem] desktop:h-[50rem] desktop:w-[50rem]
                      "
              />
            </motion.div>
          ) : (
            <div>
              <Image
                src="MetronomePendulum.svg"
                alt="metronome pendulum"
                width={200}
                height={200}
                className="z-1 relative left-[-4.5rem]
                    top-[-2.5rem]
                    h-[35rem] w-[40rem]
                    laptop:top-[-2rem] laptop:h-[45rem]
                    desktop:top-[1rem] desktop:h-[50rem] desktop:w-[50rem]
                  "
              />
            </div>
          )}
          <div
            className="absolute left-1/2 top-[22rem] z-10
                          h-8 
                          w-60 translate-x-[-50%]
                          bg-primary-yellow
                          laptop:top-[27.5rem] laptop:h-12
                          desktop:top-[33.5rem]
                        "
          ></div>
        </div>
      </div>

      <div className="volume__container flex flex-col items-center gap-5">
        <h2 className="text-4xl font-semibold desktop:text-5xl">Volume</h2>

        <Slider
          min={0}
          max={10}
          step={1}
          value={vol}
          onChange={handleVol}
          sx={{
            color: "#E98427",
          }}
        />
      </div>

      <div className="soundStyle__container">
        <ul className="flex w-full items-center justify-between text-3xl laptop:text-4xl desktop:text-5xl">
          <li
            className="cursor-pointer rounded-lg bg-primary-blue-accent p-5 font-semibold tracking-wide"
            onClick={() => {
              const newArray = [...soundState];
              // Modify the copied array
              newArray[0] = "Bongo.mp3";
              newArray[1] = "BongoEmp.mp3";
              // Update the state with the modified array
              setSoundState(newArray);
            }}
          >
            Bongo
          </li>
          <li
            className="cursor-pointer rounded-lg bg-primary-blue-accent p-5 font-semibold tracking-wide"
            onClick={() => {
              const newArray = [...soundState];
              // Modify the copied array
              newArray[0] = "Click.mp3";
              newArray[1] = "ClickEmp.mp3";
              // Update the state with the modified array
              setSoundState(newArray);
            }}
          >
            Click
          </li>
          <li
            className="cursor-pointer rounded-lg bg-primary-blue-accent p-5 font-semibold tracking-wide"
            onClick={() => {
              const newArray = [...soundState];
              // Modify the copied array
              newArray[0] = "Electric.mp3";
              newArray[1] = "ElectricEmp.mp3";
              // Update the state with the modified array
              setSoundState(newArray);
            }}
          >
            Electric
          </li>
          <li
            className="cursor-pointer rounded-lg bg-primary-blue-accent p-5 font-semibold tracking-wide"
            onClick={() => {
              const newArray = [...soundState];
              // Modify the copied array
              newArray[0] = "Percussion.mp3";
              newArray[1] = "PercussionEmp.mp3";
              // Update the state with the modified array
              setSoundState(newArray);
            }}
          >
            Percussion
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Metronome;
