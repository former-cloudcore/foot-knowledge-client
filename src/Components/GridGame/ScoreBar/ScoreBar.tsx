import { useState } from 'react';
import { add_player_to_scoreboard } from '../../../utils/api/api.ts';
import QuitModal from '../QuitModal/QuitModal';
import css from './ScoreBar.module.css';
import { useNavigate } from 'react-router-dom';
import Timer from '../Timer/Timer';

const ScoreBar = ({ squaresNumber, playersNumber }:
    { squaresNumber: number, playersNumber: number }) => {
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(0);
    const navigate = useNavigate();

    const openQuitModal = () => {
        setIsQuitModalOpen(true);
        setIsRunning(false);
    };

    const closeQuitModal = () => {
        setIsQuitModalOpen(false);
        setIsRunning(true);
    };

    const goToScoreboard = () => {
        closeQuitModal();
        navigate('/grid/scoreboard');
    }

    const saveScore = async (nickname: string) => {
        const playerData = { nickname, squares_number: squaresNumber, players_number: playersNumber, time };
        await add_player_to_scoreboard('grid', playerData);
        goToScoreboard();
    };

    return (
        <div>
            <div className={css.buttonsContainer}>
                <div className={css.button} onClick={openQuitModal}>I Quit!</div>
                <div className={css.button} onClick={goToScoreboard}>ScoreBoard</div>
                <QuitModal isOpen={isQuitModalOpen} onClose={closeQuitModal}
                    goToScoreboard={goToScoreboard} saveScore={saveScore}></QuitModal>
                <div className={css.scoresContainer}>
                    <div className={css.score}>Players: {playersNumber}</div>
                    <div className={css.score}>Squares: {squaresNumber}</div>
                    <div className={css.score}>
                        <Timer isRunning={isRunning} setTime={setTime}></Timer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBar;
