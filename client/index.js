import { Advertisment } from './Advertisment.js';

const print = (data) => { console.log(data) };

const sleep = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}

/**
 * Parse JSON array of advertisments and return it as list of advertisments objects.
 * 
 * @param {*} config JSON array of Advertisments data.
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

/**
 * Request advertisment data from the server for this screen,
 * by the screen ID.
 * 
 * @param {*} screenId The identifier of this screen (client).
 * @returns Array of advertisment for this screen
 */
function fetchAdvertisments(screenId) {

    const apiResult = $.ajax({
        url: "advertisment?id=" + screenId,
        contentType: "application/json",
        dataType: 'json',
        async: false
    });

    return apiResult.responseJSON;
}

function main() {

    const screenId = getIdFromParams();
    const advertismentsArray = fetchAdvertisments(screenId);

    print(advertismentsArray);

    if (advertismentsArray.length == 0) {
        print("Could not received advertisments for this screen");
        return;
    }

    const advertismentList = parseConfiguration(advertismentsArray);

    showAdvertismentLoop(advertismentList);
}

main();