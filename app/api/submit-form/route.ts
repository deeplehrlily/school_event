import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json()
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("form_submissions")
      .insert({
        name: formData.name,
        birth_date: formData.birthDate,
        phone: formData.phone,
        address: formData.address,
        education_level: formData.educationLevel,
        school_name: formData.schoolName,
        major: formData.major,
        graduation_date: formData.graduationDate,
        gpa: formData.gpa,
        certifications: formData.certifications || [],
        analysis_score: formData.analysisScore,
        pass_status: formData.passStatus,
        strengths: formData.strengths || [],
        weaknesses: formData.weaknesses || [],
        recommendations: formData.recommendations || [],
      })
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
