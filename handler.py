
import json
from dateutil.relativedelta import relativedelta
import requests
import datetime
import pytz
import time

api_key = "c8h0pu2ad3i9rgv9ca50"

def get_company(symbol):
    url = f"https://finnhub.io/api/v1/stock/profile2"
    response = fetch_api(url,symbol)
    return response.text

def get_stock_summary(symbol):
    url_sumary = f"https://finnhub.io/api/v1/quote"
    url_trends = f"https://finnhub.io/api/v1/stock/recommendation"
    summary =  fetch_api(url_sumary,symbol).json()
    trends = fetch_api(url_trends,symbol).json()
    

    latest_trends = {}
    if trends:
        date_list = [i['period'] for i in trends]
        latest_date = max(date_list, key=lambda x: datetime.datetime.strptime(x, "%Y-%m-%d"))
        for item in trends:
            if item['period'] == latest_date:
                latest_trends = item
                break
    
    result = {
        'summary':summary,
        "trends":latest_trends
    }

    return json.dumps(result)


def get_chart(symbol):
    timezone = pytz.timezone('America/Los_Angeles')
    current_time = datetime.datetime.now(tz=timezone)
    from_date = (current_time - relativedelta(months=6,day=1))
    today = current_time
    from_timestamp = int(time.mktime(from_date.timetuple()))
    today_timestamp = int(time.mktime(today.timetuple()))
    url = f'https://finnhub.io/api/v1/stock/candle?resolution=D&from={from_timestamp}&to={today_timestamp}&token={api_key}'
    response = fetch_api(url,symbol).json()
    final_list = []
    if response:
        
        for count in range(0,len(response['c'])):
            offset = 16 * 60 * 60 * 1000
            date = response['t'][count] * 1000 - offset
            close = response['c'][count]
            volume = response['v'][count]
            final_list.append({'date':date,'close':close,'volume':volume})
    return json.dumps(final_list)



def get_news(symbol):
    timezone = pytz.timezone('America/Los_Angeles')
    current_time = datetime.datetime.now(tz=timezone)
    from_date = (current_time - relativedelta(days=30)).strftime('%Y-%m-%d')
    today = current_time.strftime('%Y-%m-%d')
    url = f'https://finnhub.io/api/v1/company-news?from={from_date}&to={today}&token={api_key}'
    response = fetch_api(url,symbol).json()

    return json.dumps(response)


def fetch_api(url,symbol):
    querystring = {"symbol":symbol,"token":api_key}
    return requests.request("GET", url, params=querystring)
