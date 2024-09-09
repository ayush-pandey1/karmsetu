// HomePage.js
"use client"
// /components/HomePage.js
import { useSelector } from 'react-redux';

const HomePage = () => {
    const { messages } = useSelector((state) => state.language);

    return (
        <div>
            <h1>{messages.greeting}</h1>
            <p>{messages.welcome}</p>
        </div>
    );
};

export default HomePage;
