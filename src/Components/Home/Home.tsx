import { useState } from 'react';
import SearchBox from '../SearchBox/SearchBox';
import css from './Home.module.css';
import { useNavigate } from 'react-router';

const Home = () => {
  const [gamesState] = useState<string[]>(["grid", "connections"]);
  const navigate = useNavigate();

  return (
    <div className={css.home}>
      <div className={css.header}>
      <h1>Home</h1>
      <p>This is the home page.</p>
      <SearchBox onSelect={(player) => console.log(player)} />
      </div>
     
      <div className={css.gamesButtons}>
        {gamesState.map((game, i) =>
          <div key={i} className={css.gameColumn}>
            <div className={css.gameName}>{game}</div>
            <div onClick={() => navigate(`/${game}`)} className={css.action}>Play</div>
            <div onClick={() => navigate(`/${game}/scoreboard`)} className={css.action}>view scores</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
