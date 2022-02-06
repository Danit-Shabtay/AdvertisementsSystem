
const SERVER="localhost:3000";
$(document).ready(function () {
fetch('http://'+SERVER+"/advertisment?id=0")
 .then(response =>response.json())
 .then(function(data){
  var content = '';
    for(var i=0;i<data.length;i++){
      //Construction of rows having data from json object
      content += '<tr>';
      content+='<td><a href="https://google.com">'+data[i].name+'</a></td>'
      content += '<td>' + data[i].screenId + '</td>'; 
      content += '<td>' + data[i].template + '</td>'; 
      content += '<td>' + data[i].length + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].dates.start).toLocaleDateString() + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].dates.end).toLocaleDateString() + '</td>'; 
      content += '<td>' + new Date(data[i].timeFrame[0].time.start).toLocaleTimeString() + '</td>';
      content += '<td>' + new Date(data[i].timeFrame[0].time.end).toLocaleTimeString() + '</td>'; 
      content += '</tr>';
    }
    //Inserting rows into table 
    $('#adsTable').append(content);
  })
})

fetch('http://'+SERVER+"/screens")
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
 