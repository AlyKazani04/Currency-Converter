function loadData(currency_code)
{
    return fetch(`/api/external-data?currency_code=${currency_code}`)
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
            ${JSON.stringify(data.currency).split(',').join('\n')}`;
    })
    .catch(err => console.error(err));
}

// For specific rate conversions
// json = fetchJSON(`/currencies/{fromCurrency}`)
// rate = json[fromCurrency][toCurrency]