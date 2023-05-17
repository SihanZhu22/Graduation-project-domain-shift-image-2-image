// setup for selection of domains

// class distributions
// add title

//placeholder for now
const titleClassDist = d3.select("#classDistTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("text-decoration", "underline")
    .text("Distribution of classes (placeholder)");
var classDistribution = d3.select("#classDistPlot")
  .append("svg")
  .insert('image')
  .attr('xlink:href',  "imgs/violinplotExample.png")
  .attr("width", "120%")
  .attr("height","120%");

// setup for input view

// set the dimensions and margins of the graph
const margin_of_input = {top: 10, right: 10, bottom: 10, left: 10},
    inputWidth = 460 - margin_of_input.left - margin_of_input.right,
    inputHeight = 400 - margin_of_input.top - margin_of_input.bottom;

const titleInputView = d3.select("#inputViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("text-decoration", "underline")
    .text("Input Distribution View");
// append the svg object to the body of the page
var svg = d3.select("#inputView")
  .append("svg")
    .attr("width", inputWidth + margin_of_input.left + margin_of_input.right)//tried adding an additional 100 to make the svg bigger->did not solve the issue
    .attr("height", inputHeight + margin_of_input.top + margin_of_input.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin_of_input.left + "," + margin_of_input.top + ")");

// Setup for performance view
const titlePerformanceView = d3.select("#performanceViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("text-decoration", "underline")
    .text("Performance View (placeholder)");

var performance = d3.select("#performanceView")
  .append("svg")
  .attr("width", 300)
  .attr("height", 300)
  .insert('image')
  .attr('xlink:href',  "imgs/performanceExample.jpg")
  .attr("width", "100%")
  .attr("height","100%");

// Setup for image view

const titleImageView = d3.select("#imageViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("text-decoration", "underline")
    .text("Image View");

// Use the separate divs to hold the images
var cityscape_images = d3.select("#imgCityscapes")
        // .attr("width", 1200)
        // .attr("height", 300);

var synthia_images = d3.select("#imgSynthia")

// Setup for activation view

var margin_of_activation = {top: 30, right: 30, bottom: 50, left: 60},
    activationWidth = 460 - margin_of_activation.left - margin_of_activation.right,
    activationHeight = 420 - margin_of_activation.top - margin_of_activation.bottom;

const titleModelView = d3.select("#modelViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("text-decoration", "underline")
    .text("Model View: Instance-level model activations");

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
d3.csv("system_df_full.csv", function(data) {
  // Convert the values in the "tsne_1" and "tsne_2" column to numbers (numbers originally)

  // Color scale: give me a specie name, I return a color
  var color = d3.scaleOrdinal()
  .domain(["Cityscapes", "Synthia" ])
  .range([ "#003f5c", "#ffa600"])

  function makeInputView(data,Option){
    // remove the previous text and add new text
    d3.select("#currentEmbeddingMethod").selectAll("*").remove();
    d3.select("#currentEmbeddingMethod").append("text")
    .text(Option);

    if (Option=="PCA + t-SNE"){
      data.forEach(function(d) {
        d.tsne_1 = +d.simple_tsne_1;
        d.tsne_2 = +d.simple_tsne_2
      });
    }
    else if (Option=="Classifier embedding"){
      data.forEach(function(d) {
        d.tsne_1 = +d.meaningful_tsne_1;
        d.tsne_2 = +d.meaningful_tsne_2;
      });
    }
    else{
      console.log("Error with selection!!")
    }
    
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

    // Add brushing
    svg
    .call(d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [inputWidth,inputHeight] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("brush start", function() {
        updateChart_start(myPoint, x, y); // Invoke the function inside the event handler
      })
      // .on('brush end', updateChart_end) //placeholder currently
  )}
  
  makeInputView(data,"Classifier embedding");
  const embeddingMethodsItems = d3.selectAll('#embeddingMethods .child li');

  // embeddingMethods: Add click event listener to each menu item
  embeddingMethodsItems.on('click', function() {
    // Get the selected option using D3
    const selectedOption = d3.select(this).text().trim();
    svg.selectAll("*").remove();
    makeInputView(data,selectedOption);
  });
  
  // Add interaction with clicking
  function clickImage(countCheckbox){
    d3.selectAll(".image").on("click", function updateImageAndActivations() {
      // Change the class of the previous selected image to just "image"
      // Make it "image" before removing it from "selectedImage"
      d3.selectAll(".selectedImage").classed("notSelectedImage", true);
      d3.selectAll(".selectedImage").classed("selectedImage", false);

      // if only one checkbox is selected, meaning that there are multiple instances:
      if (countCheckbox ==1){
        d3.select(this).classed("notSelectedImage", false);
        d3.select(this).classed("selectedImage", true);
      }
      // otherwise, color the boundaries of all the images
      else{
        // var selectedImage = d3.select(this);
        var parentDiv = this.parentNode;
        // console.log("parentDiv:"+parentDiv);
        // console.log(this.parentNode)
        d3.select(parentDiv).selectAll(".image").classed("notSelectedImage", false);
        d3.select(parentDiv).selectAll(".image").classed("selectedImage", true);
      }

      // Get the ID of the clicked image
      var id = d3.select(this).attr("id").split("-")[1]; 

      // Find the corresponding data in your dataset
      var instance = data.filter(function(d) { return d.id == id; })[0];
      instanceActivations(instance)
    })
  }
  
  
  // Function that is triggered when brushing is performed
  function updateChart_start(myPoint,x,y) {
    // console.log("update") // the chart is update many times with the selection it seems like
    extent = d3.event.selection
    myPoint.classed("selected", function(d){ return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))} ) // The points are classed to be either true or false
    // update the corresponding images, leave out initially 
    var filteredData = data.filter(function(d){return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))})
    if (filteredData.length>0){
      updateImages(filteredData)
      // console.log(filteredData)
      updateActivations(filteredData)
      // allow clicking images after adding all the images to image view
      // (the listeners have to be added after the images have been appended to the DOM)
      clickImage(countCheckbox)
    }
    
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

    // first check the selections
    // each Checkbox variable contain a True or False value on whether it's checked
    var imageCheckbox = d3.select('input[name="imageCheck"]').node();
    var groundTruthCheckbox = d3.select('input[name="groundTruthCheck"]').node();
    var predictionCheckbox = d3.select('input[name="predictionCheck"]').node();

    var imageValue = imageCheckbox.checked ? 1 : 0;
    var groundTruthValue = groundTruthCheckbox.checked ? 1 : 0;
    var predictionValue = predictionCheckbox.checked ? 1 : 0;

    // not initialize the variable so that it's global (Automatically Global (doesn't work if strict mode is on))
    countCheckbox = imageValue+groundTruthValue+predictionValue;
    
    //conditions
    if (countCheckbox==1){
      if (imageValue){
        filteredData.forEach(function(d) {
          d.path = d.image_path; // no "+", because don't need path to be number here
        });
      }
      else if (groundTruthValue){
        filteredData.forEach(function(d) {
          d.path = d.label_path;
        });
      }
      else {
        filteredData.forEach(function(d) {
          d.path = d.prediction_path;
        });
      }
      for (let i=0 ; i < maxImages; i++) {
          if (filteredData.length <= i || (numCityscapes>=4 && numSynthia>=4)) {
            break
          }
          if (i==0){
            current_class = "selectedImage"
          }
          else{
            current_class = "notSelectedImage"
          }
          if (filteredData[i].dataset=="Cityscapes"){
            if (numCityscapes<3){
              var current_image = cityscape_images.append("svg")
                // .attr("width",150)
                // .attr("height",150)
                // .attr("outline","1px solid white")
                .classed("image",true)
                .classed(current_class,true)
                .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
                .insert('image')
                .attr('xlink:href', filteredData[i].path)
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
            if (numSynthia<3){
              var current_image = synthia_images.append("svg")
                // .attr("width",150)
                // .attr("height",150)
                // .attr("outline","1px solid white")
                .classed("image",true)
                .classed(current_class,true)
                .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
                .insert('image')
                .attr('xlink:href',  filteredData[i].path)
                .attr('width', '100%')
                .attr('height', '100%')
                .attr('preserveAspectRatio', 'xMinYMin meet');
              
              numSynthia = numSynthia+1
            }
          }
        }
      }
    else{
      // filter out the cityscapes and synthia data
      var cityscapesData = filteredData.filter(function(d) {
        return d.dataset === "Cityscapes";
      });
      var synthiaData = filteredData.filter(function(d) {
        return d.dataset === "Synthia";
      });
      
      if (cityscapesData.length>0){
        instance = cityscapesData[0]
        if (instance==filteredData[0]){
          current_class="selectedImage"
        }
        else{
          current_class="notSelectedImage"
        }
        if (imageValue){
          var current_image = cityscape_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.image_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
        if (groundTruthValue){
          var current_image = cityscape_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.label_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
        if (predictionValue){
          var current_image = cityscape_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.prediction_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
      }
      if (synthiaData.length>0){
        instance = synthiaData[0]
        if (instance==filteredData[0]){
          current_class="selectedImage"
        }
        else{
          current_class ="notSelectedImage"
        }
        if (imageValue){
          var current_image = synthia_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.image_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
        if (groundTruthValue){
          var current_image = synthia_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.label_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
        if (predictionValue){
          var current_image = synthia_images.append("svg")
            .classed("image",true)
            .classed(current_class,true)
            .attr("id", "image-" + instance.id) // assign an ID to the image element
            .insert('image')
            .attr('xlink:href', instance.prediction_path)
            .attr('width', '100%')
            .attr('height', '100%')
            .attr('preserveAspectRatio', 'xMinYMin meet');
        }
      }
      // find all the cityscapes data in filtered data
    }
    // return countCheckbox;
  }
  
    

  function updateActivations(filteredData){
    if (filteredData.length>0){
      //call the first instance in filterData as default
        instance = filteredData[0];
        instanceActivations(instance)
    }
  }

  function instanceActivations(instance){
    var second_instance_path = instance.similar_image_paths;
    var second_instance = data.find(function(d) {
      return d.image_path === second_instance_path;
    });
    d3.select("#maskSimilarity").selectAll("*").remove();
    activation_svg.selectAll("*").remove();
    // clear the existing mask for the previous image, to make way for printing new masks
    // console.log(filteredData.length)
    // console.log(filteredData[0])
    activation_list_to_graph(instance.bottleneck_activations_embedding,second_instance.bottleneck_activations_embedding,instance.dataset,instance.similar_IoU_score)
    
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