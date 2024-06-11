import GridFilter from './GridFilter/GridFilter';
import css from './GridGame.module.css';
import { useEffect, useState } from 'react';
import { Filter } from '../../utils/interfaces';
import { fetch_teams } from '../../utils/api';
import { top_left_image } from '../../utils/consts';
import { getRandomFilters } from '../../utils/utils';
import GridItem from './GridItem/GridItem';

const GridGame = () => {
	const [gridSizeState, setGridSizeState] = useState<[number, number]>([6, 3]);
	const [filterState, setFilterState] = useState<Filter[]>([]);

	useEffect(() => {
		(async () => {
			setFilterState(await fetch_teams());
		})();
	}, []);

	const getGrid = () => {
		const rows = [];
		const { sideFilters, topFilters } = getRandomFilters(filterState, gridSizeState[0], gridSizeState[1]);
		for (let i = 0; i < gridSizeState[0] + 1; i++) {
			const row = [];
			
			for (let j = 0; j < gridSizeState[1] + 1; j++) {
				if (i === 0 && j === 0) {
					row.push(
						<div className={css.topLeft} key={`${i}-${j}`}>
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
				
				
				row.push(<GridItem filter1={topFilters[j - 1]} filter2={sideFilters[i - 1]} key={`${i}-${j}`} />);
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
		<div className={css.gridGame} style={{ '--grid-item-size': '10rem' } as React.CSSProperties}>
			{filterState.length === 0 ? null : getGrid()}
		</div>
	);
};

export default GridGame;
