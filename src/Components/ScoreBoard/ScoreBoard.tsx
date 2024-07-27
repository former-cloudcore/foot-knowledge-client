import { useState, useEffect } from "react";
import PlayerRow from "./PlayerRow/PlayerRow";
import css from './ScoreBoard.module.css';
import { fetch_scoreboard } from "../../utils/api/api.ts";
import { scoreRowSchema, SecondarySortSchema } from "../../utils/api/api.interfaces.ts";
import { orderBy } from "lodash";
import { useLocation, useNavigate } from "react-router-dom";
import { Dimmer, Loader, Image, Segment } from 'semantic-ui-react';
import { ArrowBack } from "@mui/icons-material";

const ScoreBoard = () => {
    const [game, setGame] = useState("grid");
    const [title, setTitle] = useState(game + " Game ScoreBoard");
    const [scores, setScores] = useState<scoreRowSchema[]>([]);
    const [primarySort, setPrimarySort] = useState<string>("squares_number");
    const [secondarySort, setSecondarySort] =
        useState<SecondarySortSchema>({ sortName: "players_number", sortOrder: false });
    const [isLoaded, setIsLoaded] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    const setScoreBoard = async () => {
        let data = await fetch_scoreboard(game.toLowerCase());
        data = sortScores(data);
        setScores(data);
        setIsLoaded(true);
    }

    const sortScores = (data: scoreRowSchema[]) => {
        return orderBy(data, [primarySort, secondarySort.sortName], ["desc", secondarySort.sortOrder]);
    }

    const sortBySecondary = (sortName: string, sortOrder: boolean) => {
        if (sortName === secondarySort.sortName) return;
        setSecondarySort({ sortName, sortOrder });
        const sortedScores = sortScores(scores);
        console.log(sortedScores)
        setScores(sortedScores);
    }

    const getGameFromPath = () => {
        const path = location.pathname.split("/");
        return path[path.length - 2];
    }

    useEffect(() => {
        setGame(getGameFromPath());
    }, []);

    useEffect(() => {
        setTitle(game + " Game ScoreBoard");
        setPrimarySort(game === "grid" ? "squares_number" : "shortest_path");
        setScoreBoard();
    }, [game])

    return (
        <div>
            <div className={css.scoreboard}>
                <header>
                    <div className={css.title}>
                        <ArrowBack className={css.backButton} onClick={() => navigate(-1)} />
                        <div>{title}</div></div>
                    <div className={css.scoreNamesContainer}>
                        <span className={css.scoreName}>{game === "grid" ? 'Sqrs' : 'Path'}</span>
                        <span className={css.scoreName} onClick={() => sortBySecondary('players_number', false)}>Players</span>
                        <span className={css.scoreName} onClick={() => sortBySecondary('time', true)}>Time</span>
                    </div>
                </header>
                {!isLoaded && <Segment>
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
        </div>
    );
};

export default ScoreBoard;
