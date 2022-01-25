from distutils import text_file
from transformers import BertTokenizerFast as BertTokenizer

MAX_LEN = 512
tokenizer = BertTokenizer.from_pretrained('bert-base-uncased', truncation=True, do_lower_case=True)


def transform_text(text):
    encoded_review = tokenizer.encode_plus(
      text,
      max_length=MAX_LEN,
      add_special_tokens=True,
      return_token_type_ids=True,
      pad_to_max_length=True,
      return_attention_mask=True,
      return_tensors='pt',
    )

    input_ids = encoded_review['input_ids']
    attention_mask = encoded_review['attention_mask']
    token_type_ids = encoded_review['token_type_ids']
    return (input_ids, attention_mask, token_type_ids)
