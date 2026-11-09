"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import QuickFillPresets from "@/components/QuickFillPresets";
import ResultDashboard from "@/components/ResultDashboard";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import { AnalysisResult, AnalyzeResponse } from "@/types/analysis";
import {
  Sparkles,
  RotateCcw,
  AlertTriangle,
  ArrowRight,
  BookOpenCheck,
  CheckCircle,
} from "lucide-react";

export default function HomePage() {
  const [content, setContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [executionTimeMs, setExecutionTimeMs] = useState<number | undefined>(undefined);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // ฟังก์ชันส่งข้อความไปวิเคราะห์ผ่าน Route Handler
  const handleAnalyze = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!content.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: content.trim() }),
      });

      const resData: AnalyzeResponse = await response.json();

      if (!response.ok || !resData.success || !resData.data) {
        throw new Error(
          resData.error || `การประมวลผลล้มเหลว (Status: ${response.status})`
        );
      }

      setResult(resData.data);
      setExecutionTimeMs(resData.executionTimeMs);
      setIsDemoMode(!!resData.isDemoMode);

      // เลื่อนหน้าจอลงไปยังส่วนผลลัพธ์แบบ Smooth
      setTimeout(() => {
        document.getElementById("results-section")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err: unknown) {
      console.error("Fetch Error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการเชื่อมต่อกับ Server กรุณาลองใหม่อีกครั้ง"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ล้างข้อมูลทั้งหมด
  const handleClear = () => {
    setContent("");
    setResult(null);
    setError(null);
    setExecutionTimeMs(undefined);
    setIsDemoMode(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <Navbar />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8 text-center sm:text-left">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-700/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            AI Mini-Project Showcase
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            AI Insight & Action Plan Generator
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            เปลี่ยนโน้ตการเรียน ไอเดียธุรกิจ หรือข้อสรุปการประชุมที่กระจัดกระจาย
            ให้กลายเป็นข้อสรุปที่คมชัดและแผนปฏิบัติการแบบเป็นขั้นตอน (Structured Output) ด้วย Google Gemini 1.5 Flash
          </p>
        </div>

        {/* Input Card Form */}
        <section className="mb-10 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs sm:p-6">
          <form onSubmit={handleAnalyze} className="flex flex-col gap-5">
            {/* Presets Button Bar */}
            <QuickFillPresets
              disabled={isLoading}
              onSelect={(sampleText) => {
                setContent(sampleText);
                setError(null);
              }}
            />

            {/* Textarea */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="content-input"
                  className="text-sm font-bold text-slate-800"
                >
                  วางข้อความหรือเนื้อหาที่ต้องการให้ AI วิเคราะห์:
                </label>
                <span className="text-xs text-slate-400">
                  {content.length.toLocaleString()} ตัวอักษร
                </span>
              </div>
              <textarea
                id="content-input"
                rows={7}
                disabled={isLoading}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="พิมพ์หรือวางเนื้อหาที่นี่ เช่น โน้ตเลกเชอร์, ไอเดียสตาร์ทอัพ, บันทึกการประชุมทีม หรือแผนโปรเจกต์..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 placeholder-slate-400 shadow-inner transition-all duration-200 ease-out focus:border-indigo-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            {/* Error Banner */}
            {error && (
              <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50/80 p-4 text-sm text-rose-800">
                <AlertTriangle className="h-5 w-5 shrink-0 text-rose-600" />
                <div className="flex-1">
                  <span className="font-semibold">ข้อผิดพลาด: </span>
                  {error}
                </div>
              </div>
            )}

            {/* Controls / Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={handleClear}
                disabled={isLoading || (!content && !result && !error)}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-semibold text-slate-600 shadow-xs transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
                ล้างข้อมูล
              </button>

              <button
                type="submit"
                disabled={isLoading || !content.trim()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all duration-200 ease-out hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Sparkles className="h-4 w-4" />
                <span>{isLoading ? "กำลังประมวลผล..." : "วิเคราะห์และสร้าง Action Plan"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </form>
        </section>

        {/* Results / Skeleton Area */}
        <section id="results-section" className="flex-1">
          {isLoading && <LoadingSkeleton />}

          {!isLoading && result && (
            <ResultDashboard
              result={result}
              executionTimeMs={executionTimeMs}
              isDemoMode={isDemoMode}
            />
          )}

          {!isLoading && !result && !error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/50 p-12 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4">
                <BookOpenCheck className="h-7 w-7" />
              </div>
              <h3 className="text-base font-bold text-slate-800">
                ยังไม่มีผลลัพธ์การวิเคราะห์
              </h3>
              <p className="mt-1 max-w-md text-xs leading-relaxed text-slate-500">
                กดเลือกตัวอย่างเนื้อหาจากกล่อง Quick Demo ด้านบน หรือวางเนื้อหาของคุณ
                แล้วกดปุ่ม &quot;วิเคราะห์และสร้าง Action Plan&quot; เพื่อเริ่มต้น
              </p>
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} AI Insight & Action Plan Generator — พัฒนาเพื่อส่งงานรายวิชา AI Application</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Next.js 14 App Router</span>
            <span>•</span>
            <span>Gemini 1.5 Flash</span>
            <span>•</span>
            <span>TypeScript</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
