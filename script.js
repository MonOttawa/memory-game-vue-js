var CardTypes = [
  {
    name: "vue",
    image: "https://vuejs.org/images/logo.png",
    info: "Vue.js features an incrementally adoptable architecture that focuses on declarative rendering and component composition. Advanced features required for complex applications such as routing, state management and build tooling are offered via officially maintained supporting libraries and packages."
  },
  {
    name: "express",
    image: "https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67",
    info: "Express.js, or simply Express, is a web application framework for Node.js, released as free and open-source software under the MIT License. It is designed for building web applications and APIs.[3] It has been called the de facto standard server framework for Node.js"
  },
  {
    name: "mongo",
    image: "https://www.klipfolio.com/sites/default/files/integrations/mongo.png",
    info: "MongoDB is a cross-platform document-oriented database program. It is issued under the Server Side Public License, which is currently being evaluated for OSI certification. Classified as a NoSQL database program, MongoDB uses JSON-like documents with schemata. MongoDB is developed by MongoDB Inc."
  },
  {
    name: "nodejs",
    image: "https://worldvectorlogo.com/logos/nodejs-icon.svg",
    info: "Node.js is an open-source, cross-platform JavaScript run-time environment that executes JavaScript code outside of a browser. Typically, JavaScript is used primarily for client-side scripting, in which scripts written in JavaScript are embedded in a webpage's HTML and run client-side by a JavaScript engine in the user's web browser. Node.js lets developers use JavaScript to write Command Line tools and for server-side scripting—running scripts server-side to produce dynamic web page content before the page is sent to the user's web browser."
  },
  {
    name: "webpack",
    image: "https://raw.githubusercontent.com/webpack/media/master/logo/icon-square-big.png",
    info: "Webpack is an open-source JavaScript module bundler. Its main purpose is to bundle JavaScript files for usage in a browser, yet it is also capable of transforming, bundling, or packaging just about any resource or asset. Webpack takes modules with dependencies and generates static assets representing those modules. It is a module bundler primarily for JavaScript, but it can transform front-end assets like HTML, CSS, even images if the corresponding plugins are included."
  },
  {
    name: "babel",
    image: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Babel_Logo.svg/1200px-Babel_Logo.svg.png",
    info: "Babel or Babel.js is a free and open-source JavaScript compiler and configurable transpiler used in web development. Babel allows software developers to write source code in a preferred programming language or markup language and have it translated by Babel into JavaScript, a language understood by modern web browsers."
  }
];

var shuffleCards = function shuffleCards() {
  var cards = [].concat(_.cloneDeep(CardTypes), _.cloneDeep(CardTypes));
  return _.shuffle(cards);
};

new Vue({
  el: "#app",

  data: {
    showSplash: false,
    cards: [],
    started: false,
    startTime: 0,
    turns: 0,
    flipBackTimer: null,
    timer: null,
    time: "--:--",
    score: 0
  },

  methods: {
    resetGame: function resetGame() {
      this.showSplash = false;
      var cards = shuffleCards();
      this.turns = 0;
      this.score = 0;
      this.started = false;
      this.startTime = 0;

      _.each(cards, function (card) {
        card.flipped = false;
        card.found = false;
      });

      this.cards = cards;
    },

    closeModal: function closeModal() {
      $("#info").hide();
    },

    showModal: function showModal() {
      $("#info").fadeIn("slow");
    },

    flippedCards: function flippedCards() {
      return _.filter(this.cards, function (card) { return card.flipped; });
    },

    sameFlippedCard: function sameFlippedCard() {
      var flippedCards = this.flippedCards();
      if (flippedCards.length == 2) {
        if (flippedCards[0].name == flippedCards[1].name)
          return true;
      }
    },

    capitalizeString: function capitalizeString(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    showInfoAboutFramework: function showInfoAboutFramework() {
      this.showModal();
      var flippedCard = this.flippedCards()[0];
      $("#info-title").html("Want to learn more about " + this.capitalizeString(flippedCard.name) + "?");
      $("#info-description").html(flippedCard.info);
      $("#info-image").attr("src", flippedCard.image);
    },

    setCardFounds: function setCardFounds() {
      _.each(this.cards, function (card) {
        if (card.flipped)
          card.found = true;
      });
    },

    checkAllFound: function checkAllFound() {
      var foundCards = _.filter(this.cards, function (card) { return card.found; });
      if (foundCards.length == this.cards.length)
        return true;
    },

    startGame: function startGame() {
      var _this = this;
      this.started = true;
      this.startTime = moment();

      this.timer = setInterval(function () {
        _this.time = moment(moment().diff(_this.startTime)).format("mm:ss");
      }, 1000);
    },

    finishGame: function finishGame() {
      this.started = false;
      clearInterval(this.timer);
      var score = 1000 - (moment().diff(this.startTime, 'seconds') - CardTypes.length * 5) * 3 - (this.turns - CardTypes.length) * 5;
      this.score = Math.max(score, 0);
      this.showSplash = true;
    },

    flipCard: function flipCard(card) {
      var _this2 = this;
      if (card.found || card.flipped) return;

      if (!this.started) {
        this.startGame();
      }

      var flipCount = this.flippedCards().length;
      if (flipCount == 0) {
        card.flipped = !card.flipped;
      } else
        if (flipCount == 1) {
          card.flipped = !card.flipped;
          this.turns += 1;

          if (this.sameFlippedCard()) {
            // Match!
            this.showInfoAboutFramework();

            this.flipBackTimer = setTimeout(function () {
              _this2.clearFlipBackTimer();
              _this2.setCardFounds();
              _this2.clearFlips();

              if (_this2.checkAllFound()) {
                _this2.finishGame();
              }

            }, 200);
          } else {
            // Wrong match
            this.flipBackTimer = setTimeout(function () {
              _this2.clearFlipBackTimer();
              _this2.clearFlips();
            }, 1000);
          }
        }
    },

    clearFlips: function clearFlips() {
      _.map(this.cards, function (card) { return card.flipped = false; });
    },

    clearFlipBackTimer: function clearFlipBackTimer() {
      clearTimeout(this.flipBackTimer);
      this.flipBackTimer = null;
    }
  },

  created: function created() {
    this.resetGame();
  }
});
