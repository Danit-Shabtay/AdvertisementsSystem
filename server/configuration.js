//ads
const configuration =
    [
        {
            "screenId": 0,
            "name": "Adidas",
            "template": "A",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["1.jpg"],
            "text": ["Adidas 50% sale !!!"]
        },
        {
            "screenId": 1,
            "name": "Nike",
            "template": "B",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["2.jpg"],
            "text": ["Nike 30% sale"]
        },
        {
            "screenId": 2,
            "name": "McDonalds",
            "template": "C",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["3.jpg"],
            "text": ["McDonalds, Yummy !"]
        },
        {
            "screenId": 0,
            "name": "Makeup course",
            "template": "D",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["4.jpg"],
            "text": ["Makeup course"]
        },
        {
            "screenId": 2,
            "name": "cyber course",
            "template": "B",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["5.jpg"],
            "text": ["The best cyber course !!"]
        },
        {
            "screenId": 1,
            "name": "AI course",
            "template": "C",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["6.jpg"],
            "text": ["AI course - The future is already here !"]
        },
        {
            "screenId": 2,
            "name": "coca cola",
            "template": "A",
            "length": 4,
            "timeFrame": [{
                "dates": {
                    "start": "2021-11-01",
                    "end": "2022-11-01"
                },
                "days": [0,1,2,3,4,5,6],
                "time": {
                    "start": "2000-01-01T00:00:00",
                    "end": "2000-01-01T23:00:00"
                }
            }],
            "images": ["7.jpg"],
            "text": ["coca cola O_O"]
        }
    ];
    const admins =
        [
            {
             "username": "admin",
            "password": "password"
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
    configuration,
    admins
};