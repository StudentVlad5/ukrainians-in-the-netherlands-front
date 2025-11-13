"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";
import Cookies from "js-cookie";
import { BASE_URL } from "@/helper/CONST";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        Cookies.set("accessToken", data.token, {
          expires: 1,
        });
        router.push("/profile");
      } else {
        const data = await res.json();
        setError(data.message || "Неправильний email або пароль.");
      }
    } catch (err) {
      setError("Не вдалося підключитися до сервера. Спробуйте пізніше.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <Input
        id="email"
        label="Електронна пошта"
        type="email"
        autoComplete="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />

      <Input
        id="password"
        label="Пароль"
        type="password"
        autoComplete="current-password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      {/* Тут можна додати "Забули пароль?" */}

      <div>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !email || !password}
        >
          Увійти
        </Button>
      </div>
    </form>
  );
}
