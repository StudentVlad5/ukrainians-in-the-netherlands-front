"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import {
  Mail,
  MessageCircle,
  Send,
  Languages,
  MapPin,
  Euro,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import defaultImage from "@/public/images/no-photo-available-icon.jpg";
import { masters } from "@/helper/CONST";

export default function MasterProfile() {
  const master = masters[0];
  return (
    <div className="min-h-screen bg-white pb-20 text-slate-900">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Кнопка Назад */}
        <Link
          href="/masters"
          className="flex items-center gap-2 text-nl-blue font-semibold hover:underline mb-8 transition-all"
        >
          <ArrowLeft size={20} />
          <span>Назад до майстрів</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ЛІВА КОЛОНКА */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-4 space-y-6"
          >
            <div className="relative h-[500px] w-full rounded-[40px] overflow-hidden shadow-2xl ring-4 ring-gray-50">
              <Image
                src={master.imageUrl || defaultImage}
                alt={master.name}
                fill
                className="object-cover"
              />
            </div>

            {/* Блок Локація та Прайс */}
            <div className="bg-ua-blue/5 rounded-3xl p-6 border border-ua-blue/10 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-ua-blue text-white rounded-2xl flex items-center justify-center shadow-lg shadow-ua-blue/20">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ua-blue uppercase tracking-tight">
                    Локація
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {master.location.address}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nl-red text-white rounded-2xl flex items-center justify-center shadow-lg shadow-nl-red/20">
                  <Euro size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-nl-red uppercase tracking-tight">
                    Замовлення
                  </p>
                  <p className="text-lg font-extrabold text-slate-900">
                    {master.minOrder}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ПРАВА КОЛОНКА */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-8 space-y-8"
          >
            <div>
              {/* Назва професії з яскравим фоном */}
              <span className="bg-nl-red text-white px-5 py-1.5 rounded-full text-sm font-black uppercase tracking-widest shadow-md">
                {master.specialty}
              </span>
              <h1 className="text-6xl font-black text-nl-blue mt-6 leading-none">
                {master.name}
              </h1>
            </div>

            {/* Про себе */}
            <div className="bg-gray-50 p-8 rounded-[32px] border-l-8 border-ua-blue">
              <p className="text-xl font-medium text-slate-800 leading-relaxed italic">
                {master.description}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Пошта з акцентом */}
              <div className="flex items-center gap-5 p-6 bg-white rounded-3xl shadow-sm border-2 border-gray-100 hover:border-ua-blue transition-colors">
                <div className="w-14 h-14 bg-ua-blue rounded-2xl flex items-center justify-center text-white">
                  <Mail size={28} />
                </div>
                <div>
                  <h5 className="font-black text-slate-900 uppercase text-xs tracking-widest">
                    Email для зв&apos;язку
                  </h5>
                  <p className="text-lg font-bold text-ua-blue break-all">
                    {master.email}
                  </p>
                </div>
              </div>

              {/* Мови з кольоровим бекграундом */}
              <div className="flex flex-col gap-3 p-6 bg-white rounded-3xl shadow-sm border-2 border-gray-100">
                <div className="flex items-center gap-2 text-nl-blue mb-2">
                  <Languages size={20} />
                  <span className="font-black uppercase text-xs tracking-widest text-slate-900">
                    Мови спілкування
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {master.languages.map((l: string) => (
                    <span
                      key={l}
                      className="bg-nl-blue text-white px-4 py-2 rounded-xl text-sm font-bold shadow-sm"
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Кнопки месенджерів */}
            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href={`https://t.me/${master.telegram}`}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 bg-[#0088cc] text-white rounded-2xl font-black hover:scale-105 transition shadow-xl shadow-blue-500/20"
              >
                <Send size={22} />
                <span>TELEGRAM</span>
              </a>
              <a
                href={`https://wa.me/${master.whatsapp}`}
                className="flex-1 min-w-[200px] flex items-center justify-center gap-3 py-4 bg-[#25D366] text-white rounded-2xl font-black hover:scale-105 transition shadow-xl shadow-green-500/20"
              >
                <MessageCircle size={22} />
                <span>WHATSAPP</span>
              </a>
            </div>

            {/* Портфоліо (якщо є) */}
            <div className="space-y-4">
              <h4 className="text-2xl font-bold text-gray-900">Мої роботи</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-48 bg-gray-200 rounded-2xl animate-pulse"
                  /> // Заглушка для фото
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
