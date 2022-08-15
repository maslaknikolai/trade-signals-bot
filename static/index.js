let START_BALANCE = 1
let TOTAL_TRADERS_COUNT = 100
let ONE_TRADE = 10
let FEE_FOR_TRADE = 0.02
let MUTATE = 0.05
let THINK_ABOUT_BARS_COUNT = 20

let bars = []
let counter = THINK_ABOUT_BARS_COUNT
let checkbox
let slider
let traders = []
let savedTraders = []
let generationCounters = []
let MAX
let MIN
let extrasensTrader = createExtrasensTrader()
let randomTrader = createRandomTrader()
let alwaysBuyingTrader = createStableTrader('buy')
let alwaysSellingTrader = createStableTrader('sell')
let isExtrasensTraining = !true
let isDebug = false

function setup() {
  fetch(`/kline.json`)
    .then(r => r.json())
    .then(r => {
      bars = r.map(createBar)
      MAX = Math.max(...bars.map(it => it.high))
      MIN = Math.min(...bars.map(it => it.low))
    })

  createCanvas(1000, 480);
  textFont('monospace');

  ml5.tf.setBackend("cpu");
  checkbox = createCheckbox('Play', false)
  slider = createSlider(1, 30, 1);

  // let nn = ml5.neuralNetwork({
  //   inputs: 8,
  //   outputs: 2,
  //   task: 'classification',
  //   debug: true
  // })


  // trainingData.forEach(it => {
  //   nn.addData(it.inputs, [it.output])
  // })

  // setTimeout(() => {
  //   nn.normalizeData();
  //   nn.train({
  //     epochs: 320
  //   }, () => {
  //     console.log(1);
  //   });
  // }, 3000)


  traders = Array(TOTAL_TRADERS_COUNT).fill(null).map(createTrader)
}

function draw() {
  if (!checkbox.checked()) {
    return
  }

  for (let n = 0; n < slider.value(); n += 1) {
    extrasensTrader.update()
    randomTrader.update()
    alwaysBuyingTrader.update()
    alwaysSellingTrader.update()

    traders.forEach((trader, i) => {
      trader.update(true)

      if (isExtrasensTraining) {
        if (trader.state.lastTrade !== extrasensTrader.state.lastTrade) {
          savedTraders.push(traders.splice(i, 1)[0]);
        }
      } else {
        if (trader.state.balance <= 0) {
          savedTraders.push(traders.splice(i, 1)[0]);
        }
      }
    })

    if (traders.length === 0) {
      nextGeneration();
      return;
    }

    const barsForThinkAbout = bars.slice(
      counter - THINK_ABOUT_BARS_COUNT,
      counter
    )

    extrasensTrader.think(barsForThinkAbout)
    randomTrader.think(barsForThinkAbout)
    alwaysBuyingTrader.think(barsForThinkAbout)
    alwaysSellingTrader.think(barsForThinkAbout)
    traders.forEach(trader => {
      trader.think(barsForThinkAbout)
    })

    counter++
  }

  background(0);

  const slice = bars.slice(counter, counter + 100)
  slice.forEach((bar, index) => {
    bar.draw(index)
  })

  stroke(0);
  fill(255);
  textSize(16);
  text(`Generation: ${generationCounters.length + 1}`, 20, 20)
  text(`Counter: ${counter} / ${bars.length}`, 20, 40)
  text(`Generation counters: ${generationCounters.join(', ')}`, 20, 60)

  const maxCounter = generationCounters.length ? Math.max(...generationCounters) : 0
  const numberOfGenerationWithMaxCounter = generationCounters.length
    ? generationCounters.indexOf(maxCounter) + 1
    : '-'
  text(`Best generation: ${numberOfGenerationWithMaxCounter}. Record: ${maxCounter}`, 20, 80)

  textSize(10);
  text(`Extrasens: $${extrasensTrader.state.balance}`, 20, 100)
  text(`Random trader: $${randomTrader.state.balance}`, 20, 110)
  text(`Always buying trader: $${alwaysBuyingTrader.state.balance}`, 20, 120)
  text(`Always selling trader: $${alwaysSellingTrader.state.balance}`, 20, 130)

  traders.forEach((trader, i) => {
    fill(255);
    textSize(10);
    text(`$${trader.state.balance}`, 20, 140 + i * 10)
  })
}

function createBar(klineItem) {

  function draw(index) {
    const graphHeight = height

    const groundedMax = MAX - MIN

    const [bodyLowest, bodyHighest] = [klineItem.open, klineItem.close].sort().map(it => it - MIN)
    const wasClosedLower = klineItem.close < klineItem.open

    if (wasClosedLower) {
      stroke(255, 0, 0);
      fill(255, 0, 0);
    } else {
      stroke(0, 255, 0);
      fill(0, 255, 0);
    }

    const bodyHighestPercent = bodyHighest / groundedMax
    const bodyLowestPercent = bodyLowest / groundedMax

    const bodyTopOffset = graphHeight - (graphHeight * bodyHighestPercent)
    const bodyHeight = (graphHeight - (graphHeight * bodyLowestPercent)) - bodyTopOffset
    const bodyWidth = 10
    const bodyLeftOffset = bodyWidth + (index * bodyWidth) + (index * bodyWidth / 2)

    rect(
      bodyLeftOffset,
      bodyTopOffset,
      bodyWidth,
      bodyHeight
    );

    const [shadowLowest, shadowHighest] = [klineItem.low, klineItem.high].map(it => it - MIN)
    const shadowHighestPercent = shadowHighest / groundedMax
    const shadowLowestPercent = shadowLowest / groundedMax

    const shadowTopOffset = graphHeight - (graphHeight * shadowHighestPercent)
    const shadowHeight = (graphHeight - (graphHeight * shadowLowestPercent)) - shadowTopOffset
    const shadowWidth = 2
    const shadowLeftOffset = bodyLeftOffset + bodyWidth / 2 - shadowWidth / 2

    rect(
      shadowLeftOffset,
      shadowTopOffset,
      shadowWidth,
      shadowHeight,
    );
  }

  return {
    ...klineItem,
    draw
  }
}

function createExtrasensTrader() {
  return createTrader({
    classifySync: (inputs) => {
      const currentBar = bars[counter]
      const nextBar = bars[counter+1]

      // window.aaa = [
      //   ...(window.aaa || []),
      //   {
      //     inputs,
      //     output: nextBar.close >= currentBar.close ? 'buy' : 'sell'
      //   }
      // ]

      if (nextBar.close >= currentBar.close) {
        return [{label: 'buy'}]
      } else {
        return [{label: 'sell'}]
      }
    }
  })
}

function createRandomTrader() {
  return createTrader({
    classifySync: () => {
      return [{label: random() >= 0.5 ? 'buy' : 'sell'}]
    }
  })
}

function createStableTrader(action) {
  return createTrader({
    classifySync: () => {
      return [{label: action}]
    }
  })
}

function createTrader(brain) {
  let state = {
    balance: START_BALANCE,
    maxBalance: START_BALANCE,
    liveBarsCount: 0,
    correctMovesCount: 0,
    lastTrade: '',
    fitness: 0,
    brain: (() => {
      if (brain) {
        return brain
      }

      return ml5.neuralNetwork({
        inputs: (THINK_ABOUT_BARS_COUNT * 2) - 2,
        outputs: ["sell", "buy"],
        task: "classification",
        noTraining: true,
      });
    })()
  }

  function think(barsForThinking) {
    const barsForThinkingReversed = barsForThinking.slice().reverse()

    const volumeDiffs = barsForThinkingReversed
      .map((bar, i) => i < barsForThinkingReversed.length - 1
        ? bar.volume/barsForThinkingReversed[i+1].volume
        : null
      )
      .slice(0, barsForThinkingReversed.length - 1)

    const closePriceDiffs = barsForThinkingReversed
      .map((bar, i) => i < barsForThinkingReversed.length - 1
        ? bar.close/barsForThinkingReversed[i+1].close
        : null
      )
      .slice(0, barsForThinkingReversed.length - 1)

    const inputs = [
      ...volumeDiffs,
      ...closePriceDiffs
    ]

    const results = state.brain.classifySync(inputs);

    if (results[0].label === "buy") {
      state.lastTrade = "buy"
    } else {
      state.lastTrade = "sell"
    }
  }

  function update(isRealTrader) {
    state.liveBarsCount += 1;

    if (!state.lastTrade) {
      return
    }


    if (isRealTrader) {
      if (state.lastTrade === extrasensTrader.lastTrade) {
        state.correctMovesCount += 1;
      }
    }

    const previousBar = bars[counter - 1]
    const currentBar = bars[counter]
    const nextBar = bars[counter + 1]

    if (!previousBar) {
      return
    }

    const changePercent = currentBar.close / previousBar.close - 1
    const oppositeChangePercent = -changePercent

    const currentChangePercent = state.lastTrade === 'buy'
      ? changePercent
      : oppositeChangePercent

    const income = ONE_TRADE * currentChangePercent

    const incomeWithoutFee = income - FEE_FOR_TRADE
    const newBalance = state.balance + incomeWithoutFee

    state.balance = newBalance
    state.balance = +state.balance.toFixed(4)

    state.maxBalance = Math.max(state.maxBalance, state.balance)
  }

  return {
    state,
    think,
    update
  }
}

function nextGeneration() {
  calculateFitness();

  for (let i = 0; i < TOTAL_TRADERS_COUNT; i += 1) {
    traders[i] = reproduce();
  }

  for (let i = 0; i < TOTAL_TRADERS_COUNT; i += 1) {
    savedTraders[i].state.brain.dispose();
  }

  extrasensTrader = createExtrasensTrader()
  randomTrader = createRandomTrader()
  alwaysBuyingTrader = createStableTrader('buy')
  alwaysSellingTrader = createStableTrader('sell')
  savedTraders = [];

  // const sumOfCounters = generationCounters.reduce((a, i) => a + i, 0);

  generationCounters = [
    counter,
    // counter - sumOfCounters,
    ...generationCounters
  ]

  counter = THINK_ABOUT_BARS_COUNT;
}

function reproduce() {
  const traderA = pickOne();
  const traderB = pickOne();

  if (isDebug) {
    debugger
  }

  const childBrain = traderA.state.brain.crossover(traderB.state.brain);
  childBrain.mutate(MUTATE);
  return createTrader(childBrain);
}

function pickOne() {
  let index = 0;
  let r = random(1);

  while (r > 0) {
    r -= savedTraders[index].state.fitness;
    index += 1;
  }

  index -= 1;

  const trader = savedTraders[index];

  return trader;
}

function calculateFitness() {
  const sum = savedTraders.reduce((acc, it) => acc + it.state.correctMovesCount, 0)

  for (const trader of savedTraders) {
    trader.state.fitness = trader.state.correctMovesCount / sum;
  }
}
