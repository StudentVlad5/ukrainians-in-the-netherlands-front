import AuthLayout from "@/components/Auth/AuthLayout";
import LoginForm from "@/components/Auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Увійдіть у свій акаунт" footerLink="register">
      <LoginForm />
    </AuthLayout>
  );
}
