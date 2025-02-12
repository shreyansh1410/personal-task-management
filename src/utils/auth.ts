import * as jose from "jose";

interface CustomJWTPayload extends jose.JWTPayload {
  userId: number;
}

export const verifyToken = async (
  token: string | undefined
): Promise<number> => {
  if (!token) {
    throw new Error("No token provided");
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    const { payload } = await jose.jwtVerify(token, secret);
    return (payload as CustomJWTPayload).userId;
  } catch (error) {
    console.log(error);
    throw new Error("Invalid token");
  }
};
