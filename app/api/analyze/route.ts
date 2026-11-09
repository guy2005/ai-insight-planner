import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { AnalysisResult, AnalyzeResponse } from "@/types/analysis";

// บังคับให้เป็น dynamic runtime ไม่ทำ static cache
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  const startTime = Date.now();

  try {
    // 1. ตรวจสอบ Environment Variable
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          success: false,
          error:
            "ไม่พบ GEMINI_API_KEY ในระบบ กรุณาตั้งค่าในไฟล์ .env.local ก่อนเริ่มใช้งาน",
        },
        { status: 500 }
      );
    }

    // 2. รับและตรวจสอบ Request Payload
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

    // 3. เริ่มต้น Google Generative AI Client
    const genAI = new GoogleGenerativeAI(apiKey);

    // 4. กำหนด JSON Schema สำหรับ Structured Output
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
      // กรณีมี backticks หรือ whitespace ปนเปื้อน
      const cleaned = responseText.replace(/```json/gi, "").replace(/```/g, "").trim();
      parsedData = JSON.parse(cleaned);
    }

    // Sanity check properties
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
