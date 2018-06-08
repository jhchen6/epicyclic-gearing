var toothWidth = 8,
    toothHight = 8,
    centerRadius = 10,
    annulusThick = 8,
    numToothSun = 16,
    numToothPlanet = 32,
    numPlanet = 3;

var sunRadius = numToothSun * toothWidth / Math.PI,
    planetRadius = numToothPlanet * toothWidth / Math.PI,
    revolutionRadius = sunRadius + planetRadius + toothHight,
    annulusRadius = revolutionRadius + planetRadius + toothHight,
    numToothAnnulus = Math.round(annulusRadius * Math.PI / toothWidth),
    outerRaius = annulusRadius + annulusThick;

var rotateSpeedSun = 0.7,
    rotateSpeedPlanet = -rotateSpeedSun / numToothPlanet * numToothSun,
    rotateSpeedAnnulus = -rotateSpeedSun / numToothAnnulus * numToothSun,
    rotateSpeedG,
    rotateSun = 0,
    rotateG = 0,
    rotatePlanet = 0,
    rotateAnnulus = 0;

var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

//paint
var g = svg.append("g")
    .attr("transform", "translate(" + [width / 2, height / 2] + ")")
    .append("g");

var annulus = g.append("g")
    .attr("class", "annulus")
    .append("path")
    .datum({
        n: numToothAnnulus,
        r: outerRaius,
        orientation: 0
    })
    .attr("d", gearPath);

var sun = g.append("g")
    .attr("class", "sun")
    .append("path")
    .datum({
        n: numToothSun,
        r: centerRadius,
        orientation: 1
    })
    .attr("d", gearPath);

var angle = -Math.PI / 2,
    anglePiece = Math.PI * 2 / numPlanet,
    data = [];

for (var i = 0; i < numPlanet; i++) {
    angle += anglePiece;
    data.push({
        angle: angle,
        n: numToothPlanet,
        r: centerRadius,
        orientation: 1
    });
}

var planets = g.selectAll(".planet")
    .data(data)
    .enter().append("g")
    .attr("class", "planet")
    .attr("transform", d => "translate(" + [revolutionRadius * Math.cos(d.angle),
        revolutionRadius * Math.sin(d.angle)
    ] + ")")
    .append("path").attr("d", gearPath);

//animate
d3.select("form").on("change", function () {
    d3.event.preventDefault();
    timer.stop();
    setRotateSpeed();
    timer.restart(rotate);
});

setRotateSpeed();
var timer = d3.timer(rotate);

function gearPath(d) {
    var n = d.n,
        centerRadius = d.r,
        orientation = d.orientation;
    var radius = n * toothWidth / Math.PI,
        angle = 0,
        anglePiece = Math.PI / n,
        halfToothW = toothWidth / 2,
        halfAngleP = anglePiece / 2,
        radialCoef = 180 / Math.PI,
        path = [];
    path.push("M ", radius * Math.cos(angle), " ", radius * Math.sin(angle));

    for (var i = 0; i < n; i++) {
        angle += anglePiece;
        path.push("A ", halfToothW, " ", toothHight, " ",
            ((angle - halfAngleP) * radialCoef + 90), " 0 ", orientation,
            " ", radius * Math.cos(angle), " ", radius * Math.sin(angle));
        angle += anglePiece;
        path.push("A ", radius, " ", radius, " 0 0 1 ",
            radius * Math.cos(angle), " ", radius * Math.sin(angle));
    }

    path.push("M 0 ", -centerRadius);
    path.push("A ", centerRadius, " ", centerRadius, " 0 0 0 0 ", centerRadius);
    path.push("A ", centerRadius, " ", centerRadius, " 0 0 0 0 ", -centerRadius);
    return path.join("");
}

function setRotateSpeed() {
    var reference = d3.select("input[name='reference']:checked").attr("id").substring(4);
    if (reference === "annulus") {
        rotateSpeedG = -rotateSpeedAnnulus;
    } else if (reference === "planet") {
        rotateSpeedG = 0;
    } else if (reference === "sun") {
        rotateSpeedG = -rotateSpeedSun;
    }
}

function rotate() {
    rotateSun += rotateSpeedSun;
    rotateG += rotateSpeedG;
    rotatePlanet += rotateSpeedPlanet;
    rotateAnnulus += rotateSpeedAnnulus;
    sun.attr("transform", "rotate(" + rotateSun + ")");
    g.attr("transform", "rotate(" + rotateG + ")");
    annulus.attr("transform", "rotate(" + rotateAnnulus + ")");
    planets.attr("transform", "rotate(" + rotatePlanet + ")");
}