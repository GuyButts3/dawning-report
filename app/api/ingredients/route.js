import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { getPlayerIngredients, getDestinyMembership } from "@/lib/bungie";
import { NextResponse } from "next/server";

export async function GET(request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const destinyMembership = getDestinyMembership(session.user.destinyMemberships);
    
    const ingredients = await getPlayerIngredients(
      destinyMembership.membershipType,
      destinyMembership.membershipId,
      session.accessToken
    );

    return NextResponse.json({ ingredients });
  } catch (error) {
    console.error('Error fetching ingredients:', error);
    return NextResponse.json(
      { error: "Failed to fetch ingredients" },
      { status: 500 }
    );
  }
}
