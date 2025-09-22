import pandas as pd
import numpy as np
from urllib.request import urlopen
import json

# Load the CSV data
csv_url = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/%5B%E1%84%83%E1%85%B5%E1%84%86%E1%85%A2%E1%86%AB%E1%84%83%E1%85%B3%5D%202025%E1%84%82%E1%85%A7%E1%86%AB%20%E1%84%92%E1%85%A1%E1%84%87%E1%85%A1%E1%86%AB%E1%84%80%E1%85%B5%20%E1%84%92%E1%85%A7%E1%86%AB%E1%84%83%E1%85%A2%E1%84%8C%E1%85%A1%E1%84%83%E1%85%A9%E1%86%BC%E1%84%8E%E1%85%A1%20%E1%84%80%E1%85%B5%E1%84%89%E1%85%AE%E1%86%AF%E1%84%8B%E1%85%B5%E1%86%AB%E1%84%85%E1%85%A7%E1%86%A8%20%E1%84%8E%E1%85%A2%E1%84%8B%E1%85%AD%E1%86%BC%20%E1%84%92%E1%85%A1%E1%86%B8%E1%84%87%E1%85%AE%E1%86%AF%E1%84%8C%E1%85%A9%E1%84%89%E1%85%A1%20-%20%E1%84%89%E1%85%B5%E1%84%90%E1%85%B31-QsjSlUC2QsaRpjHvGFlPAk2X3CdEGr.csv"

try:
    df = pd.read_csv(csv_url)
    print("CSV 데이터 로드 성공!")
    print(f"총 {len(df)}개의 데이터")
    
    # 합격/불합격 분포 확인
    result_column = "2025년 하반기 현대자동차 기술인력 채용' 서류 전형에 합격하셨나요?"
    if result_column in df.columns:
        result_counts = df[result_column].value_counts()
        print("\n합격/불합격 분포:")
        print(result_counts)
        
        # 합격자와 불합격자 데이터 분리
        passed = df[df[result_column] == '합격']
        failed = df[df[result_column] == '불합격']
        
        print(f"\n합격자: {len(passed)}명")
        print(f"불합격자: {len(failed)}명")
        
        # 학력별 합격률 분석
        if '최종학력' in df.columns:
            education_analysis = df.groupby('최종학력')[result_column].value_counts(normalize=True).unstack(fill_value=0)
            print("\n학력별 합격률:")
            print(education_analysis)
        
        # 나이별 합격률 분석
        if '나이' in df.columns:
            df['나이'] = pd.to_numeric(df['나이'], errors='coerce')
            age_groups = pd.cut(df['나이'], bins=[0, 25, 30, 35, 100], labels=['25세 이하', '26-30세', '31-35세', '36세 이상'])
            age_analysis = df.groupby(age_groups)[result_column].value_counts(normalize=True).unstack(fill_value=0)
            print("\n나이별 합격률:")
            print(age_analysis)
        
        # 내신/학점 분석
        if '내신 등급은 어떻게 되시나요?' in df.columns:
            grade_data = df['내신 등급은 어떻게 되시나요?'].dropna()
            grade_data = pd.to_numeric(grade_data, errors='coerce')
            passed_grades = df[df[result_column] == '합격']['내신 등급은 어떻게 되시나요?']
            passed_grades = pd.to_numeric(passed_grades, errors='coerce').dropna()
            
            if len(passed_grades) > 0:
                print(f"\n합격자 평균 내신: {passed_grades.mean():.2f}")
                print(f"합격자 내신 중앙값: {passed_grades.median():.2f}")
        
        if '평균 학점은 어떻게 되시나요?' in df.columns:
            gpa_data = df['평균 학점은 어떻게 되시나요?'].dropna()
            gpa_data = pd.to_numeric(gpa_data, errors='coerce')
            passed_gpa = df[df[result_column] == '합격']['평균 학점은 어떻게 되시나요?']
            passed_gpa = pd.to_numeric(passed_gpa, errors='coerce').dropna()
            
            if len(passed_gpa) > 0:
                print(f"\n합격자 평균 학점: {passed_gpa.mean():.2f}")
                print(f"합격자 학점 중앙값: {passed_gpa.median():.2f}")
        
        # 자격증 분석
        cert_columns = [
            '보유하신 기능사 자격증이 있으신가요?',
            '보유하신 산업기사 자격증이 있으신가요?',
            '보유중인 기사 자격증이 있으신가요?',
            '보유하신 기능장 자격증이 있으신가요?',
            '보유하신 기술사 자격증이 있으신가요?'
        ]
        
        print("\n자격증 보유 현황 (합격자):")
        for col in cert_columns:
            if col in df.columns:
                passed_certs = passed[col].dropna()
                has_cert = passed_certs[passed_certs != '없음'].count()
                total_passed = len(passed)
                if total_passed > 0:
                    cert_rate = (has_cert / total_passed) * 100
                    print(f"{col.replace('보유하신 ', '').replace('보유중인 ', '').replace(' 자격증이 있으신가요?', '')}: {cert_rate:.1f}%")
        
        # 분석 결과를 JSON으로 저장
        analysis_result = {
            "total_applicants": len(df),
            "passed_count": len(passed),
            "failed_count": len(failed),
            "pass_rate": len(passed) / len(df) * 100 if len(df) > 0 else 0,
            "education_analysis": education_analysis.to_dict() if '최종학력' in df.columns else {},
            "age_analysis": age_analysis.to_dict() if '나이' in df.columns else {},
            "passed_avg_grade": passed_grades.mean() if len(passed_grades) > 0 else None,
            "passed_avg_gpa": passed_gpa.mean() if len(passed_gpa) > 0 else None,
        }
        
        print("\n분석 완료!")
        print(json.dumps(analysis_result, indent=2, ensure_ascii=False))
        
    else:
        print("합격/불합격 컬럼을 찾을 수 없습니다.")
        print("사용 가능한 컬럼:", df.columns.tolist())

except Exception as e:
    print(f"데이터 분석 중 오류 발생: {e}")
