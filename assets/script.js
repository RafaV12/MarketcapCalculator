// Global variables
const btcPrice = document.getElementById('btc-price');
const slideTrack = document.querySelector('.slide-track');
const calculatedPrice = document.getElementById('calculated-price');
// We are getting the coin supply and the coin marketcap from CoinGecko's API.
let coinSupply;
let coinMarketcap;

// "Price of" div variables
const priceOfCoin = document.getElementById('price-of');
const currentPrice = document.getElementById('current-price');
const priceModal = document.querySelector('.select-price-modal');
const priceSearch = document.getElementById('price-search-input');
const priceList = document.getElementById('select-price-list');
const exitPriceBtn = document.querySelector('.exit-price-btn');

// "Marketcap of" div variables
const marketcapOfCoin = document.getElementById('marketcap-of');
const currentMarketcap = document.getElementById('current-marketcap');
const marketcapModal = document.querySelector('.select-marketcap-modal');
const marketcapSearch = document.getElementById('marketcap-search-input');
const marketcapList = document.getElementById('select-marketcap-list');
const exitMarketcapBtn = document.querySelector('.exit-marketcap-btn');

// Open modal functions
priceOfCoin.addEventListener('click', () => {
  priceModal.classList.toggle('hidden');
});
marketcapOfCoin.addEventListener('click', () => {
  marketcapModal.classList.toggle('hidden');
});

// Close modal functions
exitPriceBtn.addEventListener('click', () => {
  priceModal.classList.toggle('hidden');
});
exitMarketcapBtn.addEventListener('click', () => {
  marketcapModal.classList.toggle('hidden');
});

const insertCoinsToList = (coinsArray, list) => {
  // The 'list' argument will let us know to which list we will insert the coins into.
  // It's either the coin price list or the marketcap list.
  coinsArray.forEach((coin) => {
    // Get the coin id, symbol and image
    const { id, image, symbol } = coin;

    // Remember have two lists with almost the same functions,
    // check which one are we using and act accordingly

    if (list === 'priceList') {
      // Create all elements for the price list
      let listItem = document.createElement('li');
      let coinId = document.createElement('p');
      coinId.innerText = id;
      let coinLogo = document.createElement('img');
      coinLogo.classList.add('coin-logo');
      coinLogo.src = image;

      // Append everything
      listItem.appendChild(coinLogo);
      listItem.appendChild(coinId);
      priceList.appendChild(listItem);

      // On coin select (click), fetch its data and display the symbol, logo and current price
      listItem.addEventListener('click', () => {
        // Get the child elements of the symbol wrapper to change them,
        // depending on which coin was selected
        const currencyLogo = document.getElementById('price-currency-logo');
        const currencySymbol = document.getElementById('price-currency-symbol');

        currencyLogo.src = image;
        currencySymbol.innerText = symbol;

        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
        )
          .then((response) => response.json())
          .then((data) => {
            // In reality, if we want to calculate the price of a coin,
            // we should use the circulating supply instead of the total supply.
            // In this case, CoinGecko's API doesn't have the circulating supply
            // of some coins, so we use the total.
            coinSupply = data[0].total_supply;
            currentPrice.innerHTML = '$' + data[0].current_price;
          });

        // Close modal
        priceModal.classList.toggle('hidden');
      });
    }

    if (list === 'marketcapList') {
      // Create all elements for the price list
      let listItem = document.createElement('li');
      let coinId = document.createElement('p');
      coinId.innerText = id;
      let coinLogo = document.createElement('img');
      coinLogo.classList.add('coin-logo');
      coinLogo.src = image;

      // Append everything
      listItem.appendChild(coinLogo);
      listItem.appendChild(coinId);
      marketcapList.appendChild(listItem);

      // On coin select (click), fetch its data and display the symbol, logo and current price
      listItem.addEventListener('click', () => {
        // Get the child elements of the symbol wrapper to change them,
        // depending on which coin was selected
        const currencyLogo = document.getElementById('marketcap-currency-logo');
        const currencySymbol = document.getElementById(
          'marketcap-currency-symbol'
        );

        currencyLogo.src = image;
        currencySymbol.innerText = symbol;

        fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${id}&order=market_cap_desc&per_page=1&page=1&sparkline=false`
        )
          .then((response) => response.json())
          .then((data) => {
            coinMarketcap = data[0].market_cap;
            if (coinMarketcap === 0) {
              // If the coin doesn't have a marketcap in CoinGecko's API, we calculate it
              // (coin's current price (USD) * coin's total supply)
              coinMarketcap = data[0].current_price * data[0].total_supply;
              return (currentMarketcap.innerHTML = '$' + coinMarketcap);
            }
            currentMarketcap.innerHTML = '$' + data[0].market_cap;
          });

        // Close modal
        marketcapModal.classList.toggle('hidden');
      });
    }
  });
};

const calculatePrice = () => {
  if (!coinSupply || !coinMarketcap) {
    alert('You forgot to select a coin!');
  }
  // In this case, we are calculating the price of a coin
  // by dividing the marketcap and the coin's supply
  calculatedPrice.innerHTML = coinMarketcap / coinSupply;
};

function filterList(list) {
  let filter;
  let li;

  // We have two search filters, check which one are we using and act accordingly
  if (list === 'priceList') {
    filter = priceSearch.value.toUpperCase();
    li = priceList.getElementsByTagName('li');
  }

  if (list === 'marketcapList') {
    filter = marketcapSearch.value.toUpperCase();
    li = marketcapList.getElementsByTagName('li');
  }

  // Loop through all list items, and hide those who don't match the search query
  for (let i = 0; i < li.length; i++) {
    let txtValue = li[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = '';
    } else {
      li[i].style.display = 'none';
    }
  }
}

const createSlides = (coinsArray) => {
  // Create an slide for each coin and append it to the slide Track.
  coinsArray.forEach((coin) => {
    // Create all elements
    let slide = document.createElement('div');
    slide.classList.add('slide');
    let coinSymbol = document.createElement('p');
    coinSymbol.classList.add('coin-symbol');
    coinSymbol.innerText = coin.symbol + ':';
    let coinPrice = document.createElement('p');
    coinPrice.classList.add('coin-price');
    coinPrice.innerText = '$' + coin.current_price;
    let coinLogo = document.createElement('img');
    coinLogo.classList.add('coin-logo');
    coinLogo.src = coin.image;

    // Append everything
    slide.appendChild(coinLogo);
    slide.appendChild(coinSymbol);
    slide.appendChild(coinPrice);
    slideTrack.appendChild(slide);
  });
};

const updatePrices = () => {
  fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2Cethereum-classic%2Cethereum%2Cnamecoin%2Clitecoin%2Cmonero%2Cripple%2Ccardano%2Csolana&order=market_cap_desc&per_page=100&page=1&sparkline=false'
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log('Error on HTTP request');
      }
    })
    .then((coinsArray) => {
      let coinPrices = document.querySelectorAll('.coin-price');

      // Update prices
      for (let index = 0; index < coinsArray.length; index++) {
        if (coinsArray[index].id === 'bitcoin') {
          btcPrice.innerText = '$' + coinsArray[index].current_price;
        }
        coinPrices[index].innerHTML = '$' + coinsArray[index].current_price;
      }
    })
    .catch(function (error) {
      console.log(`Something went wrong fetching! Error: ${error.message}`);
    });
};

const fetchCoins = () => {
  // To add more coins to fetch, you need to edit the API's link according to Coingecko's docs.
  // Remember that adding or removing a coin will also affect the slider's css. Since its width depends
  // on how many coins we are fetching.
  fetch(
    'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=bitcoin%2C%20ethereum%2C%20ethereum-classic%2Csolana%2Cripple%2Cnamecoin%2Cmonero%2Ccardano%2Clitecoin&order=market_cap_desc&per_page=100&page=1&sparkline=false'
  )
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.log('Error on HTTP request');
      }
    })
    .then((coinsArray) => {
      // Set Bitcoin price
      coinsArray.forEach((coin) => {
        if (coin.id === 'bitcoin') {
          btcPrice.innerText = '$' + coin.current_price;
        }
      });
      // Create the slides for the price slider inside the header
      createSlides(coinsArray);
      insertCoinsToList(coinsArray, 'priceList');
      insertCoinsToList(coinsArray, 'marketcapList');
    })
    .catch(function (error) {
      console.log(`Something went wrong fetching! Error: ${error.message}`);
    });

  // Coingecko update their prices every 1 to 10 minutes. Let's go for half (5 mins)
  setInterval(updatePrices, 300000);
};

document.addEventListener('load', fetchCoins());
