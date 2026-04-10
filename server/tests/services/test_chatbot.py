from app.services.chatbot import (
    DEFAULT_REDIRECTS,
    KEYWORD_RESPONSES,
    generate_response,
)


class TestGenerateResponse:
    def test_medication_keywords(self) -> None:
        for keyword in ("medication", "medicine", "drug", "biologic", "injection"):
            response = generate_response(f"Tell me about {keyword}")
            medication_responses = KEYWORD_RESPONSES[
                ("medication", "medicine", "drug", "biologic", "injection", "infusion")
            ]
            assert response in medication_responses

    def test_side_effects_keywords(self) -> None:
        for keyword in ("nausea", "headache", "fatigue", "rash"):
            response = generate_response(f"I have {keyword}")
            key = (
                "side effect", "reaction", "nausea", "headache",
                "fatigue", "tired", "pain", "rash",
            )
            assert response in KEYWORD_RESPONSES[key]

    def test_diet_keywords(self) -> None:
        response = generate_response("What should I eat for dinner?")
        key = ("diet", "food", "eat", "drink", "coffee", "alcohol", "nutrition", "meal")
        assert response in KEYWORD_RESPONSES[key]

    def test_flare_keywords(self) -> None:
        response = generate_response("I'm having a flare up")
        key = ("flare", "symptom", "cramp", "diarrhea", "bloating", "blood", "urgency")
        assert response in KEYWORD_RESPONSES[key]

    def test_dosage_keywords(self) -> None:
        response = generate_response("I missed my dose")
        key = ("dosage", "dose", "forget", "miss", "schedule", "late", "skip")
        assert response in KEYWORD_RESPONSES[key]

    def test_greeting_keywords(self) -> None:
        response = generate_response("Hello there!")
        key = ("hello", "hi", "hey", "morning", "evening", "good day", "howdy")
        assert response in KEYWORD_RESPONSES[key]

    def test_thanks_keywords(self) -> None:
        response = generate_response("Thank you so much!")
        key = ("thank", "thanks", "appreciate", "helpful")
        assert response in KEYWORD_RESPONSES[key]

    def test_stress_keywords(self) -> None:
        response = generate_response("I'm feeling a lot of stress")
        key = ("stress", "anxiety", "worried", "scared", "nervous", "mental")
        assert response in KEYWORD_RESPONSES[key]

    def test_off_topic_returns_redirect(self) -> None:
        response = generate_response("Tell me about quantum physics")
        assert response in DEFAULT_REDIRECTS

    def test_case_insensitive(self) -> None:
        response = generate_response("MEDICATION")
        key = ("medication", "medicine", "drug", "biologic", "injection", "infusion")
        assert response in KEYWORD_RESPONSES[key]

    def test_first_matching_group_wins(self) -> None:
        # "medication" should match before any later group
        response = generate_response("medication")
        key = ("medication", "medicine", "drug", "biologic", "injection", "infusion")
        assert response in KEYWORD_RESPONSES[key]

    def test_empty_message_returns_redirect(self) -> None:
        response = generate_response("")
        assert response in DEFAULT_REDIRECTS
