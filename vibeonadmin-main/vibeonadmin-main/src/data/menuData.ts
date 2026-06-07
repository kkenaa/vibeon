export interface MenuItem {
  id: string;
  label: string;
  icon: any;
  children?: MenuItem[];
  collapsible?: boolean;
}

import IconDashboard from "../components/icons/IconDashboard.vue";
import IconAudience from "../components/icons/IconAudience.vue";
import IconPosts from "../components/icons/IconPosts.vue";
import IconSchedules from "../components/icons/IconSchedules.vue";
import IconIncome from "../components/icons/IconIncome.vue";
import IconMembers from "../components/icons/IconMembers.vue";
import IconsUsers from "../components/icons/IconsUsers.vue";
export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: IconDashboard,
  },
  {
    id: "members",
    label: "Members",
    icon: IconMembers,
  },
  {
    id: "users",
    label: "Users",
    icon: IconsUsers,
  },
  {
    id: "audience",
    label: "Audience",
    icon: IconAudience,
    collapsible: true,
    children: [
      {
        id: "earnings",
        label: "Earnings",
        icon: undefined,
      },
      {
        id: "refunds",
        label: "Refunds",
        icon: undefined,
      },
      {
        id: "declines",
        label: "Declines",
        icon: undefined,
      },
      {
        id: "payouts",
        label: "Payouts",
        icon: undefined,
      },
    ],
  },
  {
    id: "posts",
    label: "Posts",
    icon: IconPosts,
  },
  {
    id: "schedules",
    label: "Schedules",
    icon: IconSchedules,
  },
  {
    id: "income",
    label: "Income",
    icon: IconIncome,
    collapsible: true,
    children: [
      {
        id: "earnings",
        label: "Earnings",
        icon: undefined,
      },
      {
        id: "refunds",
        label: "Refunds",
        icon: undefined,
      },
      {
        id: "declines",
        label: "Declines",
        icon: undefined,
      },
      {
        id: "payouts",
        label: "Payouts",
        icon: undefined,
      },
    ],
  },
];
