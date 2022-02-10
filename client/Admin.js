const SERVER = "localhost:3000";

function deleteAdvertismentHandler(event) {
  const advertismentId = event.currentTarget.id;

  deleteAdvertismentFromDb(advertismentId)
    .then(deleteAdvertismentFromTable(advertismentId));
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
  $('#' + advertismentId).remove();
}

$(document).ready(function () {
  //'http://'+SERVER+"/advertisment?id=0"
fetch('http://'+SERVER+"/adminAd?id=0",{
  headers:{
    'x-api-key':localStorage.getItem('Advertisment-token') || ''
  }
})
 .then(response =>response.json())
 .then(function(data){
  var content = '';
    for(var i=0;i<data.length;i++){
      //Construction of rows having data from json object
      content += '<tr id=' + data[i]._id + '>';
      content += '<td>' + data[i].name + '</a></td>'
      content += '<td>' + data[i].screenId + '</td>'; 
      content += '<td>' + data[i].template + '</td>'; 
      content += '<td>' + data[i].length + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].dates.start).toLocaleDateString() + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].dates.end).toLocaleDateString() + '</td>'; 
      content += '<td>' + new Date(data[i].timeFrame[0].time.start).toLocaleTimeString() + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].time.end).toLocaleTimeString() + '</td>'; 
      content += '</tr>';
    }
    
   // Inserting rows into table
   $('#adsTable').append(content);

   // Add onclick event to each table row:
   // TODO: Replace with another handler: open edit/delete screen
   for (var i = 0; i < data.length; i++) {
      $('#' + data[i]._id).on("click", deleteAdvertismentHandler);
   }
  })
})

fetch('http://'+SERVER+"/screens",{
  headers:{
    'x-api-key':localStorage.getItem('Advertisment-token') || ''
  }
})
 .then(response =>response.json())
 .then(function(data){
  var content = '';
    for(var i=0;i<data.length;i++){
      //Construction of rows having data from json object
      content += '<tr>';
      content += '<td>' + data[i]._id + '</td>';
      const date=new Date(data[i].lastConnection);
      content += '<td>' + date.toLocaleDateString()+" "+date.toLocaleTimeString()+ '</td>';
      content += '<td>' + data[i].isOnline+ '</td>';
      content += '</tr>';
    }
    //Inserting rows into table 
    $('#screensTable').append(content);
  })
 