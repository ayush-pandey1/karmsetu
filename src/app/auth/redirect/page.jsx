"use client";
import Loader from "@/components/Loader";
import Loader2 from "@/components/Loader2";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const AuthRedirectPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.replace("/auth/signin");
      return;
    }

    const processRedirect = async () => {
      // Check existing sessionStorage first
      const stored = sessionStorage.getItem("karmsetu");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.role === "client") {
            router.replace("/cl");
            return;
          } else if (parsed?.role === "freelancer") {
            router.replace("/fl");
            return;
          }
        } catch (e) {
          console.error("Error reading stored session", e);
        }
      }

      // If no valid stored role, fetch user details by email
      const userEmail = session?.user?.email;
      if (!userEmail) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch("/api/userInfoByEmail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: { email: userEmail } }),
        });

        const result = await response.json();

        if (response.ok && result?.user) {
          const userObj = result.user;
          const sessionData = {
            email: userObj.email,
            name: userObj.fullname,
            id: userObj._id,
            role: userObj.role,
            profileImage: userObj.imageLink || "",
            phone: userObj.phone || "",
          };

          sessionStorage.setItem("karmsetu", JSON.stringify(sessionData));

          if (userObj.role === "client") {
            router.replace("/cl");
          } else if (userObj.role === "freelancer") {
            router.replace("/fl");
          } else {
            router.replace("/onboarding");
          }
        } else {
          console.error("User not found or error:", result?.message);
          router.replace("/");
        }
      } catch (error) {
        console.error("Error during auth redirect:", error);
        router.replace("/");
      } finally {
        setIsProcessing(false);
      }
    };

    processRedirect();
  }, [session, status, router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-white">
      <Loader2 />
    </div>
  );
};

export default AuthRedirectPage;
