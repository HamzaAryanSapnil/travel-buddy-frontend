"use client";

import { loginUser } from "@/services/auth/loginUser";
import { useActionState, useEffect, useState, useRef } from "react";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import InputFieldError from "./shared/InputFieldError";
import { Button } from "./ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "./ui/field";
import { Input } from "./ui/input";
import { Checkbox } from "./ui/checkbox";
import Link from "next/link";

const LoginForm = ({ redirect }: { redirect?: string }) => {
  const [state, formAction, isPending] = useActionState(loginUser, null);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state && !state.success && state.message) {
      toast.error(state.message);
    }
  }, [state]);

  const handleUserLogin = () => {
    const userEmail = process.env.NEXT_PUBLIC_USER_EMAIL || "";
    const userPassword = process.env.NEXT_PUBLIC_USER_PASS || "";
    setEmail(userEmail);
    setPassword(userPassword);
    // Focus on email input after setting values
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);
  };

  const handleAdminLogin = () => {
    const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "";
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASS || "";
    setEmail(adminEmail);
    setPassword(adminPassword);
    // Focus on email input after setting values
    setTimeout(() => {
      emailInputRef.current?.focus();
    }, 0);
  };

  return (
    <form action={formAction}>
      {redirect && <input type="hidden" name="redirect" value={redirect} />}
      <FieldGroup>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              ref={emailInputRef}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <InputFieldError field="email" state={state} />
          </Field>

          {/* Password */}
          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <div className="relative">
              <Input
                ref={passwordInputRef}
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <InputFieldError field="password" state={state} />
          </Field>

          {/* Remember Me */}
          <Field>
            <div className="flex items-center gap-2">
              <Checkbox id="rememberMe" name="rememberMe" />
              <FieldLabel
                htmlFor="rememberMe"
                className="font-normal cursor-pointer"
              >
                Remember me for 30 days
              </FieldLabel>
            </div>
          </Field>
        </div>

        <FieldGroup className="mt-4">
          <Field>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? "Logging in..." : "Sign In"}
            </Button>

            {/* Demo Login Buttons */}
            <div className="flex gap-2 mt-3">
              <Button
                type="button"
                variant="outline"
                onClick={handleUserLogin}
                className="flex-1"
                disabled={isPending}
              >
                User
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleAdminLogin}
                className="flex-1"
                disabled={isPending}
              >
                Admin
              </Button>
            </div>

            <FieldDescription className="px-6 text-center">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="text-primary hover:underline font-medium"
              >
                Register here
              </Link>
            </FieldDescription>
            <FieldDescription className="px-6 text-center">
              <Link
                href="/forgot-password"
                className="text-primary hover:underline font-medium"
              >
                Forgot your password?
              </Link>
            </FieldDescription>
          </Field>
        </FieldGroup>
      </FieldGroup>
    </form>
  );
};

export default LoginForm;
