const express = require('express')
const fs = require("fs");
const app = express()
const port = process.env.PORT || 5000;

app.use(express.static("public"));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');


app.get('/', (req, res) => {
  console.log("Root Request")
})

app.get('/rate', getRate);

app.listen(port, () => {
  console.log(`Postal Calc listening at http://localhost:${port}`)
})

//models
function getRate (request, response) {
    
    var type = request.query.mailType;
    var weight = request.query.weight;
    var cost = 0;
    var typeDisplay = "";

    switch(type) {
        case 'stamped':
            cost = calcStamped(weight);
            typeDisplay = "Letters (Stamped)";
            break;
        case 'metered':
            cost = calcMetered(weight);
            typeDisplay = "Letters (Metered)"
            break;
        case 'flats':
            cost = calcFlats(weight);
            typeDisplay = "Large Envelopes (Flats)"
            break;
        case 'firstClass':
            cost = calcFirstClass(weight);
            typeDisplay = "First-Class Package Service—Retail";
            break;
    }

    const params = {typeDisplay: typeDisplay, weight: weight, cost: cost};
    response.render('pages/result', params);
}

function calcStamped (weight) {
    var base = .55;
    var multiplier = .20;
    var maxWeight = 3.5
    var cost = 0;
    if (weight >= maxWeight) {
        cost = 1.15
    } else {
        cost = calcRate(base, multiplier, maxWeight, weight);
    }

    return cost;
}

function calcMetered (weight) {
    var base = .51;
    var multiplier = .20;
    var maxWeight = 3.5
    var cost = 0;
    if (weight >= maxWeight) {
        cost = 1.11;
    } else {
        cost = calcRate(base, multiplier, maxWeight, weight);
    }

    return cost;
};

function calcFlats(weight) {
    var base = 1;
    var multiplier = .20;
    var maxWeight = 13
    var cost = calcRate(base, multiplier, maxWeight, weight);

    return cost;
}

function calcRate (base, multiplier, maxWeight, weight) {
    var cost = base + ((multiplier * weight) - multiplier);

    return cost;
};

function calcFirstClass (weight) {
    var cost = 0;
    if (weight <= 4 ) {
        return cost = 4;
    }
    else if (weight <= 8) {
        return cost = 4.80;
    }
    else if (weight <= 12){
        return cost = 5.50;
    } else {
        return cost = 6.25;
    }
}

//views
function renderIndex(request, response) {
    response.sendFile('/index.html');
}