import { useEffect, useState, useRef, useCallback } from "react";
import { Midi } from "@tonejs/midi";

interface UseMIDIProps {
  onNoteOn: (noteName: string, velocity: number) => void;
  onNoteOff: (noteName: string) => void;
}

// Helper to convert MIDI number (e.g., 60) to Note Name (e.g., "C4")
const midiNumberToNoteName = (midiNote: number): string => {
  const notes = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B",
  ];
  const octave = Math.floor(midiNote / 12) - 1;
  const note = notes[midiNote % 12];
  return `${note}${octave}`;
};

export const useMIDI = ({ onNoteOn, onNoteOff }: UseMIDIProps) => {
  const [isSupported, setIsSupported] = useState<boolean>(false);
  const [devices, setDevices] = useState<string[]>([]);
  const [isPlayingFile, setIsPlayingFile] = useState<boolean>(false);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // 1. Handle Physical USB MIDI Keyboard Connection
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "navigator" in window &&
      "requestMIDIAccess" in navigator
    ) {
      setIsSupported(true);
      navigator.requestMIDIAccess().then(
        (midiAccess) => {
          const updateDevices = () => {
            const inputList: string[] = [];
            midiAccess.inputs.forEach((input) => {
              if (input.name) inputList.push(input.name);
              input.onmidimessage = handleMIDIMessage;
            });
            setDevices(inputList);
          };

          updateDevices();
          midiAccess.onstatechange = updateDevices;
        },
        (err) => console.error("Could not access MIDI devices.", err),
      );
    }
  }, [onNoteOn, onNoteOff]);

  const handleMIDIMessage = (event: MIDIMessageEvent) => {
    if (!event.data) return;
    const [command, noteNumber, velocity] = event.data;
    const noteName = midiNumberToNoteName(noteNumber);

    // Command 144 = Note On (velocity > 0), Command 128 = Note Off
    if (command === 144 && velocity > 0) {
      onNoteOn(noteName, velocity / 127);
    } else if (command === 128 || (command === 144 && velocity === 0)) {
      onNoteOff(noteName);
    }
  };

  // 2. Handle MIDI File Playback
  const playMIDIFile = async (url: string) => {
    try {
      stopMIDIFile();
      setIsPlayingFile(true);

      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      const midi = new Midi(arrayBuffer);

      midi.tracks.forEach((track) => {
        track.notes.forEach((note) => {
          const noteName = midiNumberToNoteName(note.midi);
          const delayOn = note.time * 1000;
          const duration = note.duration * 1000;

          // Schedule Note On
          const tOn = setTimeout(() => {
            onNoteOn(noteName, note.velocity);
          }, delayOn);

          // Schedule Note Off
          const tOff = setTimeout(() => {
            onNoteOff(noteName);
          }, delayOn + duration);

          timeoutsRef.current.push(tOn, tOff);
        });
      });
    } catch (error) {
      console.error("Failed to load or parse MIDI file:", error);
      setIsPlayingFile(false);
    }
  };

  const stopMIDIFile = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    setIsPlayingFile(false);
  }, []);

  return {
    isSupported,
    devices,
    isPlayingFile,
    playMIDIFile,
    stopMIDIFile,
  };
};
export default useMIDI;
