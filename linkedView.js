// color setup
var discreteDomains = ["Cityscapes","Synthia"]
var discreteDomainColor = d3.scaleOrdinal()
  .domain(["Selected","Cityscapes", "Synthia"])
  .range([ "#bc5090","#003f5c", "#ffa600"])

// setup for selection of domains

// class distributions
// add title

//placeholder for now
const titleClassDist = d3.select("#classDistTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .text("Distribution of classes");

// set the dimensions and margins of the graph
var violinMargin = {top: 10, right: 30, bottom: 30, left: 30},
    violinWidth = 400 - violinMargin.left - violinMargin.right,
    violinHeight = 230 - violinMargin.top - violinMargin.bottom;

// append the svg object to the body of the page
var violinPlot = d3.select("#classDistPlot")
  .append("svg")
    .attr("width", violinWidth + violinMargin.left + violinMargin.right)
    .attr("height", violinHeight + violinMargin.top + violinMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + violinMargin.left + "," + violinMargin.top + ")");

// setup for input view

// set the dimensions and margins of the graph
const margin_of_input = {top: 10, right: 10, bottom: 10, left: 10},
    inputWidth = 460 - margin_of_input.left - margin_of_input.right,
    inputHeight = 400 - margin_of_input.top - margin_of_input.bottom;

const titleInputView = d3.select("#inputViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .style("font-family","Arial, Helvetica, sans-serif")
    .text("Input Distribution View");

//TODO: create legend for heatmap
// var legend = d3.select("#inputScatterPlot").append("svg")
//   .attr("width", 100)
//   .attr("height", 50)
//   .append("g");

// legend.classed("legend");
// legend.append("circle").attr("cx",40).attr("cy",10).attr("r", 6).style("fill", "#003f5c")
// legend.append("circle").attr("cx",40).attr("cy",40).attr("r", 6).style("fill", "#ffa600")
// legend.append("text").attr("x", 60).attr("y", 10).text("Cityscapes").style("font-size", "15px").attr("alignment-baseline","middle")
// legend.append("text").attr("x",60).attr("y", 40).text("Synthia").style("font-size", "15px").attr("alignment-baseline","middle")

// append the svg object to the body of the page
var svg = d3.select("#inputScatterPlot")
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
    .text("Performance View ");

// var performance = d3.select("#performanceView")
//   .append("svg")
//   .attr("width", 300)
//   .attr("height", 300)
//   .insert('image')
//   .attr('xlink:href',  "imgs/performanceExample.jpg")
//   .attr("width", "100%")
//   .attr("height","100%");
// setup for heatmap view
var heatmapMargin = {top: 15, right: 25, bottom: 30, left: 110},
      heatmapWidth = 550 - heatmapMargin.left - heatmapMargin.right,
      heatmapHeight = 250 - heatmapMargin.top - heatmapMargin.bottom;

// create a tooltip
var tooltip = d3.select("#performanceView")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "absolute");

// append the svg object to the body of the page
var heatmap_svg = d3.select("#performancePlot")
.append("svg")
  .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
  .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
.append("g")
  .attr("transform",
        "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

// Setup for image view

const titleImageView = d3.select("#imageViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
    .text("Image View");

// Use the separate divs to hold the images
var domain1_images = d3.select("#imgDomain1")
        // .attr("width", 1200)
        // .attr("height", 300);

var domain2_images = d3.select("#imgDomain2")

// Setup for activation view

var margin_of_activation = {top: 30, right: 30, bottom: 50, left: 60},
    activationWidth = 460 - margin_of_activation.left - margin_of_activation.right,
    activationHeight = 420 - margin_of_activation.top - margin_of_activation.bottom;

const titleModelView = d3.select("#modelViewTitle")
  .append("text")
    .style("font-size", "16px")
    .style("font-weight",700)
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
d3.csv("system_df_v2.csv",function(discreteData){
  d3.csv("noise_df.csv", function(noiseData) {
    // create global variables
    currentTypeDomain = "Continuous"
    continuousDomain = "Noise"
    continuousValue = 0 //todo: change this to finding the min (non-zero) or max of the value
    // todo: change the slider also
    noiseData.forEach(function(d) {
      d.noise_level = +d.noise_level;
    });

    initializeViews()
    
    function initializeViews(){
      // initialize some views
      svg.selectAll("*").remove();
      d3.select("#imgDatasetNames").selectAll("*").remove();
      if (currentTypeDomain == "Discrete"){
        // after this 
        data=discreteData
        // dynamically add the legend for domain
        // Create the first SVG element
        var datasetNameSvg1 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
        datasetNameSvg1.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", "#003f5c");
        datasetNameSvg1.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
          .attr("font-size", "14").text("Cityscapes");

        // Create the second SVG element
        var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
        datasetNameSvg2.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", "#ffa600");
        datasetNameSvg2.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
          .attr("font-size", "14").text("Synthia");

        // initialize the views
        makeInputView(discreteData,"Classifier embedding");
        makePerformanceView(data = discreteData)
        var currentViolinClass = "Road"
        makeClassDist(data = discreteData,filteredData = 0,specifiedClassName = currentViolinClass,setDomainColors=setDomainColors);
      }
      else{
        // change the makeInputView
        // makeInputView(noiseData,"Classifier embedding")
        if (continuousDomain=="Noise"){
          data=noiseData

          // create color mapping function
          let noiseMin = d3.min(noiseData,function(d) { return d.noise_level; });
          let noiseMax = d3.max(noiseData,function(d) { return d.noise_level; });
          let colorStart = "#003f5c";  // Start color (e.g., drak blue)
          let colorEnd = "#c2e7ff";    // End color (e.g., light blue)
  
          continuousDomainColor = d3.scaleLinear()
            .domain([noiseMin, noiseMax])
            .range([colorStart, colorEnd])
            .interpolate(d3.interpolateHsl);
          // dynamically add the legend for domain
          // Create the first SVG element
          var datasetNameSvg1 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
          datasetNameSvg1.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", "#003f5c");
          datasetNameSvg1.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
            .attr("font-size", "14").text("Noise: 0");

          // Create the second SVG element
          if (continuousValue!=0){
            var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
            datasetNameSvg2.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", function(){return continuousDomainColor(continuousValue)});
            datasetNameSvg2.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
              .attr("font-size", "14").text("Noise: "+continuousValue.toString());
          }
          else{
            var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
          }
          var noiseDataOriginal = noiseData.filter(function(d) {return d.noise_level == 0})
          if (continuousValue){
            var noiseDataCurrent = noiseData.filter(function(d) {return d.noise_level == continuousValue})
            // noiseSelectedData is global
            noiseSelectedData =  noiseDataOriginal.concat(noiseDataCurrent);
          }
          else{
            noiseSelectedData = noiseDataOriginal
          }
          // get noise level and make colors
          makeInputView(noiseSelectedData,"Classifier embedding");
          var currentViolinClass = "Road";
          makeClassDist(data = noiseSelectedData,filteredData = 0,specifiedClassName = currentViolinClass,setDomainColors=setDomainColors)
          makePerformanceView(data = noiseSelectedData) //TODO: major improve for this one  
        }
      }
       // always use all the arguments because the missing argument is undefined
    }

    // event listener for domain selection
    var domainDropdown = d3.selectAll("#dropdown .child li");
    domainDropdown.on("click",function(){
      d3.event.stopPropagation();
      const selectedDomain = d3.select(this).text().trim();
      // TODO: make the text more complicated later
      d3.select("#currentSelectedDomain").selectAll("*").remove();
      d3.select("#currentSelectedDomain").append("text").text("Current domain type: "+selectedDomain);
      if (selectedDomain=="Discrete"){
        currentTypeDomain = "Discrete"
        initializeViews()
      }
      else{
        currentTypeDomain = "Continuous"
        initializeViews()
        // current domain is the specific value?
      }
    })

    // event listener for slider
    // think about: combining this with domainDropdown or not?
    var slider = d3.select("#mySlider");
    slider.on("input", function() {
      // Retrieve the selected value from the slider
      var selectedValue = d3.event.target.value;
      
      // Do something with the selected value
      continuousValue=+selectedValue
      initializeViews()
    });

    // event listener for class dist
    var classDropdown = d3.selectAll("#classDropdown .child li");
    classDropdown.on("click",function(){
      const selectedOption = d3.select(this).text().trim();
      makeClassDist(data = data,filteredData = 0,specifiedClassName = selectedOption,setDomainColors=setDomainColors)
    })

    const embeddingMethodsItems = d3.selectAll('#embeddingMethods .child li');

    // embeddingMethods: Add click event listener to each menu item
    embeddingMethodsItems.on('click', function() {
      // Get the selected option using D3
      const selectedOption = d3.select(this).text().trim();
      svg.selectAll("*").remove();
      makeInputView(data,selectedOption);
    });

    function makeInputView(data,Option){
      // remove the previous text and add new text
      svg.selectAll("*").remove();
      d3.select("#currentEmbeddingMethod").selectAll("*").remove();
      d3.select("#currentEmbeddingMethod").append("text")
      .text(Option);

      // Convert the strings in the "tsne_1" and "tsne_2" column to numbers
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
      else if (Option=="PCA"){
        data.forEach(function(d) {
          d.tsne_1 = +d.pca_1; //TODO: change the tsne_1 to something else
          d.tsne_2 = +d.pca_2;
        });
      }
      else{
        console.log(Option)
        console.warn("Error with selection!!")
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
        .style("fill", function (d) { return setDomainColors(d)} )
      
      //remove the x and y axis
      xAxis.remove()
      yAxis.remove()

      // Add brushing
      // the non-passive event listener is not because of it's within a function; 
      // however, might still be a nice thing to move it outside of the makeInputView function at some point
      // issues are with x,y,and myPoint: could declare them to be global, but not sure how that would affect other plots
      svg
      .call(d3.brush()                 // Add the brush feature using the d3.brush function
        .extent( [ [0,0], [inputWidth,inputHeight] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
        .on("brush start", function() {
          updateChart_start(myPoint, x, y); // Invoke the function inside the event handler
        }),{ passive: true }
      )
    }
    
    // Add interaction with clicking
    function clickImage(){
      d3.selectAll(".image").on("click", function () {
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
          d3.select(parentDiv).selectAll(".image").classed("notSelectedImage", false);
          d3.select(parentDiv).selectAll(".image").classed("selectedImage", true);
        }

        // Get the ID of the clicked image
        var id = d3.select(this).attr("id").split("-")[1]; 

        // Find the corresponding data in your dataset
        var instance = data.filter(function(d) { return d.id == id; })[0];
        instanceActivations(instance)

        d3.selectAll(".selected").classed("instance-point", function(d) {
          return d.tsne_1 === instance.tsne_1 && d.tsne_2 === instance.tsne_2 
        });
      })
    }
    
    
    // Function that is triggered when brushing is performed
    function updateChart_start(myPoint,x,y) {
      // the chart is update many times with the selection it seems like
      extent = d3.event.selection
      myPoint.classed("selected", function(d){ return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))} ) // The points are classed to be either true or false
      // update the corresponding images, leave out initially 
      var filteredData = data.filter(function(d){return isBrushed(extent, x(d.tsne_1), y(d.tsne_2))})
      // remove all the red boundaries first (before adding new one later)
      myPoint.classed("instance-point", function() {
        return false;
      });
      updateMultipleViews(filteredData)
    }
    // function updateChart_end(){

    // }

    function updateMultipleViews(filteredData){
      if (filteredData.length>0){
        // mark the initial selected point in red
        d3.selectAll(".selected").classed("instance-point", function(d) {
          if (filteredData.length>0){
            return d.tsne_1 === filteredData[0].tsne_1 && d.tsne_2 === filteredData[0].tsne_2
          } else {
            return false;
          }
        });

        // TODO (possibly:) sort filteredData so that the data points with the same images but different names are together 
        // shouldn't order by names

        updateImages(filteredData)
        updateActivations(filteredData)
        makePerformanceView(data,filteredData)
        var currentClassViolin = d3.select("#classNameText").text();
        makeClassDist(data=data,filteredData=filteredData,specifiedClassName=currentClassViolin,setDomainColors=setDomainColors)
        var classDropdown = d3.selectAll("#classDropdown .child li");
        classDropdown.on("click",function(){
          const selectedOption = d3.select(this).text().trim();
          makeClassDist(data=data,filteredData = filteredData,specifiedClassName = selectedOption,setDomainColors=setDomainColors)
        })
        // allow clicking images after adding all the images to image view
        // (the listeners have to be added after the images have been appended to the DOM)
        clickImage()

        // event listener: change of image/label/prediction selection
        var checkboxes = d3.selectAll('input[name="imageCheck"], input[name="groundTruthCheck"], input[name="predictionCheck"]');
        // "filter(":checked")": filters the selection to include only the checkboxes that are checked
        var checkedCount = checkboxes.filter(":checked").size(); 
        checkboxes.on("change", function(){
          updateMultipleViews(filteredData)
        }); // this function(){} is necessary to have, otherwise the updateMultipleViews will be immediately called
        
        // Image View: next button: 
        var nextButton = d3.select("#imageCheckBox button"); // name of div + button
        nextButton.on("click",function(){
          var domain1Data = filteredData.filter(function(d) {
            if (currentTypeDomain=="Discrete"){
              return d.dataset === "Cityscapes";
            }
            else{
              return d.noise_level==0;
            } 
          });
          var domain2Data = filteredData.filter(function(d) {
            if (currentTypeDomain=="Discrete"){
              return d.dataset === "Synthia";
            }
            else{
              if (continuousDomain=="Noise" && continuousValue!=0){
                return d.noise_level == continuousValue
              }
              else{
                return 0;
              }
            }
          });
          var parentDiv = d3.select(".selectedImage").node().parentNode;
          var parentDivId = parentDiv.id;
          // switch the cityscapes or synthia based on the div with 
          if (checkedCount == 1){
            if (parentDivId =="imgDomain1"){
              var firstThreeElements = domain1Data.slice(0, 3); // Get the first three elements
              var remainingElements = domain1Data.slice(3); // Get the remaining elements
              domain1Data = remainingElements.concat(firstThreeElements); // Concatenate the remaining elements with the first three elements
              var newFilteredData = domain1Data.concat(domain2Data)
            }
            else{
              var firstThreeElements = domain2Data.slice(0, 3); // Get the first three elements
              var remainingElements = domain2Data.slice(3); // Get the remaining elements
              domain2Data = remainingElements.concat(firstThreeElements); // Concatenate the remaining elements with the first three elements
              var newFilteredData = domain2Data.concat(domain1Data);
            }
          }
          else{
            if (parentDivId =="imgDomain1"){
              var firstElement = domain1Data.shift();
              domain1Data.push(firstElement);
              var newFilteredData = domain1Data.concat(domain2Data)
            }
            else{
              var firstElement = domain2Data.shift();
              domain2Data.push(firstElement);
              var newFilteredData = domain2Data.concat(domain1Data);
            }
          }
          // var firstElement = filteredData.shift();
          // filteredData.push(firstElement);
          updateMultipleViews(newFilteredData);
        })
      }
    }

    function updateImages(filteredData){
      // This probably does not work because it is inside an svg.call instead of something else
      const maxImages = 100;
      var numDomain1 = 0;
      var numDomain2 = 0; 
      domain1_images.selectAll("*").remove();
      domain2_images.selectAll("*").remove();

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
            if (filteredData.length <= i || (numDomain1>=4 && numDomain2>=4)) {
              break
            }
            if (i==0){
              current_class = "selectedImage"
            }
            else{
              current_class = "notSelectedImage"
            }
            // either discrete cityscapes, or continuous with noise level=0
            if ((filteredData[i].dataset=="Cityscapes"&&currentTypeDomain=="Discrete")|| filteredData[i].noise_level ==0){
              if (numDomain1<3){
                var current_image = domain1_images.append("svg")
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
                numDomain1 = numDomain1+1
              }
            }
            // either discrete synthia, or continuous with noise level the same as the current value
            else if((filteredData[i].dataset=="Synthia"&&currentTypeDomain=="Discrete")|| filteredData[i].noise_level ==continuousValue){
              if (numDomain2<3){
                var current_image = domain2_images.append("svg")
                  .classed("image",true)
                  .classed(current_class,true)
                  .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
                  .insert('image')
                  .attr('xlink:href',  filteredData[i].path)
                  .attr('width', '100%')
                  .attr('height', '100%')
                  .attr('preserveAspectRatio', 'xMinYMin meet');
                
                numDomain2 = numDomain2+1
              }
            }
          }
        }
      else{
        // filter out the cityscapes and synthia data
        var domain1Data = filteredData.filter(function(d) {
          if (currentTypeDomain=="Discrete"){
            return d.dataset === "Cityscapes";
          }
          else{
            return d.noise_level==0;
          } 
        });
        var domain2Data = filteredData.filter(function(d) {
          if (currentTypeDomain=="Discrete"){
            return d.dataset === "Synthia";
          }
          else{
            if (continuousDomain=="Noise" && continuousValue!=0){
              return d.noise_level == continuousValue
            }
            else{
              return 0;
            }
          }
        });
        if (domain1Data.length>0){
          instance = domain1Data[0]
          if (instance==filteredData[0]){
            current_class="selectedImage"
          }
          else{
            current_class="notSelectedImage"
          }
          if (imageValue){
            var current_image = domain1_images.append("svg")
              .classed("image",true)
              .classed(current_class,true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.image_path)
              .attr('width', '100%') //TODO: need to change this if the image is larger
              // .attr('height', "100%")
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (groundTruthValue){
            var current_image = domain1_images.append("svg")
              .classed("image",true)
              .classed(current_class,true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.label_path)
              .attr('width', '100%')
              // .attr('height', '100')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (predictionValue){
            var current_image = domain1_images.append("svg")
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
        if (domain2Data.length>0){
          instance = domain2Data[0]
          if (instance==filteredData[0]){
            current_class="selectedImage"
          }
          else{
            current_class ="notSelectedImage"
          }
          if (imageValue){
            var current_image = domain2_images.append("svg")
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
            var current_image = domain2_images.append("svg")
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
            var current_image = domain2_images.append("svg")
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
      if (currentTypeDomain=="Discrete"){
        var second_instance_path = instance.similar_image_paths;
        var second_instance = data.find(function(d) {
        return d.image_path === second_instance_path;
      });
      }
      else{
        if (continuousDomain=="Noise"){
          // get the current noise level
          // find the corresponding image in that level
          if (continuousValue!=0){
            var second_instance = data.find(function(d) {
              // if the first instance have noise = 0, then find the instance with selected noise value
              // and vice versa
              if (instance.noise_level ==0){
                // console.log("equality for noise:", d.noise_level === continuousValue)
                return d.noise_level === continuousValue && d.name === instance.name;
              }
              else{
                // console.log("equality for noise (0):", d.noise_level === 0)
                return d.noise_level === 0 && d.name === instance.name;
              }
              // return (d.noise_level ==0)? (d.name === instance.name && d.noise_level === continuousValue) : (d.name === instance.name && d.noise_level === 0);
              }            
            );
            second_instance_path = second_instance.image_path
          }
        }
      }
      
      d3.select("#maskSimilarity").selectAll("*").remove();
      activation_svg.selectAll("*").remove();
      // clear the existing mask for the previous image, to make way for printing new masks
      // var instance_type, second_instance_type = 
      if (second_instance){
        activation_list_to_graph(instance, second_instance)
      }
      else{
        activation_list_to_graph(instance)
      }
      // measuere the height of a div
      // var offsetHeight = document.getElementById('maskSimilarity').offsetHeight;
      
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
        .text("Current: ("+instance_type+")")
        .attr('x', imageSize / 2) //center it horizontally within the container
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '12px')
        .style("fill", setDomainColors(instance)); //but I want background color

      if (currentTypeDomain=="Discrete"||continuousValue!=0){
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
          .text("Corresponding: ("+second_instance_type+")")
          .attr('x', imageSize / 2) //center it horizontally within the container
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '12px')
          .style("fill", setDomainColors(second_instance));
      }
    }

    function isBrushed(brush_coords, cx,cy) {
      const x0 = brush_coords[0][0],
            x1 = brush_coords[1][0],
            y0 = brush_coords[0][1],
            y1 = brush_coords[1][1];

      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    function activation_list_to_graph(instance,second_instance){
      // dataset_types = ["Cityscapes", "Synthia" ];

      // find the domain for the second instance
      if (currentTypeDomain=="Discrete"){
        instance_type = instance.dataset
        second_instance_type = second_instance.dataset
        activation_svg.append("text")
        .text("Similarity score for masks:"+instance.similar_IoU_score);
      }
      else{
        if (continuousDomain=="Noise"){
          instance_type = "Noise: "+ instance.noise_level.toString()
          if (second_instance){
            second_instance_type = "Noise: "+ second_instance.noise_level.toString()
          }
          // console.log("Instance type",instance_type)
        }
      }

      parsed_list = JSON.parse(instance.bottleneck_activations_embedding);
      if (second_instance){
        second_activations_parsed = JSON.parse(second_instance.bottleneck_activations_embedding);
        var combinedList = parsed_list.concat(second_activations_parsed);
      }
      else{
        var combinedList = parsed_list
      }
      // use the combined list to find the range of graph

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
          .style("fill", setDomainColors(instance))
      
      //Add dots for the other dataset
      if (second_instance){
        activation_svg.append('g')
          .selectAll("dot")
          .data(second_activations_parsed)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return x(d[0])} )
          .attr("cy", function (d) { return y(d[1])} )
          .attr("r", 2.5)
          .style("fill",setDomainColors(second_instance))
      }
  
      // this removes the x and y axis from the scatter plot
      xAxis.remove()
      yAxis.remove()

      // return instance_type, second_instance_type
    }

    function setDomainColors(d){
      // console.log("current type domain in set",currentTypeDomain)
      if (currentTypeDomain=="Discrete"){
        if (d.key){
          return discreteDomainColor(d.key)
        }
        else{
          return discreteDomainColor(d.dataset)
        }
      }
      else{
        if (continuousDomain=="Noise"){
          // range of noise (color domain)
          // let noiseMin = d3.min(noiseData,function(d) { return d.noise_level; });
          // let noiseMax = d3.max(noiseData,function(d) { return d.noise_level; });
          // let colorStart = "#003f5c";  // Start color (e.g., drak blue)
          // let colorEnd = "#c2e7ff";    // End color (e.g., light blue)
  
          // continuousDomainColor = d3.scaleLinear()
          //   .domain([noiseMin, noiseMax])
          //   .range([colorStart, colorEnd])
          //   .interpolate(d3.interpolateHsl);
          // define the color
          if (d.key){
            if (d.key=="Selected"){
              return discreteDomainColor(d.key)
            }
            else{
              return continuousDomainColor(d.key)
            }
          }
          else{
            return continuousDomainColor(d.noise_level)
          }
        }
      }
    }

    // function getLabelExtension(d){
    //   // add (overall) vs (partial)
    //   if (currentTypeDomain=="Discrete"){
    //     domainLabelsExtension = discreteDomains
        
    //   }else{
    
    //   }
    // }
    // domain names based on different domains
    
  })//end of d3.csv
})//another end of d3.csv

// define more functions here 
function makePerformanceView(data,filteredData){
  heatmap_svg.selectAll("*").remove();

  //Add selection for domains later
  var columnNames = Object.keys(data[0]);
    var iouColumns = columnNames.filter(function(column) {
        return column.endsWith("_iou");
    })
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var HorizontalVars = iouColumns.map(function(d){return d.slice(0,-4);}) // horizontal

  // get the domain list for Vertical Vars
  if (currentTypeDomain=="Discrete"){
    var domainNameList = ["Cityscapes (Overall)", "Synthia (Overall)", "Selected (Partial)"]
  }
  else{
    if (continuousDomain=="Noise"){
      // no need to think about one domain case specifically, because it could be that one domain is empty in the graph
      var domain1 = "Noise: 0 " +"(Overall)"
      var domain2 = "Noise: " + continuousValue.toString() + " " + "(Overall)"
      // create a list
      if (continuousValue!=0){
        var domainNameList = [domain1, domain2, "Selected (Partial)"]
      }
      else{
        var domainNameList = [domain1, "Selected (Partial)"]
      }
    }
  }
  // if (currentTypeDomain=="Discrete"){
  //   var VerticalVars = d3.map(data, function(d){return d.dataset;}).keys()// vertical
  // }
  // else{
  //   // TODO: return the categories
  //   var VerticalVars = d3.map(data, function(d){
  //     return d.noise_level;
  //   }).keys()// vertical
  // }
  // VerticalVars.push("Selected");

  data.forEach(function(d) {
    if (currentTypeDomain=="Discrete"){
      d.domainKey = d.dataset;
    }
    else{
      if (continuousDomain=="Noise"){
        d.domainKey = d.noise_level
      }
    }
  });

  // separate the data to domains
  var nestedData = d3.nest()
    .key(d => d.domainKey)
    .entries(data);

  if (filteredData){
    // combine the filtered data with the overall data
    nestedData = nestedData.concat({
      key: "Selected",
      values: filteredData
    });
  }

  // TODO: add the selected data to the groupData with data.concat
  var meanValues = new Map();
  var transformedData = [];
  // transform the data in order to generate the heatmap
  nestedData.forEach(group => {
    var meanObj = {};
    meanObj.domainKey = group.key;

    // Calculate mean for each column
    meanObj.overall = d3.mean(group.values, d => d.overall_iou);
    meanObj.other = d3.mean(group.values, d => d.other_iou);
    meanObj.road = d3.mean(group.values, d => d.road_iou);
    meanObj.sidewalk = d3.mean(group.values, d => d.sidewalk_iou);
    meanObj.vegetation = d3.mean(group.values, d => d.vegetation_iou);
    meanObj.sky = d3.mean(group.values, d => d.sky_iou);
    meanObj.car = d3.mean(group.values, d => d.car_iou);

    meanValues.set(group.key, meanObj);

    meanValues.forEach((obj, key) => {
      var domainKey = meanObj.domainKey;

      Object.keys(obj).forEach(column => {
        if (column !== "domainKey") {
          var className = column;
          var value = obj[column];

          transformedData.push({
            domainKey: domainKey,
            class: className,
            value: value
          });
        }
      });
    });
  });

  // Build X scales and axis:
  var x = d3.scaleBand()
    .range([ 0, heatmapWidth ])
    .domain(HorizontalVars)
    .padding(0.05);
  heatmap_svg.append("g")
    .style("font-size", 10)
    .attr("transform", "translate(0," + heatmapHeight + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([ heatmapHeight, 0 ])
    .domain(domainNameList)
    .padding(0.05);
  heatmap_svg.append("g")
    .style("font-size", 10)
    .call(
      d3.axisLeft(y)
        .tickSize(0)
        .tickFormat(
          d => d.split(" ").map(function(word) {
            return word.trim();
          }).join("\n")
        )
    )
    .select(".domain").remove()

  // Apply CSS style to the text elements for line breaks
  heatmap_svg.selectAll(".tick text")
    .attr("dy", "0.35em") // Adjust vertical alignment as needed
    .style("white-space", "pre-wrap"); // Allow line breaks to be displayed

  // Build color scale
  var heatmapColor = d3.scaleSequential()
    .domain([0,1])
    .interpolator(d3.interpolateGreens) //interpolate* is sequential single hue

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function(d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html("Performance (IoU): " + d.value)
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
      // .style("left", (d3.event.pageX + 10) + "px") // Position relative to mouse coordinates
      // .style("top", (d3.event.pageY + 10) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }

  // add the squares
  heatmap_svg.selectAll()
    .data(transformedData, function(d) {return d.class+':'+d.domainKey;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return x(d.class) })
      .attr("y", function(d) { return y(getDataScope(d.domainKey)) })
      .attr("rx", 4)
      .attr("ry", 4)
      .attr("width", x.bandwidth() )
      .attr("height", y.bandwidth() )
      .style("fill", function(d) { return heatmapColor(d.value)} )
      .style("stroke-width", 4)
      .style("stroke", "none")
      .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

function makeClassDist(data,filteredData,specifiedClassName,setDomainColors){
  d3.select("#classDistPlot").selectAll("*").remove();
  d3.select("#classNameText").selectAll("*").remove();

  d3.select("#classNameText").append("text")
    .text(specifiedClassName);

  var violinPlot = d3.select("#classDistPlot")
  .append("svg")
    .attr("width", violinWidth + violinMargin.left + violinMargin.right)
    .attr("height", violinHeight + violinMargin.top + violinMargin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + violinMargin.left + "," + violinMargin.top + ")");
  
  // className refer to the specific ratio of the semantic segmentation class
  var className = specifiedClassName.toLowerCase()+"_ratio";
  var maxClassRatio= d3.max(data,function(d) {
     return +d[className]; // need the "+" to make it number
    })
  
  var y = d3.scaleLinear()
  .domain([0,maxClassRatio])          // Y scale is set manually (here it's [0,1] because of the ratio of classes)
  .range([violinHeight, 0])
  violinPlot.append("g").call(d3.axisLeft(y) )  

  // get the list of domains to put on the axis
  if (currentTypeDomain=="Discrete"){
    var domainNameList = ["Cityscapes (Overall)", "Synthia (Overall)", "Selected (Partial)"]
  }
  else{
    if (continuousDomain=="Noise"){
      // no need to think about one domain case specifically, because it could be that one domain is empty in the graph
      var domain1 = "Noise: 0 " +"(Overall)"
      var domain2 = "Noise: " + continuousValue.toString() + " " + "(Overall)"
      // create a list
      if (continuousValue!=0){
        var domainNameList = [domain1, domain2, "Selected (Partial)"]
      }
      else{
        var domainNameList = [domain1, "Selected (Partial)"]
      }
    }
  }

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
  .range([ 0, violinWidth])
  .domain(domainNameList) //TODO: change this to also fit continuous domains
  .padding(0.05)     // This is important: it is the space between 2 groups. 0 means no padding. 1 is the maximum.
  violinPlot.append("g")
  .attr("transform", "translate(0," + violinHeight + ")")
  .call(d3.axisBottom(x))

  // Features of the histogram
  var histogram = d3.histogram()
        .domain(y.domain())
        //the original code has 20, use 10 to avoid too detailed range
        .thresholds(y.ticks(10))    // Important: how many bins approx are going to be made? It is the 'resolution' of the violin plot
        .value(d => d)
  
  data.forEach(function(d) {
    if (currentTypeDomain=="Discrete"){
      d.group = d.dataset;
    }
    else{
      if (continuousDomain=="Noise"){
        d.group = d.noise_level
      }
    }
  });

  if (filteredData){
    let selectedData = JSON.parse(JSON.stringify(filteredData)) // deepcopy the filterData
    selectedData.forEach(function(d) {
      d.group = "Selected";
    });
    var violinData = data.concat(selectedData)
  }
  else{
    var violinData = data;
  }

  // sumstat has the calculated distribution for ratio values in each interval
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function(d) { return d.group;})
    .rollup(function(d) {   // For each key..
      input = d.map(function(g) { return g[className];})    // use the current selected class
      bins = histogram(input)   // And compute the binning on it.
      return(bins)
    })
    .entries(violinData)
  
  // What is the biggest number of value in a bin for each group?
  // maxNum is the dictionary for maximum bandwith for each violin, and the range of each violin is defined by the plus and minus of the corresponding max number
  var maxNum = {};
  sumstat.forEach(function(d) {
    var allBins = d.value;
    var lengths = allBins.map(function(a) { return a.length; });
    allBins.map(function(bin) {bin.group = d.key})
    maxNum[d.key] = d3.max(lengths);
  });
  // console.log(JSON.parse(JSON.stringify(sumstat)))

  
  function calculateDomain(length,key) {
    let xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum[key],maxNum[key]]) 
    return xNum(length);
  }
  
  // Add the shape to this svg!
  violinPlot
    .selectAll("myViolin") // not sure why the "myViolin", but it works somehow (shrug)
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
      .attr("transform", function(d){
        return("translate(" + x(getDataScope(d.key)) +" ,0)") 
      } ) // Translation on the right to be at the group position
      .style("fill", function (d) {
        // console.log("discrete color:",discreteDomainColor(d.key))
        //  console.log("set: ",setDomainColors(d))
         return setDomainColors(d) 
        } )
    .append("path")
        .datum(function(d){ return(d.value)} )     // So now we are working bin per bin
        .style("stroke", "none")
        .attr("d", d3.area()
            .x0(function(d){ 
              // return(xNum(-d.length)) 
              return calculateDomain(-d.length,d.group)
            })
            .x1(function(d){ 
              // return(xNum(d.length)) 
              return calculateDomain(d.length,d.group)
            })
            .y(function(d){ return(y(d.x0)) } )
            .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
        )
  } 

  function getDataScope(key){
    if (key=="Selected"){
      // the scope of let is only this "if" function
      let dataScope="(Partial)"
      return key+" "+dataScope
    }
    else {
      var dataScope="(Overall)"
      if (currentTypeDomain=="Discrete"){
        return key+" "+dataScope
      }
      else{
        if (continuousDomain=="Noise"){
          // console.log("Noise: "+ key.toString() +dataScope)
          return "Noise: "+ key.toString() +" " + dataScope
        }
      }
    } 
  }

  