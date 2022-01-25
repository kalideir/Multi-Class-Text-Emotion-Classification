import pandas as pd
import emoji
import string
from google_play_scraper import Sort, reviews, app

from utils.preprocess import text_preprocessing_pipeline

def get_df(appID):

    app_reviews = []

    for sort_order in [Sort.MOST_RELEVANT, Sort.NEWEST]:
        rvs, _ = reviews(
            appID,
            lang='en', # defaults to 'en'
            country='us',# defaults to 'us'
            sort=sort_order,
            count= 100,
        )
        app_reviews.extend(rvs)
    
    app_reviews_df = pd.DataFrame(app_reviews)
    
    return app_reviews_df

def preprocess_df(df):
    df['text'] = df['content'].apply(text_preprocessing_pipeline)
    df = df[['text']]