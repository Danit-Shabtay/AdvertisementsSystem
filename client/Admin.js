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
//let newAdvTrIndex = INVALID_TD_INDEX;

async function addAdvertismentHandler() {
  console.log("Add pressed!");

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

    await addAdvertismentRequest(allRowData)
      .then(res => res.json())
      .then(data => console.log(`new ID=${data["id"]}`));

    // Call server API request to add new adv

    // Update table row:
    //  Add controllers
    //  Update IDs
    
    // Add new adv to global state

    advAddGlobalState = false;
  }
}

/**
  Insert new row to the table with tr id=TR_NEW_ID.
*/
function insertNewEmptyRow() {
  let content = "";
  content += '<tr id="' + TR_NEW_ID + '">';
  content += '<td contenteditable="false">';
  //content += '<button id="' + BTN_DELETE_ID_PREFIX + '" adv-id="' +  '"> <img src="/resources/delete_btn.png" /></button>';
  //content += '<button id="' + BTN_EDIT_ID_PREFIX + '" adv-id="' +  '"> <img src="/resources/edit_btn.png" /></button>';
  content += '</td >';
  content += '<td contenteditable="false" adv-property="name">' + '</td>';
  content += '<td contenteditable="false" adv-property="screenId">' + '</td>';
  content += '<td contenteditable="false" adv-property="template">' + '</td>';
  content += '<td contenteditable="false" adv-property="length">' + '</td>';
  content += '<td contenteditable="false" adv-property="date-start">' + '</td>';
  content += '<td contenteditable="false" adv-property="date-end">' + '</td>';
  content += '<td contenteditable="false" adv-property="time-start">' + '</td>';
  content += '<td contenteditable="false" adv-property="time-end">' + '</td>';
  content += '<td contenteditable="false" adv-property="days">' + '</td>';
  content += '<td contenteditable="false" adv-property="text">' + '</td>';
  content += '<td contenteditable="false" adv-property="photo-name">' + '</td>';
  content += '</tr>';
  
  $("#adsTable").append(content);
}

/*
function addControllersToTr(trId) {
  $("#" + trId).
}
*/

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

async function editRow(event) {
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

function setIdToTd(originalTrId, newIdValue) {
  $("#" + originalTrId).attr("adv-id", newIdValue);
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
    return new Date(arr[index].timeFrame[0].time.start).toLocaleDateString();
  } catch (error) {
    return "";
  }
}

function getTimeEnd(arr, index) {
  try {
    return new Date(arr[index].timeFrame[0].time.end).toLocaleDateString();
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
        content += '<td contenteditable="false">';
        content += '<button id="' + BTN_DELETE_ID_PREFIX + data[i]._id + '" adv-id="' + data[i]._id + '"> <img src="/resources/delete_btn.png" /></button>';
        content += '<button id="' + BTN_EDIT_ID_PREFIX + data[i]._id + '" adv-id="' + data[i]._id + '"> <img src="/resources/edit_btn.png" /></button>';
        content += '</td > ';
        content += '<td contenteditable="false" adv-property="name">' + data[i].name + '</td>';
        content += '<td contenteditable="false" adv-property="screenId">' + data[i].screenId + '</td>';
        content += '<td contenteditable="false" adv-property="template">' + data[i].template + '</td>';
        content += '<td contenteditable="false" adv-property="length">' + data[i].length + '</td>';
        content += '<td contenteditable="false" adv-property="date-start">' + getDateStart(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="date-end">' + getDateEnd(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="time-start">' + getTimeStart(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="time-end">' + getTimeStart(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="days">' + getTimeFrameDays(data, i) + '</td>';
        content += '<td contenteditable="false" adv-property="text">' + data[i].text + '</td>';
        content += '<td contenteditable="false" adv-property="images">' + data[i].images + '</td>';
        content += '</tr>';
      }
    
      // Inserting rows into table
      $('#adsTable').append(content);

      // Add events to table buttons:
      for (var i = 0; i < data.length; i++) {
        $('#' + BTN_EDIT_ID_PREFIX + data[i]._id).on("click", editRow);
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
 