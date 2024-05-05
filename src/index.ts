// Imports use relative file paths or Node.js package names
import { textInput } from './dom-utils';
import axios from 'axios'

// CSS IMPORT IN TS NUR ÜBER VITE MÖGLICH
import './styles/styles.css';


//THIS IS THE ENTRY FILE - WRITE YOUR MAIN LOGIC HERE

// init App

type Transaction = {
    id: number,
    name: string,
    amount: number,
    date: Date,
    type: string,
}

interface exchangeRateData {
    "data": {
        "EUR": number,
        "GBP": number,
        "JPY": number,
        "KRW": number,
        "USD": number
      }
}

const transactions: [Transaction] = JSON.parse(localStorage.getItem("transactions") || "''" );

var formatter = new Intl.NumberFormat("en-DE", {
  style: "currency",
  currency: "EUR",
  signDisplay: "always",
});

const list: HTMLElement = document.getElementById("transactionList") as HTMLElement;
const form: HTMLFormElement = document.getElementById("transactionForm") as HTMLFormElement;
const status: HTMLElement = document.getElementById("status") as HTMLElement;
const balance: HTMLElement = document.getElementById("balance") as HTMLElement;
const income: HTMLElement = document.getElementById("income") as HTMLElement;
const expense: HTMLElement = document.getElementById("expense") as HTMLElement;
const currencies: HTMLSelectElement = document.getElementById("currencies") as HTMLSelectElement;

var selectedCurrency: string = "";
var exchangeRate: number = 1;
var exchangeRates = {
    "EUR": 1,
    "GBP": 1,
    "JPY": 1,
    "KRW": 1,
    "USD": 1
  }

form.addEventListener("submit", addTransaction);
currencies.addEventListener("change", currencySelected)

function updateTotal() {

    var incomeTotal = transactions
    .filter((trx) => trx.type === "income")
    .reduce((total, trx) => total + trx.amount, 0);

  var expenseTotal = transactions
    .filter((trx) => trx.type === "expense")
    .reduce((total, trx) => total + trx.amount, 0);

  incomeTotal = incomeTotal * exchangeRate;
  expenseTotal = expenseTotal * exchangeRate;
  const balanceTotal = (incomeTotal - expenseTotal);
  
  balance.textContent = formatter.format(balanceTotal).substring(1);
  income.textContent = formatter.format(incomeTotal);
  expense.textContent = formatter.format(expenseTotal * -1);
}

function renderList() {
  list.innerHTML = "";

  status.textContent = "";
  if (!Array.isArray(transactions) || !transactions.length) {
    status.textContent = "No transactions.";
    return;
  }


  transactions.forEach(({ id, name, amount, date, type }) => {
    var sign: number = 0;

    if (type === "income") {
        sign = 1;
    } else {
        sign = -1;
    }

    const li = document.createElement("li");

    li.innerHTML = `
      <div class="name">
        <h4>${name}</h4>
        <p>${new Date(date).toLocaleDateString()}</p>
      </div>

      <div class="amount ${type}">
        <span>${formatter.format(amount * exchangeRate * sign)}</span>
      </div>
    
      <div class="action">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" onclick="deleteTransaction(${id})">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    `;

    list.appendChild(li);
  });
}

function deleteTransaction(id: number) {
  const index = transactions.findIndex((trx) => trx.id === id);
  transactions.splice(index, 1);

  updateTotal();
  saveTransactions();
  renderList();
}

(window as any).deleteTransaction = deleteTransaction;

function addTransaction(e: Event) {
  e.preventDefault();

  const formData: FormData = new FormData(form);

  var currentID: number = 0;

  transactions.forEach(({ id }) => {
    if (id > currentID) {
        currentID = id;
    }
  });

  transactions.push({
    id: currentID + 1,
    name: formData.get("name")!.toString(),
    amount: parseFloat(formData.get("amount")!.toString()) / exchangeRate,
    date: new Date(formData.get("date")!.toString()),
    type: "on" === formData.get("type") ? "income" : "expense",
  });

  form.reset();

  updateTotal();
  saveTransactions();
  renderList();
}

function saveTransactions() {
  transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  localStorage.setItem("transactions", JSON.stringify(transactions));
}

function determineExchangeRates() {
    const apiUrl = 'https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_QSZ5QoseFeyeyHGBfLbrsxuu4qJtGf5Bu74p2doj&currencies=EUR%2CUSD%2CGBP%2CKRW%2CJPY&base_currency=EUR';
    
    axios.get(apiUrl)
    .then(response => {
        exchangeRates = response.data.data;
    })
    .catch(error => {
        console.log(error)
    })
}

function currencySelected(e: Event) {

    selectedCurrency = currencies.options[currencies.selectedIndex].value;

    switch (selectedCurrency) {
        case "EUR":
            exchangeRate = exchangeRates.EUR;
            break;
        case "USD":
            exchangeRate = exchangeRates.USD;
            break;
        case "GBP": 
            exchangeRate = exchangeRates.GBP;
            break;
        case "KRW":
            exchangeRate = exchangeRates.KRW;
            break;
        case "JPY":
            exchangeRate = exchangeRates.JPY;
            break;
        default:
            exchangeRate = 1;
    }
    
    formatter = new Intl.NumberFormat("en-DE", {
        style: "currency",
        currency: selectedCurrency,
        signDisplay: "always",
    });

    renderList();
    updateTotal();
}

renderList();
updateTotal();
determineExchangeRates()