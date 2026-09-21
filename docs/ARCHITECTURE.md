# Dace Architecture

## Product layers

1. **Planning** — time blocks, tasks, categories, priorities and recurring plans.
2. **Execution** — focus sessions, pause/resume, completion, actual duration and optional distraction tracking.
3. **Learning** — feedback such as quality, difficulty and confidence.
4. **Intelligence** — predictions, schedule feasibility and personalization.
5. **Reflection** — daily/weekly analytics and prediction-vs-reality.

## Data flow

```text
User creates task
      |
      v
Planner ---------------------> SQLite
      |                            |
      v                            v
Reminder service             Session history
                                   |
                                   v
                              Feature builder
                                   |
                    +--------------+--------------+
                    |                             |
                    v                             v
             Duration model               Completion model
                    |                             |
                    +--------------+--------------+
                                   |
                                   v
                           Smart planner
                                   |
                                   v
                             Next schedule
```

## ML strategy

Do not train a deep neural network just because this is an ML project. The initial problem is tabular and personal, so tree-based models are a better starting point.

### Target 1: duration prediction

Predict actual minutes required for a task/session.

Initial candidates:
- Baseline: historical median
- Random Forest
- Gradient boosting / XGBoost

### Target 2: completion probability

Binary classification: whether a planned task is completed within its scheduled block or accepted reschedule window.

### Target 3: productivity score

A derived score from completion, focus ratio, schedule adherence and optional quality feedback. It should be treated as a product metric first and only later as an ML target if enough labeled data exists.

## Personalization

Every prediction stores its model version and prediction timestamp. When actual results become available, the app can calculate error:

`absolute_error = abs(actual_minutes - predicted_minutes)`

The system should report calibration and error over time rather than claiming that a model is accurate without evidence.

## Privacy

Productivity history is sensitive personal data. The MVP should work offline. Any cloud sync or desktop activity tracking must be explicit, optional and transparent.
