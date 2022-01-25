from json import load
import torch.nn as nn
import torch
from transformers import BertModel
import numpy as np
from utils.preprocess import text_preprocessing_pipeline
from utils.transform import transform_text


class BERTClass(torch.nn.Module):
    def __init__(self):
        super(BERTClass, self).__init__()
        self.l1 = BertModel.from_pretrained('bert-base-uncased')
#         self.l2 = torch.nn.Dropout(0.15)
        self.l3 = torch.nn.Linear(768, 5)
    
    def forward(self, ids, mask, token_type_ids):
        _, output = self.l1(ids, attention_mask = mask, token_type_ids = token_type_ids, return_dict=False)
#         output_2 = self.l2(output)
        output = self.l3(output)
        return output


def load_model():
    model = BERTClass()
    model.load_state_dict(torch.load('../model'))
    model.eval()
    return model

target_cols = [
 'anger',
 'fear',
 'joy',
 'sadness',
 'surprise']

def to_labels(idx_list):
    arr = []
    for i, emotion in enumerate(idx_list):
        if emotion:
            arr.append(target_cols[i])
    return arr

def predict_df(df):
    model = load_model()
    predictions = []
    for review in df['text']:
        input_ids, attention_mask, token_type_ids = transform_text(review)
        output = model(input_ids, attention_mask, token_type_ids)
        prediction = np.where(nn.Sigmoid()(output).cpu().detach().numpy() >= 0.5, 1, 0).flatten()
        predictions.append(prediction)
    df['predictions'] = predictions
    df['emotions labels'] = df['predictions'].apply(to_labels)
    
    
    
def predict_sentence(sentence):
    model = load_model()
    sentence = text_preprocessing_pipeline(sentence)
    input_ids, attention_mask, token_type_ids = transform_text(sentence)
    output = model(input_ids, attention_mask, token_type_ids)
    prediction = np.where(nn.Sigmoid()(output).cpu().detach().numpy() >= 0.5, 1, 0).flatten()
    return to_labels(prediction)
    
    