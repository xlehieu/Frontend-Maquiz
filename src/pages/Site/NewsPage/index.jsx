import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const NewsPage = () => {
    return (
        <section className="flex flex-col justify-center items-center mb-5">
            <iframe
                src="https://www.tiktok.com/embed/7487196946269031685"
                width="325"
                height="580"
                style={{ border: 'none', overflow: 'hidden' }}
                allow="encrypted-media"
            ></iframe>
        </section>
    );
};

export default NewsPage;
