import NextAuth from "next-auth";

const BungieProvider = {
  id: "bungie",
  name: "Bungie",
  type: "oauth",
  wellKnown: "https://www.bungie.net/.well-known/openid-configuration",
  authorization: {
    url: "https://www.bungie.net/en/OAuth/Authorize",
    params: { scope: "" }
  },
  token: "https://www.bungie.net/platform/app/oauth/token/",
  userinfo: {
    url: "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
    async request({ tokens, provider }) {
      const response = await fetch(
        "https://www.bungie.net/Platform/User/GetMembershipsForCurrentUser/",
        {
          headers: {
            Authorization: `Bearer ${tokens.access_token}`,
            "X-API-Key": process.env.BUNGIE_API_KEY,
          },
        }
      );
      const data = await response.json();
      return data.Response;
    },
  },
  clientId: process.env.BUNGIE_CLIENT_ID,
  clientSecret: process.env.BUNGIE_CLIENT_SECRET,
  profile(profile) {
    return {
      id: profile.bungieNetUser.membershipId,
      name: profile.bungieNetUser.displayName,
      membershipId: profile.bungieNetUser.membershipId,
      destinyMemberships: profile.destinyMemberships,
    };
  },
};

export const authOptions = {
  providers: [BungieProvider],
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.membershipId = token.membershipId;
        session.user.destinyMemberships = token.destinyMemberships;
        session.accessToken = token.accessToken;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      if (user) {
        token.membershipId = user.membershipId;
        token.destinyMemberships = user.destinyMemberships;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
