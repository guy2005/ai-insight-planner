import React from "react";
import { BookOpen, Briefcase, CalendarCheck } from "lucide-react";

interface QuickFillPresetsProps {
  onSelect: (content: string) => void;
  disabled?: boolean;
}

export const PRESETS = [
  {
    id: "business",
    label: "ไอเดียธุรกิจคาเฟ่ & Co-working",
    icon: Briefcase,
    content: `ต้องการเปิดร้าน Specialty Coffee ผสม Co-working Space ใกล้มหาวิทยาลัย
กลุ่มเป้าหมายคือนักศึกษาและฟรีแลนซ์ที่ต้องการสถานที่ทำงานสงบพร้อมอินเทอร์เน็ตความเร็วสูง
งบประมาณเริ่มต้นประมาณ 800,000 บาท จุดเด่นคือมีเมล็ดกาแฟ Single Origin ให้เลือก, 
โต๊ะทำงานพร้อมปลั๊กทุกจุด และมีห้องประชุมเล็ก 2 ห้องสำหรับเช่ารายชั่วโมง
ความท้าทายหลักคือมีร้านกาแฟแฟรนไชส์ตั้งอยู่ใกล้ๆ 2 ร้าน และค่าเช่าตึกค่อนข้างสูง
ต้องการกลยุทธ์การเปิดร้าน การทำการตลาดดึงดูดลูกค้าช่วงเปิดตัว และแผนลดความเสี่ยงทางการเงิน`,
  },
  {
    id: "lecture",
    label: "โน้ตการเรียน: AI & Machine Learning",
    icon: BookOpen,
    content: `สรุปเนื้อหาคาบเรียนวิชา Artificial Intelligence เรื่อง Supervised Learning vs Unsupervised Learning
- Supervised Learning ทำงานโดยมี Labeled Data (ข้อมูลพร้อมเฉลย) เช่น Classification (การจำแนกประเภท) และ Regression (การทำนายค่าตัวเลขต่อเนื่อง) อัลกอริทึมยอดนิยมคือ Linear Regression, Decision Tree, และ SVM
- Unsupervised Learning ทำงานกับข้อมูลที่ไม่มี Label โดยมุ่งเน้นการหารูปแบบหรือโครงสร้างภายในข้อมูล เช่น Clustering (K-Means, Hierarchical) และ Dimensionality Reduction (PCA)
- ปัญหาสำคัญในการสร้างโมเดลคือ Overfitting (โมเดลเรียนรู้จำข้อมูลฝึกมากเกินไปจนทายข้อมูลใหม่ผิด) แก้ได้ด้วย Cross-Validation, Regularization, และการเพิ่มข้อมูลทดสอบ
สัปดาห์หน้ามีสอบ Quiz และต้องส่งหัวข้อโครงงานปลายภาคที่ต้องนำอัลกอริทึมเหล่านี้ไปประยุกต์ใช้กับ Dataset จริง`,
  },
  {
    id: "meeting",
    label: "ประชุมทีม: ปรับปรุง Checkout Flow",
    icon: CalendarCheck,
    content: `บันทึกการประชุมปรับปรุงระบบ Checkout ของแพลตฟอร์ม E-Commerce
ปัญหาที่พบในปัจจุบัน: อัตรา Drop-off สูงถึง 42% ในขั้นตอนการกรอกข้อมูลที่อยู่และการเลือกช่องทางชำระเงิน
ข้อสรุปจากทีม UX และ Dev:
1. ต้องลดจำนวนขั้นตอนจาก 4 หน้า เหลือเป็น 1-Page Checkout
2. เพิ่มระบบ Auto-fill ที่อยู่จากรหัสไปรษณีย์ และเชื่อมต่อ PromptPay QR Code เพื่อให้จ่ายเงินง่ายขึ้น
3. เพิ่มตัวเลือกสั่งซื้อแบบ Guest Checkout โดยไม่ต้องบังคับสมัครสมาชิกก่อน
4. Deadline การทดสอบเวอร์ชัน Beta คืออีก 3 สัปดาห์ และต้องพร้อมใช้งานจริงก่อนแคมเปญ 12.12
ทีมต้องการกระจายงานให้ชัดเจนว่าส่วนไหนต้องทำก่อนและจัดลำดับความสำคัญของแต่ละฟีเจอร์`,
  },
];

export default function QuickFillPresets({ onSelect, disabled }: QuickFillPresetsProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        ตัวอย่างเนื้อหาสำหรับทดสอบ (Quick Demo Presets):
      </span>
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const Icon = preset.icon;
          return (
            <button
              key={preset.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(preset.content)}
              className="group inline-flex min-h-[44px] items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-700 shadow-xs transition-all duration-200 ease-out hover:border-indigo-300 hover:bg-indigo-50/50 hover:text-indigo-900 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Icon className="h-4 w-4 text-indigo-500 transition-colors group-hover:text-indigo-600" />
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
