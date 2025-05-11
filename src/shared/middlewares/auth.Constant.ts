

export type TAuthGuard = "USER" | "ADMIN" | "SUPER_ADMIN" | "GUEST";

export const AuthGard: Record<TAuthGuard, TAuthGuard> = {
    USER: "USER",
    ADMIN: "ADMIN",
    SUPER_ADMIN: "SUPER_ADMIN",
    GUEST: "GUEST",
};