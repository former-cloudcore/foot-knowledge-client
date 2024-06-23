const Logo = () => (
    <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
        <svg
            width="100"
            height="100"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
        >
            <g transform="translate(10,10)">
                <path
                    d="M10 60 Q 20 30, 60 30 Q 80 30, 90 40 L 80 60 L 10 60 Z"
                    fill="#3f51b5"
                    stroke="#ffffff"
                    strokeWidth="2"
                />
                <circle cx="20" cy="55" r="3" fill="#ffffff" />
                <circle cx="30" cy="55" r="3" fill="#ffffff" />
                <circle cx="40" cy="55" r="3" fill="#ffffff" />
                <circle cx="50" cy="55" r="3" fill="#ffffff" />
                <circle cx="60" cy="55" r="3" fill="#ffffff" />
                <circle cx="70" cy="55" r="3" fill="#ffffff" />
            </g>
            <text x="50%" y="90%" textAnchor="middle" dy=".3em" fontSize="20" fontWeight="bold" fill="#3f51b5">
                FK
            </text>
        </svg>
        <h1 style={{ color: '#3f51b5', fontSize: '1.5rem', margin: '0' }}>Foot Knowledge</h1>
    </div>
);

export default Logo;
