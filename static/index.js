const coin = document.location.search?.match(/coin=(\w*)/)?.[1].toUpperCase()
let kline = []
let counter = 0
let checkbox

function setup() {
  fetch(`/kline.json`)
    .then(r => r.json())
    .then(r => {
      kline = r
    })

  createCanvas(640, 480);
  ml5.tf.setBackend("cpu");
  checkbox = createCheckbox('Play', false)
}

function draw() {
  background(0);

  const slice = kline.slice(counter, counter + 100)
  slice.forEach((bar, index) => createBar(bar, index, slice))

  if (checkbox.checked()) {
    counter++
  }
}

function createBar(bar, index, slice) {
  const graphHeight = height

  const MAX = Math.max(...slice.map(it => it.high))
  const MIN = Math.min(...slice.map(it => it.low))
  const groundedMax = MAX - MIN

  const [bodyLowest, bodyHighest] = [bar.open, bar.close].sort().map(it => it - MIN)
  const wasClosedLower = bar.close < bar.open

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

  const [shadowLowest, shadowHighest] = [bar.low, bar.high].map(it => it - MIN)
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
