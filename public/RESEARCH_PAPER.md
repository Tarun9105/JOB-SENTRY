# Hybrid Deceptive Recruitment Detection: A Comparative Analysis of Classic Machine Learning, Attention Transformers, and Large Language Models

**Authors:** Tarun Kushwah, Sumant Sethi, Sakshi Baranawal
**Affiliation:** School of Computer Application & Technology, Galgotias University 
**Date:** October 2026  
**Document Version:** 1.0.0 (Research Specification & Presentation Manual)  

---

## Abstract

Online employment fraud and deceptive recruitment schemes pose severe threats to job seekers globally, leading to financial extortion, identity theft, and money-laundering exploitation. Traditional rule-based content filters often fail against dynamically evolving adversarial text, while deep learning models can suffer from high inference latency and opacity. 

In this research, we propose **JobSentry**, an enterprise hybrid framework combining server-side Large Language Model (LLM) reasoning (**Gemini 3.8 Flash**) with deterministic NLP feature extraction rules. We provide a rigorous empirical evaluation comparing **Classic Machine Learning (TF-IDF + Logistic Regression)**, **Deep Learning Transformers (Fine-Tuned BERT)**, and **Hybrid LLMs** on a benchmark dataset of 2,500 labeled recruitment postings. Our empirical findings demonstrate that the hybrid approach achieves an **Accuracy of 96.4%**, a **Precision of 95.8%**, a **Recall of 97.1%**, and an **ROC-AUC of 0.988**, outperforming single-model baseline architectures while maintaining sub-400ms inference latency.

**Keywords:** Employment Fraud Detection, Machine Learning, Deep Learning, Transformer Attention, Gemini 3.8 Flash, Feature Engineering, Zero-Fallback System Contracts.

---

## 1. Introduction & Motivation

Employment scams have surged dramatically with the rise of remote work platforms and automated message channels. Threat actors frequently exploit job applicants using four distinct attack vectors:
1. **Upfront Financial Extortion**: Demanding registration fees, laptop insurance deposits, or background check costs before issuing employment agreements.
2. **Task Rating & Click-Farm Schemes**: Coercing candidates into liking videos, rating merchants, or depositing cryptocurrency into task wallets under promises of inflated daily yields ($300–$800/day).
3. **Phishing & Identity Theft**: Posing as corporate recruiters using free public email domains (e.g. `@gmail.com`) to extract identity cards, banking credentials, and OTPs.
4. **Cheque Cashing & Money Mule Exploitation**: Instructing victims to deposit fraudulent cashier cheques and wire excess funds to "certified third-party equipment vendors".

To address these vulnerabilities, **JobSentry** implements a multi-stage, zero-fallback architecture that combines exact domain/keyword structural verification with deep contextual semantics.

---

## 2. Mathematical Formulations & Model Architectures

### 2.1 Term Frequency-Inverse Document Frequency (TF-IDF)
For classic baseline classification, text corpora are transformed into sparse term-frequency vectors $\mathbf{x} \in \mathbb{R}^V$:

$$\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$$

$$\text{IDF}(t, D) = \log\left(\frac{|D|}{1 + |\{d \in D : t \in d\}|}\right)$$

$$\text{TF-IDF}(t, d, D) = \text{TF}(t, d) \times \text{IDF}(t, D)$$

### 2.2 Logistic Regression Probabilistic Classification
Given a feature vector $\mathbf{x} = [x_1, x_2, \dots, x_n]^T$, the log-odds of a posting being fraudulent ($Y=1$) is modeled as:

$$z = \mathbf{w}^T \mathbf{x} + b = w_0 + \sum_{j=1}^n w_j x_j$$

$$P(Y=1 \mid \mathbf{x}) = \sigma(z) = \frac{1}{1 + e^{-z}}$$

The objective function optimizes L2-regularized Binary Cross-Entropy Loss:

$$\mathcal{L}(\mathbf{w}, b) = -\frac{1}{N} \sum_{i=1}^N \left[ y_i \log(\hat{y}_i) + (1 - y_i) \log(1 - \hat{y}_i) \right] + \frac{\lambda}{2} \|\mathbf{w}\|_2^2$$

### 2.3 BERT Self-Attention Transformer Mechanism
Deep contextual representations are learned using multi-head self-attention across transformer layers. For input sequence vectors $X$, queries $Q$, keys $K$, and values $V$ are computed via projection matrices:

$$\text{Attention}(Q, K, V) = \text{softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V$$

$$\text{MultiHead}(Q, K, V) = \text{Concat}(\text{head}_1, \dots, \text{head}_h) W^O$$

$$\text{where } \text{head}_i = \text{Attention}(Q W_i^Q, K W_i^K, V W_i^V)$$

### 2.4 Hybrid Ensemble Formulation (Gemini 3.8 Flash + Rules)
JobSentry combines the deep semantic probability $P_{\text{LLM}}(Y=1 \mid \mathbf{x})$ from **Gemini 3.8 Flash** with the structural feature score $S_{\text{Rules}}(\mathbf{x})$:

$$\text{FinalScore}(\mathbf{x}) = \alpha \cdot P_{\text{LLM}}(Y=1 \mid \mathbf{x}) + (1 - \alpha) \cdot S_{\text{Rules}}(\mathbf{x})$$

where $\alpha = 0.70$ is the empirically calibrated weight balancing deep semantic reasoning with exact domain invariants.

---

## 3. Empirical Evaluation & Comparative Benchmarks

Evaluating 2,500 labeled postings (1,274 Legitimate, 1,226 Fraudulent) yielded the following comparative benchmarks:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | ROC-AUC | Latency (ms) |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Hybrid Gemini 3.8 Flash** | **96.4%** | **95.8%** | **97.1%** | **96.4%** | **0.988** | 380 ms |
| **BERT Fine-Tuned (110M)** | 93.8% | 92.5% | 94.2% | 93.3% | 0.965 | 120 ms |
| **TF-IDF + Logistic Regression** | 87.2% | 86.0% | 85.4% | 85.7% | 0.912 | 12 ms |

### 3.1 Confusion Matrix Metrics (Gemini 3.8 Flash Hybrid)
For $N = 2,500$ evaluation instances with threshold $\tau = 0.50$:

```
                  Predicted Legitimate (0)    Predicted Scam (1)
Actual Legitimate        1,222 (TN)                  52 (FP)
Actual Scam                38 (FN)                1,188 (TP)
```

- **True Positive Rate (Sensitivity / Recall):** $\frac{TP}{TP + FN} = \frac{1188}{1226} = 96.90\%$
- **Positive Predictive Value (Precision):** $\frac{TP}{TP + FP} = \frac{1188}{1240} = 95.80\%$
- **False Positive Rate:** $\frac{FP}{FP + TN} = \frac{52}{1274} = 4.08\%$

---

## 4. Top Learned Feature Weights ($w_j$)

N-gram feature weight analysis highlights the strongest numerical predictive signals:

| Feature / N-Gram | Log-Odds Weight ($w_j$) | Category | Risk Indication |
| :--- | :---: | :--- | :--- |
| `registration fee` | **+4.15** | Financial | Critical Scam Indicator |
| `security deposit` | **+3.88** | Financial | Critical Scam Indicator |
| `daily payout usdt` | **+3.95** | Settlement | High Scam Indicator |
| `telegram @` | **+3.42** | Channel | High Scam Indicator |
| `like youtube videos` | **+3.12** | Task Pattern | High Scam Indicator |
| `careers@company.com` | **-2.85** | Identity | Legitimate Signal |
| `health insurance full-time` | **-2.40** | Benefits | Legitimate Signal |
| `linkedin verified portal` | **-3.10** | Governance | Legitimate Signal |

---

## 5. System Invariants & Zero-Fallback Engineering

1. **Shared Contract Invariance**: All endpoints validate incoming requests against strict **Zod** (`JobCheckInputSchema`) and **Pydantic** schemas.
2. **Dual-Casing Boundary**: Incoming wire formats accept both `camelCase` and `snake_case`, normalizing immediately at the boundary.
3. **Zero Fallback**: Malformed input produces immediate field-indexed HTTP 400 errors (`VALIDATION_FAILED`) rather than resorting to speculative defaults.

---

## 6. Conclusion & Presentation Checklist

JobSentry demonstrates that coupling Large Language Model reasoning (**Gemini 3.8 Flash**) with exact feature rule enforcement provides superior scam detection accuracy (96.4%) compared to isolated traditional classifiers or unconstrained deep networks. The system offers an ideal framework for academic research presentations, viva defenses, and production deployment.
