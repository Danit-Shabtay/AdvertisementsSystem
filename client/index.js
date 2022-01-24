const SERVER="localhost:3000";

const print = (data) => { console.log(data) };

const sleep = (ms) => {
    return new Promise(res => setTimeout(res, ms));
}
function getTime(date) {
    return new Date(0, 0, 0, date.getHours());
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

async function showAdvertismentLoop(screenId) {
    while(true){
        await fetch('http://'+SERVER+"/advertisment?id=" + screenId)
        .then(response =>response.json())
        .then(async function(data){
            for(var i=0;i<data.length;i++){
                for(var j=0;j<data[i].timeFrame.length;j++){
                    var currTF=data[i].timeFrame[j];
                    var todaysDate=(new Date()).getTime();
                    var startDate = (new Date(currTF.dates.start)).getTime() - todaysDate;
                    var endDate = (new Date(currTF.dates.end)).getTime() - todaysDate;
                    var nowHour=getTime(new Date());
                    var startHour = getTime((new Date(currTF.time.start))) - nowHour;
                    var endHour = getTime((new Date(currTF.time.end))) - nowHour;
                    if (startDate <= 0 && endDate >= 0 && startHour <= 0 && endHour >= 0 && currTF.days.includes(new Date().getDay())) {
                        showAdvertisment(data[i]);
                        await sleep(data[i].length*1000);
                    }
                }
            }
        })
    }
}

function getIdFromParams(){
    const queryString = window.location.search;
    const urlparams = new URLSearchParams(queryString);

    const id = urlparams.get("id");
    return id;
}

function main() {
    const screenId = getIdFromParams();
    showAdvertismentLoop(screenId);
}

main();