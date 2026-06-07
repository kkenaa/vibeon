export interface MemberRights {
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
  canViewAnalytics: boolean;
  canManageMembers: boolean;
  canApproveTransactions: boolean;
  canViewReports: boolean;
  canManagePayments: boolean;
}

export const createEmptyMemberRights = (): MemberRights => ({
  canEdit: false,
  canDelete: false,
  canManageUsers: false,
  canViewAnalytics: false,
  canManageMembers: false,
  canApproveTransactions: false,
  canViewReports: false,
  canManagePayments: false,
});

export const MEMBER_RIGHT_KEYS = [
  "canEdit",
  "canDelete",
  "canManageUsers",
  "canViewAnalytics",
  "canManageMembers",
  "canApproveTransactions",
  "canViewReports",
  "canManagePayments",
] as const satisfies readonly (keyof MemberRights)[];