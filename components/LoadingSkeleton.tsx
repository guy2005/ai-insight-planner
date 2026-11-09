import React, { useEffect, useState } from "react";
import { Loader2, Sparkles, Brain, ListChecks } from "lucide-react";

export default function LoadingSkeleton() {
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { text: "เชื่อมต่อกับ Gemini 1.5 Flash Model...", icon: Brain },
    { text: "วิเคราะห์บริบทและสกัดประเด็นสำคัญ...", icon: Sparkles },
    { text: "สังเคราะห์โครงสร้าง Action Plan และประเมินความสำคัญ...", icon: ListChecks },
    { text: "ตรวจสอบความถูกต้องของ Structured JSON Schema...", icon: Loader2 },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1400);

    return () => clearInterval(timer);
  }, [steps.length]);

  const CurrentIcon = steps[stepIndex].icon;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
      {/* Live Processing Indicator */}
      <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shadow-sm">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-600" />
          <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-violet-600 text-white shadow-xs">
            <CurrentIcon className="h-3.5 w-3.5 animate-pulse" />
          </div>
        </div>

        <div>
          <h4 className="text-sm font-semibold text-slate-800">
            {steps[stepIndex].text}
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            ระบบกำลังใช้ LLM API เพื่อจัดโครงสร้างข้อมูลแบบ Structured Output
          </p>
        </div>
      </div>

      {/* Skeleton placeholders */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {/* Summary Skeleton */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="h-4 w-1/4 rounded-md bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full rounded-md bg-slate-200 animate-pulse" />
              <div className="h-3 w-5/6 rounded-md bg-slate-200 animate-pulse" />
              <div className="h-3 w-3/4 rounded-md bg-slate-200 animate-pulse" />
            </div>
          </div>

          {/* Action Steps Skeleton */}
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="h-4 w-1/3 rounded-md bg-slate-200 animate-pulse" />
            <div className="space-y-2 pt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-slate-200 animate-pulse shrink-0" />
                  <div className="h-3 flex-1 rounded-md bg-slate-200 animate-pulse" />
                  <div className="h-5 w-16 rounded-md bg-slate-200 animate-pulse shrink-0" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Skeleton */}
        <div className="space-y-6">
          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="h-4 w-1/2 rounded-md bg-slate-200 animate-pulse" />
            <div className="space-y-2">
              <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
              <div className="h-10 w-full rounded-lg bg-slate-200 animate-pulse" />
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-slate-100 bg-slate-50/50 p-5">
            <div className="h-4 w-1/3 rounded-md bg-slate-200 animate-pulse" />
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-14 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-6 w-16 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-6 w-12 rounded-full bg-slate-200 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
