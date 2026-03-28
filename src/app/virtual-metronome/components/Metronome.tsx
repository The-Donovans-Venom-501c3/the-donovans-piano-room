import Image from "next/image";
import Slider from "@mui/material/Slider";
import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

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
    "Bongo.wav",
    "BongoEmp.wav",
  ]);
  const [animatedIndex, setAnimatedIndex] = useState<number>(0);
  const [animatedImage, setAnimatedImage] = useState<number>(0);
  const [vol, setVol] = useState<number>(5);
  const isFirstRender = useRef(true);
  const timePassed = useRef(0);
  const counter = useRef(1);
  const isCorner = useRef(false);
  const index = useRef(0);
  let interval2: NodeJS.Timeout;

  useEffect(() => {
    if (animation) {
      if (isFirstRender.current) {
        setAnimatedIndex(0);
        setAnimatedImage((prev) => prev + 1);
        const sound = new Audio(soundState[0]);
        const soundEmp = new Audio(soundState[1]);

        if (beatEmp === index.current) {
          soundEmp.volume = vol / 10;
          soundEmp.play();
          index.current = (index.current + 1) % beatsNum;
        } else {
          sound.volume = vol / 10;
          sound.play();
          index.current = (index.current + 1) % beatsNum;
        }

        const interval = setInterval(
          () => {
            if (beatEmp === index.current) {
              soundEmp.volume = vol / 10;
              soundEmp.play();
              index.current = (index.current + 1) % beatsNum;
              setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
            } else {
              sound.volume = vol / 10;
              sound.play();
              index.current = (index.current + 1) % beatsNum;
              setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
            }
          },
          (60 / tempoNum) * 1000,
        );

        const timer = setInterval(() => {
          timePassed.current++;
          if (
            timePassed.current ===
            Math.floor((60 / tempoNum) * counter.current * 100)
          ) {
            counter.current++;
            isCorner.current = true;
          } else {
            isCorner.current = false;
          }
        }, 10);

        isFirstRender.current = false;
        // Clear the interval on component unmount to avoid memory leaks
        return () => {
          clearInterval(interval);
          clearInterval(timer);
        };
      } else {
        console.log("not first render");

        const waitForIsCorner = async () => {
          while (!isCorner.current) {
            // Wait for 10 milliseconds before checking again
            await new Promise((resolve) => setTimeout(resolve, 10));
          }
          // Once isCorner is true, execute your code here
          console.log("isCorner is true now!");

          const sound = new Audio(soundState[0]);
          const soundEmp = new Audio(soundState[1]);

          if (beatEmp === index.current) {
            soundEmp.volume = vol / 10;
            soundEmp.play();
            index.current = (index.current + 1) % beatsNum;
            setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
          } else {
            sound.volume = vol / 10;
            sound.play();
            index.current = (index.current + 1) % beatsNum;
            setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
          }

          interval2 = setInterval(
            () => {
              if (beatEmp === index.current) {
                soundEmp.volume = vol / 10;
                soundEmp.play();
                index.current = (index.current + 1) % beatsNum;
                setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
              } else {
                sound.volume = vol / 10;
                sound.play();
                index.current = (index.current + 1) % beatsNum;
                setAnimatedIndex((prevIndex) => (prevIndex + 1) % beatsNum);
              }
            },
            (60 / tempoNum) * 1000,
          );
        };

        const timer = setInterval(() => {
          timePassed.current++;
          if (
            timePassed.current ===
            Math.floor((60 / tempoNum) * counter.current * 100)
          ) {
            counter.current++;
            isCorner.current = true;
          } else {
            isCorner.current = false;
          }
        }, 10);

        waitForIsCorner();

        return () => {
          clearInterval(interval2);
          clearInterval(timer);
        };
      }
    }
  }, [animation, beatsNum, tempoNum, beatEmp, vol, soundState]);

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
        <div className="mb-12 mt-6 flex gap-2">
          {Array.from({ length: beatsNum }, (_, index) => {
            if (index === beatEmp)
              if (animation) {
                return (
                  <motion.div
                    key={index}
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 30,
                      border: `5px solid #FFA500`,
                    }}
                    animate={{
                      backgroundColor:
                        index === animatedIndex ? "rgb(186,85,211)" : "#D4D8D4",
                    }}
                  >
                    <div></div>
                  </motion.div>
                );
              } else
                return (
                  <div
                    key={index}
                    className="h-10 w-10 rounded-full border-4 border-solid text-2xl font-semibold desktop:h-16 desktop:w-16 desktop:text-5xl"
                    style={{
                      borderColor: "#FFA500",
                    }}
                  ></div>
                );

            if (animation) {
              return (
                <motion.div
                  key={index}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 30,
                  }}
                  animate={{
                    backgroundColor:
                      index === animatedIndex ? "rgb(186,85,211)" : "#D4D8D4",
                  }}
                >
                  <div></div>
                </motion.div>
              );
            } else
              return (
                <div
                  key={index}
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 30,
                  }}
                  className="rounded-fulls mt--5 h-16 w-16 border-solid bg-zinc-300 text-2xl font-semibold desktop:h-16 desktop:w-16 desktop:text-5xl"
                ></div>
              );
          })}
        </div>
        <div
          className="relative h-[36rem] w-[30rem] overflow-hidden bg-[url('/MetronomeMelody.svg')] bg-contain 
                        bg-center
                        bg-no-repeat
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
                className="z-1 laptop: relative
                left-[-4.2rem]
                top-[-2.5rem]
                h-[37rem] w-[40rem]
                desktop:left-[-6rem] desktop:top-[-5rem] desktop:mt-40 desktop:h-[40rem] desktop:w-[50rem]
                      "
              />
            </motion.div>
          ) : (
            <div>
              <Image
                src="MetronomePendulum.svg"
                alt="metronome pendulum"
                width={150}
                height={150}
                className="z-1 laptop: relative
                    left-[-4rem] top-[-2.5rem]
                    h-[38rem] w-[40rem]
                    desktop:left-[-6rem] desktop:top-[-5rem] desktop:mt-40 desktop:h-[40rem] desktop:w-[50rem]
                  "
              />
            </div>
          )}
          <div
            className="absolute left-1/2 top-[22rem] z-10
                          mt-3
                          h-11
                          w-60 translate-x-[-50%]
                          bg-primary-yellow
                          desktop:top-[32.5rem]
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
              newArray[0] = "Bongo.wav";
              newArray[1] = "BongoEmp.wav";
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
              newArray[0] = "Click.wav";
              newArray[1] = "ClickEmp.wav";
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
              newArray[0] = "Electric.wav";
              newArray[1] = "ElectricEmp.wav";
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
              newArray[0] = "Tambourine.wav";
              newArray[1] = "TambourineEmp.wav";
              // Update the state with the modified array
              setSoundState(newArray);
            }}
          >
            Tambourine
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Metronome;
