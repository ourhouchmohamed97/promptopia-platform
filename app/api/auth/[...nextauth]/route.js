import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import User from '@models/user';
import connectToDB from '@utils/database'; // Changed import

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  ],
  callbacks: {
    async session({ session }) {
      try {
        await connectToDB(); // This now returns the connection
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
        }
        return session;
      } catch (error) {
        console.log("Error in session callback:", error.message);
        return session;
      }
    },
    async signIn({ profile }) {
      try {
        await connectToDB(); // Ensure connection is established
        
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          const sanitizeUsername = (username) => {
            let sanitized = username.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
            if (sanitized.length < 8) {
              sanitized = sanitized.padEnd(8, 'x');
            } else if (sanitized.length > 20) {
              sanitized = sanitized.substring(0, 20);
            }
            return sanitized;
          };

          await User.create({
            email: profile.email,
            username: sanitizeUsername(profile.name),
            image: profile.picture,
          });
        }

        return true;
      } catch (error) {
        console.log("Error in signIn callback:", error.message);
        return false;
      }
    },
  }
});

export { handler as GET, handler as POST };