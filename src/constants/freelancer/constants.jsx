import { Icon } from '@iconify/react';
export const SIDENAV_ITEMS = [
    {
        title: 'Home',
        path: '/fl',
        icon: <Icon icon="lucide:home" width="24" height="24"/>,
    },
    {
        title: 'Projects',
        path: '/fl/projects',
        icon: <Icon icon="lucide:folder" width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'All', path: '/fl/projects' },
            { title: 'Ongoing', path: '/fl/projects/ongoing' },
            { title: 'Completed', path: '/fl/projects/completed' },
        ],
    },
    {
        title: 'Notifications',
        path: '/fl/notifications',
        icon: <Icon icon="lucide:bell" width="24" height="24"/>,
    },
    {
        title: 'Messages',
        path: '/fl/messages',
        icon: <Icon icon="lucide:mail" width="24" height="24"/>,
        
    },
    {
        title: 'Reward',
        path: '/fl/reward',
        icon: <Icon icon="lucide:coins" width="24" height="24"/>,
        
    },
    {
        title: 'Analytics',
        path: '/fl/analytics',
        icon: <Icon icon="lucide:trending-up" width="24" height="24"/>,
    },
    {
        title: 'Transactions',
        path: '/fl/transactions',
        icon: <Icon icon="lucide:receipt-indian-rupee" width="24" height="24"/>,
        
    },
    {
        title: 'Settings',
        path: '/fl/settings',
        icon: <Icon icon="lucide:settings" width="24" height="24"/>,
        submenu: true,
        subMenuItems: [
            { title: 'Profile', path: '/fl/settings/profile' },
            { title: 'Privacy', path: '/fl/settings/privacy' },
        ],
    },
    {
        title: 'Help',
        path: '/fl/help',
        icon: <Icon icon="lucide:help-circle" width="24" height="24"/>,
    },
];
