import { useEffect, useState } from 'react';
import { fetch_players_with_filters } from '../../../utils/api/api';
import { playerSchema } from '../../../utils/api/api.interfaces';
import { Filter } from '../../../utils/interfaces';
import css from './GridItem.module.css';
import { Tooltip } from '@mui/material';
import classNames from 'classnames';
import CloseIcon from '@mui/icons-material/Close';

interface GridItemProps {
	filter1: Filter;
	filter2: Filter;
	id: string;
	currentFocused: string;
	searchedPlayer: { player_id: number };
	onClick?: () => void;
	onPlayerAdded: () => void;
	onSquareAdded: () => void;
	onSquareCompleted: () => void;
}
const GridItem = ({
	filter1,
	filter2,
	id,
	currentFocused,
	searchedPlayer,
	onClick,
	onPlayerAdded,
	onSquareAdded,
	onSquareCompleted,
}: GridItemProps) => {
	const [resultsState, setResultsState] = useState<playerSchema[]>([]);
	const [confirmedPlayers, setConfirmedPlayers] = useState<playerSchema[]>([]);
	const [loading, setLoading] = useState(true);

	const updateScore = () => {
		onPlayerAdded();
		if (confirmedPlayers.length === 0) {
			onSquareAdded();
			if (resultsState.length - 1 === confirmedPlayers.length) {
				onSquareCompleted();
			}
		}
	};

	useEffect(() => {
		(async () => {
			if (!filter1 || !filter2) return;
			setLoading(true);
			setConfirmedPlayers([]);
			const players = await fetch_players_with_filters(filter1, filter2);

			await setResultsState(players);
			setLoading(false);
		})();
	}, [filter1, filter2]);

	useEffect(() => {
		if (
			(currentFocused === id || currentFocused === 'all') &&
			confirmedPlayers.find(player => player.player_id === searchedPlayer.player_id) === undefined
		) {
			const player = resultsState.find(player => player.player_id === searchedPlayer.player_id);
			if (player) {
				setConfirmedPlayers(a => [...a, player]);
				updateScore();
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchedPlayer]);
	if (loading) return <div className={css.gridItem}>Loading...</div>;
	return (
		<div
			className={classNames(
				css.gridItem,
				{ [css.selected]: currentFocused === id },
				{ [css.complete]: resultsState.length === confirmedPlayers.length && resultsState.length !== 0 },
			)}
			onContextMenu={e => {
				e.preventDefault();
				console.log(resultsState.map(player => player.name));
			}}
			onClick={e => {
				console.log('Right click');
				if (e.type === 'click') {
					onClick && onClick();
				} else if (e.type === 'contextmenu') {
					e.preventDefault();
				}
			}}
		>
			{resultsState.length === 0 ? (
				<Tooltip title='No players exist'>
					<CloseIcon className={css.noPlayers} />
				</Tooltip>
			) : confirmedPlayers.length === 0 ? null : (
				<Tooltip title={confirmedPlayers[confirmedPlayers.length - 1].name}>
					<img src={confirmedPlayers[confirmedPlayers.length - 1].img_ref} className={css.image} />
				</Tooltip>
			)}
			{confirmedPlayers.length !== 0 && <div className={css.confirmedAmount}>{confirmedPlayers.length}</div>}
		</div>
	);
};

export default GridItem;
