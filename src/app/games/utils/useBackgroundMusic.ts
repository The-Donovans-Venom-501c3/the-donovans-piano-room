import { useEffect, useRef } from "react";
import { TRACKS, trackUrl } from "@/utils/tracks";

// Loops a random piano track for the length of a game.
// inGame: a game is on screen (a new track is picked each time this turns on)
// playing: the music is audible right now (false while paused or a modal is open)
// volume: 0-100, from the game's volume slider
export function useBackgroundMusic(
  inGame: boolean,
  playing: boolean,
  volume: number
) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!inGame) return;
    const track = TRACKS[Math.floor(Math.random() * TRACKS.length)];
    const audio = new Audio(trackUrl(track.file));
    audio.loop = true;
    audioRef.current = audio;

    return () => {
      audio.pause();
      // Stop downloading the rest of the file
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [inGame]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume / 100;
  }, [inGame, volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      // The browser can block playback; the game should carry on without music
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }, [inGame, playing]);
}
