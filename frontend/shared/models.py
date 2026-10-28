"""
JobSentry Enterprise Shared Models (Python / Pydantic)
Single Source of Truth for ML and Python Microservices
"""

from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, EmailStr, field_validator


class AppStage(str, Enum):
    STAGING = "staging"
    PRODUCTION = "production"


class RiskLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"


class RiskSeverity(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class JobCheckInput(BaseModel):
    """
    Ingress schema accepting both camelCase and snake_case.
    """
    job_text: Optional[str] = Field(None, min_length=10, alias="jobText")
    job_text_alt: Optional[str] = Field(None, min_length=10, alias="job_text")
    email: Optional[EmailStr] = None
    company: Optional[str] = Field(None, max_length=120)
    salary: Optional[str] = None
    stage: AppStage = AppStage.PRODUCTION

    @property
    def canonical_job_text(self) -> str:
        text = self.job_text or self.job_text_alt
        if not text or len(text.strip()) < 10:
            raise ValueError("job_text must be provided and contain at least 10 characters")
        return text.strip()

    class Config:
        populate_by_name = True


class RiskFactorDetail(BaseModel):
    id: str
    severity: RiskSeverity
    category: str
    description: str


class JobCheckOutput(BaseModel):
    """
    Egress schema providing both camelCase and snake_case fields.
    """
    risk_level: RiskLevel = Field(..., alias="riskLevel")
    risk_level_wire: RiskLevel = Field(..., alias="risk_level")
    score: float = Field(..., ge=0.0, le=1.0)
    red_flags: List[str] = Field(..., alias="redFlags")
    red_flags_wire: List[str] = Field(..., alias="red_flags")
    advice: List[str]
    factors: Optional[List[RiskFactorDetail]] = None
    stage: AppStage
    evaluated_at: str = Field(..., alias="evaluatedAt")

    class Config:
        populate_by_name = True


class JobAuditRecord(BaseModel):
    id: str
    job_text: str
    email: Optional[str] = None
    company: Optional[str] = None
    salary: Optional[str] = None
    risk_level: RiskLevel
    score: float
    red_flags: List[str]
    advice: List[str]
    stage: AppStage
    created_at: str
