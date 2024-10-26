const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateRegistration = (form) => {
  const { username, email, password, confirmPassword } = form;
  const errors = [];

  if (!username || !email || !password || !confirmPassword) {
    errors.push("Tüm alanları doldurun.");
  }

  if (email && !emailRegex.test(email)) {
    errors.push("Geçersiz e-posta formatı.");
  }

  if (password !== confirmPassword) {
    errors.push("Şifreler uyuşmuyor.");
  }

  if (password && password.length < 6) {
    errors.push("Şifre en az 6 karakter olmalıdır.");
  }

  return errors.length > 0 ? errors.join(" ") : null;
};

export const validateLogin = (form) => {
  const { email, password } = form;
  const errors = [];

  if (!email || !password) {
    errors.push("Tüm alanları doldurun.");
  }

  if (email && !emailRegex.test(email)) {
    errors.push("Geçersiz e-posta formatı.");
  }

  return errors.length > 0 ? errors.join(" ") : null;
};
