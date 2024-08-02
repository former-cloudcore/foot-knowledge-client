import { Modal } from '@mui/material';
import style from './PlayerHistory.module.css';
import classNames from 'classnames';

interface PlayerHistoryProps {
	player_id: string;
	open: boolean;
	onClose: () => void;
}

const PlayerHistory = ({ player_id, open, onClose }: PlayerHistoryProps) => {
	return (
		<Modal open={open} onClose={onClose} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
			<div className={classNames(style.Modal)}>
				<h1 id='modal-modal-title'>Player History</h1>
				<p id='modal-modal-description'>Player ID: {player_id}</p>
			</div>
		</Modal>
	);
};

export default PlayerHistory;
