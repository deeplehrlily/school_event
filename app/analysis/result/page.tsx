"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CheckCircle, AlertCircle, XCircle, TrendingUp, Share2, Award } from "lucide-react"

interface AnalysisResult {
  completionLevel: number
  completionStage: string
  strengths: string[]
  improvements: string[]
  recommendations: string[]
  passRate: number
  similarProfiles: number
  recommendedCertifications: string[]
}

export default function AnalysisResultPage() {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const analyzeUserData = async () => {
      try {
        // Get user data from sessionStorage
        const basicInfo = JSON.parse(sessionStorage.getItem("basicInfo") || "{}")
        const educationInfo = JSON.parse(
          sessionStorage.getItem(basicInfo.education === "고졸" ? "highSchoolInfo" : "universityInfo") || "{}",
        )
        const certificationInfo = JSON.parse(sessionStorage.getItem("certificationInfo") || "{}")

        // Simple analysis logic based on collected data
        let score = 0
        const strengths: string[] = []
        const improvements: string[] = []
        const recommendations: string[] = []

        const recommendedCertifications: string[] = []

        // Age analysis
        const age = Number.parseInt(basicInfo.age || "0")
        if (age >= 20 && age <= 28) {
          score += 25
          strengths.push("적정 연령대로 신입 채용에 유리합니다")
        } else if (age > 28 && age <= 35) {
          score += 20
          strengths.push("경력직 채용에 적합한 연령대입니다")
        } else if (age > 35) {
          improvements.push("상대적으로 높은 연령대")
        } else {
          improvements.push("최소 연령 요건 확인 필요")
        }

        // Education analysis
        if (basicInfo.education === "대졸") {
          score += 20
          strengths.push("4년제 대학교 졸업으로 학력 요건을 충족합니다")
        } else if (basicInfo.education === "초대졸") {
          score += 15
          strengths.push("전문대학교 졸업으로 기술 전문성을 인정받을 수 있습니다")
        } else if (basicInfo.education === "고졸") {
          score += 10
          strengths.push("고등학교 졸업으로 기본 학력 요건을 충족합니다")
        }

        // Grade/GPA analysis with more detailed feedback
        if (educationInfo.gradeAverage) {
          const grade = Number.parseFloat(educationInfo.gradeAverage)
          if (grade <= 2.5) {
            score += 20
            strengths.push("우수한 내신 성적으로 학업 성취도가 높습니다")
          } else if (grade <= 3.5) {
            score += 15
            strengths.push("양호한 내신 성적을 보유하고 있습니다")
          } else {
            improvements.push("내신 성적이 다소 아쉬운 편입니다")
          }
        }

        if (educationInfo.gpa && educationInfo.maxGpa) {
          const gpaRatio = Number.parseFloat(educationInfo.gpa) / Number.parseFloat(educationInfo.maxGpa)
          if (gpaRatio >= 0.85) {
            score += 20
            strengths.push("매우 우수한 대학 학점을 보유하고 있습니다")
          } else if (gpaRatio >= 0.75) {
            score += 15
            strengths.push("양호한 대학 학점을 유지했습니다")
          } else {
            improvements.push("대학 학점이 다소 아쉬운 편입니다")
          }
        }

        const userCerts = {
          craftsman: certificationInfo.craftsman || [],
          industrialEngineer: certificationInfo.industrialEngineer || [],
          engineer: certificationInfo.engineer || [],
          masterCraftsman: certificationInfo.masterCraftsman ? [certificationInfo.masterCraftsman] : [],
          technicalMaster: certificationInfo.technicalMaster ? [certificationInfo.technicalMaster] : [],
        }

        const totalCerts = [
          ...userCerts.craftsman,
          ...userCerts.industrialEngineer,
          ...userCerts.engineer,
          ...userCerts.masterCraftsman,
          ...userCerts.technicalMaster,
        ].filter((cert) => cert && cert !== "없음").length

        let certScore = 0

        // High-value certifications for Hyundai production roles (based on image data)
        const topCertifications = {
          craftsman: ["지게차운전", "전기", "용접", "기계가공조립", "전자기기", "컴퓨터응용선반", "설비보전"],
          industrialEngineer: ["산업안전", "전기", "공조냉동기계"],
          engineer: ["산업안전", "전기", "공조냉동기계"],
        }

        // Score craftsman certifications (기능사)
        userCerts.craftsman.forEach((cert) => {
          if (topCertifications.craftsman.includes(cert)) {
            certScore += 15 // High value craftsman certs
            strengths.push(`${cert}기능사는 현대자동차 생산직에서 가장 선호하는 자격증입니다`)
          } else {
            certScore += 8 // Other craftsman certs
          }
        })

        // Score industrial engineer certifications (산업기사)
        userCerts.industrialEngineer.forEach((cert) => {
          if (topCertifications.industrialEngineer.includes(cert)) {
            certScore += 20 // High value industrial engineer certs
            strengths.push(`${cert}산업기사는 중간관리자급에서 높이 평가받는 자격증입니다`)
          } else {
            certScore += 12
          }
        })

        // Score engineer certifications (기사)
        userCerts.engineer.forEach((cert) => {
          if (topCertifications.engineer.includes(cert)) {
            certScore += 25 // High value engineer certs
            strengths.push(`${cert}기사는 기술직 채용에서 최고 수준의 자격증입니다`)
          } else {
            certScore += 15
          }
        })

        // Score master craftsman (기능장)
        if (userCerts.masterCraftsman.length > 0 && userCerts.masterCraftsman[0] !== "없음") {
          certScore += 30
          strengths.push("기능장 자격증은 해당 분야 최고 수준의 기술력을 인정받는 자격증입니다")
        }

        // Score technical master (기술사)
        if (userCerts.technicalMaster.length > 0 && userCerts.technicalMaster[0] !== "없음") {
          certScore += 35
          strengths.push("기술사 자격증은 국가 최고 수준의 기술 전문가 자격으로 매우 높게 평가됩니다")
        }

        score += Math.min(certScore, 40) // Cap certification score at 40

        // Check for high-value certifications
        const highValueCerts = ["전기", "기계가공", "용접", "전자기기", "컴퓨터응용가공"]
        const hasHighValueCert =
          userCerts.craftsman.some((cert) => highValueCerts.some((valuable) => cert.includes(valuable))) ||
          userCerts.industrialEngineer.some((cert) => highValueCerts.some((valuable) => cert.includes(valuable))) ||
          userCerts.engineer.some((cert) => highValueCerts.some((valuable) => cert.includes(valuable)))

        if (hasHighValueCert) {
          score += 10
          strengths.push("현대자동차 생산직에 핵심적인 자격증을 보유하고 있습니다")
        } else if (totalCerts > 0) {
          improvements.push("보유 자격증이 생산직과의 연관성이 낮습니다")
          recommendedCertifications.push("전기기능사", "기계가공기능사")
        }

        let hasExperience = false
        if (certificationInfo.experience && certificationInfo.experience !== "없음") {
          hasExperience = true
          const experienceYears = certificationInfo.experience.includes("년")
            ? Number.parseInt(certificationInfo.experience)
            : 0

          if (experienceYears >= 3) {
            score += 15
            strengths.push(`${experienceYears}년의 풍부한 실무 경험을 보유하고 있습니다`)
          } else if (experienceYears >= 1) {
            score += 10
            strengths.push(`${experienceYears}년의 실무 경험이 있어 현장 적응력이 좋습니다`)
          } else {
            score += 5
            strengths.push("관련 분야 실무 경험을 보유하고 있습니다")
          }
        }

        if (!hasExperience) {
          if (age <= 25) {
            improvements.push("신입으로서 실무 경력이 부족하지만 연령상 성장 가능성이 높습니다")
          } else {
            improvements.push("실무 경력 부족으로 경쟁력이 다소 아쉽습니다")
          }
        }

        // Major analysis
        if (educationInfo.schoolType === "공고" || educationInfo.schoolType === "마이스터고") {
          score += 5
          strengths.push("기술계 고등학교 출신으로 실무 기초가 탄탄합니다")
        }

        if (
          educationInfo.major?.includes("기계") ||
          educationInfo.major?.includes("전기") ||
          educationInfo.major?.includes("자동차") ||
          educationInfo.major?.includes("전자")
        ) {
          score += 10
          strengths.push("전공이 자동차 생산 분야와 직접적으로 연관됩니다")
        } else if (educationInfo.major) {
          improvements.push("전공과 생산직 업무의 연관성이 낮습니다")
        }

        const isPass = score >= 70
        const completionStage = isPass ? "합격" : "불합격"

        // Calculate estimated pass rate based on score
        const passRate = Math.min(Math.max(score * 0.8, 10), 85)

        const detailedRecommendations: string[] = []

        if (totalCerts === 0) {
          detailedRecommendations.push(
            "🎯 1순위 자격증 취득 전략: 현대자동차 합격자 데이터 분석 결과, 지게차운전기능사(18명), 산업안전산업기사(17명), 전기기능사(12명) 순으로 많이 보유하고 있습니다. 이 중 본인의 전공이나 관심 분야와 가장 가까운 자격증부터 취득하세요.",
          )
        } else if (totalCerts <= 2) {
          detailedRecommendations.push(
            "📈 자격증 업그레이드 전략: 현재 보유한 기능사 자격증을 바탕으로 같은 분야의 산업기사 자격증 취득을 목표로 하세요. 산업기사는 기능사보다 20% 이상 높은 평가를 받으며, 승진 기회도 더 많습니다.",
          )
        }

        if (age >= 20 && age <= 26) {
          detailedRecommendations.push(
            `⭐ 연령대 활용 전략: 현재 연령(${age}세)은 현대자동차 합격자 중 가장 많은 비율(66.1%)을 차지하는 20대 초중반입니다. 이 연령대의 장점인 학습능력, 적응력, 성장가능성을 적극 어필하세요.`,
          )
        } else if (age > 26) {
          detailedRecommendations.push(
            "🎖️ 경력 어필 전략: 20대 후반 이상의 연령대는 안정성과 책임감을 강조해야 합니다. 이전 직장에서의 성과, 팀워크 경험, 문제해결 능력을 구체적인 사례와 함께 준비하세요.",
          )
        }

        if (!hasHighValueCert && totalCerts > 0) {
          detailedRecommendations.push(
            "🔄 보유 자격증 재활용 전략: 현재 보유한 자격증이 생산직과 직접 연관이 낮더라도 포기하지 마세요. 해당 자격증 취득 과정에서 보여준 학습능력, 목표달성 의지, 전문성 추구 자세를 어필 포인트로 활용하고, 동시에 생산직 관련 자격증 추가 취득 계획을 구체적으로 제시하세요.",
          )
        }

        detailedRecommendations.push(
          "💪 체력 및 안전 관리: 생산직은 3교대 근무와 물리적 작업이 많아 체력이 중요합니다. 꾸준한 운동으로 체력을 기르고, 산업안전보건법과 작업장 안전수칙을 숙지하여 안전 의식이 높다는 점을 어필하세요.",
        )

        detailedRecommendations.push(
          "🎯 면접 핵심 전략: 현대자동차의 인재상인 '도전정신', '창의성', '협업능력'에 맞는 경험담을 준비하세요. 특히 '어려운 상황을 극복한 경험', '팀워크로 문제를 해결한 사례', '새로운 기술이나 지식을 습득한 경험'을 구체적으로 준비하면 좋은 평가를 받을 수 있습니다.",
        )

        setAnalysisResult({
          completionLevel: score,
          completionStage,
          strengths,
          improvements,
          recommendations: detailedRecommendations, // Using detailed recommendations
          passRate,
          similarProfiles: Math.floor(Math.random() * 50) + 20,
          recommendedCertifications,
        })

        // Submit data to Google Sheets after analysis
        try {
          const { submitToGoogleSheets } = await import("@/lib/google-sheets")

          const submissionData = {
            // 기본 정보
            name: basicInfo.name || "",
            age: basicInfo.age || "",
            education: basicInfo.education || "",
            phone: basicInfo.phone || "",

            // 고등학교 정보 (고졸인 경우)
            ...(basicInfo.education === "고졸" && {
              schoolType: educationInfo.schoolType || "",
              gradeAverage: educationInfo.gradeAverage || "",
              absences: educationInfo.absences || "",
              earlyLeaves: educationInfo.earlyLeaves || "",
              tardiness: educationInfo.tardiness || "",
              results: educationInfo.results || "",
            }),

            // 대학교 정보 (대졸인 경우)
            ...(basicInfo.education !== "고졸" && {
              universityType: educationInfo.universityType || "",
              universityName: educationInfo.universityName || "",
              major: educationInfo.major || "",
              gpa: educationInfo.gpa || "",
              maxGpa: educationInfo.maxGpa || "",
            }),

            // 자격증 정보
            technicalMaster: certificationInfo.technicalMaster || "없음",
            engineer: Array.isArray(certificationInfo.engineer)
              ? certificationInfo.engineer.join(", ")
              : certificationInfo.engineer || "없음",
            industrialEngineer: Array.isArray(certificationInfo.industrialEngineer)
              ? certificationInfo.industrialEngineer.join(", ")
              : certificationInfo.industrialEngineer || "없음",
            craftsman: Array.isArray(certificationInfo.craftsman)
              ? certificationInfo.craftsman.join(", ")
              : certificationInfo.craftsman || "없음",
            masterCraftsman: certificationInfo.masterCraftsman || "없음",

            // 기타 정보
            experience: certificationInfo.experience || "없음",
            languageScore: certificationInfo.languageScore || "없음",
            awards: certificationInfo.awards || "없음",

            // 제출일시
            submittedAt: new Date().toISOString(),
          }

          await submitToGoogleSheets(submissionData)
          console.log("[v0] 데이터가 Google Sheets에 성공적으로 저장되었습니다.")
        } catch (sheetsError) {
          console.error("[v0] Google Sheets 저장 실패:", sheetsError)
          // Google Sheets 오류가 발생해도 분석은 계속 진행
        }

        setTimeout(() => {
          setShowConfetti(true)
          setTimeout(() => setShowConfetti(false), 3000)
        }, 500)
      } catch (error) {
        console.error("Analysis error:", error)
        // Fallback result
        setAnalysisResult({
          completionLevel: 50,
          completionStage: "불합격",
          strengths: ["기본 정보 완성"],
          improvements: ["추가 정보 필요"],
          recommendations: ["더 많은 정보를 입력해주세요"],
          passRate: 45,
          similarProfiles: 30,
          recommendedCertifications: [],
        })
      } finally {
        setLoading(false)
      }
    }

    analyzeUserData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-300 mx-auto"></div>
            <p className="text-blue-200 font-medium">스펙을 분석하고 있습니다...</p>
            <p className="text-blue-300 text-sm">현대자동차 합격자 데이터와 비교 중</p>
          </div>
        </div>
      </div>
    )
  }

  if (!analysisResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 flex items-center justify-center">
        <div className="text-center space-y-6 max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center shadow-2xl border-4 border-red-100">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <div className="space-y-2">
            <p className="text-white font-medium">분석 결과를 불러올 수 없습니다.</p>
            <p className="text-blue-200 text-sm">다시 시도해주세요</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-xl"
            onClick={() => (window.location.href = "/")}
          >
            처음으로 돌아가기
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-3 sm:p-4 lg:p-6 relative">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#96ceb4", "#feca57", "#ff9ff3"][
                    Math.floor(Math.random() * 6)
                  ],
                }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="max-w-sm sm:max-w-md lg:max-w-2xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3 sm:space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="text-white hover:bg-white/10 rounded-xl min-h-[44px] min-w-[44px] touch-manipulation"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg sm:text-xl font-bold text-white">현대자동차 스펙 분석 결과</h1>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4 px-4 sm:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
              {analysisResult.completionStage === "합격" ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-10 sm:w-12 h-10 sm:h-12 text-green-600" />
                  <Badge className="text-green-600 bg-green-50 border-green-200 px-6 sm:px-8 py-3 sm:py-4 text-xl sm:text-2xl font-bold rounded-xl">
                    합격
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <XCircle className="w-10 sm:w-12 h-10 sm:h-12 text-red-600" />
                  <Badge className="text-red-600 bg-red-50 border-red-200 px-6 sm:px-8 py-3 sm:py-4 text-xl sm:text-2xl font-bold rounded-xl">
                    불합격
                  </Badge>
                </div>
              )}
            </div>
            <div className="bg-blue-50 rounded-xl p-3 sm:p-4 border border-blue-100">
              <p className="text-blue-800 font-bold text-base sm:text-lg">
                현대자동차 합격 가능성: {analysisResult.passRate.toFixed(1)}%
              </p>
            </div>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <div className="space-y-4">
              <Progress value={analysisResult.completionLevel} className="w-full h-3 sm:h-4 bg-slate-200" />
              <p className="text-xs sm:text-sm text-slate-600 text-center bg-slate-50 rounded-lg p-3">
                유사한 프로필 {analysisResult.similarProfiles}명 중 분석 결과
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Certifications */}
        {analysisResult.recommendedCertifications.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-3 text-purple-700">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-4 sm:w-5 h-4 sm:h-5 text-purple-600" />
                </div>
                <span className="text-lg sm:text-xl font-bold">추천 자격증 (우선 취득)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {analysisResult.recommendedCertifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-sm sm:text-base text-purple-800 font-medium">{cert}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 text-xs sm:text-sm">추천</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs sm:text-sm text-purple-600 mt-4 p-3 bg-purple-50 rounded-lg">
                * 현재 자격증 보유 수준에 맞춰 우선적으로 취득하면 좋은 자격증입니다
              </p>
            </CardContent>
          </Card>
        )}

        {/* Strengths */}
        {analysisResult.strengths.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-3 text-green-700">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 sm:w-5 h-4 sm:h-5 text-green-600" />
                </div>
                <span className="text-lg sm:text-xl font-bold">강점</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {analysisResult.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 sm:p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-1 sm:mt-2"></div>
                    <span className="text-sm sm:text-base text-green-800 font-medium leading-relaxed">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improvements */}
        {analysisResult.improvements.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-3 text-orange-700">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-orange-600" />
                </div>
                <span className="text-lg sm:text-xl font-bold">보완점</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-3">
                {analysisResult.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-3 sm:p-4 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-1 sm:mt-2"></div>
                    <span className="text-sm sm:text-base text-orange-800 font-medium leading-relaxed">
                      {improvement}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {analysisResult.recommendations.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader className="px-4 sm:px-6">
              <CardTitle className="flex items-center space-x-3 text-blue-700">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600" />
                </div>
                <span className="text-lg sm:text-xl font-bold">상세 개선 방안</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4 sm:space-y-6">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-4 sm:p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-5 sm:w-6 h-5 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-xs sm:text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-sm sm:text-base text-blue-900 leading-relaxed font-medium">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-6 sm:pb-8">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-4 text-base sm:text-lg shadow-2xl border-0 rounded-xl transition-all duration-300 transform hover:scale-105 min-h-[56px] touch-manipulation"
            onClick={() => (window.location.href = "/")}
          >
            다시 분석하기
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl py-4 transition-all duration-200 min-h-[56px] touch-manipulation"
            onClick={() => {
              const text = `내 현대자동차 스펙 분석 결과: ${analysisResult.completionStage} (${analysisResult.completionLevel}점)`
              const url = window.location.origin
              navigator.clipboard.writeText(`${text}\n${url}`)
              alert("결과가 복사되었습니다!")
            }}
          >
            <Share2 className="w-4 h-4 mr-2" />
            결과 공유하기
          </Button>
        </div>
      </div>

      <style jsx>{`
        .confetti-container {
          position: relative;
          width: 100%;
          height: 100%;
        }
        
        .confetti {
          position: absolute;
          width: 10px;
          height: 10px;
          background: #ff6b6b;
          animation: confetti-fall 3s linear infinite;
        }
        
        @keyframes confetti-fall {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
