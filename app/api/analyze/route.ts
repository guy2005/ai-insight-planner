import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, AnalyzeResponse } from "@/types/analysis";

// บังคับให้เป็น Dynamic Runtime ไม่ทำ static cache
export const dynamic = "force-dynamic";

/**
 * ฟังก์ชันสร้างผลลัพธ์จำลอง (Mock Data) อัตโนมัติ
 * ทำงานเมื่อยังไม่ได้กรอก GEMINI_API_KEY หรือเมื่อผู้ใช้ต้องการทดสอบระบบ (Demo Mode)
 */
function generateMockAnalysis(content: string): AnalysisResult {
  const lower = content.toLowerCase();

  // กรณีเกี่ยวกับ ธุรกิจ / คาเฟ่ / กาแฟ / สตาร์ทอัพ
  if (
    lower.includes("กาแฟ") ||
    lower.includes("cafe") ||
    lower.includes("ธุรกิจ") ||
    lower.includes("business") ||
    lower.includes("สตาร์ทอัพ")
  ) {
    return {
      summary:
        "โครงการจัดตั้งร้าน Specialty Coffee & Co-working Space ใกล้มหาวิทยาลัยด้วยงบประมาณ 800,000 บาท มุ่งสร้างจุดเด่นด้วยเมล็ดกาแฟ Single Origin, โต๊ะทำงานพร้อมสิ่งอำนวยความสะดวกครบครัน และห้องประชุมย่อย เพื่อสร้างความแตกต่างจากคู่แข่งแฟรนไชส์ในพื้นที่",
      keyTakeaways: [
        "กลุ่มเป้าหมายนักศึกษาและฟรีแลนซ์ต้องการพื้นที่ทำงานที่มีปลั๊กไฟและอินเทอร์เน็ตความเร็วสูงที่นั่งได้ยาวนาน",
        "จุดขายด้าน Specialty Coffee และห้องประชุมให้เช่ารายชั่วโมง เป็นแต้มต่อสำคัญที่คู่แข่งเลียนแบบได้ยาก",
        "ต้นทุนค่าเช่าตึกและสภาพคล่องหมุนเวียน 3 เดือนแรกเป็นความเสี่ยงหลักที่ต้องมีแผนสำรอง",
        "กลยุทธ์การตลาดเปิดตัวด้วยแคมเปญนักศึกษาจะช่วยสร้างฐานลูกค้าประจำ (Repeat Customers) ได้รวดเร็ว",
      ],
      actionSteps: [
        {
          step: 1,
          task: "จัดทำ Feasibility Study คำนวณต้นทุนคงที่และประเมินจุดคุ้มทุน (Break-even Point) อิงค่าเช่าจริง",
          priority: "High",
        },
        {
          step: 2,
          task: "เจรจาซัพพลายเออร์เมล็ดกาแฟ Single Origin และคัดเลือกจัดซื้อเครื่องชงระบบ Commercial Espresso",
          priority: "High",
        },
        {
          step: 3,
          task: "ออกแบบผังร้านแบ่งสัดส่วน Silent Zone, Co-working และห้องประชุมย่อย 2 ห้อง พร้อมติดตั้ง Wi-Fi 6",
          priority: "Medium",
        },
        {
          step: 4,
          task: "จัดทำแคมเปญการตลาดเปิดตัว 'Study & Sip Pass' มอบสิทธิพิเศษสำหรับนักศึกษาในช่วง 2 สัปดาห์แรก",
          priority: "Medium",
        },
        {
          step: 5,
          task: "ติดตั้งระบบ POS และ Line Official Account สำหรับสะสมคะแนนและระบบจองห้องประชุมล่วงหน้า",
          priority: "Low",
        },
      ],
      tags: [
        "ธุรกิจคาเฟ่",
        "Co-working Space",
        "แผนธุรกิจ",
        "การบริหารต้นทุน",
        "Specialty Coffee",
        "กลยุทธ์การตลาด",
      ],
    };
  }

  // กรณีเกี่ยวกับ AI / Machine Learning / การเรียน / เลกเชอร์
  if (
    lower.includes("ai") ||
    lower.includes("machine learning") ||
    lower.includes("เรียน") ||
    lower.includes("เลกเชอร์") ||
    lower.includes("lecture") ||
    lower.includes("supervised")
  ) {
    return {
      summary:
        "สรุปประเด็นหัวใจสำคัญของวิชา AI/Machine Learning ครอบคลุมการจำแนกระหว่าง Supervised Learning (มีเฉลย Label) และ Unsupervised Learning (ไม่มี Label เน้นหารูปแบบ) พร้อมเทคนิคการป้องกันปัญหา Overfitting เพื่อเตรียมตัวสอบ Quiz และทำโครงงานปลายภาค",
      keyTakeaways: [
        "Supervised Learning ใช้งานกับโจทย์ Classification และ Regression โดยอาศัย Labeled Data ในการเทรน",
        "Unsupervised Learning เน้นค้นหาความสัมพันธ์เชิงลึกผ่าน Clustering (เช่น K-Means) และ Dimensionality Reduction (PCA)",
        "Overfitting คือภาวะที่โมเดลจดจำข้อมูลมากเกินไป แก้ได้ด้วย Cross-Validation, Regularization และ Data Augmentation",
        "การส่งหัวข้อ Final Project ต้องเริ่มจากการสำรวจ Dataset (Exploratory Data Analysis) ก่อนคัดเลือกอัลกอริทึม",
      ],
      actionSteps: [
        {
          step: 1,
          task: "ทบทวนสูตรคณิตศาสตร์และ Decision Boundary ของ Linear Regression และ Decision Tree เพื่อเตรียมสอบ Quiz",
          priority: "High",
        },
        {
          step: 2,
          task: "ค้นหาและคัดเลือก Dataset ที่สนใจจาก Kaggle หรือ UCI Repository เพื่อนำมาใช้ทำโครงงานปลายภาค",
          priority: "High",
        },
        {
          step: 3,
          task: "เขียนสรุปเปรียบเทียบข้อดี-ข้อจำกัดระหว่าง Decision Trees กับ Support Vector Machines (SVM)",
          priority: "Medium",
        },
        {
          step: 4,
          task: "ทดลองสร้าง Baseline Model ด้วย Scikit-learn บน Google Colab และวัดผลด้วย Confusion Matrix",
          priority: "Medium",
        },
        {
          step: 5,
          task: "ร่างเอกสารข้อเสนอหัวข้อโครงงาน (Project Proposal) เพื่อส่งให้อาจารย์ผู้สอนตรวจสอบความเหมาะสม",
          priority: "Low",
        },
      ],
      tags: [
        "Machine Learning",
        "Supervised Learning",
        "Unsupervised Learning",
        "Overfitting",
        "เตรียมสอบ",
        "AI Project",
      ],
    };
  }

  // กรณีเกี่ยวกับ การประชุม / Sprint / Checkout / พัฒนาระบบ
  if (
    lower.includes("ประชุม") ||
    lower.includes("checkout") ||
    lower.includes("sprint") ||
    lower.includes("ทีม") ||
    lower.includes("meeting") ||
    lower.includes("e-commerce")
  ) {
    return {
      summary:
        "สรุปแนวทางการปรับปรุงระบบ Checkout ของแพลตฟอร์ม E-Commerce เพื่อลดปัญหา Drop-off 42% โดยมุ่งเน้นการยุบขั้นตอนเป็น 1-Page Checkout, เพิ่มระบบ Auto-fill ที่อยู่, รองรับ PromptPay QR Code และเปิด Guest Checkout ให้ทันแคมเปญ 12.12",
      keyTakeaways: [
        "ขั้นตอนการชำระเงินที่ซับซ้อนและการบังคับลงทะเบียนเป็นสาเหตุหลักที่ทำให้สูญเสียลูกค้า",
        "การปรับปรุงเป็น 1-Page Checkout ร่วมกับ Auto-fill จะช่วยลดเวลาเฉลี่ยในการสั่งซื้อลงอย่างมีนัยสำคัญ",
        "PromptPay QR Code เป็นช่องทางชำระเงินที่มีอัตรา Conversion สูงสุดสำหรับผู้ใช้งานในไทย",
        "กรอบเวลา 3 สัปดาห์ก่อนแคมเปญ 12.12 จำเป็นต้องตัดทอนฟีเจอร์ที่ไม่จำเป็นและมุ่งเน้น Core Flow ก่อน",
      ],
      actionSteps: [
        {
          step: 1,
          task: "ออกแบบ UI Wireframe ของ 1-Page Checkout และให้ทีม Frontend เริ่มขึ้นโครง Layout",
          priority: "High",
        },
        {
          step: 2,
          task: "พัฒนาระบบ Auto-fill รหัสไปรษณีย์ และเชื่อมต่อ Payment Gateway รองรับ PromptPay QR Dynamic",
          priority: "High",
        },
        {
          step: 3,
          task: "ปลดการบังคับสมัครสมาชิกและเพิ่มตัวเลือก Guest Checkout พร้อมระบบส่ง Order Confirmation ทางอีเมล/SMS",
          priority: "Medium",
        },
        {
          step: 4,
          task: "เปิดทดสอบเวอร์ชัน Beta ภายในทีม (Internal Dogfooding) เพื่อจับ Edge Cases และวัดผลโหลดหน้าเว็บ",
          priority: "Medium",
        },
        {
          step: 5,
          task: "ติดตั้ง Google Analytics Tracking Events ในแต่ละจุดของขั้นตอน Checkout ใหม่เพื่อวัดผล Funnel Drop-off",
          priority: "Low",
        },
      ],
      tags: [
        "E-Commerce",
        "Checkout Flow",
        "UX/UI Design",
        "PromptPay",
        "Sprint Planning",
        "Conversion Rate",
      ],
    };
  }

  // กรณีข้อความทั่วไป
  return {
    summary:
      "ผลการวิเคราะห์เนื้อหาเชิงสังเคราะห์: ข้อความระบุถึงเป้าหมายและปัญหาที่ต้องแก้ไขอย่างเป็นระบบ โดยจำเป็นต้องจัดลำดับความสำคัญของทรัพยากร วางกระบวนการดำเนินงานอย่างเป็นขั้นตอน และกำหนดตัวชี้วัดความสำเร็จ (KPIs) ที่ชัดเจนเพื่อให้บรรลุผลตามกำหนดการ",
    keyTakeaways: [
      "มีการระบุวัตถุประสงค์หลักชัดเจน แต่ยังขาดรายละเอียดขั้นตอนการลงมือปฏิบัติที่เฉพาะเจาะจง",
      "ปัจจัยด้านเวลาและทรัพยากรเป็นข้อจำกัดสำคัญที่ต้องจัดลำดับความสำคัญอย่างรอบคอบ",
      "การแบ่งภารกิจออกเป็น Milestone ย่อยจะช่วยลดความเสี่ยงและติดตามความก้าวหน้าได้อย่างมีประสิทธิภาพ",
      "ควรสร้างช่องทางการสื่อสารและสรุปผลการดำเนินงานอย่างสม่ำเสมอในทุกขั้นตอน",
    ],
    actionSteps: [
      {
        step: 1,
        task: "กำหนดขอบเขตงาน (Scope of Work) และระบุผู้รับผิดชอบหลักในแต่ละส่วนงานอย่างชัดเจน",
        priority: "High",
      },
      {
        step: 2,
        task: "จัดทำตารางเวลาการดำเนินงาน (Timeline & Milestones) พร้อมกำหนด Deadline ที่วัดผลได้จริง",
        priority: "High",
      },
      {
        step: 3,
        task: "จัดเตรียมเครื่องมือและทรัพยากรที่จำเป็นสำหรับการเริ่มดำเนินงานในระยะที่ 1",
        priority: "Medium",
      },
      {
        step: 4,
        task: "ประชุมติดตามความคืบหน้าครั้งแรกเพื่อประเมินอุปสรรคและปรับแผนงานให้สอดคล้องกับสถานการณ์",
        priority: "Low",
      },
    ],
    tags: [
      "การบริหารงาน",
      "Action Plan",
      "การวิเคราะห์ข้อมูล",
      "Productivity",
      "การวางแผนกลยุทธ์",
    ],
  };
}

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  const startTime = Date.now();

  try {
    // 1. รับและตรวจสอบ Request Payload
    const body = await req.json().catch(() => null);
    if (!body || typeof body.content !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Payload ไม่ถูกต้อง: ต้องระบุฟิลด์ 'content' เป็นข้อความ",
        },
        { status: 400 }
      );
    }

    const trimmedContent = body.content.trim();
    if (trimmedContent.length < 10) {
      return NextResponse.json(
        {
          success: false,
          error: "เนื้อหาสั้นเกินไป กรุณาระบุข้อความอย่างน้อย 10 ตัวอักษรเพื่อให้ AI วิเคราะห์ได้อย่างแม่นยำ",
        },
        { status: 400 }
      );
    }

    if (trimmedContent.length > 15000) {
      return NextResponse.json(
        {
          success: false,
          error: "เนื้อหายาวเกินขีดจำกัด (สูงสุด 15,000 ตัวอักษร)",
        },
        { status: 400 }
      );
    }

    // 2. ตรวจสอบ API Key: หากยังไม่ได้ระบุ ให้เปิดใช้งาน Demo Mock Mode อัตโนมัติ
    const rawApiKey = process.env.GEMINI_API_KEY?.trim();
    const isMockMode =
      !rawApiKey ||
      rawApiKey === "" ||
      rawApiKey === "your_gemini_api_key_here" ||
      rawApiKey === "your_actual_gemini_api_key_here" ||
      rawApiKey === "mock" ||
      rawApiKey === "demo";

    if (isMockMode) {
      // จำลองเวลาประมวลผลของ AI ประมาณ 850ms เพื่อให้เห็น Skeleton/Loading State สวยงาม
      await new Promise((resolve) => setTimeout(resolve, 850));

      const mockData = generateMockAnalysis(trimmedContent);
      const executionTimeMs = Date.now() - startTime;

      return NextResponse.json(
        {
          success: true,
          data: mockData,
          executionTimeMs,
          isDemoMode: true,
        },
        { status: 200 }
      );
    }

    // 3. เริ่มต้น Google Generative AI Client เมื่อมีคีย์จริง
    const genAI = new GoogleGenerativeAI(rawApiKey);

    // 4. กำหนด System Instruction และ JSON Schema สำหรับ Structured Output
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: `คุณเป็น Senior Business Analyst และ Executive Consultant ผู้เชี่ยวชาญด้านการวิเคราะห์ข้อมูล 
หน้าที่ของคุณคือ:
1. วิเคราะห์เนื้อหาที่ได้รับอย่างละเอียด ไม่ว่าจะเป็นโน้ตการเรียน, ไอเดียธุรกิจ, บันทึกการประชุม หรือบทความ
2. สกัดใจความสำคัญเป็น Executive Summary ที่กระชับและตรงประเด็น
3. ดึงประเด็นสำคัญ (Key Takeaways) 3 ถึง 5 ข้อที่มีประโยชน์สูงสุด
4. วางแผนปฏิบัติการ (Action Steps) เป็นขั้นตอนรูปธรรม เรียงลำดับ 1, 2, 3... พร้อมระบุ Priority (High, Medium, Low)
5. สกัด Tags หรือคีย์เวิร์ดที่เกี่ยวข้อง 3 ถึง 6 คำ
6. ตอบกลับด้วยภาษาเดียวกับเนื้อหาที่ส่งเข้ามา (หากส่งภาษาไทย ให้ตอบภาษาไทยที่สละสลวย เป็นมืออาชีพ)
7. ผลลัพธ์ต้องเป็นไปตาม JSON Schema ที่กำหนดเท่านั้น ห้ามเพิ่มข้อความทักทายหรือ Markdown อื่นนอก JSON`,
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            summary: {
              type: SchemaType.STRING,
              description: "สรุปใจความสำคัญแบบกระชับ ชัดเจน เข้าใจง่าย",
            },
            keyTakeaways: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.STRING,
              },
              description: "ประเด็นสำคัญหรือข้อคิดหลัก 3-5 ข้อ",
            },
            actionSteps: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  step: {
                    type: SchemaType.INTEGER,
                    description: "ลำดับขั้นตอน เริ่มจาก 1",
                  },
                  task: {
                    type: SchemaType.STRING,
                    description: "ภารกิจที่ต้องลงมือทำอย่างเป็นรูปธรรม",
                  },
                  priority: {
                    type: SchemaType.STRING,
                    format: "enum",
                    enum: ["High", "Medium", "Low"],
                    description: "ระดับความสำคัญ: High, Medium, หรือ Low",
                  },
                },
                required: ["step", "task", "priority"],
              },
              description: "ขั้นตอนแผนปฏิบัติการที่สามารถนำไปทำต่อได้จริง",
            },
            tags: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.STRING,
              },
              description: "หมวดหมู่หรือคีย์เวิร์ด 3-6 คำ",
            },
          },
          required: ["summary", "keyTakeaways", "actionSteps", "tags"],
        },
      },
    });

    // 5. ส่งคำขอไปยัง Gemini API
    const prompt = `วิเคราะห์เนื้อหาต่อไปนี้ และสกัดข้อมูลตาม JSON Schema:\n\n${trimmedContent}`;
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // 6. แปลงและ Validate ข้อมูล JSON
    let parsedData: AnalysisResult;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    if (
      !parsedData ||
      typeof parsedData.summary !== "string" ||
      !Array.isArray(parsedData.keyTakeaways) ||
      !Array.isArray(parsedData.actionSteps) ||
      !Array.isArray(parsedData.tags)
    ) {
      throw new Error("โครงสร้างข้อมูลที่ AI ตอบกลับมาไม่ตรงตามรูปแบบที่กำหนด");
    }

    const executionTimeMs = Date.now() - startTime;

    return NextResponse.json(
      {
        success: true,
        data: parsedData,
        executionTimeMs,
        isDemoMode: false,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("API Analyze Error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "เกิดข้อผิดพลาดในการประมวลผลข้อมูลด้วย AI";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        executionTimeMs: Date.now() - startTime,
      },
      { status: 500 }
    );
  }
}
