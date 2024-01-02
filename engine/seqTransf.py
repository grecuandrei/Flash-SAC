from sentence_transformers import SentenceTransformer
import pickle
import os

cwd = os.getcwd()

model = SentenceTransformer('nli-distilroberta-base-v2')

with open(cwd+'/model.pkl', 'wb') as file:
      
    # A new file will be created
    pickle.dump(model, file)