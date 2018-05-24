$(document).ready(start);

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
    rotateSpeedPlanet = - rotateSpeedSun / numToothPlanet * numToothSun,
    rotateSpeedAnnulus = - rotateSpeedSun / numToothAnnulus * numToothSun,
    rotateSun = 0,
    rotateG2 = 0,
    rotatePlanet = 0,
    rotateAnnulus = 0,
    animationFrameID;

function start() {
    var $svg = $("svg"),
        svg = $svg[0],
        width = +$svg.attr("width"),
        height = +$svg.attr("height");

    //paint
    var $g1 = append(svg, "g")
        .attr("transform", "translate(" + [width / 2, height / 2] + ")");

    var $g2 = append($g1, "g");

    var $gAnnulus = append($g2, "g")
        .attr("class", "annulus");
    var $annulus = append($gAnnulus, "path")
        .attr("d", gearPath(numToothAnnulus, outerRaius, 0));

    var $gSun = append($g2, "g")
        .attr("class", "sun");
    var $sun = append($gSun, "path")
        .attr("d", gearPath(numToothSun, centerRadius, 1));

    var angle = -Math.PI / 2,
        anglePiece = Math.PI * 2 / numPlanet,
        planetPath = gearPath(numToothPlanet, centerRadius, 1);
    for (var i = 0; i < numPlanet; i++) {
        angle += anglePiece;
        var $g = append($g2, "g")
            .attr("class", "planet")
            .attr("transform", "translate(" +
                [revolutionRadius * Math.cos(angle),
                revolutionRadius * Math.sin(angle)] + ")");
        append($g, "path").attr("d", planetPath);
    }

    //animate
    $("form").change(function (evt) {
        evt.preventDefault();
        cancelAnimationFrame(animationFrameID);
        rotate($("input[name='reference']:checked").attr("id").substring(4));
    });

    rotate($("input[name='reference']:checked").attr("id").substring(4));

    function rotate(reference) {
        var rotateSpeedG2;
        if (reference === "annulus") {
            rotateSpeedG2 = -rotateSpeedAnnulus;
        }
        else if (reference === "planet") {
            rotateSpeedG2 = 0;
        }
        else if (reference === "sun") {
            rotateSpeedG2 = -rotateSpeedSun;
        }

        animationFrameID = requestAnimationFrame(loop);

        function loop() {
            rotateSun += rotateSpeedSun;
            rotateG2 += rotateSpeedG2;
            rotatePlanet += rotateSpeedPlanet;
            rotateAnnulus += rotateSpeedAnnulus;
            $sun.attr("transform", "rotate(" + rotateSun + ")");
            $g2.attr("transform", "rotate(" + rotateG2 + ")");
            $annulus.attr("transform", "rotate(" + rotateAnnulus + ")");
            $(".planet path").attr("transform", "rotate(" + rotatePlanet + ")");

            animationFrameID = requestAnimationFrame(loop);
        }
    }
}

function gearPath(n, centerRadius, orientation) {
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

function append(parent, tag) {
    var elem = document.createElementNS("http://www.w3.org/2000/svg", tag);
    $(parent).append(elem);
    return $(elem);
}