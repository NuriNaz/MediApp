import React from 'react';
import './index.css';

const FirstnameIcon = ({ firstName }) => {
    return (
        <div>
            <div className="firstname-icon">{firstName.charAt(0)}</div>
        </div>
    );
};

export default FirstnameIcon;
