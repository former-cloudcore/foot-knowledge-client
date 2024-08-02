import { useState, useEffect } from 'react';
import PlayerRow from './PlayerRow/PlayerRow.tsx';
import css from './ScoreBoard.module.css';
import { fetch_scoreboard } from '../../../utils/api/api.ts';
import { scoreRowSchema, SortSchema } from '../../../utils/api/api.interfaces.ts';
import { orderBy } from 'lodash';
import { useLocation, useNavigate } from 'react-router-dom';
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import { ArrowBack } from '@mui/icons-material';

const ScoreBoard = () => {
	const [game, setGame] = useState<string>();
	const [title, setTitle] = useState<string>();
	const [scores, setScores] = useState<scoreRowSchema[]>([]);
	const [primarySort, setPrimarySort] = useState<SortSchema>();
	const [secondarySort, setSecondarySort] = useState<SortSchema>();
	const [isLoaded, setIsLoaded] = useState(false);
	const location = useLocation();
	const navigate = useNavigate();

	const setScoreBoard = async () => {
		let data = await fetch_scoreboard(game.toLowerCase());
		if (game === 'connections') {
			data = mapNegToInf(data);
		}
		data = sortScores(data);
		setScores(data);
		setIsLoaded(true);
	};

	const sortScores = (data: scoreRowSchema[]) => {
		if (primarySort) {
			const primaryField = primarySort.sortName as keyof scoreRowSchema;
			if (secondarySort) {
				const secondaryField = secondarySort.sortName as keyof scoreRowSchema;
				return orderBy(data, [primaryField, secondaryField], [primarySort.sortOrder, secondarySort.sortOrder]);
			}
			return orderBy(data, [primaryField], [primarySort.sortOrder]);
		}
		return data;
	};

	const mapNegToInf = (connectionsScore: scoreRowSchema[]) => {
		return connectionsScore.map((score: scoreRowSchema) => {
			if (score.shortest_path === -1) {
				score.shortest_path = Infinity;
			}
			return score;
		});
	};

	const sortBySecondary = (sortSchema: SortSchema) => {
		if (sortSchema.sortName === secondarySort?.sortName) return;
		setSecondarySort(sortSchema);
		const sortedScores = sortScores(scores);
		setScores(sortedScores);
	};

	const getGameFromPath = () => {
		const path = location.pathname.split('/');
		return path[path.length - 2];
	};

	const setSortByGame = () => {
		switch (game) {
			case 'grid':
				setPrimarySort({ sortName: 'squares_number', sortOrder: 'desc' });
				break;
			case 'connections':
				setPrimarySort({ sortName: 'shortest_path', sortOrder: 'asc' });
				break;
			default:
				setPrimarySort({ sortName: 'squares_number', sortOrder: 'desc' });
				break;
		}
	};

	useEffect(() => {
		setGame(getGameFromPath());
	}, []);

	useEffect(() => {
		if (game) {
			setTitle(game + ' Game ScoreBoard');
			setSortByGame();
			setScoreBoard();
		}
	}, [game]);

	useEffect(() => {
		if (scores?.length && primarySort) {
			setScores(scores => sortScores(scores));
		}
	}, [scores, primarySort, secondarySort]);

	return (
		<div>
			<div className={css.scoreboard}>
				<header>
					<div className={css.title}>
						<ArrowBack className={css.backButton} onClick={() => navigate(-1)} />
						<div>{title}</div>
					</div>
					<div className={css.scoreNamesContainer}>
						<span className={css.scoreName}>{game === 'grid' ? 'Sqrs' : 'Path'}</span>
						<span className={css.scoreName} onClick={() => sortBySecondary({ sortName: 'players_number', sortOrder: 'asc' })}>
							Players
						</span>
						<span className={css.scoreName} onClick={() => sortBySecondary({ sortName: 'time', sortOrder: 'desc' })}>
							Time
						</span>
					</div>
				</header>
				{!isLoaded && (
					<Segment>
						<Dimmer active inverted>
							<Loader inverted />
						</Dimmer>

						<Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
					</Segment>
				)}

				{scores.map((score, index) => (
					<PlayerRow score={score} index={index} key={index} />
				))}
			</div>
		</div>
	);
};

export default ScoreBoard;
