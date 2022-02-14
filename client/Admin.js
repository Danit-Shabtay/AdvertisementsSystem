const SERVER = "localhost:3000";
const BTN_ADD_ID_NAME = "btn_add";
const BTN_EDIT_ID_PREFIX = "btn_edit_";
const BTN_DELETE_ID_PREFIX = "btn_delete_";
const TR_ID_PREFIX = "tr_";
const TR_NEW_ID = TR_ID_PREFIX + "new";
const INVALID_TD_INDEX = -1;

// Global state variables:
let advEditGlobalState = false;
let advertismentGlobalData = [];
let advAddGlobalState = false;

async function addAdvertismentHandler() {

  // Enter add row state:
  if (!advAddGlobalState) {
    changeBtnImg(BTN_ADD_ID_NAME, "/resources/save_btn.png");
    insertNewEmptyRow();
    changeRowContentEditableState(TR_NEW_ID, true);

    advAddGlobalState = true;
  }
  // Exit add row state:
  else {
    changeBtnImg(BTN_ADD_ID_NAME, "/resources/add_btn.png");
    changeRowContentEditableState(TR_NEW_ID, false);

    const allRowData = readRowData(TR_NEW_ID);

    // Call server API request to add new adv:
    let newAdv = "";
    await addAdvertismentRequest(allRowData)
      .then((res) => res.json())
      .then((data) => {
        newAdv = data["advertismentData"];
      });

    const newAdvId = newAdv._id;
    console.log(`New Advertisment ID received, ID=${newAdvId}`);

    // Update table row:
    const trNewId = TR_ID_PREFIX + newAdvId;

    setIdToTd(TR_NEW_ID, trNewId);
    setAdvIdToTd(newAdvId);
    addControllersToTr(trNewId, newAdvId);

    // Add new adv to global state
    addNewAdvToGlobalData(newAdv);

    advAddGlobalState = false;
  }
}

function addNewAdvToGlobalData(newAdv) {
  advertismentGlobalData.push(newAdv);
}

function addControllersToTr(trId, newAdvId) {
  $('#' + trId).each ((trIndex, tr) => {
    $(tr).children('td').each((tdIndex, td) => {
      const controllersAttribute = $(td).attr("controllers");
      if (typeof controllersAttribute !== 'undefined' && controllersAttribute !== false) {
        let content = '';
        
        content += '<button id="' + BTN_DELETE_ID_PREFIX + newAdvId + '" adv-id="' + newAdvId + '"><img src="/resources/delete_btn.png"/></button>';
        content += '<button id="' + BTN_EDIT_ID_PREFIX + newAdvId + '" adv-id="' + newAdvId + '"><img src="/resources/edit_btn.png"/></button>';
        
        $(td).append(content);
        $("#" + BTN_DELETE_ID_PREFIX + newAdvId).on("click", deleteAdvertismentHandler);
        $("#" + BTN_EDIT_ID_PREFIX + newAdvId).on("click", editRowHandler);
      }
     });
  });
}

/**
  Insert new row to the table with tr id=TR_NEW_ID.
*/
function insertNewEmptyRow() {
  let content = "";
  content += '<tr id="' + TR_NEW_ID + '">';
  content += '<td controllers contenteditable="false"></td >';
  content += '<td contenteditable="false" adv-property="name"></td>';
  content += '<td contenteditable="false" adv-property="screenId"></td>';
  content += '<td contenteditable="false" adv-property="template"></td>';
  content += '<td contenteditable="false" adv-property="length"></td>';
  content += '<td contenteditable="false" adv-property="date-start"></td>';
  content += '<td contenteditable="false" adv-property="date-end"></td>';
  content += '<td contenteditable="false" adv-property="time-start"></td>';
  content += '<td contenteditable="false" adv-property="time-end"></td>';
  content += '<td contenteditable="false" adv-property="days"></td>';
  content += '<td contenteditable="false" adv-property="text"></td>';
  content += '<td contenteditable="false" adv-property="images"></td>';
  content += '</tr>';
  
  $("#adsTable").append(content);
}

function deleteAdvertismentHandler(event) {
  const deleteButtonId = event.currentTarget.id;
  const advertismentId = $('#' + deleteButtonId).attr("adv-id");

  deleteAdvertismentFromDb(advertismentId)
    .then(deleteAdvertismentFromTable(advertismentId))
    .then(deleteAdverismentFromGlobalData(advertismentId));
}

async function deleteAdvertismentFromDb(advertismentId) {
  const serverApi = 'http://' + SERVER + "/advertisment?id=" + advertismentId;

  return fetch(serverApi,
    {
      method: 'DELETE',
      headers: {
        'x-api-key': localStorage.getItem('Advertisment-token') || ''
      }
    });
}

async function deleteAdvertismentFromTable(advertismentId) {
  $('#' + TR_ID_PREFIX + advertismentId).remove();
}

function deleteAdverismentFromGlobalData(advertismentId) {
  const advertismentIndex = advertismentGlobalData.map(adv => adv._id).indexOf(advertismentId);
  advertismentGlobalData.splice(advertismentIndex, 1);
}

async function editRowHandler(event) {
  const editButtonId = event.currentTarget.id; // btn_edit_XXX
  const advertismentId = $('#' + editButtonId).attr("adv-id");
  const advertismentTrId = TR_ID_PREFIX + advertismentId;

  // Enter edit row state:
  if (!advEditGlobalState) {
    changeBtnImg(editButtonId, "/resources/save_btn.png");
    changeRowContentEditableState(advertismentTrId, true);

    advEditGlobalState = true;
  }
  // Exit edit row state:
  else {
    changeBtnImg(editButtonId, "/resources/edit_btn.png");
    changeRowContentEditableState(advertismentTrId, false);

    let allRowData = readRowData(advertismentTrId);
    allRowData["_id"] = getIdFromTd(advertismentTrId);
    const originalAdvData = advertismentGlobalData.filter((adv) => adv._id == advertismentId)[0];

    const advertismentDataToUpdate = getDataDiff(allRowData, originalAdvData);
    if (jQuery.isEmptyObject(advertismentDataToUpdate)) {
      // Nothing to update
      return;
    }

    await updateAdvertismentRequest(advertismentId, advertismentDataToUpdate).then(
      updateAdvertismentDataInGlobalState(
        advertismentId,
        advertismentDataToUpdate
      )
    );

    advEditGlobalState = false;
  }
}

function updateAdvertismentDataInGlobalState(advertismentId, advertismentDataToUpdate) {
  const advertismentIndex = advertismentGlobalData
    .map((adv) => adv._id)
    .indexOf(advertismentId);

  for (const [updateKey, updateValue] of Object.entries(advertismentDataToUpdate)) {
    advertismentGlobalData[advertismentIndex][updateKey] = updateValue;
  }
  console.log(`Update page global state: ID=${advertismentId} values:${JSON.stringify(advertismentDataToUpdate)}`);
}

async function updateAdvertismentRequest(advertismentId, advertismentData) {
  const serverApi = "http://" + SERVER + "/advertisment?id=" + advertismentId;

  return fetch(serverApi, {
    method: "PUT",
    headers: {
      "x-api-key": localStorage.getItem("Advertisment-token") || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertismentData,
    }),
  });
}

async function addAdvertismentRequest(advertismentData) {
  const serverApi = "http://" + SERVER + "/advertisment";

  return fetch(serverApi, {
    method: "POST",
    headers: {
      "x-api-key": localStorage.getItem("Advertisment-token") || "",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      advertismentData,
    }),
  });
}

function getDataDiff(updatedAdvData, originalAdvData) {

  let advDataToUpdate = {};

  for (const [updatedKey, updatedValue] of Object.entries(updatedAdvData)) {
    for (const [originalKey, originalValue] of Object.entries(originalAdvData)) {
      if (updatedKey == originalKey)
      {
        if (updatedValue != originalValue)
        {
          advDataToUpdate[updatedKey] = updatedValue;
        }
      }
    }
  }

  return advDataToUpdate;
}

function changeBtnImg(btnId, imgPath) {
  $('#' + btnId).children('img').attr('src', imgPath);
}

function changeRowContentEditableState(trId, state) {
  const stateBool = state ? "true" : "false";

  $('#' + trId).each ((trIndex, tr) => {
    $(tr).children('td').each((tdIndex, td) => {
      $(td).attr("contenteditable", stateBool);
     });
  });                  
}

function getIdFromTd(trId) {
  return $("#" + trId).attr("adv-id");
}

function setIdToTd(originalTrId, newTdIdValue) {
  $("#" + originalTrId).attr("id", newTdIdValue);
}

function setAdvIdToTd(originalTrId, newAdvIdValue) {
  $("#" + originalTrId).attr("adv-id", newAdvIdValue);
}

function readRowData(trId) {

  let data = {};

  $('#' + trId).each ((trIndex, tr) => {
    $(tr).children('td').each((tdIndex, td) => {

      const advProperty = $(td).attr("adv-property");

      if (advProperty) {
        const text = $(td).text();
        data[advProperty] = text;
      }

     });
  });

  // Fix special properties to support arrays members 
  // and nested objects in the advertisment objec:

  // convert to array:
  data["images"] = [data["images"]];

  var startDate=data["date-start"];
  startDate=startDate.slice(-4)+"-"+startDate.slice(3,5)+"-"+startDate.slice(0,2);//Cast to server date format
  var endDate=data["date-end"];
  endDate=endDate.slice(-4)+"-"+endDate.slice(3,5)+"-"+endDate.slice(0,2);//Cast to server date format
  // convert to nested objects:
  data["timeFrame"] = {
    dates: {
      start: startDate,
      end: endDate,
    },
    days: data["days"].split(",").map((i) => Number(i)),
    time: {
      start: "2000-01-01T"+data["time-start"],//Cast to server time format
      end: "2000-01-01T"+data["time-end"],//Cast to server time format
    },
  };

  return data;
}

function getDateStart(arr, index) {
  try {
    return new Date(arr[index].timeFrame[0].dates.start).toLocaleDateString();
  } catch (error) {
    return "";
  }
}

function getDateEnd(arr, index) {
  try {
    return new Date(arr[index].timeFrame[0].dates.end).toLocaleDateString();
  } catch (error) {
    return "";
  }
}

function getTimeStart(arr, index) {
  try {
    return new Date(arr[index].timeFrame[0].time.start).toLocaleTimeString();
  } catch (error) {
    return "";
  }
}

function getTimeEnd(arr, index) {
  try {
    return new Date(arr[index].timeFrame[0].time.end).toLocaleTimeString();
  } catch (error) {
    return "";
  }
}

function getTimeFrameDays(arr, index) {
  try {
    return arr[index].timeFrame[0].days;
  } catch (error) {
    return "";
  }
}

function getScreenIdValue(arr, index) {
  try {
    const value = arr[index].screenId;
    return (value != null) ? value : "";
  } catch (error) {
    return "";
  }
}

function getLengthValue(arr, index) {
  try {
    const value = arr[index].length;
    return (value != null) ? value : "";
  } catch (error) {
    return "";
  }
}

$(document).ready(function () {
  fetch('http://' + SERVER + "/adminAd?id=0", {
    headers: {
      'x-api-key': localStorage.getItem('Advertisment-token') || ''
    }
  })
    .then(response => response.json())
    .then(function (data) {
      var content = '';
      for (var i = 0; i < data.length; i++) {
        // Construction of rows having data from json object
        // 'adv-property' is our special attribute to indicates for each table-data who is the 
        // corresponding key in the advertisment.
        content += '<tr id="' + TR_ID_PREFIX + data[i]._id + '" adv-id="' + data[i]._id + '">';
        content += '<td controllers contenteditable="false">';
        content += '<button id="' + BTN_DELETE_ID_PREFIX + data[i]._id + '" adv-id="' + data[i]._id + '"> <img src="/resources/delete_btn.png" /></button>';
        content += '<button id="' + BTN_EDIT_ID_PREFIX + data[i]._id + '" adv-id="' + data[i]._id + '"> <img src="/resources/edit_btn.png" /></button>';
        content += '</td > ';
        content += '<td contenteditable="false" adv-property="name">' + data[i].name + '</td>';
        content += '<td contenteditable="false" adv-property="screenId">' + getScreenIdValue(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="template">' + data[i].template + '</td>';
        content += '<td contenteditable="false" adv-property="length">' + getLengthValue(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="date-start">' + getDateStart(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="date-end">' + getDateEnd(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="time-start">' + getTimeStart(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="time-end">' + getTimeEnd(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="days">' + getTimeFrameDays(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="text">' + data[i].text + '</td>';
        content += '<td contenteditable="false" adv-property="images">' + data[i].images + '</td>';
        content += '</tr>';
      }
    
      // Inserting rows into table
      $('#adsTable').append(content);

      // Add events to table buttons:
      for (var i = 0; i < data.length; i++) {
        $("#" + BTN_EDIT_ID_PREFIX + data[i]._id).on("click", editRowHandler);
        $('#' + BTN_DELETE_ID_PREFIX + data[i]._id).on("click", deleteAdvertismentHandler);
      }

      // Add event to add button:
      $('#' + BTN_ADD_ID_NAME).on("click", addAdvertismentHandler);

      // Save advertisment for latter:
      advertismentGlobalData = [...data];
    });
})

fetch('http://' + SERVER + "/screens", {
  headers: {
    'x-api-key': localStorage.getItem('Advertisment-token') || ''
  }
})
  .then(response => response.json())
  .then(function (data) {
    var content = '';
    for (var i = 0; i < data.length; i++) {
      //Construction of rows having data from json object
      content += '<tr>';
      content += '<td>' + data[i]._id + '</td>';
      const date = new Date(data[i].lastConnection);
      content += '<td>' + date.toLocaleDateString() + " " + date.toLocaleTimeString() + '</td>';
      content += '<td>' + data[i].isOnline + '</td>';
      content += '</tr>';
    }
    //Inserting rows into table 
    $('#screensTable').append(content);
  });
 