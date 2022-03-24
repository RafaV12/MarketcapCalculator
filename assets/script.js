const btcPrice = document.getElementById('btc-price');
const slideTrack = document.querySelector('.slide-track');
const priceOfCoin = document.getElementById('price-of');
const selectModal = document.querySelector('.select-modal');
const selectList = document.getElementById('select-coin-list');
const exitBtn = document.querySelector('.exit-btn');

priceOfCoin.addEventListener('click', () => {
  selectModal.classList.toggle('hidden');
});

exitBtn.addEventListener('click', () => {
  selectModal.classList.toggle('hidden');
});

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

const insertCoinsToList = (coinsArray) => {
  coinsArray.forEach((coin) => {
    // Get the coin id and image
    const { id, image, symbol } = coin;
    // Create all elements
    let listItem = document.createElement('li');
    let coinId = document.createElement('p');
    coinId.innerText = id;
    let coinLogo = document.createElement('img');
    coinLogo.classList.add('coin-logo');
    coinLogo.src = image;

    // Append everything
    listItem.appendChild(coinLogo);
    listItem.appendChild(coinId);
    selectList.appendChild(listItem);

    // On coin select (click), fetch its data and display the symbol, logo and current price
    listItem.addEventListener('click', () => {
      // Get the child elements of the symbol wrapper to change them,
      // depending on which coin was selected
      const currentPrice = document.getElementById('current-price');
      const currencyLogo = document.getElementById('currency-logo');
      const currencySymbol = document.getElementById('currency-symbol');

      currencyLogo.src = image;
      currencySymbol.innerText = symbol;

      fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd&include_market_cap=true&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false`
      )
        .then((response) => response.json())
        .then((data) => {
          const { [coin.id]: id } = data;
          currentPrice.innerHTML = '$' + id.usd;
        });

      // Close modal
      selectModal.classList.toggle('hidden');
    });
  });
};

function filterList() {
  // Declare variables
  let input = document.getElementById('search-input');
  let filter = input.value.toUpperCase();
  let li = selectList.getElementsByTagName('li');

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
      // Set Bitcoin price
      coinsArray.forEach((coin) => {
        if (coin.id === 'bitcoin') {
          btcPrice.innerText = '$' + coin.current_price;
        }
      });
      // Create the slides for the price slider inside the header
      createSlides(coinsArray);
      insertCoinsToList(coinsArray);
    })
    .catch(function (error) {
      console.log(`Something went wrong fetching! Error: ${error.message}`);
    });

  // Coingecko update their prices every 1 to 10 minutes. Let's go for half (5 mins)
  setInterval(updatePrices, 300000);
};

document.addEventListener('load', fetchCoins());
