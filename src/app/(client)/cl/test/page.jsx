// /components/LanguageSwitcher.js
"use client"
import { useDispatch, useSelector } from 'react-redux';
import { setLanguage } from '../../../(redux)/features/languageSlice';
import { setLocaleCookie } from '../../../../utils/cookieUtils';

const LanguageSwitcher = () => {
    const dispatch = useDispatch();
    const language = useSelector((state) => state.language.language);

    const switchLanguage = (lang) => {
        dispatch(setLanguage(lang));
        setLocaleCookie(lang); // Set the locale in cookies
    };

    return (
        <div>
            <button
                onClick={() => switchLanguage('en')}
                style={{ fontWeight: language === 'en' ? 'bold' : 'normal' }}
            >
                EN
            </button>
            <button
                onClick={() => switchLanguage('hi')}
                style={{ fontWeight: language === 'hi' ? 'bold' : 'normal' }}
            >
                HI
            </button>
        </div>
    );
};

export default LanguageSwitcher;
