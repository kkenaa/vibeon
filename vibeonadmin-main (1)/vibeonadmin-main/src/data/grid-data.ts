import type { Column } from "../types";
import StatusBadge from "../components/StatusBadge.vue";
import AvatarName from "../components/AvatarName.vue";

export const columns: Column[] = [
  {
    key: "id",
    label: "ID",
    type: "number",
    sortable: true,
    searchable: false,
    filterable: true,
  },
  {
    key: "user",
    label: "User",
    type: "component",
    component: AvatarName,

    componentProps: (row: any) => ({
      user: {
        name: row.name,
        avatar: row.avatar,
        verified: row.verified,
        isLive: row.isLive,
      },
    }),
  },
  {
    key: "email",
    label: "Email",
    type: "text",
    editable: true,
    searchable: false,
    sortable: true,
  },
  {
    key: "date",
    label: "Date",
    type: "date",
    editable: true,
    formatter: (val) => new Date(val).toLocaleDateString(),
  },
  {
    key: "state",
    label: "State",
    type: "text",
    editable: true,
    searchable: false,
  },
  {
    key: "followers",
    label: "Followers",
    type: "text",
    editable: true,
    sortable: true,
    searchable: false,
  },
  {
    key: "status",
    label: "Status",
    type: "component",
    component: StatusBadge,
    componentProps: (row: any) => ({
      user: {
        status: row.status,
      },
    }),
  },
];
