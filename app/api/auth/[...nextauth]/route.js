import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

import User from '@models/user';
import { connectToDB } from '@utils/database';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from MongoDB to session
      const sessionUser = await User.findOne({ email: session.user.email });
      session.user.id = sessionUser._id.toString();

      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        await connectToDB();

        // check if user already exists
        const userExists = await User.findOne({ email: profile.email });

        // if not, create a new document and save user in MongoDB
        if (!userExists) {
          await User.create({
            email: profile.email,
            username: profile.name.replace(" ", "").toLowerCase(),
            image: profile.picture,
          });
        }

        const sanitizeUsername = (username) => {
          // Remove non-alphanumeric characters and spaces, and ensure length
          let sanitized = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
          
          // Ensure length is between 8 and 20
          if (sanitized.length < 8) {
            sanitized = sanitized.padEnd(8, 'x'); // pad with 'x' if it's too short
          } else if (sanitized.length > 20) {
            sanitized = sanitized.substring(0, 20); // truncate if it's too long
          }
        
          return sanitized;
        };
        
        if (!userExists) {
          const username = sanitizeUsername(profile.name);
        
          await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
          });
        }
        
        return true
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false
      }
    },
  }
})

export { handler as GET, handler as POST }
