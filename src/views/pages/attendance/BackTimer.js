// import { useState, useEffect } from 'react';

// const BackTimer = ({ Time }) => {
//     const startTimeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
//     if (!startTimeRegex.test(Time)) {
//         return <div></div>;
//     }

//     console.log(typeof Time, Time, 'hello Time ');
//     const startTime = Time;
//     const durationInMinutes = 10;
//     const endTime = new Date(new Date().toDateString() + ' ' + startTime);
//     endTime.setTime(endTime.getTime() + durationInMinutes * 60 * 1000);

//     // const [remainingTime, setRemainingTime] = useState(endTime.getTime() - Date.now());
//     const [remainingTime, setRemainingTime] = useState(Math.max(endTime.getTime() - Date.now(), 0));

//     useEffect(() => {
//         const intervalId = setInterval(() => {
//             setRemainingTime((prevTime) => prevTime - 1000);
//         }, 1000);
//         return () => clearInterval(intervalId);
//     }, []);

//     const minutes = Math.floor(remainingTime / 1000 / 60);
//     const seconds = Math.floor((remainingTime / 1000) % 60);

//     return (
//         <div>
//             <p style={{ display: remainingTime > 0 ? 'block' : 'none' }}>You need to submit your scrum report in 10:00 Minutes.</p>
//             <span style={{ color: 'red', fontWeight: 600 }}>
//                 {remainingTime > 0 ? `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}` : <span></span>}
//             </span>
//         </div>
//     );
// };

// export default BackTimer;

import { useState, useEffect } from 'react';

const BackTimer = ({ Time }) => {
    const startTimeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;
    const [remainingTime, setRemainingTime] = useState(0);

    useEffect(() => {
        if (startTimeRegex.test(Time)) {
            const startTime = Time;
            const durationInMinutes = 10;
            const endTime = new Date(new Date().toDateString() + ' ' + startTime);
            endTime.setTime(endTime.getTime() + durationInMinutes * 60 * 1000);

            setRemainingTime(Math.max(endTime.getTime() - Date.now(), 0));

            const intervalId = setInterval(() => {
                setRemainingTime((prevTime) => prevTime - 1000);
            }, 1000);
            return () => clearInterval(intervalId);
        } else {
            setRemainingTime(0);
        }
    }, [Time]);

    const minutes = Math.floor(remainingTime / 1000 / 60);
    const seconds = Math.floor((remainingTime / 1000) % 60);

    if (!startTimeRegex.test(Time)) {
        return <div></div>;
    }

    return (
        <div>
            <p style={{ display: remainingTime > 0 ? 'block' : 'none' }}>
                You need to submit your scrum report in{' '}
                <span style={{ color: 'red', fontWeight: 600 }}>
                    {remainingTime > 0 ? `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}` : <span></span>}
                </span>{' '}
                Minutes.
            </p>
            {/* <span style={{ color: 'red', fontWeight: 600 }}>
                {remainingTime > 0 ? `0${minutes}:${seconds < 10 ? '0' + seconds : seconds}` : <span></span>}
            </span> */}
        </div>
    );
};

export default BackTimer;
