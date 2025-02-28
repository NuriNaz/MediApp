// Seconds to convert in HH/MM/SS

const { Difference } = require('@mui/icons-material');

exports.formatTime = (durationInSeconds) => {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;
    if (isNaN(hours)) {
        return '00:00:00';
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

exports.handleFormatDate = (originalDate) => {
    const dateObj = new Date(originalDate);
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const year = dateObj.getFullYear().toString();

    // const formattedDate = `${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}-${year}`;

    const formattedDate = `${day.toString().padStart(2, '0')}-${month.toString().padStart(2, '0')}-${year}`;

    return formattedDate;
};

// function for calculating the Difference B/w Punchout - Punchin Time
exports.timeDifferenceSec = (punchInTime, punchOutTime) => {
    const newPunchInTime = new Date(punchInTime);
    const newPunchOutTime = new Date(punchOutTime);

    const timeDiff = newPunchOutTime - newPunchInTime;
    const timeDiffSec = timeDiff / 1000;
    // console.log('timeDiff', timeDiffSec);
    const hours = Math.floor(timeDiffSec / (60 * 60));
    const minutes = Math.floor((timeDiffSec % (60 * 60)) / 60);
    const seconds = Math.floor(timeDiffSec % 60);
    if (isNaN(hours)) {
        return '00:00:00';
    }
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};
const timeStringToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map((component) => parseInt(component));
    return hours * 3600 + minutes * 60 + seconds;
};

exports.unpaidBreaks = (totalTime, clockedTime) => {
    const newPunchInTime = timeStringToSeconds(totalTime);
    const timeDiff = newPunchInTime - clockedTime;
    console.log(clockedTime, 'hello clocked');
    console.log(newPunchInTime, 'totalTimesec');
    console.log('timeDiff', timeDiff);
    const hours = Math.floor(timeDiff / (60 * 60));
    const minutes = Math.floor((timeDiff % (60 * 60)) / 60);
    const seconds = Math.floor(timeDiff % 60);
    if (isNaN(hours)) {
        return '00:00:00';
    }

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

exports.formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};
