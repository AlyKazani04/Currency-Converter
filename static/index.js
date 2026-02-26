function toggleDropdown(list) {
    const select = document.getElementById(list);

    const isVisible = select.style.display === "block";

    select.style.display = isVisible ? "none" : "block";
}

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
        const fromList = document.getElementById("fromCurrencies");
        const toList = document.getElementById("toCurrencies")

        fromList.innerHTML = "";
        toList.innerHTML = "";
        
        Object.entries(data.currencies).forEach(([code, name]) => {
            const option = document.createElement("option");
            option.text = `${code.toUpperCase()} - ${name}`;
            option.value = `${code.toUpperCase()} - ${name}`;
            fromList.appendChild(option);

            const option2 = document.createElement("option");
            option2.text = `${code.toUpperCase()} - ${name}`;
            option2.value = `${code.toUpperCase()} - ${name}`;
            toList.appendChild(option2);
        });
        console.debug(fromList.children.length);
    })
    .catch(err => console.error(err));
}

function extractCode(input) {
    if (!input) return "";
    return input.split(" - ")[0].trim().toLowerCase();
}

function convertCurrency()
{
    const fromSearch = document.getElementById("fromSearch");
    const toInput = document.getElementById("toSearch");
    const amountInput = document.getElementById("amount");

    const amount = parseFloat(amountInput.value);
    const fromCurrency = extractCode(fromSearch.value);
    const toCurrency = extractCode(toInput.value);

    if(amount >= 0 && fromCurrency && toCurrency)
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
                `Date: ${data.date}
                ${fromCurrency.toUpperCase()} ${amount} = ${toCurrency.toUpperCase()} ${convertedAmount}`;
        })
        .catch(err => console.error(err));
    }
    else
    {
        if(amount < 0 || isNaN(amount))
        {
            highlightAndClear("amount", 2000);

        }
        if(!fromCurrency || !toCurrency)
        {
            highlightAndClear("fromSearch", 2000);
            highlightAndClear("toSearch", 2000);
        }
    }
}

function filterCurrencies(id, list) {
    const search = document.getElementById(id).value.toUpperCase();
    const select = document.getElementById(list);
    const options = select.getElementsByTagName("option");

    for (let i = 0; i < options.length; i++) {
        const text = options[i].textContent || options[i].innerText;
        options[i].style.display =
            text.toUpperCase().includes(search) ? "" : "none";
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

// Make selection fill the search input
document.getElementById("fromCurrencies").addEventListener("change", function () {
    document.getElementById("fromSearch").value = this.value;

    // hide dropdown after selecting
    document.getElementById("fromCurrencies").style.display = "none";
});

document.getElementById("toCurrencies").addEventListener("change", function () {
    document.getElementById("toSearch").value = this.value;

    // hide dropdown after selecting
    document.getElementById("toCurrencies").style.display = "none";
});