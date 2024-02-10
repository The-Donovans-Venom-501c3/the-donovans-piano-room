import liveStage1 from '../../../assets/svg/LiveStage1.svg';
import liveStage2 from '../../../assets/svg/LiveStage2.svg';
import liveStage3 from '../../../assets/svg/LiveStage3.svg';
import liveStage4 from '../../../assets/svg/LiveStage4.svg';
import liveStage5 from '../../../assets/svg/LiveStage5.svg';
import './lives.scss';

export default function LiveAnimated() {
  return (
    <div className='livesContainer'>
      <img id='liveStage1' src={liveStage1} alt='music note stage1' />
      <img id='liveStage2' src={liveStage2} alt='music note stage2' />
      <img id='liveStage3' src={liveStage3} alt='music note stage3' />
      <img id='liveStage4' src={liveStage4} alt='music note stage4' />
      <img id='liveStage5' src={liveStage5} alt='music note stage5' />
    </div>
  );
}
