import { validateLogin, validateRegistration } from "../utils/validationForm";

describe("Validation Tests", () => {
  describe("validateRegistration", () => {
    it("should return an error if all fields are not filled", () => {
      const result = validateRegistration({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
      expect(result).toBe("Tüm alanları doldurun.");
    });

    it("should return an error for invalid email format", () => {
      const result = validateRegistration({
        username: "testUser",
        email: "invalidEmail",
        password: "password",
        confirmPassword: "password",
      });
      expect(result).toBe("Geçersiz e-posta formatı.");
    });

    it("should return an error if passwords do not match", () => {
      const result = validateRegistration({
        username: "testUser",
        email: "test@example.com",
        password: "password1",
        confirmPassword: "password2",
      });
      expect(result).toBe("Şifreler uyuşmuyor.");
    });

    it("should return an error if password is less than 6 characters", () => {
      const result = validateRegistration({
        username: "testUser",
        email: "test@example.com",
        password: "123",
        confirmPassword: "123",
      });
      expect(result).toBe("Şifre en az 6 karakter olmalıdır.");
    });

    it("should return null if there are no validation errors", () => {
      const result = validateRegistration({
        username: "testUser",
        email: "test@example.com",
        password: "password",
        confirmPassword: "password",
      });
      expect(result).toBeNull();
    });
  });

  describe("validateLogin", () => {
    it("should return an error if all fields are not filled", () => {
      const result = validateLogin({ email: "", password: "" });
      expect(result).toBe("Tüm alanları doldurun.");
    });

    it("should return an error for invalid email format", () => {
      const result = validateLogin({
        email: "invalidEmail",
        password: "password",
      });
      expect(result).toBe("Geçersiz e-posta formatı.");
    });

    it("should return null if there are no validation errors", () => {
      const result = validateLogin({
        email: "test@example.com",
        password: "password",
      });
      expect(result).toBeNull();
    });
  });
});
