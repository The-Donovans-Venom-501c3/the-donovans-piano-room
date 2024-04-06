
"use client";

import TempoSetting from "@metronome/TempoSetting";
import Metronome from "@metronome/Metronome";
import { useState } from "react";

const VirtualMetronome = () => {
  const [tempoNum, setTempo] = useState<number>(25);
  const [beatsNum, setBeats] = useState<number>(4);
  const [beatEmp, setBeatEmp] = useState<number>(-1);
  const [animation, setAnimation] = useState<boolean>(false);
  const [fullScreen, setFullScreen] = useState<boolean>(false);


  return (
    <div className="flex h-full justify-center bg-primary-skin p-12">
      <div className="flex h-full w-full laptop:w-10/12 desktop:gap-16">
        <TempoSetting
          beatsNum={beatsNum}
          setBeats={setBeats}
          tempoNum={tempoNum}
          setTempo={setTempo}
          beatEmp={beatEmp}
          setBeatEmp={setBeatEmp}
          setAnimation={setAnimation}
          fullScreen={fullScreen}
        />
        <Metronome
          beatsNum={beatsNum}
          tempoNum={tempoNum}
          beatEmp={beatEmp}
          animation={animation}
          fullScreen={fullScreen}
          setFullScreen={setFullScreen}
        />
      </div>
    </div>
  );
};

export default VirtualMetronome;