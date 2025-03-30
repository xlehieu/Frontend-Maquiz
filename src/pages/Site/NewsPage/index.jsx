import { faEnvelope, faPhone, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const NewsPage = () => {
    return (
        <section className="flex flex-col justify-center items-center mb-5">
            <h1 className="text-4xl my-5">LIÊN HỆ</h1>
            <blockquote
                class="tiktok-embed"
                cite="https://www.tiktok.com/@gianghohocthuc/video/7487196946269031685"
                data-video-id="7487196946269031685"
                style={{ maxWidth: 605, minWidth: 325 }}
            >
                {' '}
                <section>
                    {' '}
                    <a
                        target="_blank"
                        title="@gianghohocthuc"
                        href="https://www.tiktok.com/@gianghohocthuc?refer=embed"
                    >
                        @gianghohocthuc
                    </a>{' '}
                    👍👍{' '}
                    <a title="capcut" target="_blank" href="https://www.tiktok.com/tag/capcut?refer=embed">
                        #capcut
                    </a>{' '}
                    <a
                        target="_blank"
                        title="♬ nhạc nền - chíp 26.. - Chíp 26..❤️‍🩹"
                        href="https://www.tiktok.com/music/nhạc-nền-chíp-26-7472678173117926161?refer=embed"
                    >
                        ♬ nhạc nền - chíp 26.. - Chíp 26..❤️‍🩹
                    </a>{' '}
                </section>{' '}
            </blockquote>{' '}
            <script async src="https://www.tiktok.com/embed.js"></script>
        </section>
    );
};

export default NewsPage;
