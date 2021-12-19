const configuration =
    [{
        "name": "first",
        "template": "A",
        "length": 5,
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
    }, {
        "name": "second",
        "template": "B",
        "length": 5,
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
    }, {
        "name": "third",
        "template": "C",
        "length": 5,
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
    }, {
        "name": "Fourth",
        "template": "D",
        "length": 5,
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
    }];

export { configuration };