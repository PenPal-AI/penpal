from dotenv import load_dotenv
import os

# <strong># Use load_env to trace the path of .env</strong>:
load_dotenv('.env') 
    
# Get the values of the variable from .env using the os library</strong>:
# <strong>
password = os.environ.get("OPENAI_API_KEY")
    
print(password)
# idStringSecret