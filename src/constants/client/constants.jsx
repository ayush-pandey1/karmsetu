import { Icon } from '@iconify/react';
export const SIDENAV_ITEMS = [
    {
        title: 'Home',
        path: '/cl',
        icon: <Icon icon="lucide:home" width="24" height="24"/>,
    },
    {
        title: 'Jobs',
        path: '/cl/jobs',
        icon: <Icon icon="lucide:folder" width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'All', path: '/cl/jobs' },
            { title: 'Ongoing', path: '/cl/jobs/ongoing' },
            { title: 'Completed', path: '/cl/jobs/completed' },
        ],
    },
    {
        title: 'Notifications',
        path: '/cl/notifications',
        icon: <Icon icon="lucide:bell" width="24" height="24"/>,
    },
    {
        title: 'Messages',
        path: '/cl/messages',
        icon: <Icon icon="lucide:mail" width="24" height="24"/>,
        
    },
    
    {
        title: 'Analytics',
        path: '/cl/analytics',
        icon: <Icon icon="lucide:trending-up" width="24" height="24"/>,
    },
    {
        title: 'Transactions',
        path: '/cl/transactions',
        icon: <Icon icon="lucide:receipt-indian-rupee" width="24" height="24"/>,
        
    },
    {
        title: 'Settings',
        path: '/cl/settings',
        icon: <Icon icon="lucide:settings" width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'Profile', path: '/cl/settings/profile' },
            { title: 'Privacy', path: '/cl/settings/privacy' },
        ],
    },
    {
        title: 'Help',
        path: '/cl/help',
        icon: <Icon icon="lucide:help-circle" width="24" height="24"/>,
    },
];
