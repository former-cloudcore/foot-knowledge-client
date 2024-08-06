import GridFilter from './GridFilter/GridFilter';
import css from './GridGame.module.css';
import { useEffect, useState } from 'react';
import { Filter } from '../../utils/interfaces';
import { defaultPresets, top_left_image } from '../../utils/consts';
import { getRandomFilters, translateFilters } from '../../utils/utils';
import GridItem from './GridItem/GridItem';
import SearchBox from '../Common/SearchBox/SearchBox';
import GridSizeDropDown from './GridSizeDropDown/GridSizeDropDown';
import FiltersSelectorDropDown from './FiltersSelectorDropDown/FiltersSelectorDropDown';
import ScoreBar from './ScoreBar/ScoreBar';

const GridGame = () => {
	const [gridSizeState, setGridSizeState] = useState<[number, number]>([5, 5]);
	const [filterState, setFilterState] = useState<Filter[]>([]);
	const [currentFocused, setCurrentFocused] = useState<string>('all');
	const [searchedPlayer, setSearchedPlayer] = useState<{ player_id: number }>({ player_id: 0 });
	const [choseFilters, setChoseFilters] = useState<{ sideFilters: Filter[]; topFilters: Filter[] }>({
		sideFilters: [],
		topFilters: [],
	});
	const [playersNumber, setPlayersNumber] = useState(0);
	const [squaresNumber, setSquaresNumber] = useState(0);
	const [resetTime, setResetTime] = useState(false);

	useEffect(() => {
		(async () => {
			setFilterState(translateFilters(defaultPresets['default']));
		})();
	}, []);

	useEffect(() => {
		setChoseFilters(getRandomFilters(filterState, gridSizeState[0], gridSizeState[1]));
		resetScore();
	}, [gridSizeState, filterState]);

	const resetScore = () => {
		setPlayersNumber(0);
		setSquaresNumber(0);
		setResetTime(prev => !prev);
	};

	const getGrid = () => {
		const rows = [];
		const { sideFilters, topFilters } = choseFilters;
		for (let i = 0; i < gridSizeState[0] + 1; i++) {
			const row = [];

			for (let j = 0; j < gridSizeState[1] + 1; j++) {
				if (i === 0 && j === 0) {
					row.push(
						<div className={css.topLeft} key={`${i}-${j}`} onClick={() => setCurrentFocused('all')}>
							<img src={top_left_image} />
						</div>,
					);
					continue;
				}
				if (i === 0) {
					row.push(<GridFilter {...topFilters[j - 1]} key={`${i}-${j}`} />);
					continue;
				}
				if (j === 0) {
					row.push(<GridFilter {...sideFilters[i - 1]} key={`${i}-${j}`} />);
					continue;
				}

				row.push(
					<GridItem
						filter1={topFilters[j - 1]}
						filter2={sideFilters[i - 1]}
						key={`${i}-${j}`}
						id={`${i}-${j}`}
						currentFocused={currentFocused}
						searchedPlayer={searchedPlayer}
						onClick={() => setCurrentFocused(`${i}-${j}`)}
						onPlayerAdded={() => setPlayersNumber(prevPlayersNumber => prevPlayersNumber + 1)}
						onSquareAdded={() => setSquaresNumber(prevSquaresNumber => prevSquaresNumber + 1)}
						onSquareCompleted={() => setPlayersNumber(prevPlayersNumber => prevPlayersNumber + 3)}
					/>,
				);
			}
			rows.push(
				<div className={css.row} key={i}>
					{row}
				</div>,
			);
		}

		return <div>{rows}</div>;
	};

	return (
		<div className={css.page} style={{ '--grid-item-size': '10rem' } as React.CSSProperties}>
			<ScoreBar board='grid' playersNumber={playersNumber} squaresNumber={squaresNumber} resetTime={resetTime}></ScoreBar>
			<div className={css.gridGame}>
				<div className={css.topBar}>
					<SearchBox onSelect={playerid => setSearchedPlayer({ player_id: playerid })} />
					<FiltersSelectorDropDown onChange={filters => setFilterState(filters)} />
					<GridSizeDropDown gridSizeState={gridSizeState} setGridSizeState={setGridSizeState} />
				</div>
				{filterState.length === 0 ? null : getGrid()}
			</div>
		</div>
	);
};

export default GridGame;
