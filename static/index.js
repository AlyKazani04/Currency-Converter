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
            `${data.currency_code} | Date: ${data.date}\n
            ${JSON.stringify(data.currency).split(',').join('\n').replace(/^\{|\"|\}$/g,'').split(':').join(' ')}`;
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
    .catch(err => console.error(err));
}

function convertCurrency()
{
    const fromSelect = document.getElementById("from");
    const fromCurrency = fromSelect.options[fromSelect.selectedIndex].value;
    const toSelect = document.getElementById("to");
    const toCurrency = toSelect.options[toSelect.selectedIndex].value;
    
    const amountInput = document.getElementById("amount");
    const amount = parseFloat(amountInput.value);

    if(amount >= 0)
    {
        console.debug(`Converting ${amount} from ${fromCurrency} to ${toCurrency}`);
        return fetch(`/api/rate/${fromCurrency}/${toCurrency}`)
        .then(res => {
            if(!res.ok)
            {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json()
        })
        .then(data => {
            const rate = parseFloat(data.rate);
            const convertedAmount = (amount * rate).toFixed(3);
    
            console.debug(convertedAmount);
    
            document.getElementById("conversionResult").innerText = 
                `${fromCurrency.toUpperCase()} ${amount} = ${toCurrency.toUpperCase()} ${convertedAmount}`;
        })
        .catch(err => console.error(err));
    }
    else
    {
        highlightAndClear("amount", 2000);
    }
}

function highlightAndClear(elementId, durationMs) {
    const element = document.getElementById(elementId);
    if (!element) return;

    setTimeout(() => {
    element.classList.add('highlighted');
    });

    setTimeout(() => {
    element.classList.remove('highlighted');
    }, durationMs);
}


populateCurrencyDropdown();