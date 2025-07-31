import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/userModel";
import { ContactFormModel } from "@/models/contactModel";
import { ProductModel } from "@/models/productModel";
import VisitorModel from "@/models/visitorModel";

export async function GET() {
  try {
    await dbConnect();

    const [users, contacts, visitors, products] = await Promise.all([
      UserModel.find({}),
      ContactFormModel.find({}),
      VisitorModel.find({}),
      ProductModel.find({ "flags.isActive": true }),
    ]);

    // Get current date and calculate previous month/year
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = new Date(currentYear, currentMonth - 1, 1);
    const thisMonthStart = new Date(currentYear, currentMonth, 1);
    const lastMonthStart = new Date(currentYear, currentMonth - 1, 1);
    const lastMonthEnd = new Date(currentYear, currentMonth, 0);

    // Calculate monthly changes
    const usersThisMonth = users.filter(
      (u) => u.createdAt && u.createdAt >= thisMonthStart
    ).length;
    const usersLastMonth = users.filter(
      (u) =>
        u.createdAt &&
        u.createdAt >= lastMonthStart &&
        u.createdAt < thisMonthStart
    ).length;
    const userChangePercent = usersLastMonth
      ? ((usersThisMonth - usersLastMonth) / usersLastMonth) * 100
      : 0;
    // Calculate monthly changes
    const visitorsThisMonth = visitors.filter(
      (u) => u.createdAt && u.createdAt >= thisMonthStart
    ).length;
    const visitorsLastMonth = visitors.filter(
      (u) =>
        u.createdAt &&
        u.createdAt >= lastMonthStart &&
        u.createdAt < thisMonthStart
    ).length;
    const visitorChangePercent = visitorsLastMonth
      ? ((visitorsThisMonth - visitorsLastMonth) / visitorsLastMonth) * 100
      : 0;

    const productsThisMonth = products.filter(
      (p) => p.createdAt >= thisMonthStart
    ).length;
    const productsLastMonth = products.filter(
      (p) => p.createdAt >= lastMonthStart && p.createdAt < thisMonthStart
    ).length;
    const productChangePercent = productsLastMonth
      ? ((productsThisMonth - productsLastMonth) / productsLastMonth) * 100
      : 0;

    const contactsThisMonth = contacts.filter(
      (c) => c.createdAt >= thisMonthStart
    ).length;
    const contactsLastMonth = contacts.filter(
      (c) => c.createdAt >= lastMonthStart && c.createdAt < thisMonthStart
    ).length;
    const contactChangePercent = contactsLastMonth
      ? ((contactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100
      : 0;

    // Process metrics
    const metrics = [
      {
        title: "Total Visitors",
        value: visitors.length.toString(), // You might want to replace this with actual visitor tracking
        change: `+${visitorsThisMonth} this month (${visitorChangePercent.toFixed(1)}%)`, // You'd need visitor data to calculate this properly
        icon: "Telescope",
        trend: visitorsThisMonth > visitorsLastMonth ? "up" : "down",
        gradientColor: "from-emerald-500 to-emerald-200",
        textColor: "text-emerald-100",
        href: "/admin/visitor",
      },
      {
        title: "Active Products",
        value: products.length.toString(),
        change: `+${productsThisMonth} this month (${productChangePercent.toFixed(1)}%)`,
        icon: "ShoppingCart",
        trend: productsThisMonth > productsLastMonth ? "up" : "down",
        gradientColor: "from-blue-500 to-blue-200",
        textColor: "text-blue-100",
        href: "/admin/products",
      },
      {
        title: "Total Users",
        value: users.length.toString(),
        change: `${users.filter((u) => u.isAdmin).length} Admins`,
        icon: "Users",
        trend: usersThisMonth > usersLastMonth ? "up" : "down",
        gradientColor: "from-violet-500 to-violet-200",
        textColor: "text-violet-100",
        href: "/admin/users",
      },
      {
        title: "Total Contacts",
        value: contacts.length.toString(),
        change: `+${contactsThisMonth} this month (${contactChangePercent.toFixed(1)}%)`,
        icon: "Contact",
        trend: contactsThisMonth > contactsLastMonth ? "up" : "down",
        gradientColor: "from-amber-500 to-amber-200",
        textColor: "text-amber-100",
        href: "/admin/contacts",
      },
    ];

    // Process user growth data by month
    const userGrowthByMonth = Array(currentMonth + 1) // Only create array for months up to current month
      .fill(0)
      .map((_, i) => {
        const month = i; // Start from 0 (January) to current month
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0);

        return {
          name: monthStart.toLocaleString("default", { month: "short" }),
          users: users.filter(
            (u) =>
              u.createdAt &&
              u.createdAt >= monthStart &&
              u.createdAt <= monthEnd
          ).length,
        };
      });

    // Process product growth data by month
    const productGrowthByMonth = Array(currentMonth + 1)
      .fill(0)
      .map((_, i) => {
        const month = i; // Start from 0 (January) to current month
        const monthStart = new Date(currentYear, month, 1);
        const monthEnd = new Date(currentYear, month + 1, 0);
        return {
          name: monthStart.toLocaleString("default", { month: "short" }),
          products: products.filter(
            (p) => p.createdAt >= monthStart && p.createdAt <= monthEnd
          ).length,
        };
      });

    // Process contact status data
    const totalContacts = contacts.length;
    const resolvedCount = contacts.filter(
      (c) => c.status === "resolved"
    ).length;
    const inProgressCount = contacts.filter(
      (c) => c.status === "inprogress"
    ).length;
    const newCount = contacts.filter((c) => c.status === "new").length;

    const contactStatusData = [
      {
        name: "Resolved",
        value: resolvedCount,
        percentage:
          totalContacts > 0
            ? Math.round((resolvedCount / totalContacts) * 100)
            : 0,
      },
      {
        name: "In Progress",
        value: inProgressCount,
        percentage:
          totalContacts > 0
            ? Math.round((inProgressCount / totalContacts) * 100)
            : 0,
      },
      {
        name: "New",
        value: newCount,
        percentage:
          totalContacts > 0 ? Math.round((newCount / totalContacts) * 100) : 0,
      },
    ];

    const teamMembers = users
      .filter((u) => u.isAdmin)
      .map((admin) => ({
        name: admin.name,
        position: admin.position, // Assuming the original has 'role' property
        image: admin.image || "", // Fallback to default image if avatar not provided
      }));

    return NextResponse.json({
      success: true,
      data: {
        metrics: metrics,
        userGrowthData: userGrowthByMonth,
        productGrowthData: productGrowthByMonth,
        contactStatusData: contactStatusData,
        teamMembers: teamMembers,
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
