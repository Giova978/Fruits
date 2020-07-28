const c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const scoreH1 = document.getElementById("score");
const comboH1 = document.getElementById("combo");
let score = 0;
let combo = 0;

let x, y, randomOut, randomCurve, randomIn, radomForIn, randomForOut, randomHeight;
let playing = false;
const fruits = [
    {
        type: "banana",
        image: document.getElementById("banana"),
        splash: document.getElementById("splashBanana"),
        comboAdded: false,
    },
    {
        type: "waterMelon",
        image: document.getElementById("sandia"),
        splash: document.getElementById("splashSandia"),
        comboAdded: false,
    },
    {
        type: "tomtato",
        image: document.getElementById("tomato"),
        splash: document.getElementById("splashTomato"),
        comboAdded: false,
    },
    {
        type: "orange",
        image: document.getElementById("orange"),
        splash: document.getElementById("splashOrange"),
        comboAdded: false,
    },
    {
        type: "limon",
        image: document.getElementById("limon"),
        splash: document.getElementById("splashLimon"),
        comboAdded: false,
    },
    {
        type: "frutaDragon",
        image: document.getElementById("frutaDragon"),
        splash: document.getElementById("splashDragon"),
        comboAdded: false,
    },
    {
        type: "bomb",
        image: document.getElementById("bomb"),
        splash: document.getElementById("explosion"),
        comboAdded: false,
    },
];

// Fruis in the canvas
const fruitsToDraw = {};
/*  [
    [x, y]
]
*/
// If a fruit get destroyed will insert a splash here
const blood = [];

// Set to draw over other pixels
ctx.globalCompositeOperation = "destination-over";

// Insert in fruitsToDraw, generate random trajectory for the fruits
function sendCube(index) {
    randomForOut = Math.floor(Math.random() * (770 - 600) + 700);
    radomForIn = Math.floor(Math.random() * (270 - 150) + 150);
    randomOut = Math.floor(Math.random() * (randomForOut - 400) + 400);
    randomCurve = Math.floor(Math.random() * 500);
    randomIn = Math.floor(Math.random() * (radomForIn - 20) + 20);
    randomHeight = Math.floor(Math.random() * (900 - 600) + 600);

    let cBez = [
        { x: randomIn, y: 800 },
        { x: randomIn, y: randomCurve },
        { x: randomOut, y: randomCurve },
        { x: randomOut, y: 900 },
    ];

    let cBez1 = [
        { x: 150, y: 800 },
        { x: 150, y: randomCurve },
        { x: randomOut, y: randomCurve },
        { x: randomOut, y: 900 },
    ];

    let cBez2 = [
        { x: 100, y: 800 },
        { x: 100, y: randomCurve },
        { x: randomOut, y: randomCurve },
        { x: randomOut, y: 900 },
    ];

    let cBez3 = [
        { x: 125, y: 800 },
        { x: 125, y: randomCurve },
        { x: randomOut, y: randomCurve },
        { x: randomOut, y: 900 },
    ];

    let cBez4 = [
        { x: 175, y: 800 },
        { x: 175, y: randomCurve },
        { x: randomOut, y: randomCurve },
        { x: randomOut, y: 900 },
    ];

    // let cBezOC = [
    //     { x: randomIn, y: 800 },
    //     { x: 200, y: 0 },
    //     { x: 400, y: 200 },
    //     { x: randomOut, y: 900 },
    // ];

    const cBezArr = [cBez, cBez1, cBez2, cBez3, cBez4];

    const cBezSelected = cBezArr[Math.floor(Math.random() * cBezArr.length)];

    const fruitToSelected = Math.floor(Math.random() * fruits.length);

    fruitsToDraw[index] = {
        fruit: Object.assign({}, fruits[fruitToSelected]),
        points: findCBezPoints(cBezSelected),
        cBez: cBezSelected,
    };
}

// In charge of move the fruit trough the canvas and check if gets destroyed
function drawFruit({ fruit, points, cBez }) {
    const actualPos = points[0];
    points.splice(0, 6);
    ctx.beginPath();
    // drawBez(cBez);
    ctx.drawImage(fruit.image, actualPos.x, actualPos.y, 50, 50);
    ctx.stroke();

    if (between(x, actualPos.x - 20, actualPos.x + 20) && between(y, actualPos.y - 20, actualPos.y + 20)) {
        blood.push({
            splash: fruit.splash,
            x: actualPos.x,
            y: actualPos.y,
        });

        if (fruit.type === "bomb") {
            updateScore(-3);
            resetCombo();
        } else {
            updateScore(1);
            addCombo();
            fruit.comboAdded = true;
        }

        let timeout = setTimeout(() => {
            blood.shift();
            clearTimeout(timeout);
        }, 3000);

        points.length = 0;
    }
}

// In charge of telling the drawFruit what to draw
function drawFruitMain() {
    ctx.clearRect(0, 0, c.width, c.height);
    // Check if a fruit finished his cylce and remove it
    for (const index in fruitsToDraw) {
        const fruit = fruitsToDraw[index];
        if (fruit.points && fruit.points.length <= 20) {
            if (fruit.fruit.type != "bomb" && !fruit.fruit.comboAdded) {
                resetCombo();
            }
            delete fruitsToDraw[index];
            continue;
        }

        drawFruit(fruit);
    }

    // Paint the splash "blood"
    for (let i = 0; i < blood.length; i++) {
        const splash = blood[i].splash;
        ctx.beginPath();
        ctx.drawImage(splash, blood[i].x, blood[i].y, 90, 90);
    }
}

// Entry point of the cycle
function drawMain() {
    if (Object.keys(fruitsToDraw).length <= 0) {
        playing = false;
    }

    // Generate random fruits and call drawFruitMain to draw them
    if (!playing) {
        playing = true;

        const fruitsToDrawNumber = Math.floor(Math.random() * (8 - 2) + 2);

        for (let i = 1; i <= fruitsToDrawNumber; i++) {
            sendCube(i);
        }
    }

    drawFruitMain();

    requestAnimationFrame(drawMain);
}

drawMain();

// Fot checkin if the cursos is in certain range of the fruit itself
function between(x, min, max) {
    return x >= min && x <= max;
}

function findCBezPoints(b) {
    let pts = [b[0]];
    let lastPt = b[0];
    let tests = 5000;
    for (let t = 0; t <= tests; t++) {
        let pt = getCubicBezierXYatT(b[0], b[1], b[2], b[3], t / tests);
        let dx = pt.x - lastPt.x;
        let dy = pt.y - lastPt.y;
        let d = Math.sqrt(dx * dx + dy * dy);
        let dInt = parseInt(d);
        if (dInt > 0 || t == tests) {
            lastPt = pt;
            pts.push(pt);
        }
    }
    return pts;
}

function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
    let x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    let y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return {
        x: x,
        y: y,
    };
}

function CubicN(T, a, b, c, d) {
    let t2 = T * T;
    let t3 = t2 * T;
    return a + (-a * 3 + T * (3 * a - a * T)) * T + (3 * b + T * (-6 * b + b * 3 * T)) * T + (c * 3 - c * 3 * T) * t2 + d * t3;
}

function drawBez(b) {
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(b[0].x, b[0].y);
    ctx.bezierCurveTo(b[1].x, b[1].y, b[2].x, b[2].y, b[3].x, b[3].y);
    ctx.stroke();
}

function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
}

c.addEventListener("mousemove", function (e) {
    getCursorPosition(canvas, e);
});

function updateScore(scoreToAdd) {
    score += scoreToAdd;
    scoreH1.innerHTML = `${score}`;
}

function addCombo() {
    combo += 1;
    comboH1.innerHTML = `${combo}`;
}

function resetCombo() {
    combo = 0;
    comboH1.innerHTML = `${combo}`;
}
