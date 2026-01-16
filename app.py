from flask import Flask, jsonify, request, render_template
import requests

app = Flask(__name__)

BASE_PRIMARY_API_URL = "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/"
BASE_SECONDARY_API_URL = "https://latest.currency-api.pages.dev/v1/"

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/api/currencies')
def list_currencies():
    response = requests.get(BASE_PRIMARY_API_URL + 'currencies.json')

    if response.status_code != 200:
        return jsonify('Error fetching data from external API'), response.status_code
    data = response.json()
    currencies = { 
        code : name for code, name in data.items() if name
    }

    # print(data.values())

    return jsonify({
        "currencies": currencies
    })

@app.route('/api/currency/<currency_code>', strict_slashes=False)
def currency_data(currency_code):
    currency_code = currency_code.lower()

    response = requests.get(
        BASE_PRIMARY_API_URL + f'currencies/{currency_code}.json'
    )
    
    if response.status_code != 200:
        return jsonify('Error fetching data from external API'), response.status_code
    
    data = response.json()

    res = {
        "date": data['date'],
        "currency_code": currency_code.upper(),
        "currency": data[currency_code]
    }

    return jsonify(res)

@app.route('/api/rate/<from_code>/<to_code>')
def conversion_rate(from_code, to_code):
    from_code = from_code.lower()
    to_code = to_code.lower()

    response = requests.get(BASE_PRIMARY_API_URL + f'currencies/{from_code}.json')

    if response.status_code != 200:
        return jsonify('Error fetching data from external API'), response.status_code

    data = response.json()

    result = {
        "rate" : data[from_code][to_code]
    }
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True)