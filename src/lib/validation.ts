/**
 * Password validation utility matching the web app's requirements
 * for consistency across platforms.
 * 
 * Requirements:
 * - Minimum 8 characters
 * - Contains lowercase letter
 * - Contains uppercase letter
 * - Contains number
 * - Contains special character
 * - No more than 2 consecutive identical characters
 * - No common sequences (123, abc, etc.)
 */

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: "weak" | "medium" | "strong";
  checks: Array<{ message: string; passed: boolean }>;
}

export function validatePassword(password: string): PasswordValidation {
  const errors: string[] = [];
  const checks = [
    { message: "At least 8 characters long", passed: password.length >= 8 },
    { message: "Contains lowercase letter", passed: /[a-z]/.test(password) },
    { message: "Contains uppercase letter", passed: /[A-Z]/.test(password) },
    { message: "Contains number", passed: /\d/.test(password) },
    {
      message: "Contains special character",
      passed: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
    },
    {
      message: "No consecutive identical characters",
      passed: !/(.)\1{2,}/.test(password),
    },
    {
      message: "No common sequences",
      passed: !/123|abc|qwe|asd|zxc/i.test(password),
    },
  ];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (password.length > 128) {
    errors.push("Password must be less than 128 characters");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push("Password must contain at least one special character");
  }

  // Check for common weak patterns
  if (/(.)\1{2,}/.test(password)) {
    errors.push(
      "Password cannot contain more than 2 consecutive identical characters"
    );
  }

  if (/123|abc|qwe|asd|zxc/i.test(password)) {
    errors.push("Password cannot contain common sequences");
  }

  // Calculate strength
  let strength: "weak" | "medium" | "strong" = "weak";
  if (errors.length === 0) {
    if (
      password.length >= 12 &&
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    ) {
      strength = "strong";
    } else if (password.length >= 10) {
      strength = "medium";
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength,
    checks,
  };
}

export function validateEmail(email: string): { isValid: boolean; error?: string } {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!email.trim()) {
    return {
      isValid: false,
      error: "Email is required",
    };
  }

  if (!emailRegex.test(email)) {
    return {
      isValid: false,
      error: "Please enter a valid email address",
    };
  }

  if (email.length > 254) {
    return {
      isValid: false,
      error: "Email address is too long",
    };
  }

  return {
    isValid: true,
  };
}

