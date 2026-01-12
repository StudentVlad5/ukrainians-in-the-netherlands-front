import { UserProfile } from "./userData";

export type RoleRequestStatus = "pending" | "approved" | "rejected";
export type RequestedRole = "seller" | "admin";

export interface IRoleRequest {
  _id: string;
  userId: UserProfile;
  requestedRole: RequestedRole;
  status: RoleRequestStatus;
  adminComment?: string;
  createdAt: string;
}
