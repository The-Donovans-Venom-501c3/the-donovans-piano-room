import Image from "next/image";
import ShortPiano from "../../assets/svg/ShortPiano.svg";

export default function VirtualPiano() {
  return (
    <div className="flex h-full justify-center pb-8">
      <div className="box-border flex w-11/12 flex-col items-center rounded-3xl border-2 border-gray-300 bg-zinc-50 pt-4">
        <div className="box-border flex h-1/6 w-2/6 items-center justify-center rounded-2xl border-2 border-orange-200 bg-orange-50">
          <div className="box-border flex h-3/4 w-11/12 items-center justify-center">
            <div className="box-border inline-flex h-5/6 w-5/6 items-center justify-center rounded-lg border-2 border-orange-500  bg-orange-300 text-xl">
              Short Piano
            </div>
            <div className="box-border inline-flex h-5/6 w-5/6 items-center justify-center text-xl">
              Long Piano
            </div>
          </div>
        </div>
        <Image
          priority
          className="h-5/6 w-11/12 pt-8"
          src={ShortPiano}
          alt="short piano"
        />
      </div>
    </div>
  );
}
