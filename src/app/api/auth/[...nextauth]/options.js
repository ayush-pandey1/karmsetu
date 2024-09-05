import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import User from "@/app/(models)/User";
//import User from "../../../(models)/User";
import mongoose from "mongoose";
import bcrypt from "bcrypt";

if (!mongoose.connections[0].readyState) {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
}

export const options = {
    providers: [
        GitHubProvider({
            profile: async (profile, tokens) => {
                const { email } = profile;
                const { url } = tokens;
                // const role = new URL(url, 'http://localhost').searchParams.get('role') || 'freelancer';

                console.log("GitHub profile: ", profile);

                const existingUser = await User.findOne({ email });
                if (!existingUser) {
                    await User.create({
                        fullname: profile.name || profile.login,
                        email,
                        password: null, 
                        imageLink : ""
                        // role: role,
                    });
                }

                return {
                    ...profile,
                    // role: role,
                };
            },
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            profile: async (profile, tokens) => {
                const { email } = profile;
                const { url } = tokens;
                // const role = new URL(url, 'http://localhost').searchParams.get('role') || 'freelancer';

                console.log("Google profile: ", profile);

                // let userRole = role === 'client' ? 'client' : 'freelancer';

                const existingUser = await User.findOne({ email });
                if (!existingUser) {
                    await User.create({
                        fullname: profile.name,
                        email,
                        password: null,
                        imageLink : "" 
                        // role: userRole,
                    });
                }

                return {
                    id: profile.sub,
                    email,
                    name: profile.name,
                    // role: userRole,
                };
            },
            clientId: process.env.GOOGLE_ID,
            clientSecret: process.env.GOOGLE_SECRET,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {
                    label: "Email",
                    type: "text",
                    placeholder: "your email"
                },
                password: {
                    label: "Password",
                    type: "password",
                    placeholder: "your password"
                },
            },
            async authorize(credentials) {
                try {
                    const foundUser = await User.findOne({ email: credentials.email }).lean().exec();

                    if (foundUser) {
                        console.log("User exists");
                        const match = await bcrypt.compare(credentials.password, foundUser.password);
                        if (match) {
                            console.log("Password match");
                            delete foundUser.password;
                            return foundUser;
                        } else {
                            throw new Error("Invalid credentials");
                        }
                    } else {
                        throw new Error("Invalid credentials");
                    }
                } catch (error) {
                    console.error(error);
                    throw new Error(error.message || "Authorization failed");
                }
            },
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        async session({ session, token }) {
            if (session?.user) session.user.role = token.role;
            return session;
        }
    }
};
