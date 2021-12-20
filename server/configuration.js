const configuration =
    [
        {
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

module.exports = {
    configuration
};