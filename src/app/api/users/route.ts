import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { sendVerificationEmail } from "@/lib/sendVerificationEmail";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET() {
  await dbConnect();
  try {
    const users = await UserModel.find(
      {},
      { password: 0, verifyCode: 0, __v: 0 }
    )
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
export async function POST(req: Request) {
  await dbConnect();
  try {
    const body = await req.json();
    const user = await UserModel.create(body);
    const { password, verifyCode, __v, ...userData } = user.toObject();
    return NextResponse.json(userData, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  await dbConnect();
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return Response.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const updateData = await request.json();
    const currentUser = await UserModel.findById(session.user._id);
    if (!currentUser) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }
    // Update username (with checks)
    if (updateData.username && updateData.username !== currentUser.username) {
      const existingVerifiedUserByUsername = await UserModel.findOne({
        username: updateData.username,
        isVerified: true,
        _id: { $ne: currentUser._id },
      });

      if (existingVerifiedUserByUsername) {
        return Response.json(
          { success: false, message: "Username is already taken" },
          { status: 400 }
        );
      }
      currentUser.username = updateData.username;
    }
    // Update email (with verification)
    if (updateData.email && updateData.email !== currentUser.email) {
      const existingUserByEmail = await UserModel.findOne({
        email: updateData.email,
        _id: { $ne: currentUser._id },
      });

      if (existingUserByEmail) {
        return Response.json(
          {
            success: false,
            message: "Email already in use by another account",
          },
          { status: 400 }
        );
      }
      const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
      currentUser.email = updateData.email;
      currentUser.verifyCode = verifyCode;
      currentUser.verifyCodeExpiry = new Date(Date.now() + 3600000);
      currentUser.isVerified = false;

      const emailResponse = await sendVerificationEmail(
        updateData.email,
        currentUser.username,
        verifyCode
      );

      if (!emailResponse.success) {
        return Response.json(
          { success: false, message: emailResponse.message },
          { status: 500 }
        );
      }
    }
    // Update name (no special checks needed)
    if ("phone" in updateData) {
      currentUser.phone = updateData.phone ?? "";
    }
    if ("gender" in updateData) {
      currentUser.gender = updateData.gender ?? "other";
    }
    if ("name" in updateData) {
      currentUser.name = updateData.name ?? null;
    }
    // Update profile image and banner
    if ("image" in updateData) {
      currentUser.image = updateData.image ?? null;
    }
    if ("banner" in updateData) {
      currentUser.banner = updateData.banner ?? null;
    }

    await currentUser.save();

    return Response.json(
      {
        success: true,
        message:
          updateData.email && updateData.email !== currentUser.email
            ? "Profile updated successfully. Please verify your new email."
            : "Profile updated successfully",
        data: {
          _id: currentUser._id,
          username: currentUser.username,
          email: currentUser.email,
          name: currentUser.name,
          image: currentUser.image,
          banner: currentUser.banner,
          isVerified: currentUser.isVerified,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return Response.json(
      { success: false, message: "Error updating user profile" },
      { status: 500 }
    );
  }
}
