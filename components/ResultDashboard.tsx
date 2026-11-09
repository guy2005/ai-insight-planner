"use client";

import React, { useState } from "react";
import { AnalysisResult } from "@/types/analysis";
import ActionStepsTable from "./ActionStepsTable";
import {
  FileText,
  Lightbulb,
  CheckSquare,
  Tag,
  Copy,
  Check,
  Code2,
  Clock,
  Sparkles,
} from "lucide-react";

interface ResultDashboardProps {
  result: AnalysisResult;
  executionTimeMs?: number;
  isDemoMode?: boolean;
}

export default function ResultDashboard({
  result,
  executionTimeMs,
  isDemoMode,
}: ResultDashboardProps) {
  const [copiedType, setCopiedType] = useState<"text" | "json" | null>(null);

  // ฟังก์ชัน Copy สรุปเป็นข้อความ Markdown
  const copyAsMarkdown = () => {
    const text = `## 📌 สรุปใจความสำคัญ (Summary)
${result.summary}

### 💡 ประเด็นสำคัญ (Key Takeaways)
${result.keyTakeaways.map((item, idx) => `${idx + 1}. ${item}`).join("\n")}

### 🎯 แผนปฏิบัติการ (Action Steps)
${result.actionSteps
  .map(
    (step) =>
      `${step.step}. [${step.priority}] ${step.task}`
  )
  .join("\n")}

### 🏷️ หมวดหมู่และคำค้น (Tags)
${result.tags.map((t) => `#${t}`).join(" ")}
`;

    navigator.clipboard.writeText(text);
    setCopiedType("text");
    setTimeout(() => setCopiedType(null), 2500);
  };

  // ฟังก์ชัน Copy เป็น Raw JSON
  const copyAsJson = () => {
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
    setCopiedType("json");
    setTimeout(() => setCopiedType(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      {/* ส่วนหัวของ Dashboard พร้อมปุ่มเครื่องมือ */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              ผลการวิเคราะห์ & แผนปฏิบัติการ
            </h2>
            {isDemoMode ? (
              <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
                <Sparkles className="h-3 w-3" /> Demo Simulation Mode
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                <Sparkles className="h-3 w-3" /> Gemini 3.8 Flash (Latest Free)
              </span>
            )}
          </div>
          {executionTimeMs !== undefined && (
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Clock className="h-3.5 w-3.5" />
              เวลาประมวลผลโมเดล: {(executionTimeMs / 1000).toFixed(2)} วินาที
            </p>
          )}
        </div>

        {/* ปุ่มคัดลอกข้อมูล */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={copyAsMarkdown}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
          >
            {copiedType === "text" ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">คัดลอกสรุปแล้ว!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>คัดลอกข้อความสรุป</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={copyAsJson}
            className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 ease-out hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]"
          >
            {copiedType === "json" ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">คัดลอก JSON แล้ว!</span>
              </>
            ) : (
              <>
                <Code2 className="h-4 w-4 text-slate-500" />
                <span>JSON</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Grid จัดแสดงการ์ดผลลัพธ์ */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* คอลัมน์ซ้าย (กว้าง 2 ช่อง): สรุปใจความ + แผนปฏิบัติการ */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Card 1: สรุปใจความสำคัญ */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <FileText className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                สรุปใจความสำคัญ (Executive Summary)
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-slate-700 bg-slate-50/70 p-4 rounded-xl border border-slate-100">
              {result.summary}
            </p>
          </div>

          {/* Card 2: แผนปฏิบัติการ (Action Steps) */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50 text-violet-600">
                  <CheckSquare className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    แผนปฏิบัติการ (Action Steps)
                  </h3>
                  <p className="text-xs text-slate-500">
                    ขั้นตอนที่สกัดออกมาเพื่อให้นำไปปฏิบัติจริงได้ทันที (คลิกเพื่อติ๊กเสร็จงาน)
                  </p>
                </div>
              </div>
            </div>

            <ActionStepsTable steps={result.actionSteps} />
          </div>
        </div>

        {/* คอลัมน์ขวา (กว้าง 1 ช่อง): Key Takeaways และ Tags */}
        <div className="flex flex-col gap-6">
          {/* Card 3: Key Takeaways */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-4 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
                <Lightbulb className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                ประเด็นสำคัญ (Key Takeaways)
              </h3>
            </div>

            <ul className="space-y-3">
              {result.keyTakeaways.map((point, index) => (
                <li
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-slate-50/80 p-3 text-xs leading-relaxed text-slate-700 border border-slate-100"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-800">
                    {index + 1}
                  </span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 4: Tags & Keywords */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                <Tag className="h-4 w-4" />
              </div>
              <h3 className="text-base font-bold text-slate-900">
                คีย์เวิร์ด & หมวดหมู่ (Tags)
              </h3>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {result.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-indigo-50 hover:text-indigo-700"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
