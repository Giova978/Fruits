const c = document.getElementById("canvas");
let ctx = c.getContext("2d");

const scoreH1 = document.getElementById("score");
let score = 0;

let x, y, randomOut, randomCurve, randomIn, radomForIn, randomForOut, randomHeight;
let playing = false;
const fruits = [
    {
        type: "banana",
        image: document.getElementById("banana"),
        splash: document.getElementById("splashBanana"),
    },
    {
        type: "waterMelon",
        image: document.getElementById("sandia"),
        splash: document.getElementById("splashSandia"),
    },
    {
        type: "bomb",
        image: document.getElementById("bomb"),
        splash: document.getElementById("explosion"),
    },
];

const fruitsToDraw = {};
/*  [
    [x, y]
]
*/
const blood = [];

ctx.globalCompositeOperation = "destination-over";

function sendCube(index) {
    randomForOut = Math.floor(Math.random() * (770 - 600) + 700);
    radomForIn = Math.floor(Math.random() * (270 - 150) + 150);
    randomOut = Math.floor(Math.random() * (randomForOut - 400) + 400);
    randomCurve = Math.floor(Math.random() * (500 - 0) + 0);
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
        fruit: fruits[fruitToSelected],
        points: findCBezPoints(cBezSelected),
        cBez: cBezSelected,
    };
}

function drawFruit({ fruit, points, cBez }) {
    ctx.beginPath();
    // drawBez(cBez);
    ctx.drawImage(fruit.image, points[0].x, points[0].y, 30, 30);
    ctx.stroke();

    if (between(x, points[0].x - 10, points[0].x + 10) && between(y, points[0].y - 10, points[0].y + 10)) {
        blood.push({
            splash: fruit.splash,
            x: points[0].x,
            y: points[0].y,
        });

        if (fruit.type === "bomb") updateScore(-3);

        updateScore(1);

        let timeout = setTimeout(() => {
            blood.shift();
            clearTimeout(timeout);
        }, 3000);

        points.length = 0;
    }

    points.splice(0, 6);
}

function drawFruitMain() {
    ctx.clearRect(0, 0, c.width, c.height);
    for (const index in fruitsToDraw) {
        const fruit = fruitsToDraw[index];
        if (fruit.points && fruit.points.length <= 20) {
            delete fruitsToDraw[index];
            continue;
        }

        drawFruit(fruit);
    }

    for (let i = 0; i < blood.length; i++) {
        const splash = blood[i].splash;
        ctx.beginPath();
        ctx.drawImage(splash, blood[i].x, blood[i].y, 90, 90);
    }
}

function drawMain() {
    if (Object.keys(fruitsToDraw).length <= 0) {
        playing = false;
    }

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

function between(x, min, max) {
    return x >= min && x <= max;
}

function findCBezPoints(b) {
    var pts = [b[0]];
    var lastPt = b[0];
    var tests = 5000;
    for (var t = 0; t <= tests; t++) {
        var pt = getCubicBezierXYatT(b[0], b[1], b[2], b[3], t / tests);
        var dx = pt.x - lastPt.x;
        var dy = pt.y - lastPt.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var dInt = parseInt(d);
        if (dInt > 0 || t == tests) {
            lastPt = pt;
            pts.push(pt);
        }
    }
    return pts;
}

function getCubicBezierXYatT(startPt, controlPt1, controlPt2, endPt, T) {
    var x = CubicN(T, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = CubicN(T, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return {
        x: x,
        y: y,
    };
}

function CubicN(T, a, b, c, d) {
    var t2 = T * T;
    var t3 = t2 * T;
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
    scoreH1.innerHTML = `Tu puntuacion es: ${score}`;
}