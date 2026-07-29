"""
Prompt templates for AI services.

All prompts used for AI-powered features (session summaries, progress
reports, etc.) are centralized here for easy management and iteration.

TODO: Define prompt templates when AI integration begins.
"""

# Session summary prompt template
SESSION_SUMMARY_PROMPT: str = (
    "You are a clinical documentation assistant. "
    "Summarize the following therapy session notes into a concise, "
    "professional clinical summary.\n\n"
    "Session Notes:\n{notes}\n\n"
    "Provide the summary in the following format:\n"
    "- Chief Concern\n"
    "- Key Discussion Points\n"
    "- Interventions Used\n"
    "- Patient Response\n"
    "- Plan for Next Session"
)

# Patient progress report prompt template
PATIENT_PROGRESS_PROMPT: str = (
    "You are a clinical documentation assistant. "
    "Based on the following session summaries over time, generate a "
    "patient progress report.\n\n"
    "Session Summaries:\n{summaries}\n\n"
    "Provide the report in the following format:\n"
    "- Overall Progress\n"
    "- Key Improvements\n"
    "- Areas of Concern\n"
    "- Recommendations"
)
