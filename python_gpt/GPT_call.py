from openai import OpenAI
from dotenv import load_dotenv

def main():
    return

if __name__ == '__main__':
    load_dotenv()
    client = OpenAI()
    response = client.chat.completions.create(
        model = "gpt-3.5-turbo-0125",
        temperature = 0.8,
        max_tokens = 3000,
        response_format={ "type": "json_object" },
        messages = [
            {"role": "system", "content": "You are giving advice to a student that is writing a college essay. Analyze the tone and give ideas on how to continue this essay. The output should be in JSON format."},
            {"role": "user", "content": "When our mother would drop my sisters and I off at the PlayPen in IKEA, I would assume my usual seat at the coloring table, take a coloring sheet, and flip it over to the blank side. The Disney Princesses and strange, google-eyed animals would be pressed against the sticky table as I scribbled on the white page before me. My sisters and the others would gawk. Why isn't she coloring the outlined picture? And this habit wasn't isolated only to the furniture franchise. The dentist, Psychologist's office, GAP's coloring table were all places where, in my hands, the scribbles would appear on the back as opposed to the front"},
        ]
    )
    print(response.choices[0].message.content)

"""
Terminal Output: 

{
  "tone": "Reflective and personal",
  "suggested_continuation": [
    "Consider delving into the significance of this quirky habit of coloring on the blank side of the page. How did it make you feel? Did it symbolize your desire to think outside the lines or break away from convention?",
    "You could explore how this habit might reflect your creative thinking or independent spirit. Did it set you apart from your sisters and peers in a meaningful way?",
    "Detail specific moments where this habit stood out to you at different places like the dentist's office or the GAP's coloring table. How did people react to your unconventional coloring choice?",
    "Connect this habit to larger themes or lessons you've learned about embracing individuality or finding creative solutions to challenges. How has this habit shaped your approach to new experiences or problem-solving?",
    "Consider discussing how this habit has evolved over time or how you've incorporated it into other aspects of your life. Has it influenced your hobbies, interests, or future goals in any way?"
  ]
}

"""
    