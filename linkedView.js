// setup for selection of domains

// setup for input view

// set the dimensions and margins of the graph
const margin_of_input = {top: 10, right: 10, bottom: 10, left: 10},
    inputWidth = 460 - margin_of_input.left - margin_of_input.right,
    inputHeight = 400 - margin_of_input.top - margin_of_input.bottom;

const titleInputView = d3.select("#inputView")
  .append("text")
    .style("font-size", "16px")
    .style("text-decoration", "underline")
    .text("Input Distribution View");
// append the svg object to the body of the page
const svg = d3.select("#inputView")
  .append("svg")
    .attr("width", inputWidth + margin_of_input.left + margin_of_input.right)//tried adding an additional 100 to make the svg bigger->did not solve the issue
    .attr("height", inputHeight + margin_of_input.top + margin_of_input.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_of_input.left + "," + margin_of_input.top + ")");

// Setup for image view

// Use the separate divs to hold the images
var cityscape_images = d3.select("#imgCityscapes")
        // .attr("width", 1200)
        // .attr("height", 300);
var synthia_images = d3.select("#imgSynthia")

// Setup for activation view

var margin_of_activation = {top: 30, right: 30, bottom: 50, left: 60},
    activationWidth = 460 - margin_of_activation.left - margin_of_activation.right,
    activationHeight = 420 - margin_of_activation.top - margin_of_activation.bottom;

var activation_svg = d3.select("#activationsScatter")
  .append("svg")
    .attr("width", activationWidth + margin_of_activation.left + margin_of_activation.right)
    .attr("height", activationHeight + margin_of_activation.top + margin_of_activation.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_of_activation.left + "," + margin_of_activation.top + ")")
  // .append("text")
  //   .attr("x", (activationWidth / 2))             
  //   .attr("y", 0 - (margin_of_activation.top / 2))
  //   .attr("text-anchor", "middle")  
  //   .style("font-size", "16px") 
  //   .style("text-decoration", "underline")  
  //   .text("Instance-level model activaitons");

//Read the data
// data: input_df.csv
// alternative: df_input_discrete_embedding_by_classfier.csv
d3.csv("df_linked_v3.csv", function(data) {
  // Convert the values in the "tsne_1" and "tsne_2" column to numbers (numbers originally)
  data.forEach(function(d) {
    d.tsne_1 = +d.tsne_1;
    d.tsne_2 = +d.tsne_2
  });
  
  // input view: range for each dimension
  const min_dim_1 = d3.min(data,function(d) { return d.tsne_1; });
  const max_dim_1 = d3.max(data,function(d) { return d.tsne_1; });
  const min_dim_2 = d3.min(data,function(d) { return d.tsne_2; });
  const max_dim_2 = d3.max(data,function(d) { return d.tsne_2; });

  // Add X axis
  var x = d3.scaleLinear()
    .domain([min_dim_1 - 0.1*Math.abs(min_dim_1) , 1.1*max_dim_1])
    .range([ 0, inputWidth]);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + inputHeight + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([min_dim_2 - 0.1*Math.abs(min_dim_2) , 1.1*max_dim_2])
    .range([inputHeight, 0]);
  var yAxis =svg.append("g")
    .call(d3.axisLeft(y));

    // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
    .domain(["Cityscapes", "Synthia" ])
    .range([ "#003f5c", "#ffa600"])

  // Add dots
  var myPoint = svg.append('g')
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.tsne_1)} )
    .attr("cy", function (d) { return y(d.tsne_2)} )
    .attr("r", 2.5)
    .style("fill", function (d) { return color(d.dataset) } )
  
  //remove the x and y axis
  xAxis.remove()
  yAxis.remove()

  // For model activations view:
  // instance = data[0];
  // var instance_activations = instance.bottleneck_activations_embedding;
  // var second_instance_path = instance.similar_image_paths;
  // console.log(second_instance_path);
  // var second_instance = data.find(function(d) {
  //   return d.path === second_instance_path;
  // });
  // // console.log(second_instance);
  // var second_instance_activations = second_instance.bottleneck_activations_embedding;
  // activation_list_to_graph(instance_activations,second_instance_activations,instance.dataset,instance.IoU_score)
  

  // Add brushing
  svg
      .call( d3.brush()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [inputWidth,inputHeight] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("brush start", updateChart_start) // Each time the brush selection changes, trigger the 'updateChart' function
        // .on('brush end', updateChart_end) //placeholder currently
      )
  
  // Add interaction with clicking
  function clickImage(){
    d3.selectAll(".image").on("click", function updateImageAndActivations() {
      // Change the class of the previous selected image to just "image"
      // Make it "image" before removing it from "selectedImage"
      d3.select(".selectedImage").classed("notSelectedImage", true);
      d3.select(".selectedImage").classed("selectedImage", false);

      // Change the class of the clicked image to "selectedImage"
      d3.select(this).classed("notSelectedImage", false);
      d3.select(this).classed("selectedImage", true);

      // Get the ID of the clicked image
      var id = d3.select(this).attr("id").split("-")[1]; 

      // Find the corresponding data in your dataset
      var instance = data.filter(function(d) { return d.id == id; })[0];
      instanceActivations(instance)
    })
  }
  
  
  // Function that is triggered when brushing is performed
  function updateChart_start() {
    // console.log("update") // the chart is update many times with the selection it seems like
    extent = d3.event.selection
    myPoint.classed("selected", function(d){ return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))} ) // The points are classed to be either true or false
    // update the corresponding images, leave out initially 
    var filteredData = data.filter(function(d){return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))})
    updateImages(filteredData)
    // console.log(filteredData)
    updateActivations(filteredData)
    // allow clicking images after adding all the images to image view
    // (the listeners have to be added after the images have been appended to the DOM)
    clickImage()
    // todo: add the function to click "next" button
  }
  // function updateChart_end(){

  // }

  function updateImages(filteredData){
    // This probably does not work because it is inside an svg.call instead of something else
    const maxImages = 100;
    var numCityscapes = 0;
    var numSynthia = 0; 
    cityscape_images.selectAll("*").remove();
    synthia_images.selectAll("*").remove();
    //selected images for cityscapes and synthia
    for (let i=0 ; i < maxImages; i++) {
    //   console.log(filteredData[i].path)
      if (filteredData.length <= i || (numCityscapes>=4 && numSynthia>=4)) {
        break
      }
      if (i==0){
        // console.log("red border for the first image")
        // console.log(filteredData[i].image_path)
        current_class = "selectedImage"
      }
      else{
        current_class = "notSelectedImage"
      }
      if (filteredData[i].dataset=="Cityscapes"){
        if (numCityscapes<4){
            // console.log(filteredData[i].path)
          var current_image = cityscape_images.append("svg")
            // .attr("width",150)
            // .attr("height",150)
            // .attr("outline","1px solid white")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', filteredData[i].image_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
          
          if (i==0){
            current_image.classed("selectedImage")
          }
          
          numCityscapes = numCityscapes+1
        }
      }
      else {
        if (numSynthia<4){
        // console.log(filteredData[i].path)
          var current_image = synthia_images.append("svg")
            // .attr("width",150)
            // .attr("height",150)
            // .attr("outline","1px solid white")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href',  filteredData[i].image_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
          
          numSynthia = numSynthia+1
        }
      }
    }
  }

  function updateActivations(filteredData){
    if (filteredData.length>0){
      //call the first instance in filterData as default
        instance = filteredData[0];
        instanceActivations(instance)
    }
  }

  function instanceActivations(instance){
    second_instance_path = instance.similar_image_paths;
        var second_instance = data.find(function(d) {
          return d.image_path === second_instance_path;
        });
        d3.select("#maskSimilarity").selectAll("*").remove();
        activation_svg.selectAll("*").remove();
        // clear the existing mask for the previous image, to make way for printing new masks
        // console.log(filteredData.length)
        // console.log(filteredData[0])
        activation_list_to_graph(instance.bottleneck_activations_embedding,second_instance.bottleneck_activations_embedding,instance.dataset,instance.IoU_score)
        
        // measuere the height of a div
        // var offsetHeight = document.getElementById('maskSimilarity').offsetHeight;
        // console.log(offsetHeight) //increased to 400
        
        var imageSize = 150;
        var spacing = 20;

        var mask = d3.select("#maskSimilarity").append("svg")
          .attr("width", imageSize)
          .attr("height", imageSize + spacing)
          .attr("outline", "1px solid white")
          .append('g') // Create a group element to contain the image and title
          .attr("transform", "translate(0, " + spacing + ")"); // Adjust the y-coordinate for spacing

          // both of the methods below for extra spacing does not seem to work
          
          // .style("margin-bottom", spacing/2 + "px")

        mask.append('image')
          .attr('xlink:href', instance.label_path)
          .attr('width', imageSize)
          .attr('height', imageSize);
        
        // tried to add background color for text, but didn't work due to one of the colors are too dark
        // mask.append('rect') // Add background rectangle
        //   .attr('x', 0)
        //   .attr('y', -15)
        //   .attr('width', imageSize)
        //   .attr('height', 20)
        //   .style('fill', color(instance.dataset));

        mask.append('text') // Add title text
          .text("Current: ("+instance.dataset+")")
          .attr('x', imageSize / 2) //center it horizontally within the container
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .style("fill", color(instance.dataset)); //but I want background color

        var second_mask = d3.select("#maskSimilarity").append("svg")
          .attr("width", imageSize)
          .attr("height", imageSize + spacing)
          .attr("outline", "1px solid white")
          .append('g') // Create a group element to contain the image and title
          .attr("transform", "translate(0, " + spacing + ")"); // Adjust the y-coordinate for spacing

        second_mask.append('image')
          .attr('xlink:href', second_instance.label_path)
          .attr('width', imageSize)
          .attr('height', imageSize);

        second_mask.append('text') // Add title text
          .text("Corresponding: ("+second_instance.dataset+")")
          .attr('x', imageSize / 2) //center it horizontally within the container
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .style("fill", color(second_instance.dataset));
        // var current_image = synthia_images.append("svg")
        //     .attr("width",150)
        //     .attr("height",150)
        //     .attr("outline","1px solid white")
        //     .insert('image')
        //     .attr('xlink:href',  filteredData[i].path)
  }

  function isBrushed(brush_coords, cx,cy) {
    const x0 = brush_coords[0][0],
          x1 = brush_coords[1][0],
          y0 = brush_coords[0][1],
          y1 = brush_coords[1][1];

    return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
  }

  function activation_list_to_graph(data_list,second_activations,dataset_type,similarScore){
    dataset_types = ["Cityscapes", "Synthia" ];
    var second_dataset_type = dataset_types.find(function(element) {
      return element !== dataset_type;
    });

    parsed_list = JSON.parse(data_list);
    second_activations_parsed = JSON.parse(second_activations);
    // use the combined list to find the range of graph
    var combinedList = parsed_list.concat(second_activations_parsed);

    // input view: range for each dimension
    let min_1 = d3.min(combinedList,function(d) { return d[0]; });
    let max_1 = d3.max(combinedList,function(d) { return d[0]; });
    let min_2 = d3.min(combinedList,function(d) { return d[1]; });
    let max_2 = d3.max(combinedList,function(d) { return d[1]; });

    // Add X axis
    var x = d3.scaleLinear()
        .domain([min_1 - 0.1*Math.abs(min_1) , 1.1*max_1])
        .range([ 0, activationWidth]);
    var xAxis = activation_svg.append("g")
        .attr("transform", "translate(0," + activationHeight + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear()
        .domain([min_2 - 0.1*Math.abs(min_2) , 1.1*max_2])
        .range([ activationHeight, 0]);
    var yAxis =activation_svg.append("g")
        .call(d3.axisLeft(y));
    
    // Add dots for the current dataset
    activation_svg.append('g')
        .selectAll("dot")
        .data(parsed_list)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0])} )
        .attr("cy", function (d) { return y(d[1])} )
        .attr("r", 2.5)
        .style("fill", function (d) { return color(dataset_type) } )
    
    //Add dots for the other dataset
    activation_svg.append('g')
        .selectAll("dot")
        .data(second_activations_parsed)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0])} )
        .attr("cy", function (d) { return y(d[1])} )
        .attr("r", 2.5)
        .style("fill", function (d) { return color(second_dataset_type) } )
    
    activation_svg.append("text")
      .text("Similarity score for masks:"+similarScore);
    
    // this removes the x and y axis from the scatter plot
    xAxis.remove()
    yAxis.remove()
  }
})