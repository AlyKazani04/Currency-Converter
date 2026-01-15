function getCurrencyRates(currency_code)
{
    return fetch(`/api/currency/${currency_code}`)
    .then(res => {
        if(!res.ok)
        {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json()
    })
    .then(data => {
        document.getElementById("output").innerText =
            `Date: ${data.date}
            ${data.currency_code}:
            ${JSON.stringify(data.currency).split(',').join('\n').replace(/^\{|\}$/g,'')}`;
    })
    .catch(err => console.error(err));
}

// For specific rate conversions
// json = fetchJSON(`/currencies/{fromCurrency}`)
// rate = json[fromCurrency][toCurrency]

function populateCurrencyDropdown()
{
    return fetch('/api/currencies')
    .then(res => {
        if(!res.ok)
        {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json()
    })
    .then(data => {
        const from = document.getElementById("from");
        const to = document.getElementById("to")
        
        Object.entries(data.currencies).forEach(([code, name]) => {
            const option = document.createElement("option");
            option.text = name;
            option.value = code;
            from.appendChild(option);

            const opt2 = option.cloneNode(true);
            to.appendChild(opt2);
        });
        
    })
}

function convertCurrency()
{
    const fromCurrency = document.getElementById("currencies").value;
    const toCurrency = document.getElementById("currencies2").value;
    const amount = parseFloat(document.getElementById("amount").value);
    
}

populateCurrencyDropdown();