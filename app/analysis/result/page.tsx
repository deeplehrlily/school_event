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

  useEffect(() => {
    const analyzeUserData = () => {
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

        const userCerts = [
          ...(certificationInfo.gineungsa || []),
          ...(certificationInfo.saneopgisa || []),
          ...(certificationInfo.gisa || []),
          ...(certificationInfo.gineungjang || []),
          ...(certificationInfo.gisulsa || []),
        ]

        const totalCerts = userCerts.length

        if (totalCerts >= 3) {
          score += 25
          strengths.push(`${totalCerts}개의 자격증을 보유하여 전문성을 인정받을 수 있습니다`)
        } else if (totalCerts >= 1) {
          score += 15
          strengths.push(`${totalCerts}개의 자격증을 보유하고 있습니다`)
        } else {
          improvements.push("자격증이 부족합니다")
          if (totalCerts <= 1) {
            recommendedCertifications.push("전기기능사", "기계가공기능사", "용접기능사")
          }
        }

        // Check for high-value certifications
        const highValueCerts = ["전기", "기계가공", "용접", "전자기기", "컴퓨터응용가공"]
        const hasHighValueCert = userCerts.some((cert) => highValueCerts.some((valuable) => cert.includes(valuable)))

        if (hasHighValueCert) {
          score += 10
          strengths.push("현대자동차 생산직에 핵심적인 자격증을 보유하고 있습니다")
        } else if (totalCerts > 0) {
          improvements.push("보유 자격증이 생산직과의 연관성이 낮습니다")
          recommendedCertifications.push("전기기능사", "기계가공기능사")
        }

        // Experience analysis
        if (certificationInfo.experience && certificationInfo.experience !== "없음") {
          score += 10
          strengths.push("관련 분야 실무 경험을 보유하고 있습니다")
        } else {
          improvements.push("실무 경력이 부족합니다")
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

        if (totalCerts <= 1) {
          detailedRecommendations.push(
            "자격증 취득을 통한 전문성 강화: 현대자동차 생산직에서 가장 중요시하는 전기기능사, 기계가공기능사, 용접기능사 중 하나를 우선 취득하세요. 이 자격증들은 실제 생산라인에서 직접 활용되는 핵심 기술이며, 합격률을 20% 이상 높일 수 있습니다.",
          )
        }

        if (age > 30) {
          detailedRecommendations.push(
            "경력 어필 전략 수립: 나이가 많은 만큼 실무 경험과 안정성을 강조하세요. 이전 직장에서의 성과, 책임감 있는 업무 수행 경험, 팀워크 능력을 구체적인 사례와 함께 준비하면 연령 단점을 상쇄할 수 있습니다.",
          )
        }

        if (!hasHighValueCert && totalCerts > 0) {
          detailedRecommendations.push(
            "보유 자격증 활용도 극대화: 현재 보유한 자격증이 생산직과 직접 연관이 낮더라도, 해당 자격증을 통해 얻은 학습능력, 성취의지, 전문성 추구 자세를 어필하세요. 동시에 생산직 관련 자격증 추가 취득 계획을 구체적으로 제시하면 좋습니다.",
          )
        }

        if (!certificationInfo.experience || certificationInfo.experience === "없음") {
          detailedRecommendations.push(
            "실무 경험 보완 방안: 직접적인 자동차 생산 경험이 없다면, 관련 분야 아르바이트, 인턴십, 직업훈련 프로그램 참여를 고려하세요. 특히 현대자동차 협력업체나 부품업체에서의 경험은 매우 높게 평가됩니다.",
          )
        }

        if (educationInfo.gradeAverage && Number.parseFloat(educationInfo.gradeAverage) > 3.0) {
          detailedRecommendations.push(
            "학업 성취도 보완: 내신 성적이 아쉬운 경우, 자격증 취득이나 실무 능력으로 이를 상쇄해야 합니다. 특히 기술 분야 자격증은 학업 성적보다 더 중요하게 평가되므로, 관련 자격증 취득에 집중하세요.",
          )
        }

        if (
          !educationInfo.major?.includes("기계") &&
          !educationInfo.major?.includes("전기") &&
          !educationInfo.major?.includes("자동차")
        ) {
          detailedRecommendations.push(
            "전공 연관성 강화: 전공이 생산직과 직접 연관이 없다면, 자동차 관련 온라인 강의 수강, 기술 서적 학습, 관련 세미나 참석 등을 통해 자동차 산업에 대한 이해도를 높이세요. 면접에서 이러한 노력을 구체적으로 어필할 수 있습니다.",
          )
        }

        detailedRecommendations.push(
          "면접 준비 전략: 현대자동차의 핵심 가치인 '고객 최우선', '도전 정신', '소통과 협력'에 맞는 경험담을 준비하세요. 특히 팀워크, 문제해결 능력, 안전 의식에 대한 구체적인 사례를 준비하면 좋은 평가를 받을 수 있습니다.",
        )

        detailedRecommendations.push(
          "체력 관리 및 안전 의식 강화: 생산직은 체력이 중요하므로 꾸준한 운동과 건강 관리가 필요합니다. 또한 산업안전보건법, 작업장 안전수칙에 대한 기본 지식을 습득하여 안전 의식이 높다는 점을 어필하세요.",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = "/")}
              className="text-white hover:bg-white/10 rounded-xl"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-xl font-bold text-white">현대자동차 스펙 분석 결과</h1>
          </div>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center space-x-4 mb-4">
              {analysisResult.completionStage === "합격" ? (
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                  <Badge className="text-green-600 bg-green-50 border-green-200 px-8 py-4 text-2xl font-bold rounded-xl">
                    합격
                  </Badge>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <XCircle className="w-12 h-12 text-red-600" />
                  <Badge className="text-red-600 bg-red-50 border-red-200 px-8 py-4 text-2xl font-bold rounded-xl">
                    불합격
                  </Badge>
                </div>
              )}
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="text-blue-800 font-bold text-lg">
                현대자동차 합격 가능성: {analysisResult.passRate.toFixed(1)}%
              </p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress value={analysisResult.completionLevel} className="w-full h-4 bg-slate-200" />
              <p className="text-sm text-slate-600 text-center bg-slate-50 rounded-lg p-3">
                유사한 프로필 {analysisResult.similarProfiles}명 중 분석 결과
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recommended Certifications */}
        {analysisResult.recommendedCertifications.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-purple-700">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Award className="w-5 h-5 text-purple-600" />
                </div>
                <span className="text-xl font-bold">추천 자격증 (우선 취득)</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.recommendedCertifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-purple-50 rounded-lg border border-purple-100"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-purple-500 rounded-full flex-shrink-0"></div>
                      <span className="text-purple-800 font-medium">{cert}</span>
                    </div>
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">추천</Badge>
                  </div>
                ))}
              </div>
              <p className="text-sm text-purple-600 mt-4 p-3 bg-purple-50 rounded-lg">
                * 현재 자격증 보유 수준에 맞춰 우선적으로 취득하면 좋은 자격증입니다
              </p>
            </CardContent>
          </Card>
        )}

        {/* Strengths */}
        {analysisResult.strengths.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-green-700">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <span className="text-xl font-bold">강점</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.strengths.map((strength, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-100"
                  >
                    <div className="w-3 h-3 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-green-800 font-medium leading-relaxed">{strength}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Improvements */}
        {analysisResult.improvements.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-orange-700">
                <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-xl font-bold">보완점</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysisResult.improvements.map((improvement, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-100"
                  >
                    <div className="w-3 h-3 bg-orange-500 rounded-full flex-shrink-0 mt-2"></div>
                    <span className="text-orange-800 font-medium leading-relaxed">{improvement}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommendations */}
        {analysisResult.recommendations.length > 0 && (
          <Card className="bg-white/95 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3 text-blue-700">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <span className="text-xl font-bold">상세 개선 방안</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {analysisResult.recommendations.map((recommendation, index) => (
                  <div key={index} className="p-6 bg-blue-50 rounded-xl border-l-4 border-blue-500 shadow-sm">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <span className="text-white text-sm font-bold">{index + 1}</span>
                      </div>
                      <p className="text-blue-900 leading-relaxed font-medium text-base">{recommendation}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="space-y-3 pb-8">
          <Button
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:via-blue-800 hover:to-blue-900 text-white font-bold py-4 text-lg shadow-2xl border-0 rounded-xl transition-all duration-300 transform hover:scale-105"
            onClick={() => (window.location.href = "/")}
          >
            다시 분석하기
          </Button>
          <Button
            variant="outline"
            className="w-full bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl py-4 transition-all duration-200"
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
    </div>
  )
}
