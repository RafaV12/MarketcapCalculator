const btcPrice = document.getElementById('btc-price');
const slideTrack = document.querySelector('.slide-track');

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
        coinPrices[index].innerHTML = coinsArray[index].current_price;
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
    })
    .catch(function (error) {
      console.log(`Something went wrong fetching! Error: ${error.message}`);
    });

  setInterval(updatePrices, 300000);
};

document.addEventListener('load', fetchCoins());
