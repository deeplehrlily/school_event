"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, ArrowRight } from "lucide-react"

interface BasicInfoData {
  name: string
  age: string
  education: string
  phone: string
}

export default function BasicInfoPage() {
  const [formData, setFormData] = useState<BasicInfoData>({
    name: "",
    age: "",
    education: "",
    phone: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof BasicInfoData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePhoneChange = (value: string) => {
    // Format phone number as 000-0000-0000
    const numbers = value.replace(/\D/g, "")
    let formatted = numbers
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 3) + "-" + numbers.slice(3)
    }
    if (numbers.length >= 7) {
      formatted = numbers.slice(0, 3) + "-" + numbers.slice(3, 7) + "-" + numbers.slice(7, 11)
    }
    handleInputChange("phone", formatted)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 입력되지 않은 필수 항목 확인
    const missingFields = []
    if (!formData.name) missingFields.push("이름")
    if (!formData.age) missingFields.push("나이")
    if (!formData.education) missingFields.push("학력")
    if (!formData.phone || formData.phone.length < 13) missingFields.push("전화번호")

    if (missingFields.length > 0) {
      alert(`다음 항목을 입력해주세요:\n\n• ${missingFields.join("\n• ")}`)
      return
    }

    setIsSubmitting(true)

    try {
      sessionStorage.setItem(
        "basicInfo",
        JSON.stringify({
          ...formData,
          birthDate: new Date(new Date().getFullYear() - Number.parseInt(formData.age), 0, 1)
            .toISOString()
            .split("T")[0],
          address: "미입력", // Default value for now
        }),
      )

      // Navigate based on education level
      if (formData.education === "고졸") {
        window.location.href = "/form/high-school"
      } else {
        window.location.href = "/form/university"
      }
    } catch (error) {
      console.error("Form submission error:", error)
      alert("폼 제출 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 lg:p-6">
      <div className="max-w-sm sm:max-w-md mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
            className="min-h-[44px] min-w-[44px] touch-manipulation"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-500 h-2 rounded-full w-1/4"></div>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">1/4 단계</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="shadow-lg">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="text-lg sm:text-xl text-center">기본 정보</CardTitle>
              <p className="text-xs sm:text-sm text-gray-600 text-center">개인정보를 입력해주세요</p>
            </CardHeader>
            <CardContent className="space-y-5 sm:space-y-6 px-4 sm:px-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm sm:text-base font-medium">
                  이름 *
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="홍길동"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  autoComplete="name"
                  required
                />
              </div>

              {/* Age */}
              <div className="space-y-2">
                <Label htmlFor="age" className="text-sm sm:text-base font-medium">
                  나이 *
                </Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  inputMode="numeric"
                  placeholder="25"
                  value={formData.age}
                  onChange={(e) => handleInputChange("age", e.target.value)}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  min="18"
                  max="65"
                  required
                />
              </div>

              {/* Education */}
              <div className="space-y-2">
                <Label className="text-sm sm:text-base font-medium">학력 *</Label>
                <Select onValueChange={(value) => handleInputChange("education", value)} required>
                  <SelectTrigger className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors">
                    <SelectValue placeholder="학력을 선택해주세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="고졸" className="text-base sm:text-sm py-3 sm:py-2">
                      고졸
                    </SelectItem>
                    <SelectItem value="초대졸" className="text-base sm:text-sm py-3 sm:py-2">
                      초대졸 (전문대)
                    </SelectItem>
                    <SelectItem value="대졸" className="text-base sm:text-sm py-3 sm:py-2">
                      대졸 (4년제)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm sm:text-base font-medium">
                  전화번호 *
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="010-0000-0000"
                  value={formData.phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  maxLength={13}
                  className="h-12 sm:h-11 text-base sm:text-sm rounded-lg border-2 focus:border-blue-500 transition-colors"
                  autoComplete="tel"
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full h-12 sm:h-11 text-base sm:text-sm font-semibold rounded-lg transition-all duration-200 touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "제출 중..." : "다음 단계"}
                {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2" />}
              </Button>

              {/* Progress indicator */}
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">{Object.values(formData).filter(Boolean).length}/4 항목 완료</p>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
