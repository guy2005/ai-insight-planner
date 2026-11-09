# 🚀 AI Insight & Action Plan Generator

> **โครงงานพัฒนา Web Application ประยุกต์ใช้ปัญญาประดิษฐ์ (AI-Powered Application)**  
> ระบบวิเคราะห์เนื้อหา/โน้ตการเรียน/ไอเดียธุรกิจ สรุปประเด็นสำคัญ และสกัดออกมาเป็น Action Plan ที่เป็นรูปธรรมด้วย Google Gemini 1.5 Flash (Structured Output)

---

## 📌 สารบัญ (Table of Contents)
1. [ภาพรวมของโปรเจกต์ (Project Overview)](#-ภาพรวมของโปรเจกต์-project-overview)
2. [การประยุกต์ใช้แนวคิด AI ในระบบ (AI Concept & Implementation)](#-การประยุกต์ใช้แนวคิด-ai-ในระบบ-ai-concept--implementation)
3. [สถาปัตยกรรมของระบบ (System Architecture)](#-สถาปัตยกรรมของระบบ-system-architecture)
4. [Tech Stack](#-tech-stack)
5. [โครงสร้างของโปรเจกต์ (Project Structure)](#-โครงสร้างของโปรเจกต์-project-structure)
6. [ขั้นตอนการติดตั้งและรันโปรเจกต์ (Getting Started)](#-ขั้นตอนการติดตั้งและรันโปรเจกต์-getting-started)
7. [การทำงานของ API Endpoint (`/api/analyze`)](#-การทำงานของ-api-endpoint-apianalyze)
8. [คู่มือการนำขึ้น GitHub (Git & GitHub Submission)](#-คู่มือการนำขึ้น-github-git--github-submission)

---

## 💡 ภาพรวมของโปรเจกต์ (Project Overview)

ในชีวิตประจำวันและการทำงาน ข้อมูลจำนวนมาก เช่น โน้ตสรุปการเรียน, ไอเดียสตาร์ทอัพ, หรือบันทึกการประชุมทีม มักอยู่ในรูปของ **Unstructured Text** (ข้อความที่ไม่มีโครงสร้างชัดเจน) ทำให้ยากต่อการนำไปลงมือทำต่อทันที

**AI Insight & Action Plan Generator** ได้รับการพัฒนาขึ้นเพื่อแก้ปัญหานี้ โดยทำหน้าที่เป็นเสมือน **AI Executive Consultant**:
- วิเคราะห์และสังเคราะห์ข้อความยาวๆ ให้เหลือเฉพาะ **Executive Summary** ที่เข้าใจได้ใน 30 วินาที
- ดึง **Key Takeaways** (3-5 ข้อสำคัญ)
- วางแผน **Action Steps** เรียงลำดับขั้นตอน (Step 1, 2, 3...) พร้อมประเมินระดับความสำคัญ (High, Medium, Low) ที่ผู้ใช้งานสามารถคลิกติ๊กเพื่อติดตามความคืบหน้า (Interactive Checklist)
- ติดแท็กคำสำคัญ (**Tags**) เพื่อการจัดหมวดหมู่

---

## 🧠 การประยุกต์ใช้แนวคิด AI ในระบบ (AI Concept & Implementation)

โปรเจกต์นี้ตอบโจทย์รายวิชาการประยุกต์ใช้ AI ผ่านแนวคิดหลัก 4 ประการ:

### 1. Large Language Model (LLM) Integration
- ใช้งานโมเดล **Google Gemini 1.5 Flash** ซึ่งมีความเร็วในการตอบสนองสูง (Low Latency) และรองรับ Context Window ขนาดใหญ่ เหมาะสำหรับการประมวลผลข้อความและการทำความเข้าใจภาษาธรรมชาติ (NLP)

### 2. Structured Outputs ผ่าน JSON Schema
- ปัญหาดั้งเดิมของ LLM คือผลลัพธ์เป็นข้อความอิสระ (Unstructured Free Text) ซึ่งทำให้ระบบหน้าบ้าน (Frontend) นำไปแสดงผลหรือประมวลผลต่อได้ยาก
- ระบบนี้ประยุกต์ใช้ความสามารถ **`responseSchema`** ของ `@google/generative-ai` บังคับให้ AI ส่งคำตอบกลับมาเป็น JSON ตาม Type-safe Schema อย่างเคร่งครัด 100%:
  - `summary`: string
  - `keyTakeaways`: string[]
  - `actionSteps`: array ของ `{ step: number, task: string, priority: "High" | "Medium" | "Low" }`
  - `tags`: string[]

### 3. Prompt Engineering & System Instructions
- กำหนด Persona ให้โมเดลเป็น *Senior Business Analyst & Executive Consultant*
- ควบคุมให้ประเมินความสำคัญของงาน (Prioritization) และแปลงเป้าหมายนามธรรมให้กลายเป็นงานที่จับต้องได้ (Actionable Tasks)
- รองรับภาษาไทยและภาษาอังกฤษอย่างเป็นธรรมชาติ (Adaptive Language Output)

### 4. Zero-shot Information Extraction & Task Decomposition
- AI สกัดใจความสำคัญและทำการแตกภารกิจขนาดใหญ่ (Goal Decomposition) ออกเป็นขั้นตอนย่อยที่สามารถลงมือทำตามลำดับก่อน-หลังได้ทันที

---

## 🏗️ สถาปัตยกรรมของระบบ (System Architecture)

ระบบเป็นแบบ **Full-stack Single-repo** โดยใช้ Next.js App Router ซึ่งรวมส่วนแสดงผลและ Serverless Route Handlers ไว้ด้วยกันอย่างปลอดภัย (API Key ไม่รั่วไหลไปยังฝั่ง Client)

```
[ผู้ใช้งาน (Client Browser)]
        │
        │ 1. กรอกเนื้อหา หรือเลือก Quick Preset
        ▼
[Next.js Frontend: app/page.tsx]
        │
        │ 2. HTTP POST (JSON Payload)
        ▼
[Next.js Serverless Route: app/api/analyze/route.ts]
        │
        │ 3. ตรวจสอบ Payload & ซ่อน GEMINI_API_KEY
        │ 4. ส่ง Prompt + Strict JSON Schema
        ▼
[Google Gemini 1.5 Flash API]
        │
        │ 5. ส่ง Structured JSON Response
        ▼
[Next.js Route Handler]
        │
        │ 6. Type-check & Return { success: true, data: ... }
        ▼
[Interactive Dashboard UI]
  ├─ Executive Summary Box
  ├─ Key Takeaways List
  ├─ Interactive Action Steps Checklist (High/Med/Low)
  └─ Tags Cloud & One-Click Copy
```

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14+ (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Engine**: [Google Gemini 1.5 Flash (`@google/generative-ai`)](https://ai.google.dev/)
- **Runtime**: Node.js v18+ / v20+ / v22+

---

## 📁 โครงสร้างของโปรเจกต์ (Project Structure)

```text
ai-insight-planner/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # Backend Serverless Handler (Gemini API Integration)
│   ├── globals.css               # Global Tailwind CSS Styles
│   ├── layout.tsx                # Root Layout & Metadata
│   └── page.tsx                  # หน้าจอหลัก Single-Page Web Application
├── components/
│   ├── ActionStepsTable.tsx      # ตารางและ Checklist แสดง Action Steps พร้อม Priority
│   ├── LoadingSkeleton.tsx       # Skeleton Animation แสดงสถานะระหว่าง AI ประมวลผล
│   ├── Navbar.tsx                # แถบ Navigation ด้านบน
│   ├── QuickFillPresets.tsx      # ปุ่มลัดเลือกตัวอย่างข้อความสำหรับเดโม
│   └── ResultDashboard.tsx       # คอนเทนเนอร์แสดงผลการวิเคราะห์ทั้งหมด
├── types/
│   └── analysis.ts               # TypeScript Interfaces / Types สัญญาณข้อมูล
├── public/                       # Static Assets
├── .env.example                  # ตัวอย่างการตั้งค่า Environment Variables
├── .env.local                    # คีย์ลับสำหรับรันในเครื่อง (ไม่ถูก Commit ขึ้น Git)
├── .gitignore                    # รายการไฟล์ที่ไม่ต้องการให้ Git ติดตาม
├── next.config.mjs               # Next.js Configuration
├── package.json                  # Scripts และ Dependencies
├── postcss.config.mjs            # PostCSS Configuration
├── tailwind.config.ts            # Tailwind CSS Customization
├── tsconfig.json                 # TypeScript Configuration
└── README.md                     # เอกสารโปรเจกต์ฉบับนี้
```

---

## 🚀 ขั้นตอนการติดตั้งและรันโปรเจกต์ (Getting Started)

### 1. โคลน Repository หรือเข้าไปยังโฟลเดอร์โปรเจกต์
```bash
git clone <URL_GITHUB_REPOSITORY_ของท่าน>
cd ai-insight-planner
```

### 2. ติดตั้ง Dependencies
```bash
npm install
```

### 3. ตั้งค่า Google Gemini API Key
1. เข้าไปที่ [Google AI Studio](https://aistudio.google.com/) แล้วกด **Get API Key** (ฟรี ไม่มีค่าใช้จ่าย)
2. สร้างหรือเปิดไฟล์ `.env.local` ในโฟลเดอร์รูทของโปรเจกต์:
```bash
# คัดลอกไฟล์จาก .env.example ได้เช่นกัน
cp .env.example .env.local
```
3. นำ API Key ที่ได้มาใส่ใน `.env.local`:
```env
GEMINI_API_KEY=AIzaSyxxxxxxxxxxxxxxxxxxxxxxx
```

### 4. รัน Development Server
```bash
npm run dev
```

เปิด Browser ไปที่: **[http://localhost:3000](http://localhost:3000)**

---

## 📡 การทำงานของ API Endpoint (`/api/analyze`)

- **Method**: `POST`
- **Content-Type**: `application/json`

### ตัวอย่าง Request:
```json
{
  "content": "ต้องการเปิดร้าน Specialty Coffee ใกล้มหาวิทยาลัย งบ 800,000 บาท มีจุดเด่นคือปลั๊กไฟและเน็ตแรง มีห้องประชุมเล็ก..."
}
```

### ตัวอย่าง Response (`200 OK`):
```json
{
  "success": true,
  "executionTimeMs": 1420,
  "data": {
    "summary": "โครงการเปิดร้าน Specialty Coffee & Co-working ใกล้มหาวิทยาลัยด้วยงบ 8 แสนบาท ชูจุดเด่นพื้นที่ทำงานและเมล็ดกาแฟคุณภาพเพื่อแข่งขันกับคู่แข่งในพื้นที่",
    "keyTakeaways": [
      "กลุ่มเป้าหมายนักศึกษาและฟรีแลนซ์มีความต้องการสถานที่ทำงานที่มีสิ่งอำนวยความสะดวกครบถ้วน",
      "การแข่งขันกับร้านแฟรนไชส์ต้องใช้จุดเด่นด้าน Specialty Coffee และห้องประชุม",
      "การบริหารต้นทุนค่าเช่าและควบคุมกระแสเงินสดช่วงเปิดตัวเป็นปัจจัยชี้ขาด"
    ],
    "actionSteps": [
      {
        "step": 1,
        "task": "จัดทำ Feasibility Study และวิเคราะห์จุดคุ้มทุนโดยเปรียบเทียบกับค่าเช่าจริง",
        "priority": "High"
      },
      {
        "step": 2,
        "task": "เจรจาสัญญากับซัพพลายเออร์เมล็ดกาแฟ Single Origin และสั่งซื้อเครื่องชง",
        "priority": "High"
      },
      {
        "step": 3,
        "task": "ออกแบบระบบการจองห้องประชุมออนไลน์และติดตั้งระบบโครงข่ายอินเทอร์เน็ตความเร็วสูง",
        "priority": "Medium"
      },
      {
        "step": 4,
        "task": "จัดแคมเปญ Early-bird Promotion สำหรับนักศึกษาช่วงสัปดาห์แรกของการเปิดร้าน",
        "priority": "Low"
      }
    ],
    "tags": ["ธุรกิจคาเฟ่", "Co-working Space", "แผนธุรกิจ", "การบริหารต้นทุน", "การตลาด"]
  }
}
```

---

## 📤 คู่มือการนำขึ้น GitHub (Git & GitHub Submission)

หากต้องการนำโปรเจกต์นี้ขึ้น GitHub เพื่อส่งงานอาจารย์:

```bash
# 1. เริ่มต้น Git repository
git init

# 2. ตรวจสอบสถานะ (ไฟล์ .env.local จะต้องไม่ถูกแทร็ก)
git status

# 3. เพิ่มไฟล์ทั้งหมด
git add .

# 4. Commit ไฟล์
git commit -m "feat: complete AI Insight & Action Plan Generator web application"

# 5. สร้าง Repository ใหม่บน GitHub (เช่น ชื่อ ai-insight-planner)
# จากนั้นผูก Remote และ Push ขึ้น GitHub
git branch -M main
git remote add origin https://github.com/<your-username>/ai-insight-planner.git
git push -u origin main
```

---

## 👨‍💻 พัฒนาโดย (Authors)
- โครงงานวิชา: **การประยุกต์ใช้ปัญญาประดิษฐ์ (Artificial Intelligence Application)**
- ภาคการศึกษา: 2026/2027
