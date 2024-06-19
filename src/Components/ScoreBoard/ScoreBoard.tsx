import { useState, useEffect } from "react";
import PlayerRow from "./PlayerRow/PlayerRow";
import css from './ScoreBoard.module.css';
import { fetch_scoreboard } from "../../utils/api";
import { scoreRowSchema, SecondarySortSchema } from "../../utils/api.interfaces";
import { orderBy } from "lodash";
import { useLocation } from "react-router-dom";
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react'

const ScoreBoard = () => {
    const [game, setGame] = useState("grid");
    const [title] = useState(game + " Game ScoreBoard");
    const [scores, setScores] = useState<scoreRowSchema[]>([]);
    const [secondarySort, setSecondarySort] =
        useState<SecondarySortSchema>({ sortName: "players_number", sortOrder: false });
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();

    const setScoreBoard = async () => {
        let data = await fetch_scoreboard(game.toLowerCase());
        data = sortScores(data);
        setScores(data);
        setIsLoaded(true);
    }

    const sortScores = (data: scoreRowSchema[]) => {
        return orderBy(data, ["squares_number", secondarySort.sortName], ["desc", secondarySort.sortOrder]);
    }

    const sortBySecondary = (sortName: string, sortOrder: boolean) => {
        if (sortName === secondarySort.sortName) return;
        setSecondarySort({ sortName, sortOrder });
        const sortedScores = sortScores(scores);
        setScores(sortedScores);
    }

    const getGameFromPath = () => {
        const path = location.pathname.split("/");
        return path[path.length - 2];
    }

    useEffect(() => {
        setGame(getGameFromPath());
        setScoreBoard();
    }, []);

    return (
        <div className={css.scoreboard}>
            <header>
                <div className={css.title}>{title}</div>
                <div className={css.scoreNamesContainer}>
                    <span className={css.scoreName}>Sqrs</span>
                    <span className={css.scoreName} onClick={() => sortBySecondary('players_number', false)}>Players</span>
                    <span className={css.scoreName} onClick={() => sortBySecondary('time', true)}>Time</span>
                </div>
            </header>
            {!isLoaded &&<Segment>
                <Dimmer active inverted>
                    <Loader inverted />
                </Dimmer>

                <Image src='https://react.semantic-ui.com/images/wireframe/short-paragraph.png' />
            </Segment>}

            {scores.map((score, index) => (
                <PlayerRow
                    score={score}
                    index={index}
                    key={index}
                />
            ))}
        </div>
    );
};

export default ScoreBoard;