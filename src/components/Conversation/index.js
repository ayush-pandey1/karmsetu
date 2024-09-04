import { getUser } from '@/services/chatRequest';
import Link from 'next/link'
import React, { useEffect, useState } from 'react'

const Conversation = ({data, currentUserId, online}) => {

    const [userData,setUserData]=useState(null);

    useEffect(()=>{
        const userId=data.members.find((id)=>id!==currentUserId);
        console.log("other",userId);
        const getUserData=async()=>{
            try {
                const {data}=await getUser(userId);
            setUserData(data.user)
            console.log("new: ",data.user);
            } catch (error) {
                console.log(error);
            }
        }
        getUserData();
    },[])


  return (
    <Link
                  href="/cl/chat"
                  className="flex items-center px-3 py-2 text-sm transition duration-150 ease-in-out border-b border-gray-300 cursor-pointer hover:bg-gray-100 focus:outline-none"
                >
                  <img
                    className="object-cover w-10 h-10 rounded-full"
                    src="/images/user/user-07.png"
                    alt="username"
                  />
                  <div className="w-full pb-2">
                    <div className="flex justify-between">
                      <span className="block ml-2 font-semibold text-gray-600">
                        {userData?.fullname}
                      </span>
                      <span className="block ml-2 text-sm text-gray-600">
                        25 minutes
                      </span>
                    </div>
                    {online?<span className="block ml-2 text-sm text-gray-600">Online</span>:<span className="block ml-2 text-sm text-gray-600">Offline</span>}
                    
                  </div>
                </Link>
  )
}

export default Conversation