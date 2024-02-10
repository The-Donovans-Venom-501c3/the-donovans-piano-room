import { useAtomValue } from 'jotai';
import { loadingStateAtom, quizStateAtom } from '../../store/atoms';

import Loading from './Loading/Loading';
import Affirmation from './Affirmation/Affirmation';
import Overlay from './Overlay/Overlay';
import Popup from './Popup/Popup';
import Rules from './Rules/Rules';
import QuizScreen from './QuizScreen/QuizScreen';

export default function Quiz() {
    const loadingState = useAtomValue(loadingStateAtom);
    const quizState = useAtomValue(quizStateAtom);

    if (loadingState === 'loading') {
        return <Loading />;
    }
    return (
        <>
            {quizState === 'affirmation' && <Affirmation />}
            {quizState === 'overlay' && <Overlay />}
            {quizState === 'popup' && <Popup />}
            {quizState === 'rules' && <Rules />}
            <QuizScreen />
        </>
    );
}
