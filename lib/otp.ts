type OtpRecord = {
  code: string;
  expiresAt: number;
};

const otpStore = new Map<string, OtpRecord>();

export function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function saveOtp(username: string, code: string) {
  const fiveMinutes = 5 * 60 * 1000;

  otpStore.set(username, {
    code,
    expiresAt: Date.now() + fiveMinutes,
  });
}

export function verifyOtp(username: string, code: string) {
  const record = otpStore.get(username);

  if (!record) {
    return false;
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(username);
    return false;
  }

  if (record.code !== code) {
    return false;
  }

  otpStore.delete(username);
  return true;
}