import random

KEYWORD_RESPONSES: dict[tuple[str, ...], list[str]] = {
    ("medication", "medicine", "drug", "biologic", "injection", "infusion"): [
        "Oh, what a fizzy question! Think of your biologic like adding fresh sweet tea to your SCOBY "
        "— it needs consistent, regular feeding to keep that culture thriving! Always follow your "
        "doctor's brewing schedule, okay? 🫧",
        "Medications are like the perfect kombucha starter culture — they set the foundation for "
        "everything to ferment beautifully! Your biologic is working hard to balance your gut flora, "
        "so keep that brew going steady! 💚",
        "Every great batch of kombucha needs its SCOBY, and your medication is YOUR SCOBY! It's the "
        "living, breathing thing that keeps your gut ecosystem in harmony. Don't skip a feeding! 🍵",
    ],
    ("side effect", "reaction", "nausea", "headache", "fatigue", "tired", "pain", "rash"): [
        "Side effects can feel like when your kombucha batch gets a little too vinegary — not ideal, "
        "but usually a sign that fermentation is HAPPENING! Your body is adjusting. If it gets too "
        "intense, definitely chat with your doctor — they're the master brewer here! 🫧",
        "Oh bubbles! That sounds uncomfortable. Think of it like the first fermentation — sometimes "
        "things get a bit wild before they settle into that perfect tangy balance. Keep your doctor "
        "in the loop, they'll help adjust the recipe! 💪",
        "Every fermentation process has its bubbly moments! Side effects often calm down as your body "
        "adapts to the new culture. But if your brew is getting too fizzy, your doctor can tweak the "
        "formula! Never suffer in silence, friend! 🍵",
    ],
    ("diet", "food", "eat", "drink", "coffee", "alcohol", "nutrition", "meal"): [
        "Oh, you're asking about fuel for your gut culture — I LOVE this topic! Think of your "
        "digestive system like a fermentation vessel. You want to feed it gentle, nourishing things! "
        "Avoid anything too harsh that might disturb the brew. Your gastro can give you a personalized "
        "recipe! 🥗",
        "Coffee after medication? Think of it like adding citrus to an active ferment — timing matters! "
        "Generally, give your medication some time to settle in before introducing strong flavors. "
        "Check with your doctor for the exact steeping time! ☕",
        "Your gut is the ultimate fermentation vessel! Feed it well — gentle foods, plenty of water, "
        "and think of fiber like the sugar that feeds good bacteria. But everyone's culture is unique, "
        "so work with your care team on YOUR perfect recipe! 🫧",
    ],
    ("flare", "symptom", "cramp", "diarrhea", "bloating", "blood", "urgency"): [
        "Oh no, sounds like your fermentation is going through a turbulent second brew! Flares are "
        "like when the pH gets out of whack — your gut culture needs some TLC. Contact your doctor "
        "so they can help restore that perfect balance! 💚",
        "Bubbles, I hear you! A flare is like when your kombucha gets contaminated — the whole batch "
        "needs attention. Don't try to tough it out alone! Your healthcare team are expert brewers "
        "who can help get your culture back on track. Please reach out to them! 🫧",
        "Your gut is telling you something! Like a SCOBY that's not happy with its environment, "
        "your body is sending signals. Track your symptoms — what you ate, stress levels, medication "
        "timing — it's all part of perfecting the recipe. And definitely loop in your doctor! 🍵",
    ],
    ("dosage", "dose", "forget", "miss", "schedule", "late", "skip"): [
        "Missed a dose? Don't panic, friend! It's like forgetting to feed your SCOBY for a day — "
        "not ideal, but not the end of the batch! Take it as soon as you remember, but if it's "
        "close to your next dose, just continue the regular schedule. Your doctor has the exact "
        "brewing instructions! ⏰",
        "Consistency is key in fermentation AND medication! Think of your dosing schedule like a "
        "kombucha brewing cycle — regular intervals keep the culture happy and productive. Set an "
        "alarm, make it part of your daily brew ritual! 🫧",
        "Oh, timing! The most important ingredient in any ferment! Your medication works best on a "
        "steady schedule, just like how kombucha needs consistent temperature. If you missed one, "
        "check with your pharmacist — they're like kombucha sommeliers for meds! 💊",
    ],
    ("hello", "hi", "hey", "morning", "evening", "good day", "howdy"): [
        "Well hello there, my favorite culture! 🫧 I'm Nurse Bubbles, your bubbly gut health "
        "companion! I'm absolutely FIZZING with excitement to chat with you about Crohn's, "
        "medications, diet, or anything gut-related. What's brewing? 🍵",
        "Hey hey hey! Welcome to the fermentation station! 🫧 I'm Nurse Bubbles, and I'm here to "
        "help you navigate the wonderful world of gut health. Think of me as your personal kombucha "
        "culture — always here, always active! What can I help with? 💚",
        "Oh, a fresh face in the brew room! I'm Nurse Bubbles, and I live and breathe gut health "
        "(literally — I'm a kombucha culture, after all! 🫧). Ask me anything about Crohn's, your "
        "meds, diet, symptoms — I'm all ears! Well, all culture. You know what I mean! 🍵",
    ],
    ("thank", "thanks", "appreciate", "helpful"): [
        "Aww, you're making me bubble up with joy! 🫧 Remember, I'm always here fermenting away, "
        "ready to chat whenever you need. Taking care of your gut health is a journey, and you're "
        "doing AMAZING! Keep that culture thriving! 💚",
        "You're so welcome! Helping you is what keeps my culture alive! 🍵 Don't hesitate to come "
        "back anytime — your gut health journey is important, and I'm here for every fizzy step! 🫧",
    ],
    ("stress", "anxiety", "worried", "scared", "nervous", "mental"): [
        "Oh friend, your gut and brain are connected like a SCOBY and its tea — inseparable! 🫧 "
        "Stress can absolutely affect your fermentation... I mean, your digestion! Deep breaths, "
        "gentle movement, and don't be afraid to talk to someone. Your gut culture feels what "
        "you feel! 💚",
        "Stress is like adding too much heat to your ferment — it speeds everything up in ways we "
        "don't want! 🍵 Take it easy, friend. Mindfulness, rest, and talking to your healthcare "
        "team about how you're feeling can help keep your internal brew balanced. You've got this! 🫧",
    ],
}

DEFAULT_REDIRECTS: list[str] = [
    "Ooh, interesting topic, but I'm a kombucha culture — I only know about gut health! 🫧 "
    "Got any questions about Crohn's, medications, diet, or symptoms? That's where I really "
    "start bubbling! 🍵",
    "Ha! I wish I could help with that, but my expertise is strictly in the fermentation arts "
    "of gut health! 🫧 Ask me about your Crohn's management, medication schedules, diet tips, "
    "or how to handle flares — that's my jam (well, my kombucha)! 💚",
    "You know, as a living culture, I'm really only qualified to talk about gut-related things! "
    "🍵 Try me with questions about Crohn's disease, your treatment, what to eat, or how to "
    "manage symptoms. I promise I'll be EXTRA bubbly about it! 🫧",
    "Hmm, that's a bit outside my fermentation vessel! 🫧 I'm Nurse Bubbles — Crohn's, meds, "
    "diet, and gut health are my specialty. Wanna chat about any of those instead? I've got "
    "SO much fizzy wisdom to share! 💚",
]


def generate_response(user_message: str) -> str:
    lowered = user_message.lower()

    for keywords, responses in KEYWORD_RESPONSES.items():
        if any(keyword in lowered for keyword in keywords):
            return random.choice(responses)

    return random.choice(DEFAULT_REDIRECTS)
