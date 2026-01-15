from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

BASE_PRIMARY_API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/"
BASE_SECONDARY_API_URL = "https://latest.currency-api.pages.dev/v1/"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/external-data', strict_slashes=False)
def external_data():
    currency_code = request.args.get("currency_code", "usd").lower()
    response = requests.get(BASE_PRIMARY_API_URL + currency_code + '.json')
    if response.status_code != 200:
        return jsonify('Error fetching data from external API'), response.status_code
    
    data = response.json()
    res = {
        "date": data['date'],
        "currency_code": currency_code.upper(),
        "currency": data[currency_code]
    }
    # res.update(data[currency_code])
    return jsonify(res)
        

if __name__ == '__main__':
    app.run(debug=True)