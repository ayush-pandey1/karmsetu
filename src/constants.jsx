import { Icon } from '@iconify/react';
export const SIDENAV_ITEMS = [
    {
        title: 'Home',
        path: '/cl',
        icon: <Icon icon="lucide:home" width="24" height="24"/>,
    },
    {
        title: 'Projects',
        path: '/cl/projects',
        icon: <Icon icon="lucide:folder" width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'All', path: '/cl/projects' },
            { title: 'Ongoing', path: '/cl/projects/ongoing' },
            { title: 'Completed', path: '/cl/projects/completed' },
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
        title: 'Reward',
        path: '/cl/reward',
        icon: <Icon icon="lucide:coins" width="24" height="24"/>,
        
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
