import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import UserModel from '@/models/userModel'

export async function GET() {
  await dbConnect()
  try {
    const users = await UserModel.find({}, { password: 0, verifyCode: 0, __v: 0 })
      .sort({ createdAt: -1 })
      .lean()
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    )
  }
}
export async function POST(req: Request) {
  await dbConnect()
  try {
    const body = await req.json()
    const user = await UserModel.create(body)
    const { password, verifyCode, __v, ...userData } = user.toObject()
    return NextResponse.json(userData, { status: 201 })
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}