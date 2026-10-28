"""
JobSentry ML Service Microservice
Uses local ml_service/shared/models.py (synchronized from root /shared)
"""

import sys
import os
from datetime import datetime

# Add the local directory to sys.path to import local shared models
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from shared.models import JobCheckInput, JobCheckOutput, RiskLevel, RiskFactorDetail


def predict_job_risk(payload: JobCheckInput) -> JobCheckOutput:
    """
    ML Service Risk Inference Engine
    Consumes validated JobCheckInput and produces JobCheckOutput.
    """
    text = payload.canonical_job_text.lower()
    red_flags = []
    advice = []
    factors = []
    score = 0.12

    # Model inference simulation with rule features
    if "telegram" in text or "whatsapp" in text:
        red_flags.append("Communication isolated to unverified messaging channels")
        advice.append("Never participate in recruitment conducted exclusively via chat apps")
        factors.append(
            RiskFactorDetail(
                id="ML_CHAT_ISOLATION",
                severity="high",
                category="Channel",
                description="Detected private chat solicitation",
            )
        )
        score += 0.35

    if "fee" in text or "deposit" in text:
        red_flags.append("Mentions monetary fee or equipment security deposit")
        advice.append("Legitimate companies provide work equipment without upfront fees")
        factors.append(
            RiskFactorDetail(
                id="ML_FEE_SOLICITATION",
                severity="critical",
                category="Financial",
                description="Detected upfront fee keywords in description",
            )
        )
        score += 0.45

    score = min(0.98, max(0.08, round(score, 2)))
    risk_level = RiskLevel.HIGH if score >= 0.65 else (RiskLevel.MEDIUM if score >= 0.35 else RiskLevel.LOW)

    if not red_flags:
        red_flags.append("No primary scam triggers detected by ML inference")
        advice.append("Verify recruiter credentials on official corporate directories")

    evaluated_at = datetime.utcnow().isoformat() + "Z"

    return JobCheckOutput(
        riskLevel=risk_level,
        risk_level=risk_level,
        score=score,
        redFlags=red_flags,
        red_flags=red_flags,
        advice=list(set(advice)),
        factors=factors if payload.stage.value == "staging" else None,
        stage=payload.stage,
        evaluatedAt=evaluated_at,
    )


if __name__ == "__main__":
    print("[ml_service] Running self-test with sample job posting...")
    sample_input = JobCheckInput(
        job_text="Immediate hiring on Telegram @DirectHR. Laptop provided upon $150 deposit.",
        email="hr.agent@gmail.com",
        company="Global Logistics",
        salary="95000",
    )
    result = predict_job_risk(sample_input)
    print(f"[ml_service] Inferred Risk: {result.risk_level.value} (Score: {result.score})")
    print(f"[ml_service] Flags: {result.red_flags}")
