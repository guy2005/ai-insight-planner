"use client";

import React, { useState } from "react";
import { ActionStep, PriorityLevel } from "@/types/analysis";
import { CheckCircle2, Circle, AlertCircle, ArrowUpRight } from "lucide-react";

interface ActionStepsTableProps {
  steps: ActionStep[];
}

export default function ActionStepsTable({ steps }: ActionStepsTableProps) {
  // รองรับการคลิกติ๊กถูกเสร็จงานในแต่ละ Step
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  const toggleStep = (stepNumber: number) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepNumber]: !prev[stepNumber],
    }));
  };

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case "High":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 ring-1 ring-inset ring-rose-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
            ด่วนมาก (High)
          </span>
        );
      case "Medium":
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-inset ring-amber-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
            ปานกลาง (Medium)
          </span>
        );
      case "Low":
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            ทั่วไป (Low)
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* ส่วนแสดง Progress การดำเนินงาน */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm border border-slate-200/80">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700">ความคืบหน้าของแผนงาน:</span>
          <span className="text-slate-500">
            เสร็จสิ้น {completedCount} จากทั้งหมด {steps.length} ข้อ ({progressPercent}%)
          </span>
        </div>
        <div className="h-2 w-full sm:w-36 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full bg-indigo-600 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* รายการ Action Steps */}
      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-xs">
        <div className="divide-y divide-slate-100">
          {steps.map((item) => {
            const isDone = !!completedSteps[item.step];
            return (
              <div
                key={item.step}
                onClick={() => toggleStep(item.step)}
                className={`flex cursor-pointer items-start gap-4 p-4 transition-all duration-200 ease-out hover:bg-slate-50/80 ${
                  isDone ? "bg-slate-50/40 text-slate-400" : ""
                }`}
              >
                {/* ลำดับที่ & ปุ่ม Checkbox */}
                <div className="flex items-center gap-3 pt-0.5">
                  <button
                    type="button"
                    aria-label={`Toggle step ${item.step}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:text-indigo-600"
                  >
                    {isDone ? (
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    ) : (
                      <Circle className="h-6 w-6 text-slate-300 hover:text-indigo-400" />
                    )}
                  </button>
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {item.step}
                  </span>
                </div>

                {/* รายละเอียด Task */}
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium leading-relaxed ${
                      isDone ? "line-through text-slate-400" : "text-slate-800"
                    }`}
                  >
                    {item.task}
                  </p>
                </div>

                {/* ป้าย Priority */}
                <div className="shrink-0">{getPriorityBadge(item.priority)}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
