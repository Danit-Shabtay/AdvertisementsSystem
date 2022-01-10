const configuration =
    [
        {
            "screenId": 0,
            "name": "one",
            "template": "A",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 0),
                    "end": new Date(2022, 11)
                },
                "days": [0, 1, 2, 3, 4, 5, 6],
                "time": {
                    "start": new Date(0, 0, 0, 0),
                    "end": new Date(0, 0, 0, 23)
                }
            }],
            "images": ["1.jpg"],
            "text": ["Adidas 50% sale !!!"]
        },
        {
            "screenId": 1,
            "name": "two",
            "template": "B",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 2),
                    "end": new Date(2022, 3)
                },
                "days": [0, 1, 2, 3, 4, 5, 6],
                "time": {
                    "start": new Date(0, 0, 0, 0),
                    "end": new Date(0, 0, 0, 23)
                }
            }],
            "images": ["2.jpg"],
            "text": ["Nike 30% sale"]
        },
        {
            "screenId": 2,
            "name": "three",
            "template": "C",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 4),
                    "end": new Date(2022, 5, 15)
                },
                "days": [0, 1, 2, 3, 4, 5, 6],
                "time": {
                    "start": new Date(0, 0, 0, 1),
                    "end": new Date(0, 0, 0, 23)
                }
            }],
            "images": ["3.jpg"],
            "text": ["McDonalds, Yummy !"]
        },
        {
            "screenId": 0,
            "name": "four",
            "template": "D",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 2, 29),
                    "end": new Date(2022, 4, 15)
                },
                "days": [3],
                "time": {
                    "start": new Date(0, 0, 0, 1),
                    "end": new Date(0, 0, 0, 19)
                }
            }],
            "images": ["4.jpg"],
            "text": ["Makeup course"]
        },
        {
            "screenId": 2,
            "name": "five",
            "template": "B",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 2, 29),
                    "end": new Date(2022, 4, 15)
                },
                "days": [3],
                "time": {
                    "start": new Date(0, 0, 0, 1),
                    "end": new Date(0, 0, 0, 19)
                }
            }],
            "images": ["5.jpg"],
            "text": ["The best cyber course !!"]
        },
        {
            "screenId": 1,
            "name": "six",
            "template": "C",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 2, 29),
                    "end": new Date(2022, 4, 15)
                },
                "days": [3],
                "time": {
                    "start": new Date(0, 0, 0, 1),
                    "end": new Date(0, 0, 0, 19)
                }
            }],
            "images": ["6.jpg"],
            "text": ["AI course - The future is already here !"]
        },
        {
            "screenId": 2,
            "name": "seven",
            "template": "A",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": new Date(2021, 2, 29),
                    "end": new Date(2022, 4, 15)
                },
                "days": [3],
                "time": {
                    "start": new Date(0, 0, 0, 1),
                    "end": new Date(0, 0, 0, 19)
                }
            }],
            "images": ["7.jpg"],
            "text": ["coca cola O_O"]
        }
    ];

/**
 * Not in use right now.
 * @param {*} config 
 * @returns 
 */
function parseConfiguration(config) {

    let arr = [];

    config.forEach((element) => {
        arr.push(element);
    });

    return arr;
}

/**
 * Not in use right now.
 * @param {*} screenId 
 * @returns 
 */
function getPartialConfiguration(screenId) {
    const arrSize = configuration.length;

    let numOfGroups = 0;

    if (arrSize % SCREEN_NUMBER == 0) {
        numOfGroups = arrSize / SCREEN_NUMBER;
    }
    else {
        numOfGroups = (arrSize / SCREEN_NUMBER) + 1;
    }

    const startIndex = screenId * SCREEN_NUMBER;

    let endIndex = screenId * SCREEN_NUMBER + (SCREEN_NUMBER - 1);
    
    if (endIndex >= arrSize) {
        endIndex = arrSize - 1;
    }

    const configList = parseConfiguration(configuration);
    const screenConfiguration = configList.slice(startIndex, endIndex + 1);

    return screenConfiguration;
}

module.exports = {
    configuration
};