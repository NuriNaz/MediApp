import { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'ui-component/Loadable';
import Attendance from 'views/pages/attendance/Attendance';
import Report from 'views/pages/scrum/Report';
import DSR from 'views/pages/EOD/DSR';
import TaskManagement from 'views/pages/taskmanagement/TaskManagement';
import LeaveManagement from 'views/pages/LeaveManagement/LeaveManagement';
import Profile from 'views/pages/profile/Profile';
import ScrumOpenbyid from 'views/pages/scrum/ScrumOpenbyid';
import Qaresponse from 'views/pages/taskmanagement/Qaresponse';
import PunchOutTime from 'views/pages/EOD/PunchOutTime';
import Notifications from 'views/pages/Notification/Notifications';
import Weekendworking from 'views/pages/Weekendworking/Weekendworking';
import CalendarComponent from 'views/pages/calendar/CalendarComponent';
// import Login from 'views/pages/authentication/authentication3/Login3';
import { Navigate } from 'react-router-dom';
import DSROpenbyid from 'views/pages/EOD/DSROpenById';

// import weeklySprints from '../views/pages/taskmanagement/weeklySprints';
// dashboard routing
const DashboardDefault = Loadable(lazy(() => import('views/dashboard/Default')));

// utilities routing
// const UtilsTypography = Loadable(lazy(() => import('views/utilities/Typography')));
// const UtilsColor = Loadable(lazy(() => import('views/utilities/Color')));
// const UtilsShadow = Loadable(lazy(() => import('views/utilities/Shadow')));
// const UtilsMaterialIcons = Loadable(lazy(() => import('views/utilities/MaterialIcons')));
// const UtilsTablerIcons = Loadable(lazy(() => import('views/utilities/TablerIcons')));

// sample page routing
// const SamplePage = Loadable(lazy(() => import('views/sample-page')));
const AuthLogin3 = Loadable(lazy(() => import('views/pages/authentication/authentication3/Login3')));

// ==============================|| MAIN ROUTING ||============================== //
const auth = localStorage.getItem('Token');

const MainRoutes = {
    path: '/',
    element: auth ? <MainLayout /> : <AuthLogin3 />,
    children: [
        {
            path: '/',
            element: <Navigate to="/dashboard" replace />
        },
        {
            path: 'dashboard',
            element: <DashboardDefault />
        },
        // {
        //     path: 'utils',
        //     children: [
        //         {
        //             path: 'util-typography',
        //             element: <UtilsTypography />
        //         }
        //     ]
        // },
        // {
        //     path: 'utils',
        //     children: [
        //         {
        //             path: 'util-color',
        //             element: <UtilsColor />
        //         }
        //     ]
        // },
        // {
        //     path: 'utils',
        //     children: [
        //         {
        //             path: 'util-shadow',
        //             element: <UtilsShadow />
        //         }
        //     ]
        // },
        // {
        //     path: 'icons',
        //     children: [
        //         {
        //             path: 'tabler-icons',
        //             element: <UtilsTablerIcons />
        //         }
        //     ]
        // },
        // {
        //     path: 'icons',
        //     children: [
        //         {
        //             path: 'material-icons',
        //             element: <UtilsMaterialIcons />
        //         }
        //     ]
        // },
        // {
        //     path: 'sample-page',
        //     element: <SamplePage />
        // },
        {
            path: 'attendance',
            element: <Attendance />
        },
        {
            path: 'scrum-report',
            element: <Report />
        },
        {
            path: '/dsr',
            element: <DSR />
        },
        {
            path: '/task-management',
            element: <TaskManagement />
        },
        {
            path: '/leave-management',
            element: <LeaveManagement />
        },
        {
            path: '/profile',
            element: <Profile />
        },
        {
            path: '/dsr/:id',
            element: <DSROpenbyid />
        },
        {
            path: '/scrum/:id',
            element: <ScrumOpenbyid />
        },
        {
            path: '/task-management/qa-response/:id/:taskid',
            element: <Qaresponse />
        },
        {
            path: '/punchout',
            element: <PunchOutTime />
        },
        {
            path: '/notifications',
            element: <Notifications />
        },
        {
            path: '/Weekend-working',
            element: <Weekendworking />
        },
        {
            path: '/Holidays-Almanac',
            element: <CalendarComponent />
        }
    ]
};

export default MainRoutes;
