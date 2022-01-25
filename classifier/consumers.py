from channels.generic.websocket import WebsocketConsumer
from channels.generic.websocket import JsonWebsocketConsumer
from channels.exceptions import StopConsumer
import json
import pandas as pd
import numpy as np
from django.template.defaultfilters import slugify

from utils.playstore import get_df, preprocess_df
from utils.predict import predict_df, predict_sentence



class ClassificationConsumer(WebsocketConsumer): # reusable class

    def __init__(self):
        super().__init__()
    

    def connect(self):
        self.accept()
        self.send(json.dumps({'message': 'Successfullly connected to the model'}), 200)

    def receive(self, text_data=None, bytes_data=None):
        result = []
        text_data_json = json.loads(text_data)
        type = text_data_json.get('type')
        text = text_data_json.get('itemType')
        print(text_data_json, 25)
        if type == 'APP_ID':
            return self.response(result)
        
        self.send(json.dumps(self.response(result)), 200)

    def disconnect(self, close_code):
        self.close()
        raise StopConsumer()

    def response(self, result):
        return {'result': result}
    
    @staticmethod
    def classify_app_reviews(appID):
        df = get_df(appID)
        df = preprocess_df(df)
        df = predict_df(df)
        df_json = df.to_json()
        return df_json
    
    @staticmethod
    def classify_sentence(sentence):
        predictions = predict_sentence(sentence)
        return predictions
    