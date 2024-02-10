import './GameFinished.scss'
import PlayAgainDialog from './Dialogs/PlayAgainDialog';
import ScoreDialog from './Dialogs/ScoreDialog';
import { useAtomValue } from 'jotai';
import { gameFinishedAtom } from '../../store/atoms';


export default function GameFinished() {

  const gameFinished = useAtomValue(gameFinishedAtom);

  return (
    <div className='game-finished'>
      {gameFinished === 'score' ? <ScoreDialog /> : <PlayAgainDialog />}
    </div>
  )
}
