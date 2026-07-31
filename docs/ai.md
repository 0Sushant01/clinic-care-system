# OpenRouter AI Summary Architecture

## Overview

The AI Summary module synthesizes completed clinical session notes using OpenRouter API (`qwen/qwen3-235b-a22b:free`).

## Zero-Session Business Rule
- If `completed_sessions == 0`, `ReportAISummaryView` returns `has_data: false`.
- The frontend renders `EmptyState` ("No Completed Sessions Yet") and disables AI summary generation until clinical notes are recorded.

## Clinical Note Summarization
- When `completed_sessions > 0`, `ReportAISummaryView` extracts actual text fields (`chief_complaint`, `treatment_performed`, `patient_response`, `recommendations`) from database records and passes them to `OpenRouterProvider`.
