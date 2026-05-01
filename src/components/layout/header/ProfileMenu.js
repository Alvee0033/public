"use client";
import { avatarPlaceHolder } from "@/assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import {
  DASHBOARD_ROUTES,
  getDashboardCoursesRoute,
  getDashboardRoute,
  getDashboardSettingsRoute,
} from "@/lib/dashboard-route";
import { logOut } from "@/lib/utils";
import { logout } from "@/redux/features/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";

export default function ProfileMenu() {
  const dispatch = useAppDispatch();

  // Fetch user from /me API
  const { data: userRes, isLoading: userLoading } = useSWR("/me", async (url) => {
    const res = await axios.get(url);
    return res.data?.data;
  });
  const user = userRes;

  const dashUrl = getDashboardRoute(user || {});
  const coursesUrl = getDashboardCoursesRoute(user || {});
  const settingsUrl = getDashboardSettingsRoute(user || {});
  const isStudent = dashUrl === DASHBOARD_ROUTES.student;
  const isSuperAdmin = user?.is_super_admin === true || user?.app_user_roles?.[0]?.role?.name?.toLowerCase().includes("admin");

  // Fetch enrolled courses for students
  const { data: enrolledCourses, isLoading } = useSWR(isStudent && user?.student_id ? ["my-courses", user?.app_user_roles?.[0]?.role?.name] : null, async () => {
    const res = await axios.get(
      `/student-course-enrollments?limit=100&filter=${JSON.stringify({
        student: user?.student_id,
      })}`
    );
    return res?.data?.data || [];
  });
  const hasEnrolledCourses = Array.isArray(enrolledCourses) && enrolledCourses.length > 0;

  if (userLoading) {
    return (
      <div className="sm:flex gap-2 items-center hidden">
        <div className="flex items-center gap-2 py-6 animate-pulse">
          <div className="text-right">
            <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
            <div className="h-3 w-16 bg-gray-200 rounded"></div>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="sm:flex gap-2 items-center hidden">
      {/* <Button size="icon" className="rounded-full" variant="secondary">
        <MessagesIcon />
      </Button>
      <Button size="icon" className="rounded-full" variant="secondary">
        <NotificationIcon />
      </Button> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="bg-transparent hover:bg-transparent shadow-none focus-visible:ring-0 select-none">
          <Button variant="secondary" className="focus:outline-none flex items-center gap-2 py-6">
            <div className="text-right">
              <p className="font-semibold uppercase text-sm text-black">
                {user?.first_name} {user?.last_name}
              </p>
              <p className="text-xs text-gray-500">{user?.primary_role?.name}</p>
            </div>
            <Avatar>
              <AvatarImage src={user?.profile_picture_url} />
              <AvatarFallback>
                {/* {user?.first_name?.charAt(0)} {user?.last_name?.charAt(0)} */}
                <Image alt="" src={avatarPlaceHolder} />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={dashUrl}>Dashboard</Link>
          </DropdownMenuItem>
          {!isSuperAdmin && (
            <DropdownMenuItem asChild className="cursor-pointer">
              <Link
                href={coursesUrl}
              >
                My Courses
              </Link>
            </DropdownMenuItem>
          )}
          {!isSuperAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={'/cart'}>
              Cart
            </Link>
          </DropdownMenuItem>
          )}
          {!isSuperAdmin && (
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href={settingsUrl}>Settings</Link>
          </DropdownMenuItem>
          )}
          <DropdownMenuItem
            onClick={() => {
              logOut();
              dispatch(logout());
            }}
          >
            Log Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
