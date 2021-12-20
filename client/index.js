import { Advertisment } from './Advertisment.js';

const print = (data) => { console.log(data) };

const sleep = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}

/**
 * Parse JSON array and return list of objects.
 * 
 * @param {*} config JSON wiht array of Advertisments
 * @returns List of Advertisment objects
 */
function parseConfiguration(config) {

    let advertismentList = [];

    config.forEach((element) => {
        const currentAdvertisment = new Advertisment(element.name, element.template, element.length, element.timeFrame, element.images, element.text);
        advertismentList.push(currentAdvertisment);
    });

    return advertismentList;
}

function showAdvertisment(advertismentToShow) {

    const advertismentId = "#advertisment";
    const htmlTemplatePath = "/templates/";
    const htmlExtension = ".html";

    print("showing Advertisment: " + advertismentToShow.name);
    const templateToUse = htmlTemplatePath + advertismentToShow.template + htmlExtension;

    $.get(templateToUse, (data, status) => {

        $(advertismentId).html(data);

        if (status == "success") {
            advertismentToShow.text.forEach((element, index) => {
                $("#p" + index).text(element);
            });
            advertismentToShow.images.forEach((image, index) => {
                $("#img" + index).attr("src", "/img/" + image);
            });
        }
    });
}

async function showAdvertismentLoop(advertismentList) {

    while (true) {
        for (let i = 0; i < advertismentList.length; ++i) {
            const advertisment = advertismentList[i];
            
            showAdvertisment(advertisment);
            await sleep(advertisment.length * 1000);
        }
    }
}

function getIdFromParams(){
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);

    const id = urlparams.get("id");
    return id;
}

function fetchConfiguration(screenId) {

    const apiResult = $.ajax({
        url: "config?id=" + screenId,
        contentType: "application/json",
        dataType: 'json',
        async: false
    });

    return apiResult.responseJSON;
}

function main() {

    const screenId = getIdFromParams();
    const config = fetchConfiguration(screenId);
    const configArrayJson = JSON.parse(config);

    print(configArrayJson);

    if (configArrayJson.length == 0) {
        print("ERROR empty configuration recieved");
        return;
    }

    const advertismentList = parseConfiguration(configArrayJson);

    showAdvertismentLoop(advertismentList);
}

main();