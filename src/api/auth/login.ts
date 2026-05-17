"use client";
import { LoginEntity, LoginRequest } from "@/schema/auth";
import { browserAPI } from "../frontendClient";

export function reqLogin(loginRequest: LoginRequest): Promise<LoginEntity> {
  return browserAPI.post("/api/auth/login", loginRequest);
}
