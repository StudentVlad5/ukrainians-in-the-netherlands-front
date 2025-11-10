"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/UI/Input/Input";
import { Button } from "@/components/UI/Button/Button";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, phone }),
      });

      if (res.ok) {
        router.push("/profile");
        router.refresh();
      } else {
        const data = await res.json();
        setError(
          data.message || "Помилка реєстрації. Можливо, такий email вже існує."
        );
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
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
      />

      <Input
        id="phone"
        label="Телефон"
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        disabled={isLoading}
      />

      <Input
        id="password"
        label="Пароль"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={isLoading}
      />

      <div>
        <Button type="submit" isLoading={isLoading}>
          Зареєструватися
        </Button>
      </div>
    </form>
  );
}
