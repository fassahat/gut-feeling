import { Platform } from "react-native";

// const LOCAL_IP = Platform.OS === "android" ? "10.0.2.2" : "localhost";
const LOCAL_IP = '192.168.178.34'

export const API_BASE_URL = `http://${LOCAL_IP}:8000`;
export const WS_BASE_URL = `ws://${LOCAL_IP}:8000`;

export const USERS = ["user-alice", "user-bob"] as const;
export type UserId = (typeof USERS)[number];

export const DEFAULT_USER: UserId = "user-alice";
