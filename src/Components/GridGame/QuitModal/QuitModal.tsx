import { useState } from 'react';
import css from './QuitModal.module.css';

const QuitModal = ({ isOpen, onClose, saveScore, goToScoreboard, message }:
    { isOpen: boolean, onClose: () => void, saveScore: (nickname: string) => void, goToScoreboard: () => void, message?: string }) => {
    const [nickname, setNickname] = useState("");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            saveScore(nickname);
        }
    }

    if (!isOpen) {
        return null;
    }

    return (
        <div className={css.modalOverlay}>
            <div className={css.modal}>
                <div className={css.content}>
                    {message && <div>{message}</div>}
                    <input
                        type="text"
                        value={nickname}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        className={css.nicknameInput}
                        placeholder='Enter nickname to save your score'
                    />
                    <div className={css.buttonsContainer}>
                        <button className={css.button} onClick={onClose}>Cancel</button>
                        <button className={css.button} onClick={() => saveScore(nickname)}>Save Score</button>
                        <button className={css.button} onClick={goToScoreboard}>Skip to Scoreboard</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuitModal;
