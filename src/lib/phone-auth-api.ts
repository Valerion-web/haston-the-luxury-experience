import { apiRequest } from "@/lib/api-client";

type PhoneOtpResponse = { message: string };
type PhoneAuthResponse = {
  user: import("@/lib/haston-session").SessionUser;
  message: string;
};

const OTP_REQUEST_TIMEOUT_MS = 15_000;

const sendOtp = async (path: string, phone: string) => {
  const controller = new AbortController();
  let timedOut = false;
  const timeout = window.setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, OTP_REQUEST_TIMEOUT_MS);

  try {
    return await apiRequest<PhoneOtpResponse>(path, {
      method: "POST",
      body: JSON.stringify({ phone }),
      signal: controller.signal,
    });
  } catch (error) {
    if (timedOut) throw new DOMException("OTP request timed out.", "TimeoutError");
    throw error;
  } finally {
    window.clearTimeout(timeout);
  }
};

export const phoneAuthApi = {
  sendLoginOtp: (phone: string) => sendOtp("/auth/phone/login/send", phone),
  verifyLoginOtp: (phone: string, otp: string) =>
    apiRequest<PhoneAuthResponse>("/auth/phone/login/verify", {
      method: "POST",
      body: JSON.stringify({ phone, otp }),
    }),
  sendRegistrationOtp: (phone: string) => sendOtp("/auth/phone/register/send", phone),
  verifyRegistrationOtp: (details: {
    phone: string;
    otp: string;
    email: string;
    password: string;
    name: string;
  }) =>
    apiRequest<PhoneAuthResponse>("/auth/phone/register/verify", {
      method: "POST",
      body: JSON.stringify(details),
    }),
};
