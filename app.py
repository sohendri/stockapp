from flask import Flask,Flask, request, render_template,session,make_response,jsonify
from handler import *


app = Flask(__name__)
app.scret_key = '#FSKF969430'

# enable debugging mode
app.config["DEBUG"] = True


@app.route('/',methods=['GET'])
def home():
    return render_template('index.html')


@app.route('/api/company',methods=['GET'])
def company_info():
    text = request.args.get("symbol")
    return get_company(text)


@app.route('/api/chart',methods=['GET'])
def chart_info():
    text = request.args.get("symbol")
    return get_chart(text)


@app.route('/api/summary',methods=['GET'])
def stock_summary():
    text = request.args.get("symbol")
    return get_stock_summary(text)



@app.route('/api/news',methods=['GET'])
def news_details():
    text = request.args.get("symbol")
    return get_news(text)


if __name__ == '__main__':
    app.run()