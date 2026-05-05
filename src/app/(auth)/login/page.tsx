import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-b from-black to-golf-green/20">
      <AuthForm mode="login" />
    </div>
  );
}
