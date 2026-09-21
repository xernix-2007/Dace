# Dace

A personal productivity system that learns how you work.

## Vision

Dace is not just a to-do list. It combines:

- Time-blocked daily planning
- Local task and focus tracking
- Reminders and notifications
- Personal productivity analytics
- ML-based task-duration and completion prediction
- Smart schedule optimization
- Long-term personalization from your real work history

## Architecture

```text
Flutter Client
    |
    +---- Local SQLite
    |       +---- Tasks
    |       +---- Sessions
    |       +---- Daily stats
    |       +---- Settings
    |
    +---- Notification Service
    |
    +---- FastAPI backend (later)
              |
              +---- PostgreSQL (later)
              |
              +---- ML prediction service
                       |
                       +---- Duration model
                       +---- Completion model
                       +---- Productivity model
```

## Development phases

### Phase 1 — Working offline MVP
- Flutter shell
- Today timeline
- Task CRUD
- Local persistence
- Focus timer
- Local reminders

### Phase 2 — Behavioral data
- Planned vs actual duration
- Focus sessions
- Completion and quality signals
- Daily analytics

### Phase 3 — ML baseline
- Synthetic bootstrap dataset
- Feature engineering
- XGBoost baseline models
- Train/validation/test split
- Metrics and model versioning

### Phase 4 — Personalization
- Incremental personal dataset
- Personal duration prediction
- Completion probability
- Peak-hour analysis
- Prediction-vs-reality dashboard

### Phase 5 — Smart planning
- Schedule feasibility scoring
- "I'm behind" recovery
- Automatic rescheduling
- Completion-time estimation

### Phase 6 — Sync and intelligence
- Auth
- Cloud sync
- Cross-device data
- AI daily coach

## ML principle

Generic data is only a bootstrap. The long-term goal is a model that performs well on **your own historical behavior**. Every completed work session becomes labeled training data after enough observations exist.

## Repository structure

```text
app/                 Flutter application
backend/             FastAPI service
ml/                  Training and inference pipeline
data/                Dataset definitions and generated data
models/              Local model artifacts (ignored from Git)
docs/                Architecture and product notes
tests/               Cross-component tests
```

## Status

Foundation created. Next step: initialize the Flutter app and create the first dark/blue Today timeline.
