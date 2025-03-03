import React from 'react';
const BlurBackground = ({ isActive, onClick = () => {}, ...props }) => {
    return (
        <div
            onClick={() => onClick()}
            className={`${
                isActive ? 'block' : 'hidden'
            } fixed z-20 inset-0 opacity-55 min-w-full min-h-screen bg-black`}
            {...props}
        ></div>
    );
};

export default BlurBackground;
