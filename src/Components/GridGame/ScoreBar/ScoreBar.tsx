import { useEffect, useState } from 'react';
import { add_player_to_scoreboard } from '../../../utils/api/api.ts';
import QuitModal from '../QuitModal/QuitModal';
import css from './ScoreBar.module.css';
import { useNavigate } from 'react-router-dom';
import Timer from '../Timer/Timer';
import { inputScoreRowSchema } from '../../../utils/interfaces.ts';
import { graphData } from '../../ConnectionsGame/ConnectionsGraph/ConnectionsGraph.tsx';

const ScoreBar = ({ board, squaresNumber, resetTime, playersNumber, currShortestPath, shortestPath }:
    { board: string, squaresNumber?: number, resetTime: boolean, playersNumber: number, currShortestPath?: number, shortestPath?: graphData['nodes'] }) => {
    const [isQuitModalOpen, setIsQuitModalOpen] = useState(false);
    const [isRunning, setIsRunning] = useState(true);
    const [time, setTime] = useState(0);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (currShortestPath && shortestPath) {
            setMessageForConnectionsGame();
        }
    }, [currShortestPath, shortestPath]);

    const setMessageForConnectionsGame = () => {
        if (currShortestPath == shortestPath?.length) {
            setMessage('You have found the shortest path!');
        } else {
            const formattedShortestPath = shortestPath?.map(({ name }) => name).join('->');
            setMessage(`You have not found the shortest path yet!  Possible Shortest Path:  ${formattedShortestPath}`);
        }
    }


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
        navigate(`/${board}/scoreboard`);
    }

    const saveScore = async (nickname: string) => {
        const playerData: inputScoreRowSchema = { nickname, players_number: playersNumber, time };
        if (squaresNumber) {
            playerData.squares_number = squaresNumber;
        }
        if (currShortestPath) {
            playerData.shortest_path = currShortestPath;
        }
        await add_player_to_scoreboard(board, playerData);
        goToScoreboard();
    };

    return (
        <div>
            <div className={css.buttonsContainer}>
                <div className={css.button} onClick={openQuitModal}>{currShortestPath && currShortestPath !== -1 ? "Submit" : "I Quit!"}</div>
                <div className={css.button} onClick={goToScoreboard}>ScoreBoard</div>
                <QuitModal isOpen={isQuitModalOpen} onClose={closeQuitModal} message={message}
                    goToScoreboard={goToScoreboard} saveScore={saveScore}></QuitModal>
                <div className={css.scoresContainer}>
                    <div className={css.score}>Players: {playersNumber}</div>
                    {squaresNumber !== undefined && <div className={css.score}>Squares: {squaresNumber}</div>}
                    {currShortestPath !== undefined && <div className={css.score}>Current Shortest Path: {currShortestPath == -1 ? '∞' : currShortestPath}</div>}
                    <div className={css.score}>
                        <Timer isRunning={isRunning} setTime={setTime} resetTime={resetTime}></Timer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScoreBar;
