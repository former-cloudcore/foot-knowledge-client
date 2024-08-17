import { useState, useEffect } from 'react';
import SearchBox from '../Common/SearchBox/SearchBox';
import css from './Home.module.css';
import { useNavigate } from 'react-router';
import { userProfile } from '../../utils/api/auth';
import { generateProfileImage } from '../../utils/api/auth';
import loadingGif from '../../assets/loadingAnimation.gif';

const Home = () => {
    const [gamesState] = useState<string[]>(['grid', 'connections']);
    const navigate = useNavigate();
    const [profile, setProfile] = useState<{ name: string; image: string } | null>(null);
    const [imageName, setImageName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userProfile();
                setProfile(data);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };

        fetchProfile();
    }, []);

    const generateImage = async () => {
        setIsLoading(true);
        try {
            const newImageName = await generateProfileImage(imageName);
            setProfile(prevProfile => {
                if (prevProfile) {
                    return {
                        ...prevProfile,
                        image: newImageName.image
                    };
                }
                return null;
            });
            setImageName('');
        } catch (error) {
            console.error('Error generating profile image:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setImageName(event.target.value);
    };

    return (
        <div className={css.home}>
            <div className={css.header}>
                <h1>Welcome: {profile?.name}</h1>
                {isLoading ? (
                    <img
                        src={loadingGif}
                        alt="Loading"
                        className={css.loadingGif}
                    />
                ) : (
                    profile?.image && (
                        <img
                            src={`http://localhost:4000/api/images/${profile.image}`}
                            alt="profile image"
                            className={css.userImage}
                        />
                    )
                )}
                <div className={css.promptInput}>
                    <input
                        type="text"
                        placeholder="Enter new profile image name"
                        value={imageName}
                        onChange={handleInputChange}
                    />
                    <button onClick={generateImage}>Generate</button>
                </div>
                <p>This is the home page.</p>
                <SearchBox onSelect={player => console.log(player)} />
            </div>

            <div className={css.gamesButtons}>
                {gamesState.map((game, i) => (
                    <div key={i} className={css.gameColumn}>
                        <div className={css.gameName}>{game}</div>
                        <div onClick={() => navigate(`/${game}`)} className={css.action}>
                            Play
                        </div>
                        <div onClick={() => navigate(`/${game}/scoreboard`)} className={css.action}>
                            view scores
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Home;
