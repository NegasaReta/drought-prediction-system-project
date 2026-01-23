import { connectToDB } from "../../../lib/db";
import User from "../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectToDB();
  const { email, password } = await req.json();

  if (await User.findOne({ email })) {
    return new Response(JSON.stringify({ message: "User exists" }), {
      status: 400,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  return new Response(JSON.stringify({ token }), { status: 201 });
}
