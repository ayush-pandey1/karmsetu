"use client";
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';


const redirect = () => {
    const { data: session, status } = useSession();
    const [role, setRole] = useState("")
    const [userData, setUserData] = useState();
    const [user, setUser] = useState();
    const router = useRouter();
    if (userData?.role === "client") {
        router.push("/cl");
    }
    else if (userData?.role === "freelancer") {
        router.push("/fl");
    }
    useEffect(() => {
        // const data = JSON.parse(sessionStorage.getItem('karmsetu'));
        // setUserData(data);
        if (!userData) {
            if (session?.user?.email) {
                // setUserEmail(session.user.email);

                async function fetchUserData(email) {
                    try {
                        const response = await fetch('/api/userInfoByEmail', { // Replace with your actual route
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ data: { email } })
                        });

                        const result = await response.json();

                        if (response.ok) {
                            console.log("User Data:", result.user);
                            setUser(result.user);

                            const sessionData = {
                                email: user.email,
                                name: user.fullname,
                                id: user._id,
                                role: user.role,
                            };
                            setRole(sessionData?.role);
                            console.log("sdsd", role);
                            sessionStorage.setItem('karmsetu', JSON.stringify(sessionData));
                            console.log('Session data stored in sessionStorage:', sessionData);
                            const data = JSON.parse(sessionStorage.getItem('karmsetu'));
                            setRole(data?.role);
                            setUserData(data);
                            // Handle the user data here
                        } else {
                            console.error("Error:", result.message);

                            // Handle the error here
                        }
                    } catch (error) {
                        console.error("Fetch Error:", error);
                        // Handle the error here
                    }
                }


                // Usage example
                fetchUserData(session.user.email);



            }
            else {
                const data = JSON.parse(sessionStorage.getItem('karmsetu'));
                setUserData(data);
                console.log("asas", data);
                // setUserEmail(data?.email);
                setRole(data?.role);
            }
        }
    }, [session, role, user, userData]);
    useEffect(() => {
        const userData = JSON.parse(sessionStorage.getItem('karmsetu'));
        setUserData(userData);
        if (userData?.role === "client") {
            router.push("/cl");
        }
        else if (userData?.role === "freelancer") {
            router.push("/fl");
        }
        // else {
        //     router.push("/");
        // }
    }, [user, userData])
    return (
        <div className="h-screen w-screen"><Loader/></div>
    )
}

export default redirect;