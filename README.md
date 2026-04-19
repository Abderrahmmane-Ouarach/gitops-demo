# k8s-gitops-pipeline

A production-grade GitOps pipeline built with **Node.js/Express**, containerized with **Docker**, deployed on **Kubernetes** via **Helm**, and continuously synced using **ArgoCD** — with a full **GitHub Actions** CI/CD pipeline featuring automated testing, static analysis, and vulnerability scanning.

<img width="1525" height="908" alt="visa" src="https://github.com/user-attachments/assets/38b6aac6-8abd-4b88-9443-a56667486aed" />

---

## 📐 Architecture Overview

```
Code Push (GitHub)
        │
        ▼
┌──────────────────────────────────────────┐
│           GitHub Actions CI              │
│                                          │
│  test → sonarqube ──┐                    │
│         scan-code ──┴─→ build (Docker)   │
│                           │              │
│                      scan-image          │
│                           │              │
│              ┌────────────┴────────────┐ │
│         staging branch             main │ │
│       update-staging        update-prod │ │
└──────────────────────────────────────────┘
        │                        │
        ▼                        ▼
  helm/values.staging.yaml   helm/values.production.yaml
        │                        │
        └────────────┬───────────┘
                     ▼
              ArgoCD (GitOps Sync)
                     │
                     ▼
           Kubernetes Cluster
           └── Helm Release → Pod (port 3000)
```

---

## 🖼️ Screenshots

### CI/CD Pipeline — GitHub Actions
<!-- Screenshot: GitHub Actions workflow run showing all jobs (test, sonarqube, scan-code, build, scan-image, update-production) -->
<img width="1504" height="463" alt="actions pass in prod" src="https://github.com/user-attachments/assets/e205c250-1480-4a6d-a0ad-ce664f799cd7" />

### ArgoCD Sync — Staging & Production
<!-- Screenshot: ArgoCD UI showing both apps in Synced/Healthy state -->
<img width="1076" height="689" alt="apps healthy in argocd" src="https://github.com/user-attachments/assets/65c96380-9317-4bd7-abc9-2733b376cc11" />

### Docker Hub — Published Images
<!-- Screenshot: Docker Hub repo showing gitops-demo images with latest + SHA tags -->
<img width="953" height="798" alt="dockergub" src="https://github.com/user-attachments/assets/4450cf93-38aa-4cb8-b428-6b41ef412e4f" />

### Grafana dashboard
<img width="1588" height="926" alt="grafana" src="https://github.com/user-attachments/assets/83cbda85-57f4-40f0-858e-074d502a0f4b" />


---

## 🗂️ Project Structure

```
gitops-demo/
├── .github/workflows/       ← CI pipeline (GitHub Actions)
├── argocd/                  ← ArgoCD Application manifest (CD)
├── helm/                    ← Helm chart for Kubernetes deployment
├── .dockerignore
├── .gitignore
├── Dockerfile
├── app.js                   ← Express app (not fetchable but inferable)
├── app.test.js              ← Jest tests
├── package.json
└── package-lock.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker
- kubectl + a Kubernetes cluster
- Helm 3
- ArgoCD installed on the cluster

### Run Locally

```bash
git clone https://github.com/Abderrahmmane-Ouarach/gitops-demo.git
cd gitops-demo
npm install
npm start
# → http://localhost:3000
```

### Run Tests

```bash
npm test
```

---

## 🐳 Docker

```bash
# Build
docker build -t k8s-gitops-pipeline .

# Run
docker run -p 3000:3000 k8s-gitops-pipeline
```

The image is published to **Docker Hub** on every push to `main` or `staging`, tagged with both `:latest` and the commit SHA for full traceability.

---

## ☸️ Kubernetes Deployment (Helm)

```bash
# Staging
helm install gitops-demo ./helm -f helm/values.staging.yaml

# Production
helm install gitops-demo ./helm -f helm/values.production.yaml

# Upgrade
helm upgrade gitops-demo ./helm -f helm/values.production.yaml
```

---

## 🔄 GitOps with ArgoCD

ArgoCD watches this repository and automatically reconciles the cluster state whenever the Helm values files are updated by the CI pipeline.

```bash
# Apply ArgoCD Application manifests
kubectl apply -f argocd/

# Check sync status
argocd app get gitops-demo
```

---

## ⚙️ CI/CD Pipeline

The pipeline triggers on every push to `main` and `staging` branches (Helm values files are excluded to prevent infinite loop commits).

| Job | Trigger | Description |
|---|---|---|
| `test` | always | Node.js 20, `npm test` (Jest + Supertest) |
| `sonarqube` | after test | SonarCloud static code analysis |
| `scan-code` | after test | Trivy filesystem scan (CRITICAL + HIGH) |
| `build` | after sonar + scan | Docker build & push to Docker Hub (`:latest` + `:<sha>`) |
| `scan-image` | after build | Trivy image scan (CRITICAL only) |
| `update-staging` | `staging` branch | Commits new SHA to `helm/values.staging.yaml` |
| `update-production` | `main` branch | Commits new SHA to `helm/values.production.yaml` |

> The image tag update is committed back to the repo by `github-actions[bot]`, which triggers ArgoCD to sync automatically.

---

## 🔒 Security

- **SonarCloud** — static analysis for code smells, bugs, and security hotspots
- **Trivy (filesystem)** — scans dependencies before build, blocks on CRITICAL/HIGH
- **Trivy (image)** — scans the published Docker image, blocks on CRITICAL
- Pipeline fails fast: no image is pushed if any security gate fails

---

## 📊 Observability

Prometheus metrics exposed via `prom-client`:

| Endpoint | Description |
|---|---|
| `GET /` | Main application endpoint |
| `GET /metrics` | Prometheus metrics scrape endpoint |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Application | Node.js 20, Express |
| Testing | Jest, Supertest |
| Code Quality | SonarCloud |
| Security Scanning | Trivy (Aqua Security) |
| Containerization | Docker (node:alpine) |
| Registry | Docker Hub |
| Packaging | Helm 3 |
| GitOps | ArgoCD |
| CI/CD | GitHub Actions |
| Observability | Prometheus (prom-client) |

---

## 🔑 Required Secrets

| Secret | Description |
|---|---|
| `DOCKERHUB_USERNAME` | Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub access token |
| `SONAR_TOKEN` | SonarCloud authentication token |
| `GH_PAT` | GitHub Personal Access Token (for committing Helm tag updates) |

---

## 📄 License

ISC
