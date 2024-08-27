import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const options = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  
  ],
  secret: process.env.NEXTAUTH_SECRET,
};

export const GET = async (req, res) => {
  return NextAuth(req, res, options);
};

export const POST = async (req, res) => {
  return NextAuth(req, res, options);
};
