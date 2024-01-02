#Dependencies
import numpy as np
import pandas as pd
import sys
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
import pickle
import os

cwd = os.getcwd()

from pymongo import MongoClient
from bson.objectid import ObjectId
def get_database():
 
   # Provide the mongodb atlas url to connect python to mongodb using pymongo
   CONNECTION_STRING = "mongodb://root:example@localhost:27017"
 
   # Create a connection using MongoClient. You can import MongoClient or use pymongo.MongoClient
   client = MongoClient(CONNECTION_STRING)
 
   # Create the database for our example (we will use the same database throughout the tutorial
   return client['test']

event_id = sys.argv[1]

def event_recomm(event_id):
   #Data Collection and Pre-Processing

   #load data to pandas
   db = get_database()
   events_col = db['events']
   all_events = events_col.find()
   event_data = pd.DataFrame(list(all_events))

   with open(cwd.replace('server', 'engine')+'/model.pkl', 'rb') as file:
      
      # Call load method to deserialze
      model = pickle.load(file)

   # model = SentenceTransformer('nli-distilroberta-base-v2')

   event_data['keywords'] = event_data['keywords'].fillna('')
    
   sentences = event_data['keywords']

   sentences = sentences.to_numpy(dtype="str")

   feature_vectors = model.encode(sentences)

   similarity = cosine_similarity(feature_vectors)

   index_of_the_event = event_data.index[event_data['_id'] == ObjectId(event_id)][0]

   similarity_score = list(enumerate(similarity[index_of_the_event]))

   # sorting the events based on their similarity score
   sorted_similar_events = sorted(similarity_score, key = lambda x:x[1], reverse = True)

   list_of_similar_events = ''

   i = 1

   for event in sorted_similar_events:
      # index = event[0]
      id_from_index = str(event_data.iloc[event[0]]['_id'])
      if (i<31):
         list_of_similar_events = list_of_similar_events + id_from_index +','
         i+=1
      if(i == 31):
         break

   print(list_of_similar_events) # lista finala cu Id-uri

event_recomm(event_id)