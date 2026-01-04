"""
Thalassemia-specific training data for ChatterBot
This module contains conversation pairs for training the chatbot
"""

# Import general conversational data
from conversational_data import CONVERSATIONAL_GENERAL

# Basic Thalassemia Knowledge
BASIC_KNOWLEDGE = [
    {
        "question": "What is thalassemia?",
        "answer": "Thalassemia is a genetic blood disorder where your body doesn't produce enough hemoglobin, the protein in red blood cells that carries oxygen throughout your body. It's inherited from parents and comes in different types - mainly Alpha and Beta thalassemia. With proper treatment like regular blood transfusions and iron chelation therapy, people with thalassemia can live healthy, fulfilling lives. Would you like to know more about the types or treatment options?"
    },
    {
        "question": "Is thalassemia contagious?",
        "answer": "No, thalassemia is absolutely NOT contagious. It's a genetic disorder that you inherit from your parents, not an infection. You cannot catch it from someone else, and you cannot spread it to others through contact. It's passed down through genes, which means it's present from birth."
    },
    {
        "question": "What are the types of thalassemia?",
        "answer": "There are two main types of thalassemia:\n\n**Alpha Thalassemia**: Affects alpha globin chain production. Severity ranges from silent carrier to Hydrops Fetalis (most severe, usually fatal).\n\n**Beta Thalassemia**: Affects beta globin chain production. Includes:\n- Beta Thalassemia Major (Cooley's Anemia): Most severe, requires regular transfusions\n- Beta Thalassemia Intermedia: Moderate severity\n- Beta Thalassemia Minor (Trait): Mild or no symptoms, carrier status\n\nThe type and severity depend on which genes are affected."
    },
    {
        "question": "Can thalassemia be cured?",
        "answer": "Yes, there are curative options available:\n\n1. **Bone Marrow Transplant (BMT)**: Currently the only proven cure, but requires a matched donor (usually a sibling).\n\n2. **Gene Therapy**: New treatment like Zynteglo has shown promising results and is approved in some countries.\n\nHowever, most patients manage thalassemia very successfully with regular transfusions and chelation therapy, living normal, healthy lives. The choice of treatment depends on many factors including disease severity, donor availability, and individual circumstances. Always discuss options with your hematologist."
    },
    {
        "question": "How is thalassemia inherited?",
        "answer": "Thalassemia follows an **autosomal recessive** inheritance pattern:\n\n- If **both parents are carriers** (thalassemia trait): 25% chance child has thalassemia major, 50% chance child is a carrier, 25% chance child is unaffected.\n\n- If **one parent is carrier, one is normal**: 50% chance child is a carrier, 50% chance child is unaffected.\n\n- If **one parent has thalassemia major**: All children will at least be carriers.\n\nThis is why genetic counseling and carrier screening before marriage/pregnancy is highly recommended for at-risk populations."
    },
]

# Symptoms and Diagnosis
SYMPTOMS_DIAGNOSIS = [
    {
        "question": "What are the symptoms of thalassemia?",
        "answer": "Common symptoms of thalassemia include:\n\n**Mild to Moderate:**\n- Fatigue and weakness\n- Pale or yellowish skin (jaundice)\n- Dark-colored urine\n- Shortness of breath\n- Dizziness\n- Cold hands and feet\n\n**Severe (Thalassemia Major):**\n- Facial bone deformities\n- Slow growth and delayed puberty\n- Enlarged spleen and liver\n- Frequent infections\n- Heart problems\n\nSymptoms usually appear in the first two years of life for thalassemia major. If you're experiencing severe symptoms, please consult your doctor immediately."
    },
    {
        "question": "How is thalassemia diagnosed?",
        "answer": "Thalassemia is diagnosed through several tests:\n\n1. **Complete Blood Count (CBC)**: Shows low hemoglobin and small red blood cells\n\n2. **Hemoglobin Electrophoresis**: Identifies abnormal hemoglobin types\n\n3. **Genetic Testing**: Confirms specific gene mutations\n\n4. **Prenatal Testing**: CVS or amniocentesis can diagnose before birth\n\n5. **Carrier Screening**: Simple blood test to check if you're a carrier\n\nEarly diagnosis is important for proper treatment planning. Many countries now include thalassemia in newborn screening programs."
    },
    {
        "question": "When should I see a doctor?",
        "answer": "See a doctor immediately if you experience:\n\n**Emergency Signs:**\n- Severe chest pain or shortness of breath\n- Extreme fatigue preventing daily activities\n- High fever (especially if you've had splenectomy)\n- Signs of heart failure (swelling, rapid heartbeat)\n- Severe headache or confusion\n\n**Regular Check-ups Needed For:**\n- Persistent fatigue or weakness\n- Yellowing of skin or eyes\n- Slow growth in children\n- Family history of thalassemia\n- Planning pregnancy (carrier screening)\n\nRegular monitoring is crucial for managing thalassemia effectively."
    },
]

# Treatment Options
TREATMENT_OPTIONS = [
    {
        "question": "What is blood transfusion therapy?",
        "answer": "Blood transfusion therapy is the primary treatment for thalassemia major:\n\n**How it works:**\n- Healthy red blood cells are transfused into your body\n- Typically needed every 2-4 weeks\n- Maintains hemoglobin levels above 9.5 g/dL\n- Each session takes 2-4 hours\n\n**Benefits:**\n- Reduces fatigue and improves energy\n- Prevents bone deformities\n- Allows normal growth and development\n- Improves quality of life\n\n**Important:** Regular transfusions lead to iron overload, which is why chelation therapy is essential. Always follow your doctor's transfusion schedule."
    },
    {
        "question": "What is iron chelation therapy?",
        "answer": "Iron chelation therapy removes excess iron from your body caused by regular blood transfusions:\n\n**Why it's needed:**\nTransfusions cause iron buildup that can damage your heart, liver, and other organs.\n\n**Types of chelators:**\n1. **Deferasirox (Exjade/Jadenu)**: Oral tablet, once daily\n2. **Deferiprone (Ferriprox)**: Oral tablet, three times daily\n3. **Deferoxamine (Desferal)**: Subcutaneous pump, 5-7 nights/week\n\n**CRITICAL:** Chelation therapy is not optional - it's essential for preventing life-threatening complications. Take it exactly as prescribed, even if you feel fine.\n\nYour doctor monitors effectiveness through ferritin levels and organ function tests."
    },
    {
        "question": "What is bone marrow transplant?",
        "answer": "Bone Marrow Transplant (BMT) is currently the only proven cure for thalassemia:\n\n**How it works:**\n- Replaces your bone marrow with healthy donor marrow\n- Donor is usually a matched sibling\n- New marrow produces normal hemoglobin\n\n**Success rates:**\n- 85-90% cure rate with matched sibling donor\n- Best outcomes in younger patients with minimal complications\n\n**Considerations:**\n- Requires intensive chemotherapy preparation\n- Risk of graft-versus-host disease\n- 3-6 months recovery period\n- Not everyone is a candidate\n\n**Important:** BMT is a major decision. Discuss thoroughly with your hematologist to understand if you're a candidate and what the risks and benefits are for your specific situation."
    },
    {
        "question": "Tell me about gene therapy for thalassemia",
        "answer": "Gene therapy is an exciting new curative option for thalassemia:\n\n**Approved Treatment:**\n- **Zynteglo (betibeglogene autotemcel)**: FDA and EMA approved\n- One-time treatment that modifies your own stem cells\n- Adds functional beta-globin gene\n\n**How it works:**\n1. Your stem cells are collected\n2. Cells are modified in a lab to add working gene\n3. You receive chemotherapy to prepare\n4. Modified cells are returned to your body\n\n**Results:**\n- Many patients become transfusion-independent\n- Long-term data still being collected\n\n**Limitations:**\n- Very expensive (though improving)\n- Not available everywhere\n- Requires meeting specific criteria\n\nThis is a rapidly evolving field - talk to your doctor about current availability and eligibility."
    },
]

# Diet and Nutrition
DIET_NUTRITION = [
    {
        "question": "What foods should I avoid with thalassemia?",
        "answer": "**Foods to AVOID (high in iron):**\n- Red meat (beef, lamb, pork)\n- Liver and organ meats\n- Iron-fortified cereals and bread\n- Shellfish (oysters, clams)\n- Dried fruits (raisins, apricots)\n- Dark leafy greens in large amounts\n- Iron supplements\n\n**Also avoid:**\n- Vitamin C supplements with meals (increases iron absorption)\n- Alcohol (damages liver)\n\n**Helpful tip:** Drink black tea or coffee with meals - tannins help reduce iron absorption.\n\nRemember: The goal is to minimize iron intake since you're already getting excess iron from transfusions. Always consult your dietitian for a personalized meal plan."
    },
    {
        "question": "What foods are good for thalassemia patients?",
        "answer": "**Foods to INCLUDE:**\n\n**Calcium-rich foods:**\n- Dairy products (milk, yogurt, cheese)\n- Helps prevent osteoporosis\n\n**Vitamin D sources:**\n- Fortified milk, eggs\n- Sunlight exposure (15-20 min daily)\n\n**Folic Acid:**\n- Beans, lentils, chickpeas\n- Supports red blood cell production\n\n**Vitamin E:**\n- Nuts, seeds, vegetable oils\n- Antioxidant protection\n\n**Antioxidants:**\n- Colorful fruits and vegetables\n- Berries, citrus (between meals, not with meals)\n\n**Hydration:**\n- Plenty of water throughout the day\n\n**Pro tip:** Eat a balanced, varied diet focusing on fresh, whole foods. Work with a nutritionist familiar with thalassemia for best results."
    },
]

# Lifestyle and Daily Living
LIFESTYLE_LIVING = [
    {
        "question": "Can I exercise with thalassemia?",
        "answer": "Yes! Exercise is beneficial for thalassemia patients:\n\n**Recommended activities:**\n- Walking, jogging (moderate pace)\n- Swimming\n- Cycling\n- Yoga and stretching\n- Light strength training\n\n**Benefits:**\n- Improves bone health\n- Boosts energy levels\n- Reduces stress\n- Maintains healthy weight\n\n**Activities to AVOID:**\n- Contact sports (football, boxing, martial arts)\n- High-impact activities if you have enlarged spleen\n- Extreme endurance sports\n\n**Important tips:**\n- Start slowly and build up gradually\n- Stay well-hydrated\n- Listen to your body - rest if fatigued\n- Consult your doctor before starting new exercise program\n\nRegular, moderate exercise is encouraged and safe for most thalassemia patients!"
    },
    {
        "question": "Can I live a normal life with thalassemia?",
        "answer": "Absolutely YES! With proper treatment and care, people with thalassemia can live full, normal lives:\n\n**You CAN:**\n- Go to school and excel academically\n- Have a successful career\n- Get married and have relationships\n- Travel (with planning)\n- Participate in most activities\n- Have children (with genetic counseling)\n- Live a normal lifespan\n\n**Keys to success:**\n- Stick to your treatment schedule (transfusions & chelation)\n- Attend regular check-ups\n- Maintain healthy lifestyle\n- Stay informed about your condition\n- Build a support network\n\n**Remember:** Thalassemia is a manageable chronic condition, not a life sentence. Many successful professionals, athletes, and parents have thalassemia. Your condition doesn't define you - your determination and positive attitude do!\n\nStay compliant with treatment, and you can achieve anything you set your mind to. 💪"
    },
]

# Emergency Situations
EMERGENCY_PROTOCOLS = [
    {
        "question": "What are emergency warning signs?",
        "answer": "**Seek IMMEDIATE medical attention if you experience:**\n\n🚨 **Critical symptoms:**\n- Severe chest pain or pressure\n- Difficulty breathing or shortness of breath\n- Rapid or irregular heartbeat\n- Severe headache or confusion\n- Loss of consciousness\n- Severe abdominal pain\n\n⚠️ **Urgent symptoms:**\n- High fever (especially if spleen removed)\n- Severe fatigue preventing movement\n- Yellowing of skin/eyes (sudden jaundice)\n- Dark urine with pain\n- Signs of infection not improving\n\n**DO NOT WAIT - Call emergency services or go to ER immediately!**\n\nAlways wear a medical alert bracelet and keep emergency contacts handy. Better safe than sorry!"
    },
]

# Emotional Support
EMOTIONAL_SUPPORT = [
    {
        "question": "I feel overwhelmed with my thalassemia diagnosis",
        "answer": "It's completely normal to feel overwhelmed - you're not alone in this. ❤️\n\n**Remember:**\n- Your feelings are valid and understandable\n- Thalassemia is manageable with proper care\n- Thousands of people live full, happy lives with thalassemia\n- It gets easier as you adjust to the routine\n\n**Things that can help:**\n- Join a support group (online or in-person)\n- Talk to a counselor who understands chronic illness\n- Connect with other thalassemia patients\n- Take it one day at a time\n- Focus on what you CAN control\n- Celebrate small victories\n\n**You are stronger than you think!** This diagnosis doesn't define you. With time, treatment becomes routine, and you'll find your new normal.\n\nWould you like information about support groups or counseling resources?"
    },
]

# Conversational Patterns
CONVERSATIONAL = [
    {
        "question": "Hello",
        "answer": "Hello! Welcome to Thalassemia Care Hub. I'm here to help answer your questions about thalassemia, provide support, and guide you to resources. How can I assist you today?"
    },
    {
        "question": "Thank you",
        "answer": "You're very welcome! I'm here anytime you need information or support. Take care, and remember - you're doing great! 💙"
    },
    {
        "question": "I don't understand",
        "answer": "I apologize for any confusion. Let me try to explain that more clearly. Could you tell me which part you'd like me to clarify? I'm here to help make things easier to understand."
    },
]

# Compile all training data
ALL_TRAINING_DATA = (
    BASIC_KNOWLEDGE +
    SYMPTOMS_DIAGNOSIS +
    TREATMENT_OPTIONS +
    DIET_NUTRITION +
    LIFESTYLE_LIVING +
    EMERGENCY_PROTOCOLS +
    EMOTIONAL_SUPPORT +
    CONVERSATIONAL +
    CONVERSATIONAL_GENERAL  # 3,725 general conversation pairs
)

# Function to get training data in ChatterBot format
def get_training_conversations():
    """
    Convert training data to ChatterBot conversation format
    Returns list of conversation pairs
    """
    conversations = []
    for item in ALL_TRAINING_DATA:
        conversations.append([
            item["question"],
            item["answer"]
        ])
    return conversations

# Function to get training data by category
def get_category_data(category_name):
    """
    Get training data for a specific category
    """
    category_map = {
        "basic": BASIC_KNOWLEDGE,
        "symptoms": SYMPTOMS_DIAGNOSIS,
        "treatment": TREATMENT_OPTIONS,
        "diet": DIET_NUTRITION,
        "lifestyle": LIFESTYLE_LIVING,
        "emergency": EMERGENCY_PROTOCOLS,
        "emotional": EMOTIONAL_SUPPORT,
        "conversational": CONVERSATIONAL,
        "conversational_general": CONVERSATIONAL_GENERAL,
    }
    return category_map.get(category_name.lower(), [])
