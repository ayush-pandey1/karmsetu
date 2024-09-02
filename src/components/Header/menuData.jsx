const menuData = [
    {
        id: 1,
        title: "Home",
        newTab: false,
        path: "/",
    },
    {
        id: 2,
        title: "Features",
        newTab: false,
        path: "/#features",
    },
    {
        id: 2.1,
        title: "Dashboard",
        newTab: false,
        path: "/cl",
    },
    {
        id: 3,
        title: "Pages",
        newTab: false,
        submenu: [
            
            {
                id: 34,
                title: "Sign In",
                newTab: false,
                path: "/auth/signin",
            },
            {
                id: 35,
                title: "Sign Up",
                newTab: false,
                path: "/auth/signup",
            },
           
            {
                id: 35.1,
                title: "Support",
                newTab: false,
                path: "/support",
            },
           
        ],
    },
    {
        id: 4,
        title: "Support",
        newTab: false,
        path: "/support",
    },
];
export default menuData;
