// from data.js
var tableData = data;

// YOUR CODE HERE!
// Select the submit button
var submit = d3.select("#filter-btn");

// Event for submission
submit.on("click", function() {

  // Prevent the page from refreshing
  d3.event.preventDefault();

  // Select the input element 
  var inputElement = d3.select("#datetime");

  // Get the value property of the input element
  var inputValue = inputElement.property("value");

  let filteredData = tableData.filter(dates => dates.datetime === inputValue)
  console.log(filteredData)

    var tbody = d3.select('#ufo-table>tbody')

    filteredData.forEach(function(output){
        var row = tbody.append('tr')
        Object.entries(output).forEach(function([key, value]){
            var cell = tbody.append('td')
            cell.text(value)
        })
    })
    d3.select('#ufo-table>tbody')
        .append('tr').text(filteredData)
})