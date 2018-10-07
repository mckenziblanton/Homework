function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  var fetch_meta = "/metadata/" + sample
  console.log(fetch_meta);

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(fetch_meta).then((sample_metadata) => {
      console.log(sample_metadata);

      // Use d3 to select the panel with id of `#sample-metadata`
      var panel = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      panel.html("");

      // Use `Object.entries` to add each key and value pair to the panel
      var metadata = Object.entries(sample_metadata);

      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.

      metadata.forEach((sample)=> {
        panel.append('li')
        .text(`${sample[0]}: ${sample[1]}`)
      })
    })
}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var fetch_meta = "/samples/" + sample
  console.log(fetch_meta);
    
  d3.json(fetch_meta).then((sample_data)=>{

    var response = sample_data;
    console.log("Sample Data")
    console.log(sample_data);
    console.log("Response");
    console.log(response);
    
    
    // @TODO: Build a Bubble Chart using the sample data
    var trace_b = [
      {
      x: response.otu_ids,
      y: response.sample_values, 
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      },
      text: response.otu_labels,
      height: 600,
      width: 600
      }
    ];

    var layout_b = {
      xaxis: {title: 'OTU ID'}
    };
    
    Plotly.newPlot('bubble', trace_b, layout_b);

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var trace_p = [
      {
        labels: response.otu_ids.slice(0,10),
        values: response.sample_values.slice(0,10),
        type: "pie",
        hovertext: response.otu_labels.slice(0,10)
      }
    ];

    console.log(trace_p);

    var layout_p = {
      title: 'OTU ID',
      height: 600,
      width: 600
    };

    Plotly.newPlot('pie', trace_p, layout_p);
  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
