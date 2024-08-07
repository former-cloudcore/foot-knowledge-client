import { scoreRowSchema } from '../../../../utils/api/api.interfaces.ts';
import css from './PlayerRow.module.css';

const PlayerRow = ({ score, index }: { score: scoreRowSchema; index: number }) => {
	return (
		<div className={css.player}>
			<span className={css.playerName}>
				<svg viewBox='0 0 44 35' className={index === 0 ? css.first : index === 1 ? css.second : ''}>
					<path
						d='M26.7616 10.6207L21.8192 0L16.9973 10.5603C15.3699 14.1207 10.9096 15.2672 7.77534 12.9741L0 7.24138L6.56986 28.8448H37.0685L43.5781 7.72414L35.7425 13.0948C32.6685 15.2672 28.3288 14.0603 26.7616 10.6207Z'
						transform='translate(0 0.301727)'
					/>
					<rect width='30.4986' height='3.07759' transform='translate(6.56987 31.5603)' />
				</svg>
				{score.nickname}
			</span>
			<div className={css.counter}>
				{score.squares_number && <span className={css.counterScore}>{score.squares_number}</span>}
				{score.shortest_path && <span className={css.counterScore}>{score.shortest_path === Infinity ? -1 : score.shortest_path}</span>}
				<span className={css.counterScore}>{score.players_number}</span>
				<span className={css.counterScore}>{score.time}</span>
			</div>
		</div>
	);
};

export default PlayerRow;
