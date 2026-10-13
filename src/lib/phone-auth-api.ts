import { apiRequest } from "@/lib/api-client";

type PhoneOtpResponse = { message: string };
type PhoneAuthResponse = {
  user: import("@/lib/haston-session").SessionUser;
  message: string;
};

export const phoneAuthApi = {
  sendLoginOtp: (phone: string) =>
    apiRequest<PhoneOtpResponse>("/auth/phone/login/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyLoginOtp: (phone: string, otp: string) =>
    apiRequest<PhoneAuthResponse>("/auth/phone/login/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),
  sendRegistrationOtp: (phone: string) =>
    apiRequest<PhoneOtpResponse>("/auth/phone/register/send", {
      method: "POST",
      body: JSON.stringify({ phone }),
    }),
  verifyRegistrationOtp: (details: {
    phone: string;
    otp: string;
    email: string;
    password: string;
    name: string;
  }) =>
    apiRequest<PhoneAuthResponse>("/auth/phone/register", {
      method: "POST",
      body: JSON.stringify(details),
    }),
};
