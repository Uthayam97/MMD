import { Injectable } from "@angular/core";
import { io, Socket } from "socket.io-client";
import { environment } from "../../environments/environment";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: "root" })
export class SocketService {
  private socket: Socket | null = null;

  constructor(private authService: AuthService) {}

  connect(): void {
    const token = this.authService.getToken();
    if (!token) return;

    if (this.socket?.connected) return;

    const baseUrl = environment.apiUrl.replace("/api", "");
    this.socket = io(baseUrl, {
      auth: { token },
      transports: ["websocket"],
    });
  }

  disconnect(): void {
    this.socket?.disconnect();
    this.socket = null;
  }

  on(eventName: string, callback: (data: any) => void): void {
    this.connect();
    this.socket?.on(eventName, callback);
  }

  off(eventName: string): void {
    this.socket?.off(eventName);
  }
}
