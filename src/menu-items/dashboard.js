// assets
import { IconDashboard } from '@tabler/icons';
// import { Report } from 'tabler-icons-react';
import { BsFillCalendarCheckFill } from 'react-icons/bs';
import { AiFillPieChart, AiFillHome } from 'react-icons/ai';
import { HiChartBar } from 'react-icons/hi';
import { GrTasks } from 'react-icons/gr';
import { MdLockClock } from 'react-icons/md';
import { SlCalender } from 'react-icons/sl';
// constant
const icons = { IconDashboard, BsFillCalendarCheckFill, AiFillPieChart, HiChartBar, GrTasks, AiFillHome, MdLockClock, SlCalender };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
    id: 'dashboard',
    // title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'default',
            title: 'Dashboard',
            type: 'item',
            url: '/dashboard',
            icon: icons.IconDashboard,
            breadcrumbs: false
        },
        {
            id: 'Attendance',
            title: 'Attendance',
            type: 'item',
            url: '/attendance',
            icon: icons.BsFillCalendarCheckFill,
            breadcrumbs: false
        },
        {
            id: 'scrum',
            title: 'Scrum Report',
            type: 'item',
            url: '/scrum-report',
            icon: icons.AiFillPieChart,
            // icon: icons1.BsFillCalendarCheckFill,
            breadcrumbs: false
        },
        {
            id: 'eod',
            title: 'DSR',
            type: 'item',
            url: '/dsr',
            icon: icons.HiChartBar,
            breadcrumbs: false
        },
        {
            id: 'task',
            title: 'Task Management',
            type: 'item',
            url: '/task-management',
            icon: icons.GrTasks,
            breadcrumbs: false
        },
        {
            id: 'leave',
            title: 'Leave Management',
            type: 'item',
            url: '/leave-management',
            icon: icons.AiFillHome,
            breadcrumbs: false
        },
        // {
        //     id: 'Weekend',
        //     // title: 'Overtime management',
        //     title: 'Weekend Working',
        //     type: 'item',
        //     url: '/Weekend-working',
        //     icon: icons.MdLockClock,
        //     breadcrumbs: false
        // },
        {
            id: 'Almanac',
            title: 'Holidays Almanac',
            type: 'item',
            url: '/Holidays-Almanac',
            icon: icons.SlCalender,
            breadcrumbs: false
        }
    ]
};

export default dashboard;
