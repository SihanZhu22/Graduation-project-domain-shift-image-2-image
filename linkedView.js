// color setup
var discreteDomains = ["Cityscapes", "Synthia"]
var discreteDomainColor = d3.scaleOrdinal()
  .domain(["Selected", "Cityscapes", "Synthia"])
  // .range(["#D6D6D6", "#1f78b4", "#b2df8a"])
  .range(["#D6D6D6","#b3cde3","#ccebc5"])

const colorSelectedInstances = "red";

var classKeys = ["others","road","sidewalk","vegetation","sky","car"]
var classColors = d3.scaleOrdinal()
    .domain(classKeys)
    // .range(["#decbe4", "#fed9a6","#ffffcc","#e5d8bd","#fddaec","#fbb4ae"]);
    .range(["#d29de3","#ffc473","#ffff99","#e6ca91","#fca7d3","#f08278"])

var classColorLegend = d3.select("#classColorLegend")

classColorLegend.append("text")
  .attr("x",10)
  .attr("y",15)
  .text("Class colormap")
  .attr("text-anchor", "right")
  .style("font-size", "14px")

// Add one dot in the legend for each name.
classColorLegend.selectAll("mydots")
  .data(classKeys)
  .enter()
  .append("circle")
    .attr("cx", 30)
    .attr("cy", function(d,i){ return 30 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    .attr("r", 5)
    .style("fill", function(d){ return classColors(d)})

classColorLegend.selectAll("mylabels")
  .data(classKeys)
  .enter()
  .append("text")
    .attr("x", 45)
    .attr("y", function(d,i){ return 30 + i*15}) // 100 is where the first dot appears. 25 is the distance between dots
    // .style("fill", function(d){ return classColors(d)})
    .text(function(d){ return d})
    .attr("text-anchor", "left")
    .style("alignment-baseline", "middle")
    .style("font-size", "10px")

// var classColorlegend = d3.legendColor()
//   .scale(classColors);
// var colormapContainer = d3.select("#classColormap");
// colormapContainer.call(classColorlegend);

// setup for selection of domains

// class distributions
// add title

//placeholder for now
const titleClassDist = d3.select("#classDistTitle")
  .append("text")
  .style("font-size", "16px")
  .style("font-weight", 700)
  .style("font-family", "Arial")
  .text("Class Ratio View");

// set the dimensions and margins of the graph
var violinMargin = { top: 10, right: 30, bottom: 30, left: 30 },
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
const margin_of_input = { top: 10, right: 10, bottom: 35, left:15},
  inputWidth = 460 - margin_of_input.left - margin_of_input.right,
  inputHeight = 400 - margin_of_input.top - margin_of_input.bottom;

const titleInputView = d3.select("#inputViewTitle")
  .append("text")
  .style("font-size", "16px")
  .style("font-weight", 700)
  .style("font-family", "Arial")
  .text("Input Distribution View");

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
  .style("font-weight", 700)
  .style("font-family", "Arial")
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
var heatmapMargin = { top: 15, right: 25, bottom: 20, left: 110 },
  heatmapWidth = 550 - heatmapMargin.left - heatmapMargin.right,
  heatmapHeight = 220 - heatmapMargin.top - heatmapMargin.bottom;

// append the svg object to the body of the page
var heatmap_svg = d3.select("#performancePlot")
  .append("svg")
  .attr("width", heatmapWidth + heatmapMargin.left + heatmapMargin.right)
  .attr("height", heatmapHeight + heatmapMargin.top + heatmapMargin.bottom)
  .append("g")
  .attr("transform",
    "translate(" + heatmapMargin.left + "," + heatmapMargin.top + ")");

// create a tooltip
var tooltip = d3.select("#performanceTooltip")
  .append("div")
  .style("opacity", 0)
  .attr("class", "tooltip")
  .style("background-color", "white")
  .style("border", "solid")
  .style("border-width", "2px")
  .style("border-radius", "5px")
  .style("padding", "5px")
  .style("position", "relative")
  .style("z-index", 1)
  .style("width", "200px");
// .style("white-space", "nowrap")
// .style("overflow", "hidden")
// .style("text-overflow", "ellipsis");

// legend for heatmap
var legendWidth = 0.8 * heatmapWidth;
var legendHeight = 20;
// color scale
// const heatmapColor = d3.scaleSequential()
//   .domain([0, 1]) // Range of values for the color scale
//   .interpolator(d3.interpolateGreys); // Color interpolation function (interpolate* is sequential single hue)
// Setup for image view

const titleImageView = d3.select("#imageViewTitle")
  .append("text")
  .style("font-size", "16px")
  .style("font-weight", 700)
  .style("font-family", "Arial")
  .text("Image View");

// Use the separate divs to hold the images
var domain1_images = d3.select("#imgDomain1")
// .attr("width", 1200)
// .attr("height", 300);

var domain2_images = d3.select("#imgDomain2")

// Setup for activation view

var margin_of_activation = { top: 30, right: 30, bottom: 35, left: 60 },
  activationWidth = 430 - margin_of_activation.left - margin_of_activation.right,
  activationHeight = 400 - margin_of_activation.top - margin_of_activation.bottom;

const titleModelView = d3.select("#modelViewTitle")
  .append("text")
  .style("font-size", "16px")
  .style("font-weight", 700)
  .style("font-family", "Arial")
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
// d3.csv("system_df_v3.csv", function (discreteData) {
d3.csv("discreted_data_v16.csv", function (discreteData) {
  // d3.csv("noise_df.csv", function (noiseData) {
  d3.csv("noise_data_sample_200_v3.csv", function (noiseData) {
    // create global variables
    currentTypeDomain = "Continuous"
    continuousDomain = "Noise"
    continuousValue = 0 //todo: change this to finding the min (non-zero) or max of the value
    // todo: change the slider also
    noiseData.forEach(function (d) {
      d.noise_level = +d.noise_level;
    });

    initializeViews()

    function initializeViews(changingNoise=false) {
      // initialize some views
      svg.selectAll("*").remove();
      d3.select("#imgDatasetNames").selectAll("*").remove();
      var currentSelectedDomain = d3.select("#domainMenu").property("value");

      // // determine the domain type and value
      // if (currentSelectedDomain = "Real vs. Synthetic"){
      //   currentTypeDomain = "Discrete"
      // }
      // else{
      //   currentTypeDomain = "Continous"
      //   continuousDomain = currentSelectedDomain
      // }

      if (currentTypeDomain == "Discrete") {
        // after this 
        data = discreteData
        originalData = discreteData // global variable specifically for range calculation of input scatter plot
        // dynamically add the legend for domain
        // Create the first SVG element
        var datasetNameSvg1 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
        datasetNameSvg1.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", discreteDomainColor("Cityscapes"));
        datasetNameSvg1.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
          .attr("font-size", "14").text("Cityscapes");

        // Create the second SVG element
        var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
        datasetNameSvg2.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", discreteDomainColor("Synthia"));
        datasetNameSvg2.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
          .attr("font-size", "14").text("Synthia");

        // initialize the views
        makeInputView(discreteData, "Latent t-SNE");
        makePerformanceView(data = discreteData)
        var currentViolinClass = "Road"
        makeClassDist(data = discreteData, filteredDataClass = 0, specifiedClassName = currentViolinClass, setDomainColors = setDomainColors);
      }
      else {
        // change the makeInputView
        // makeInputView(noiseData,"Classifier embedding")
        if (continuousDomain == "Noise") {
          data = noiseData
          originalData = noiseData // global variable specifically for range calculation of input scatter plot
          // create color mapping function
          let noiseMin = d3.min(noiseData, function (d) { return d.noise_level; });
          let noiseMax = d3.max(noiseData, function (d) { return d.noise_level; });
          let colorStart = "#c7e9c0";  // Start color (e.g., drak blue)
          let colorEnd = "#006d2c";    // End color (e.g., light blue)

          // continuousDomainColor = d3.scaleSequential()
          //     .domain([0, 5])
          //     // .interpolator(d3.interpolateHcl("blue", "pink")); 
          //     .interpolator(d3.interpolateHcl("#ece2f0", "#feb24c"));
          continuousDomainColor = d3.scaleOrdinal()
              .domain([0,1,2,3,4,5])
              .range(["#c6dbef","#9ecae1","#6baed6","#4292c6","#2171b5","#084594"]);


          // continuousDomainColor = d3.scaleLinear()
          //   .domain([noiseMin, noiseMax])
            // .range([colorStart, colorEnd])
            // .interpolate(d3.interpolateHsl);
          // dynamically add the legend for domain
          // Create the first SVG element
          var datasetNameSvg1 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
          datasetNameSvg1.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", continuousDomainColor(0));
          datasetNameSvg1.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
            .attr("font-size", "14").text("Noise: 0");

          // Create the second SVG element
          if (continuousValue != 0) {
            var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
            datasetNameSvg2.append("circle").attr("cx", "30").attr("cy", "10").attr("r", "6").attr("fill", function () { return continuousDomainColor(continuousValue) });
            datasetNameSvg2.append("text").attr("x", "50%").attr("y", "15").attr("text-anchor", "middle")
              .attr("font-size", "14").text("Noise: " + continuousValue.toString());
          }
          else {
            var datasetNameSvg2 = d3.select("#imgDatasetNames").append("svg").attr("width", "49%").attr("height", "25");
          }
          var noiseDataOriginal = noiseData.filter(function (d) { return d.noise_level == 0 })
          if (continuousValue) { // if current noise level is not 0
            var noiseDataCurrent = noiseData.filter(function (d) { return d.noise_level == continuousValue })
            // noiseSelectedData is global
            noiseSelectedData = noiseDataOriginal.concat(noiseDataCurrent);
          }
          else {
            noiseSelectedData = noiseDataOriginal;
          }
          // make input view (tsne->latent by default)
          var selectedEmbeddingMethod = d3.select("#embeddingMethods").property("value");
          makeInputView(noiseSelectedData, selectedEmbeddingMethod);

          // create the performance view and class distribution
          makePerformanceView(data = noiseSelectedData)
          var currentViolinClass = "Road";
          makeClassDist(data = noiseSelectedData, filteredDataClass = 0, specifiedClassName = currentViolinClass, setDomainColors = setDomainColors)
          // get noise level and make colors
          // TODO: if there are current selected noise level, use the current one; otherwise, use "Latent"
          if (changingNoise){ // change this to something else
            // (stuck) remove brushing selection from input view 

            // update the filteredData to the new "filteredData", which has the same 
            var filteredWithoutNoise = filteredDataImageView.filter(function (d) { return d.noise_level == 0; })
            if (continuousValue!=0){
              // function for filtering instances in 
              function filterDataByNames(dataset1, dataset2) {
                return dataset1.filter(item1 => dataset2.some(item2 => item2.name === item1.name));
              }
              // find all the intances in data with same names as filteredWithoutNoise
              var filteredSameNames = filterDataByNames(originalData,filteredWithoutNoise);
              // filter the current level of noise
              var filteredSpecificNoise = filteredSameNames.filter(function(d){return d.noise_level ==continuousValue})
              filteredDataUpdated = filteredWithoutNoise.concat(filteredSpecificNoise)
            }
            else{
              filteredDataUpdated = filteredWithoutNoise
            }
            // console.log("filteredDataUpdated\n",JSON.parse(JSON.stringify(filteredDataUpdated)))
            var newFilteredData = modifyFiltered(filteredDataUpdated)
            updateImages(newFilteredData)
            updateActivations(newFilteredData)
            // update the image view based on the previous images
            // update model view based on the previous selected images
          }
        }
      // always use all the arguments because the missing argument is undefined
      }
    }

    d3.select("#domainMenu").on("click", function(d) {
      // recover the option that has been chosen
      // run the updateChart function with this selected option
      var selectedDomain = d3.select("#domainMenu").property("value");
      if (selectedDomain == "Real vs. Synthetic") {
        currentTypeDomain = "Discrete"
        initializeViews()
      }
      else {
        currentTypeDomain = "Continuous"
        continuousDomain = selectedDomain
        initializeViews()
      }
    }) 


    // event listener for domain selection
    // var domainDropdown = d3.selectAll("#dropdown .child li");
    // domainDropdown.on("click", function () {
    //   d3.event.stopPropagation();
    //   const selectedDomain = d3.select(this).text().trim();
    //   // TODO: make the text more complicated later
    //   // d3.select("#currentSelectedDomain").selectAll("*").remove();
    //   // d3.select("#currentSelectedDomain")
    //   //     .append("text")
    //   //     .text("Current domain type: " + selectedDomain)
    //   //     .style("font-family", "Arial") // Set the font-family to Arial;
    //   if (selectedDomain == "Discrete") {
    //     currentTypeDomain = "Discrete"
    //     initializeViews()
    //   }
    //   else {
    //     currentTypeDomain = "Continuous"
    //     initializeViews()
    //     // current domain is the specific value?
    //   }
    // })

    // event listener for slider
    // think about: combining this with domainDropdown or not?
    var slider = d3.select("#mySlider");
    slider.on("input", function () {
      // Retrieve the selected value from the slider
      var selectedValue = d3.event.target.value;

      // Do something with the selected value
      continuousValue = +selectedValue
      if (typeof filteredDataImageView!=="undefined"){//first check that there are some previous filter data
        initializeViews(changingNoise=true)
      }
      else{
        initializeViews(changingNoise=false)
      }
    });

    // event listener for class dist
    d3.select("#classMenu").on("click", function(d) {
        // recover the option that has been chosen
        var selectedOption = d3.select(this).property("value")
        makeClassDist(data = data, filteredDataClass = 0, specifiedClassName = selectedOption, setDomainColors = setDomainColors)
    }) 

    // const embeddingMethodsItems = d3.selectAll('#embeddingMethods .child li');
    d3.select("#embeddingMethods").on("click", function(d) {
      // recover the option that has been chosen
      // d3.event.stopPropagation();
      var selectedOption = d3.select(this).property("value")
      makeInputView(data, selectedOption);
    }) 
    // // embeddingMethods: Add click event listener to each menu item
    // embeddingMethodsItems.on('click', function () {
    //   // Get the selected option using D3
    //   d3.event.stopPropagation();
    //   const selectedOption = d3.select(this).text().trim();
    //   // Get the parent element and its text
    //   // const parentElement = d3.select(this).node().parentNode.parentNode.parentNode;
    //   const parentElement = d3.select(this).node().parentNode.parentNode;
    //   const parentText = d3.select(parentElement).select("a").text().trim();

    //   svg.selectAll("*").remove();
    //   makeInputView(data, selectedOption, parentText);
    // });

    function makeInputView(data, Option) {
      // remove the previous text and add new text
      svg.selectAll("*").remove();

      //todo: get the clear brush to work!
      // if (typeof brush !== 'undefined'){
      //   // brush.move(svg, null);
      //   svg.call(brush.move, null);
      // }

      // d3.select("#currentEmbeddingMethod").selectAll("*").remove();
      // embeddingMethodsText = optionParent + "» " + Option
      // d3.select("#currentEmbeddingMethod").append("text")
      //   .text(embeddingMethodsText);

      // Convert the strings in the "tsne_1" and "tsne_2" column to numbers
      
      if (Option == "t-SNE") {
        data.forEach(function (d) {
          d.embedding_1 = +d.simple_tsne_1;
          d.embedding_2 = +d.simple_tsne_2
        });
        // for range calculation
        originalData.forEach(function (d) {
          d.embedding_1 = +d.simple_tsne_1;
          d.embedding_2 = +d.simple_tsne_2
        });
      }
      else if (Option == "PCA") {
        data.forEach(function (d) {
          d.embedding_1 = +d.pca_1; //TODO: change the tsne_1 to something else
          d.embedding_2 = +d.pca_2;
        });
        // for range calculation
        originalData.forEach(function (d) {
          d.embedding_1 = +d.pca_1; //TODO: change the tsne_1 to something else
          d.embedding_2 = +d.pca_2;
        });
      }
      else if (Option == "UMAP") {
        data.forEach(function (d) {
          d.embedding_1 = +d.umap_1; //TODO: change the tsne_1 to something else
          d.embedding_2 = +d.umap_2;
        });
        // for range calculation
        originalData.forEach(function (d) {
          d.embedding_1 = +d.umap_1; //TODO: change the tsne_1 to something else
          d.embedding_2 = +d.umap_2;
        });
      }
      else if (Option == "Latent t-SNE") {
        data.forEach(function (d) {
          d.embedding_1 = +d.meaningful_tsne_1;
          d.embedding_2 = +d.meaningful_tsne_2;
        });
        originalData.forEach(function (d) {
          d.embedding_1 = +d.meaningful_tsne_1;
          d.embedding_2 = +d.meaningful_tsne_2;
        });
      }

      // input view: range for each dimension
      const min_dim_1 = d3.min(originalData, function (d) { return d.embedding_1; });
      const max_dim_1 = d3.max(originalData, function (d) { return d.embedding_1; });
      const min_dim_2 = d3.min(originalData, function (d) { return d.embedding_2; });
      const max_dim_2 = d3.max(originalData, function (d) { return d.embedding_2; });

      // Add X axis
      var x = d3.scaleLinear()
        .domain([min_dim_1 - 0.1 * Math.abs(min_dim_1), 1.1 * max_dim_1])
        .range([0, inputWidth]);
      var xAxis = svg.append("g")
        .attr("transform", "translate(0," + inputHeight + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([min_dim_2 - 0.1 * Math.abs(min_dim_2), 1.1 * max_dim_2])
        .range([inputHeight, 0]);
      var yAxis = svg.append("g")
        .call(d3.axisLeft(y));

      
      // Add dots
      var myPoint = svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d.embedding_1) })
        .attr("cy", function (d) { return y(d.embedding_2) })
        .attr("r", 3.5)
        .style("fill", function (d) { return setDomainColors(d) })
        .classed("points", true)

      //remove the x and y axis
      xAxis.remove()
      yAxis.remove()

      // Add brushing
      // the non-passive event listener is not because of it's within a function; 
      // however, might still be a nice thing to move it outside of the makeInputView function at some point
      // issues are with x,y,and myPoint: could declare them to be global, but not sure how that would affect other plots
      brush = d3.brush()                 // Add the brush feature using the d3.brush function
                  .extent([[0, 0], [inputWidth, inputHeight]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
                  .on("brush start", function () {
                    updateChart_start(myPoint, x, y); // Invoke the function inside the event handler
                  })
                  .on("end", function () {
                    if (!d3.event.selection) {
                      updateChart_end(myPoint, x, y); // Invoke the function when the brush selection is cleared
                    }
                  }),
                  { passive: true }
      svg
        .call(brush)
    }

    // Add interaction with clicking
    function clickImage() {
      d3.selectAll(".image").on("click", function () {
        // Change the class of the previous selected image to just "image"
        // Make it "image" before removing it from "selectedImage"

        // classify the previous instance image to either viewedSelectedImage or viewedNotSelectedImage
        var original_id = d3.select(".instanceImage").attr("id").split("-")[1];
        var original_instance = originalData.filter(function (d) { return d.id == original_id;})[0];
        if (currentTypeDomain == "Discrete"){
          // make sure to use the right previous corresponding path
          var similarClassCheckbox = d3.select('input[name="similarityByClass"]').node();
          var imageValue = similarClassCheckbox.checked ? 1 : 0;
          if (imageValue==0){
            var original_corresponding_instance = originalData.filter(function(d){return d.image_path == original_instance.similar_image_paths})
            // var original_corresponding_id = original_corresponding_instance[0].id
          }
          else{
            var currentClass = d3.select("#classMenu").property("value")
            var second_instance_path_column = "similar_image_paths_"+currentClass.toLowerCase()
            var original_corresponding_instance = originalData.filter(function(d){return d.image_path == original_instance[second_instance_path_column]})
            // var original_corresponding_id = original_corresponding_instance[0].id
          }
        }
        else{
          if (continuousValue!=0){
            var original_corresponding_instance = originalData.filter(function(d){
                                          return (d.name == original_instance.name &&
                                        d.noise_level == 0)})
          }else{
            var original_corresponding_instance = originalData.filter(function(d){
              return (d.name == original_instance.name &&
            d.noise_level == continuousValue)})
          }
        }
        console.log("original_corresponding_instance",original_corresponding_instance)
        var original_corresponding_id = original_corresponding_instance[0].id
        // console.log("original instance:\n",JSON.parse(JSON.stringify(original_instance)))
        // console.log("original corresponding instance:\n",JSON.parse(JSON.stringify(original_corresponding_instance)))
        // console.log("original corresponding instance id:\n", JSON.parse(JSON.stringify(original_corresponding_id)))
        // Get the ID of the clicked image
        var id = d3.select(this).attr("id").split("-")[1];

        // check and change the original image
        if (original_instance.selected == true) {
          d3.selectAll(".instanceImage").classed("viewedSelectedImage", true)
          // changing the original selected instance to classify as other instances
          d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
            return d.id === original_id
          });
        }
        else {
          d3.selectAll(".instanceImage").classed("viewedNotSelectedImage", true)
          d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
            return d.id === original_id
          });
        }
        // if (currentTypeDomain == "Discrete"){
          // check for the original corresponding image and change
        if (original_corresponding_instance.selected == true) {
          // changing the original selected instance to classify as other instances
          d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
            // console.log("selected points")
            return d.id === original_corresponding_id
          });
        }
        else {
          d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
            return d.id === original_corresponding_id
          });
        }
        // }
        // stop highlighting the previous instance image 
        d3.selectAll(".instanceImage").classed("instanceImage", false);

        // Find the corresponding data in your dataset
        var instance = data.filter(function (d) { return d.id == id; })[0];
        if (currentTypeDomain == "Discrete"){
          if (imageValue==0){ // if similarity is not based on class
            // find corresonding image by similar image class
            var second_clicked_instance = data.filter(function (d) { 
                        return d.image_path == instance.similar_image_paths; 
                      })[0];
          }
          else{ // if similarity is based on class
            // find corresonding image by original class
            var currentClass = d3.select("#classMenu").property("value")
            var second_instance_path_column = "similar_image_paths_"+currentClass.toLowerCase()
            var second_clicked_instance = data.filter(function (d) { 
              return d.image_path == instance[second_instance_path_column]; 
            })[0];
          }
        }

        // if only one checkbox is selected, meaning that there are multiple instances:
        if (countCheckbox == 1) {
          // d3.select(this).classed("viewedNotSelectedImage", false);
          // d3.select(this).classed("instanceImage", false);
          d3.select(this).classed("instanceImage", true);
        }
        // otherwise, color the boundaries of all the images
        else {
          // var selectedImage = d3.select(this);
          var parentDiv = this.parentNode;
          // d3.select(parentDiv).selectAll(".image").classed("viewedSelectedImage", false);
          d3.select(parentDiv).selectAll(".image").classed("instanceImage", true);
        }
        var selectedActivationsDR = d3.select("#modelSpaceDRMethod").property("value");
        instanceActivations(instance,selectedActivationsDR)

        var filteredPoint = d3.selectAll(".points")
          .filter(function (d) {
            return d.id === id;
          });
        filteredPoint.classed("viewed-selected-points", false)
        filteredPoint.classed("viewed-not-selected-points", false)
        filteredPoint.classed("instance-point", true)
        if (currentTypeDomain == "Discrete"){
          var filteredCorrespondingPoint = d3.selectAll(".points")
          .filter(function (d) {
            return d.id == second_clicked_instance.id;
          });
          filteredCorrespondingPoint.classed("viewed-selected-points", false)
          filteredCorrespondingPoint.classed("viewed-not-selected-points", false)
          filteredCorrespondingPoint.classed("instance-point", true)
        }
      })
    }


    // Function that is triggered when brushing is performed
    function updateChart_start(myPoint, x, y) {
      // the chart is update many times with the selection it seems like
      extent = d3.event.selection
      myPoint.classed("selected-points", function (d) { return isBrushed(extent, x(d.embedding_1), y(d.embedding_2)) }) // The points are classed to be either true or false
      // update the corresponding images, leave out initially
      var filteredData = data.filter(function (d) { return isBrushed(extent, x(d.embedding_1), y(d.embedding_2)) })
      if (filteredData.length > 0) {
        var newFilteredData = modifyFiltered(filteredData)
        // remove all the red boundaries first (before adding new one later)
        myPoint.classed("instance-point", function () {
          return false;
        });
        myPoint.classed("viewed-selected-points", function () {
          return false;
        });
        myPoint.classed("viewed-not-selected-points", function () {
          return false;
        });
        updateMultipleViews(newFilteredData)
      }
    }
    function updateChart_end(){
      // make all of the points "normal" again (without any other class)
      d3.selectAll(".points").classed("not-used-points",false);
      d3.selectAll(".points").classed("instance-point",false);
      d3.selectAll(".points").classed("viewed-selected-points",false);
      d3.selectAll(".points").classed("viewed-not-selected-points",false);

      // TODO: maybe clear all the other views too
    }

    function updateMultipleViews(filteredData) {
      if (filteredData.length > 0) {
        updateImages(filteredData)
        updateActivations(filteredData)
        makePerformanceView(data, filteredData)
        var currentClassViolin = d3.select("#classMenu").property("value");
        makeClassDist(data = data, filteredDataClass = filteredData, specifiedClassName = currentClassViolin, setDomainColors = setDomainColors)
        d3.select("#classMenu").on("click", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          makeClassDist(data = data, filteredDataClass = 0, specifiedClassName = selectedOption, setDomainColors = setDomainColors)
          // other views change correspondingly, if similarity is determined by class
          console.log("event listener triggered")
          var similarClassCheckbox = d3.select('input[name="similarityByClass"]').node();
          var imageValue = similarClassCheckbox.checked ? 1 : 0;
          console.log("imageValue:\n",imageValue)
          if (imageValue==1 && currentTypeDomain=="Discrete"){
            console.log("checkbox selected")
            updateMultipleViews(filteredData)
        }
        }) 
        
        // allow clicking images after adding all the images to image view
        // (the listeners have to be added after the images have been appended to the DOM)
        clickImage()

        // event listener: change of image/label/prediction selection
        var checkboxes = d3.selectAll('input[name="imageCheck"], input[name="groundTruthCheck"], input[name="predictionCheck"]');
        // "filter(":checked")": filters the selection to include only the checkboxes that are checked
        var checkedCount = checkboxes.filter(":checked").size();
        checkboxes.on("change", function () {
          updateMultipleViews(filteredData)
        }); // this function(){} is necessary to have, otherwise the updateMultipleViews will be immediately called

        // event listener for the checkbox of determine image similarity (by class or not) here:
        var similarityClassCheck = d3.select('input[name="similarityByClass"]');
        similarityClassCheck.on("change", function () {
          updateMultipleViews(filteredData)
        });

        // Image View: next button: 
        var nextButton = d3.select("#imageCheckBox button"); // name of div + button
        nextButton.on("click", function () {
          if (currentTypeDomain == "Continuous") {
            // move top three pairs to the end (the objects in filteredData are the same, just the order is different)
            var firstThreepairs = filteredData.slice(0, 6); // Get the first three elements
            var remainingElements = filteredData.slice(6); // Get the remaining elements
            var newFilteredData = remainingElements.concat(firstThreepairs); // Concatenate the remaining elements with
            updateMultipleViews(newFilteredData);
          }
          else {
            // separate the data for domain 1 and 2
            var domain1Data = filteredData.filter(function (d) {
              if (currentTypeDomain == "Discrete") {
                return d.dataset === "Cityscapes";
              }
              else {
                return d.noise_level == 0;
              }
            });
            var domain2Data = filteredData.filter(function (d) {
              if (currentTypeDomain == "Discrete") {
                return d.dataset === "Synthia";
              }
              else {
                if (continuousDomain == "Noise" && continuousValue != 0) {
                  return d.noise_level == continuousValue
                }
                else {
                  return 0;
                }
              }
            });
            // get the parent div of the current selected image: imgDomain1 or imgDomain2
            var parentDiv = d3.select(".instanceImage").node().parentNode;
            var parentDivId = parentDiv.id;
            // switch the cityscapes or synthia based on the div with 
            if (checkedCount == 1) {
              if (parentDivId == "imgDomain1") {
                var firstThreeElements = domain1Data.slice(0, 3); // Get the first three elements
                var remainingElements = domain1Data.slice(3); // Get the remaining elements
                domain1Data = remainingElements.concat(firstThreeElements); // Concatenate the remaining elements with the first three elements
                var newFilteredData = domain1Data.concat(domain2Data)
              }
              else {
                var firstThreeElements = domain2Data.slice(0, 3); // Get the first three elements
                var remainingElements = domain2Data.slice(3); // Get the remaining elements
                domain2Data = remainingElements.concat(firstThreeElements); // Concatenate the remaining elements with the first three elements
                var newFilteredData = domain2Data.concat(domain1Data);
              }
            }
            else {
              if (parentDivId == "imgDomain1") {
                var firstElement = domain1Data.shift();
                domain1Data.push(firstElement);
                var newFilteredData = domain1Data.concat(domain2Data)
              }
              else {
                var firstElement = domain2Data.shift();
                domain2Data.push(firstElement);
                var newFilteredData = domain2Data.concat(domain1Data);
              }
            }
            // var firstElement = filteredData.shift();
            // filteredData.push(firstElement);
            updateMultipleViews(newFilteredData);
          }
        })
      }
    }

    function modifyFiltered(filteredData) {
      // console.log("filteredData\n",JSON.parse(JSON.stringify(filteredData)));
      if (currentTypeDomain == "Discrete") {
        var indexToMove  = filteredData.findIndex(function(d){
          return d.image_path == filteredData[0].similar_image_paths;
        });
        if (indexToMove !==-1) {
          // Remove the item from its current position
          var itemToMove = filteredData.splice(indexToMove, 1)[0];
          // Insert the removed item at the desired position (e.g., second position)
          filteredData.splice(1, 0, itemToMove);
          filteredData.map(function (d) { d["selected"] = true });
          return filteredData
        }
        else{
          filteredData.map(function (d) { d["selected"] = true });
        }
        return filteredData
      }
      else {
        if (continuousDomain == "Noise" && continuousValue != 0) {
          // sort the data with the name column
          function compare(a, b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            if (a.name == b.name) {
              if (a.noise_level < b.noise_level) {
                return -1;
              }
              else if (a.noise_level < b.noise_level) {
                return 1;
              }
              else {
                return 0;
              }
            }
          }
          filteredData.sort(compare);
          filteredData.map(function (d) { d["selected"] = true });
          // fo r image that did not come together with another noise level, also get another noise level
          // count the occurance of each name with reduce
          var nameCounts = filteredData.reduce(function (acc, curr) {
            acc[curr.name] = (acc[curr.name] || 0) + 1;
            return acc;
          }, {}); // "{}" is the initial value for reduce function

          // Filter the instances based on the count of each name
          var singleImageCases = filteredData.filter(function (d) {
            return nameCounts[d.name] === 1;
          });
          // continuousValue
          if (singleImageCases.length > 0) {
            var notSelectedImageCases = singleImageCases.map(function (d) {
              if (d.noise_level === 0) {
                return noiseData.find(function (obj) {
                  return obj.name === d.name && obj.noise_level === continuousValue;
                });
              }
              else {
                return noiseData.find(function (obj) {
                  return obj.name === d.name && obj.noise_level === 0;
                });
              }
            });
            notSelectedImageCases.map(function (d) { d["selected"] = false });
            var newFilteredData = filteredData.concat(notSelectedImageCases)
            newFilteredData.sort(compare)
            return newFilteredData
          }
          return filteredData
        }
        else {
          filteredData.map(function (d) { d["selected"] = true });
          return filteredData
        }
      }
      // return modifiedData
    }

    function updateImages(filteredData) {
      // first set the global variable to use when the noise is changed
      filteredDataImageView = filteredData
      // find the first one of the filteredData
      var first_index = filteredData.findIndex(function (d) { return d.selected == true })
      // find the right similar image paths and scores
      var similarClassCheckbox = d3.select('input[name="similarityByClass"]').node();
      var imageValue = similarClassCheckbox.checked ? 1 : 0;
      if (currentTypeDomain == "Discrete" && imageValue ==1) {
        var currentClass = d3.select("#classMenu").property("value")
        // var instance = filteredData[first_index];
        var second_instance_path_column = "similar_image_paths_"+currentClass.toLowerCase()
        filteredData[first_index].similar_image_paths_selected = filteredData[first_index][second_instance_path_column]
        // var second_instance_score_column = "similar_IoU_score_"+currentClass.toLowerCase()
        // instance.similar_IoU_score_selected =+instance[second_instance_score_column]
      }
      else if (currentTypeDomain == "Discrete" && imageValue ==0){
        filteredData[first_index].similar_image_paths_selected = filteredData[first_index].similar_image_paths
        // instance.similar_IoU_score_selected =instance.similar_IoU_score
      }
      // corresponding image for discrete domains
      if (filteredData.length>1 && filteredData[0].similar_image_paths_selected==filteredData[1].image_path){
        // second_index = filteredData.findIndex(function (d) { return filteredData[1].image_path == filteredData[0].similar_image_paths})
        second_index = 1
      }
      else if (filteredData.length>1 && filteredData[0].name == filteredData[1].name){
        if (first_index == 1){
          second_index = 0
        }
        else{
          second_index = 1
        }
        
      }
      else{
        second_index = -1
      }

      // d3.selectAll(".points").classed("instance-point", function (d) {
      //   return d.embedding_1 === filteredData[first_index].embedding_1 && d.embedding_2 === filteredData[first_index].embedding_2
      // });
      // the instance that corresponds to the first instance in the filter data (most similar mask for discrete domain)
      var correspondingInstance = originalData.find(function (d) {
        if (currentTypeDomain == "Discrete") {
          return d.image_path === filteredData[first_index].similar_image_paths_selected;
        }
        else {
          // noise domain
          if (filteredData[first_index].noise_level == 0) {
            return d.noise_level === continuousValue && d.name === filteredData[first_index].name;
          }
          else {
            return d.noise_level === 0 && d.name === filteredData[first_index].name;
          }
        }
      });
      // console.log("correspondingInstance:\n",JSON.parse(JSON.stringify(correspondingInstance)))
      // console.log("correspondingInstance embeddings :\n",JSON.parse(JSON.stringify(correspondingInstance.embedding_1)))
      // console.log("filteredData[0] embeddings :\n",JSON.parse(JSON.stringify(filteredData[0].embedding_1)))
      // console.log("filteredData[1] embeddings :\n",JSON.parse(JSON.stringify(filteredData[1].embedding_1)))
      d3.selectAll(".points").classed("instance-point", function (d) {
        return (d.embedding_1 === correspondingInstance.embedding_1 && d.embedding_2 === correspondingInstance.embedding_2)
         || (d.embedding_1 === filteredData[first_index].embedding_1 && d.embedding_2 === filteredData[first_index].embedding_2)
      });
      // d3.selectAll(".points").classed("instance-point", function (d) {
      //   return d.embedding_1 === filteredData[first_index].embedding_1 && d.embedding_2 === filteredData[first_index].embedding_2
      // });
      // first turn off the not-used-points class before adding new ones
      d3.selectAll(".not-used-points").classed("not-used-points", false);

      const maxImages = 100;
      var numDomain1 = 0;
      var numDomain2 = 0;
      domain1_images.selectAll("*").remove();
      domain2_images.selectAll("*").remove();

      // Set the classes to be false before setting new ones.
      d3.selectAll(".selected-points").classed("viewed-selected-points", false)
      d3.selectAll(".points").classed("viewed-not-selected-points", false)

      // first check the selections
      // each Checkbox variable contain a True or False value on whether it's checked
      var imageCheckbox = d3.select('input[name="imageCheck"]').node();
      var groundTruthCheckbox = d3.select('input[name="groundTruthCheck"]').node();
      var predictionCheckbox = d3.select('input[name="predictionCheck"]').node();

      var imageValue = imageCheckbox.checked ? 1 : 0;
      var groundTruthValue = groundTruthCheckbox.checked ? 1 : 0;
      var predictionValue = predictionCheckbox.checked ? 1 : 0;

      // not initialize the variable so that it's global (Automatically Global (doesn't work if strict mode is on))
      countCheckbox = imageValue + groundTruthValue + predictionValue;

      // for continuous data: re-organize the data and add not selectedData
      // if (currentTypeDomain=="Continuous"){
      //   modifiyFilteredContinuous(filteredData)
      // }

      //conditions
      if (countCheckbox == 1) {
        if (imageValue) {
          filteredData.forEach(function (d) {
            d.path = d.image_path; // no "+", because don't need path to be number here
          });
        }
        else if (groundTruthValue) {
          filteredData.forEach(function (d) {
            d.path = d.label_path;
          });
        }
        else {
          filteredData.forEach(function (d) {
            d.path = d.prediction_path;
          });
        }
        for (let i = 0; i < maxImages; i++) {
          if (filteredData.length <= i || (numDomain1 >= 4 && numDomain2 >= 4)) {
            break
          }
          if (i == first_index||i==second_index) {
            current_class = "instanceImage"
          }
          else {
            // distinguish the selected between the not selected ones
            if (filteredData[i].selected === true) {
              current_class = "viewedSelectedImage"
            }
            else {
              current_class = "viewedNotSelectedImage"
            }
          }
          // either discrete cityscapes, or continuous with noise level=0
          if ((filteredData[i].dataset == "Cityscapes" && currentTypeDomain == "Discrete") || filteredData[i].noise_level == 0) {
            // var heightPercentCityscpaes = ((1024/2048)*100).toString()+"%";
            if (numDomain1 < 3) {
              var current_image = domain1_images.append("svg")
                .classed("image", true)
                .classed(current_class, true)
                .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
                .insert('image')
                .attr('xlink:href', filteredData[i].path)
                .attr('width', '100%')
                .attr('height', '100%')
                // .attr('height', heightPercentCityscpaes.toString())
                .attr('preserveAspectRatio', 'xMinYMin meet');

              if (i != first_index && i!= second_index && filteredData[i].selected == true) {
                d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
                  return d.embedding_1 === filteredData[i].embedding_1 && d.embedding_2 === filteredData[i].embedding_2
                });
              }
              else if (i != first_index && i!= second_index && filteredData[i].selected == false) {
                d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
                  return d.embedding_1 === filteredData[i].embedding_1 && d.embedding_2 === filteredData[i].embedding_2
                });
              }
              // if (i!=0){
              //   // current_image.classed("selectedImage")
              //   d3.selectAll(".selected").classed("viewed-points", function(d) {
              //     return d.tsne_1 === filteredData[i].tsne_1 && d.tsne_2 === filteredData[i].tsne_2
              //   });
              // }
              numDomain1 = numDomain1 + 1
            }
          }
          // either discrete synthia, or continuous with noise level the same as the current value
          else if ((filteredData[i].dataset == "Synthia" && currentTypeDomain == "Discrete") || filteredData[i].noise_level == continuousValue) {
            // var heightPercentSynthia = ((760/1280)*100).toString()+"%";
            if (numDomain2 < 3) {
              var current_image = domain2_images.append("svg")
                .classed("image", true)
                .classed(current_class, true)
                .attr("id", "image-" + filteredData[i].id) // assign an ID to the image element
                .insert('image')
                .attr('xlink:href', filteredData[i].path)
                .attr('width', '100%')
                .attr('height', '100%')
                // .attr('height', heightPercentSynthia)
                .attr('preserveAspectRatio', 'xMinYMin meet');

              if (i != first_index && i!=second_index && filteredData[i].selected == true) {
                d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
                  return d.embedding_1 === filteredData[i].embedding_1 && d.embedding_2 === filteredData[i].embedding_2
                });
              }
              else if (i != first_index && i!=second_index && filteredData[i].selected == false) {
                d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
                  return d.embedding_1 === filteredData[i].embedding_1 && d.embedding_2 === filteredData[i].embedding_2
                });
              }

              // if (i!=0){
              //   // current_image.classed("selectedImage")
              //   d3.selectAll(".selected").classed("viewed-points", function(d) {
              //     return d.tsne_1 === filteredData[i].tsne_1 && d.tsne_2 === filteredData[i].tsne_2
              //   });
              // }

              numDomain2 = numDomain2 + 1
            }
          }
        }
      }
      else {
        // filter out the cityscapes and synthia data
        var domain1Data = filteredData.filter(function (d) {
          if (currentTypeDomain == "Discrete") {
            return d.dataset === "Cityscapes";
          }
          else {
            return d.noise_level == 0;
          }
        });
        var domain2Data = filteredData.filter(function (d) {
          if (currentTypeDomain == "Discrete") {
            return d.dataset === "Synthia";
          }
          else {
            if (continuousDomain == "Noise" && continuousValue != 0) {
              return d.noise_level == continuousValue
            }
            else {
              return 0;
            }
          }
        });
        if (domain1Data.length > 0) {
          instance = domain1Data[0]
          if (instance == filteredData[first_index]||instance == filteredData[second_index]) {
            current_class = "instanceImage"
          }
          else {
            if (instance.selected == true) {
              current_class = "viewedSelectedImage"
              d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
                return d.embedding_1 === instance.embedding_1 && d.embedding_2 === instance.embedding_2
              });
            }
            else {
              current_class = "viewedNotSelectedImage"
              d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
                return d.embedding_1 === instance.embedding_1 && d.embedding_2 === instance.embedding_2
              });
            }
          }
          if (imageValue) {
            var current_image = domain1_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.image_path)
              .attr('width', '100%') //TODO: need to change this if the image is larger
              .attr('height', "100%")
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (groundTruthValue) {
            var current_image = domain1_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.label_path)
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (predictionValue) {
            var current_image = domain1_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.prediction_path)
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
        }
        if (domain2Data.length > 0) {
          instance = domain2Data[0]
          if (instance == filteredData[first_index]||instance == filteredData[second_index]) {
            current_class = "instanceImage"
          }
          else {
            if (instance.selected == true) {
              current_class = "viewedSelectedImage"
              d3.selectAll(".selected-points:not(.viewed-selected-points)").classed("viewed-selected-points", function (d) {
                return d.embedding_1 === instance.embedding_1 && d.embedding_2 === instance.embedding_2
              });
            }
            else {
              current_class = "viewedNotSelectedImage"
              d3.selectAll(".points:not(.viewed-not-selected-points)").classed("viewed-not-selected-points", function (d) {
                return d.embedding_1 === instance.embedding_1 && d.embedding_2 === instance.embedding_2
              });
            };
          }
          if (imageValue) {
            var current_image = domain2_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.image_path)
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (groundTruthValue) {
            var current_image = domain2_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.label_path)
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
          if (predictionValue) {
            var current_image = domain2_images.append("svg")
              .classed("image", true)
              .classed(current_class, true)
              .attr("id", "image-" + instance.id) // assign an ID to the image element
              .insert('image')
              .attr('xlink:href', instance.prediction_path)
              .attr('width', '100%')
              .attr('height', '100%')
              .attr('preserveAspectRatio', 'xMinYMin meet');
          }
        }
      }
      d3.selectAll(".points")
        .filter(function() {
          return !d3.select(this).classed("instance-point") && !d3.select(this).classed("viewed-selected-points") && !d3.select(this).classed("viewed-not-selected-points");
        })
        .classed("not-used-points", true);
    }


    function updateActivations(filteredData) {
      if (filteredData.length > 0) {
        // call the first instance in filterData as default
        // todo (maybe):find the first instance that are selected
        selectedInstance = filteredData[0];
        var selectedActivationsDR = d3.select("#modelSpaceDRMethod").property("value");
        instanceActivations(selectedInstance,selectedActivationsDR) // add current option here
        d3.select("#modelSpaceDRMethod").on("click", function(d) {
          // recover the option that has been chosen
          var selectedOption = d3.select(this).property("value")
          // run the updateChart function with this selected option
          instanceActivations(selectedInstance,selectedOption)
      })
      }
    }

    function instanceActivations(instance,activationDR) {
      // var reductionMethod = d3.select("#modelSpaceDRMethod").property("value");
      if (currentTypeDomain == "Discrete") {
        var similarClassCheckbox = d3.select('input[name="similarityByClass"]').node();
        var imageValue = similarClassCheckbox.checked ? 1 : 0;
        if (imageValue==0){
          var second_instance_path = instance.similar_image_paths;
          similar_IoU_score = +instance.similar_IoU_score;
        }
        else{
          var currentClass = d3.select("#classMenu").property("value")
          var second_instance_path_column = "similar_image_paths_"+currentClass.toLowerCase()
          var second_instance_path = instance[second_instance_path_column]

          var second_instance_score_column = "similar_IoU_score_"+currentClass.toLowerCase()
          similar_IoU_score = +instance[second_instance_score_column]
        }
        var second_instance = data.find(function (d) {
          return d.image_path === second_instance_path;
        });
      }
      else {
        if (continuousDomain == "Noise") {
          // get the current noise level
          // find the corresponding image in that level
          if (continuousValue != 0) {
            var second_instance = data.find(function (d) {
              // if the first instance have noise = 0, then find the instance with selected noise value
              // and vice versa
              if (instance.noise_level == 0) {
                return d.noise_level === continuousValue && d.name === instance.name;
              }
              else {
                return d.noise_level === 0 && d.name === instance.name;
              }
              // return (d.noise_level ==0)? (d.name === instance.name && d.noise_level === continuousValue) : (d.name === instance.name && d.noise_level === 0);
            });
            second_instance_path = second_instance.image_path
          }
          similar_IoU_score = -1
        }
      }
      d3.select("#maskSimilarity").selectAll("*").remove();
      activation_svg.selectAll("*").remove();
      // clear the existing mask for the previous image, to make way for printing new masks
      // var instance_type, second_instance_type = 
      let x,y
      if (second_instance) {
        [x,y]=activationListToGraph(instance, second_instance,activationDR,similar_IoU_score)
      }
      else {
        [x,y]=activationListToGraph(instance,0,activationDR,similar_IoU_score)
        // giving 0 to second_instance because otherwise the activationsDR will be recognized as second_instance
      }
      // measuere the height of a div
      // var offsetHeight = document.getElementById('maskSimilarity').offsetHeight;
      // var imageSize = 200; // this is the actual size in the system
      var spacing = 35;
      var showType;
      // var imageWidth = imageSize;
      if (instance.image_path.includes("domain_adaptation")){
        var imageWidth = 200
        var cityscapesWHRatio = 1024/2048;
        var synthiaWHRatio = 760/1280;
        if (instance.dataset == "Cityscapes"){
          var WidthHeightRatioFirst = cityscapesWHRatio;
          var WidthHeightRatioSecond = synthiaWHRatio;
        }
        else{
          var WidthHeightRatioFirst = synthiaWHRatio;
          var WidthHeightRatioSecond = cityscapesWHRatio;
        }
        var imageHeightFirst = imageWidth * WidthHeightRatioFirst;
        var imageHeightSecond = imageWidth * WidthHeightRatioSecond;
      }
      else{
        var imageWidth = 150;
        var imageHeightFirst = imageWidth;
        var imageHeightSecond = imageWidth;
      }

      if (currentTypeDomain=="Discrete") {
        showType = "label"
        instance.show_path = instance.label_path
        second_instance.show_path = second_instance.label_path
      }
      else{
        showType = "label"
        instance.show_path = instance.label_path
        if (continuousValue!=0){
          second_instance.show_path = second_instance.label_path
        }
      }

      var mask = d3.select("#maskSimilarity").append("svg")
        .attr("width", imageWidth)
        .attr("height", imageHeightFirst + spacing)
        .attr("outline", "1px solid white")
        .append('g') // Create a group element to contain the image and title
        .attr("transform", "translate(0, " + spacing + ")"); // Adjust the y-coordinate for spacing

      // both of the methods below for extra spacing does not seem to work

      // .style("margin-bottom", spacing/2 + "px")

      mask.append('image')
        .attr('xlink:href', instance.show_path)
        .attr('width', imageWidth)
        .attr('height', imageHeightFirst);

      // mask.style("border", "1px solid " + colorSelectedInstances);
      mask.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", imageWidth)
          .attr("height", imageHeightFirst)
          .style("stroke", colorSelectedInstances)
          .style("fill", "none")
          .style("stroke-width", 3);

      mask.append('text') // Add title text
        .text("Current "+showType+": (" + instance_type + ")")
        .attr('x', imageWidth / 2) //center it horizontally within the container
        .attr('y', -5)
        .attr('text-anchor', 'middle')
        .attr('font-size', '10px')
        .style("font-family", "Arial")
        // .style("fill", setDomainColors(instance)); 
        .style("fill","black")

      if (currentTypeDomain == "Discrete" || continuousValue != 0) {
        // var blankSpace = d3.select("#maskSimilarity")
        //       .append("svg")
        //       .attr("width", 20) // Adjust the width to set the desired space
        //       .attr("height", 30) // Match the height of the SVG
        //       .style("fill", "white"); // Set the fill to none to make it transparen
        var second_mask = d3.select("#maskSimilarity").append("svg")
          .attr("width", imageWidth)
          .attr("height", imageHeightSecond + spacing)
          .attr("outline", "1px solid white")
          .append('g') // Create a group element to contain the image and title
          .attr("transform", "translate(0, " + spacing + ")"); // Adjust the y-coordinate for spacing

        second_mask.append('image')
          .attr('xlink:href', second_instance.show_path)
          .attr('width', imageWidth)
          .attr('height', imageHeightSecond);

        second_mask.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", imageWidth)
          .attr("height", imageHeightSecond)
          .style("stroke", colorSelectedInstances)
          .style("fill", "none")
          .style("stroke-width", 3);

        second_mask.append('text') // Add title text
          .text("Corresponding "+showType+": (" + second_instance_type + ")")
          .attr('x', imageWidth / 2) //center it horizontally within the container
          .attr('y', -5)
          .attr('text-anchor', 'middle')
          .attr('font-size', '10px')
          .style("font-family", "Arial")
          // .style("fill", setDomainColors(second_instance));
          .style("fill","black")
      }else{
        second_mask=0
      }

      // note that the passive issue still exist, but putting it outside of this function did not help
      activation_svg.call(
        d3.brush()                 // Add the brush feature using the d3.brush function
          .extent([[0, 0], [activationWidth, activationHeight]]) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
          .on("brush end", function () {
            if (d3.event.selection){
              highlightPatches(x,y,mask,second_mask,d3.event.selection,imageWidth,imageHeightFirst,imageHeightSecond)
            }
            // var filteredActivations = data.filter(function (d) { return isBrushed(extent, x(d.tsne_1), y(d.tsne_2)) })
            // highlightPatches()
          }),
        { passive: true }
      )
    }

    function highlightPatches(x,y,mask,second_mask,extentActivation,imageWidth,imageHeightFirst,imageHeightSecond){
      // repeat the definition for x and y (which is the same as the model activations graph)
      // this is useful for checking the brushed points.
      // TODO: for domain adaptation model, sends differnet height and width instead of imageSize

      // find all of the points that are brushed
      // var brushedActivations = combinedList.filter(function (d) { 
      //   return isBrushed(extentActivation, x(d[0]), y(d[1])) }
      // )
      // check for if there is anything being brushed
      var brushedActivations = combinedList.filter(function (d) { 
          return isBrushed(extentActivation, x(d[0]), y(d[1])) }
      )
      if (brushedActivations.length<=0){
        mask.selectAll("rect").remove();
        if (second_mask!=0){
          second_mask.selectAll("rect").remove();
        }
      }
      else{
        var brushedActivations = combinedList.filter(function (d) { 
          return isBrushed(extentActivation, x(d[0]), y(d[1])) }
        )
        activationListLengthFirst = first_activations_parsed.length
        if (second_mask!=0){
          activationListLengthSecond = second_activations_parsed.length
        }

        // this means that height = 1 * width
        // todo: change how this works
        var numOfPatchesWidthFirst=Math.sqrt(activationListLengthFirst*imageWidth/imageHeightFirst)
        var numOfPatchesHeightFirst = activationListLengthFirst/numOfPatchesWidthFirst
        
        // todo: also change from imageSize to width and height
        var patchWidthFirst = imageWidth/numOfPatchesWidthFirst;
        var patchHeightFirst = imageHeightFirst/numOfPatchesHeightFirst;

        // Create an array of all patch indices (assuming a linear index)
        var allPatchIndicesFirst = Array.from({ length: numOfPatchesWidthFirst*numOfPatchesHeightFirst}, (_, i) => i);

        // for brushed points, find corresponding indices in the image 
        var brushedIndices = brushedActivations.map(function(d){return combinedList.indexOf(d)})
        var brushIndicesFirst = brushedIndices.filter(function(d){return d<activationListLengthFirst}) 

        // Find the indices of non-highlighted patches by finding the difference
        var nonHighlightedIndicesFirst = allPatchIndicesFirst.filter(function (index) {
          return brushIndicesFirst.indexOf(index) === -1;
        });
        
        mask.selectAll("rect").remove();

        // find the regions to highlight, and save them as dictionary
        var regionsToHighlightDictFirst = brushIndicesFirst.map(function(d){
          let object = {}
          object.x = (d%numOfPatchesWidthFirst)*patchWidthFirst
          object.y = (Math.floor(d/numOfPatchesWidthFirst))*patchHeightFirst
          object.width = patchWidthFirst
          object.height = patchHeightFirst
          return object
        })
        // not highlighted regions:
        var nonHighlightedRegionsFirst = nonHighlightedIndicesFirst.map(function(d){
          let object = {}
          object.x = (d%numOfPatchesWidthFirst)*patchWidthFirst
          object.y = (Math.floor(d/numOfPatchesWidthFirst))*patchHeightFirst
          object.width = patchWidthFirst
          object.height = patchHeightFirst
          return object
        })
        
        
        // Define the regions to be highlighted
        // var regionsToHighlight = [
        //   { x: 20, y: 20, width: 30, height: 30 }, // Example region 1
        //   { x: 60, y: 60, width: 40, height: 40 }, // Example region 2
        //   // Add more regions as needed...
        // ];

        // Add the masks for the highlighted regions
        regionsToHighlightDictFirst.forEach(function(region) {
          mask.append("rect")
            .attr("x", region.x)
            .attr("y", region.y)
            .attr("width", region.width)
            .attr("height", region.height)
            // .style("fill", "red") // maybe adjust the color
            // .style("opacity", 0.5);
            .style("fill", "white")
            .style("opacity", 0.5);
            // .style("opacity", 0); // opacity 0 does not work because of the black "others" class
        });

        // not highlighted regions: make it less obvious
        nonHighlightedRegionsFirst.forEach(function(region) {
          mask.append("rect")
            .attr("x", region.x)
            .attr("y", region.y)
            .attr("width", region.width)
            .attr("height", region.height)
            // .style("fill", "black") // maybe adjust the color
            // .style("opacity", 0.3);
            .style("opacity", 0);
        });

        mask.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", imageWidth)
          .attr("height", imageHeightFirst)
          .style("stroke", colorSelectedInstances)
          .style("fill", "none")
          .style("stroke-width", 3);

        if (second_mask!=0){
          second_mask.selectAll("rect").remove();
          var numOfPatchesWidthSecond=Math.sqrt(activationListLengthSecond*imageWidth/imageHeightSecond)
          var numOfPatchesHeightSecond = activationListLengthSecond/numOfPatchesWidthSecond

          var patchWidthSecond = imageWidth/numOfPatchesWidthSecond;
          var patchHeightSecond = imageHeightSecond/numOfPatchesHeightSecond;

          var allPatchIndicesSecond = Array.from({ length: numOfPatchesWidthSecond*numOfPatchesHeightSecond}, 
                                                (_, i) => allPatchIndicesFirst.length+i);

          var brushIndicesSecond = brushedIndices.filter(function(d){return d>=activationListLengthFirst})
          var nonHighlightedIndicesSecond = allPatchIndicesSecond.filter(function (index) {
            return brushIndicesSecond.indexOf(index) === -1;
          });

          var regionsToHighlightDictSecond = brushIndicesSecond.map(function(d){
            let object = {}
            object.x = ((d-activationListLengthFirst)%numOfPatchesWidthSecond)*patchWidthSecond
            object.y = (Math.floor((d-activationListLengthFirst)/numOfPatchesWidthSecond))*patchHeightSecond
            object.width = patchWidthSecond
            object.height = patchHeightSecond
            return object
          })
          var nonHighlightedRegionsSecond = nonHighlightedIndicesSecond.map(function(d){
            let object = {}
            object.x = ((d-activationListLengthFirst)%numOfPatchesWidthSecond)*patchWidthSecond
            object.y = (Math.floor((d-activationListLengthFirst)/numOfPatchesWidthSecond))*patchHeightSecond
            object.width = patchWidthSecond
            object.height = patchHeightSecond
            return object
          })

          // add the patches
          regionsToHighlightDictSecond.forEach(function(region) {
            second_mask.append("rect")
              .attr("x", region.x)
              .attr("y", region.y)
              .attr("width", region.width)
              .attr("height", region.height)
              .style("fill", "white")
              .style("opacity", 0.5);
          });
          nonHighlightedRegionsSecond.forEach(function(region) {
            second_mask.append("rect")
              .attr("x", region.x)
              .attr("y", region.y)
              .attr("width", region.width)
              .attr("height", region.height)
              // .style("fill", "black") // maybe adjust the color
              // .style("opacity", 0.3);
              .style("opacity", 0);
          });
          second_mask.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", imageWidth)
            .attr("height", imageHeightSecond)
            .style("stroke", colorSelectedInstances)
            .style("fill", "none")
            .style("stroke-width", 3);
        }
      }
    }

    function isBrushed(brush_coords, cx, cy) {
      const x0 = brush_coords[0][0],
        x1 = brush_coords[1][0],
        y0 = brush_coords[0][1],
        y1 = brush_coords[1][1];

      return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
    }

    function activationListToGraph(instance, second_instance, activationsDR,similar_IoU_score) {
      dataset_types = ["Cityscapes", "Synthia" ];
      if (activationsDR == "t-SNE"){
        instance.bottleneck_activations_embedding = instance.bottleneck_tsne_embedding
        second_instance.bottleneck_activations_embedding = second_instance.bottleneck_tsne_embedding
      }
      else if(activationsDR == "PCA"){
        instance.bottleneck_activations_embedding = instance.bottleneck_pca_embedding
        second_instance.bottleneck_activations_embedding = second_instance.bottleneck_pca_embedding
      }
      // else if(activationsDR == "UMAP"){
      //   instance.bottleneck_activations_embedding = instance.bottleneck_umap_embedding
      //   second_instance.bottleneck_activations_embedding = second_instance.bottleneck_umap_embedding
      // }
      
      // find the domain for the second instance
      if (currentTypeDomain == "Discrete") {
        instance_type = instance.dataset
        second_instance_type = second_instance.dataset
        // instance.similar_IoU_score = +instance.similar_IoU_score
        activation_svg.append("text")
          .text("Similarity score for masks:" + similar_IoU_score.toFixed(3))
          .style("font-size", "15px")
          // fill it with black color to actually see it
          .style("fill", "black");
      }
      else {
        if (continuousDomain == "Noise") {
          instance_type = "Noise: " + instance.noise_level.toString()
          if (second_instance) {
            second_instance_type = "Noise: " + second_instance.noise_level.toString()
          }
        }
      }

      first_activations_parsed = JSON.parse(instance.bottleneck_activations_embedding); // change this to more general things
      if (second_instance) {
        second_activations_parsed = JSON.parse(second_instance.bottleneck_activations_embedding);
        combinedList = first_activations_parsed.concat(second_activations_parsed);
      }
      else {
        combinedList = first_activations_parsed
      }
      // use the combined list to find the range of graph

      // range for each dimension
      let min_1 = d3.min(combinedList, function (d) { return d[0]; });
      let max_1 = d3.max(combinedList, function (d) { return d[0]; });
      let min_2 = d3.min(combinedList, function (d) { return d[1]; });
      let max_2 = d3.max(combinedList, function (d) { return d[1]; });

      // Add X axis
      var x = d3.scaleLinear()
        .domain([min_1 - 0.1 * Math.abs(min_1), 1.1 * max_1])
        .range([0, activationWidth]);
      var xAxis = activation_svg.append("g")
        .attr("transform", "translate(0," + activationHeight + ")")
        .call(d3.axisBottom(x));

      // Add Y axis
      var y = d3.scaleLinear()
        .domain([min_2 - 0.1 * Math.abs(min_2), 1.1 * max_2])
        .range([activationHeight, 0]);
      var yAxis = activation_svg.append("g")
        .call(d3.axisLeft(y));

      // Add dots for the current dataset
      activation_svg.append('g')
        .selectAll("dot")
        .data(first_activations_parsed)
        .enter()
        .append("circle")
        .attr("cx", function (d) { return x(d[0]) })
        .attr("cy", function (d) { return y(d[1]) })
        .attr("r", 3.5)
        .style("stroke", colorSelectedInstances)
        .style("stroke-width",0.5)
        .style("fill", setDomainColors(instance))
        .style("opacity",0.7) // changed from 0.9 to 0.7 to make the graph more appealing, but doesn't change much
        

      //Add dots for the other dataset
      if (second_instance) {
        activation_svg.append('g')
          .selectAll("dot")
          .data(second_activations_parsed)
          .enter()
          .append("circle")
          .attr("cx", function (d) { return x(d[0]) })
          .attr("cy", function (d) { return y(d[1]) })
          .attr("r", 3.5)
          .style("stroke", colorSelectedInstances)
          .style("stroke-width",1)
          .style("fill", setDomainColors(second_instance))
          .style("opacity",0.7)
      }

      // this removes the x and y axis from the scatter plot
      xAxis.remove()
      yAxis.remove()

      return [x,y]

      // return instance_type, second_instance_type
    }

    function setDomainColors(d) {
      if (currentTypeDomain == "Discrete") {
        if (d.key) {
          return discreteDomainColor(d.key)
        }
        else {
          return discreteDomainColor(d.dataset)
        }
      }
      else {
        if (continuousDomain == "Noise") {
          // define the color
          if (d.key) {
            if (d.key == "Selected") {
              return discreteDomainColor(d.key)
            }
            else {
              return continuousDomainColor(d.key)
            }
          }
          else {
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
function makePerformanceView(data, filteredData) {
  heatmap_svg.selectAll("*").remove();

  //Add selection for domains later
  var columnNames = Object.keys(data[0]);
  var iouColumns = columnNames.filter(function (column) {
    return column.endsWith("_iou");
  })
  // Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
  var HorizontalVars = iouColumns.map(function (d) { return d.slice(0, -4); }) // horizontal

  // get the domain list for Vertical Vars
  if (currentTypeDomain == "Discrete") {
    var domainNameList = ["Synthia (Overall)","Cityscapes (Overall)","Selected (Partial)"]
  }
  else {
    if (continuousDomain == "Noise") {
      // no need to think about one domain case specifically, because it could be that one domain is empty in the graph
      var domain1 = "Noise: 0 " + "(Overall)"
      var domain2 = "Noise: " + continuousValue.toString() + " " + "(Overall)"
      var domain1_partial = "Noise: 0 " + "(Partial)"
      var domain2_partial = "Noise: " + continuousValue.toString() + " " + "(Partial)"
      // create a list
      // domainNameList = [domain1, domain2, domain1_partial, domain2_partial]
      // this does not work for changing the noise 0 from two names to 4 names, 
      // because there would just be overlapping names

      if (continuousValue != 0) {
        var domainNameList = [domain1, domain2, domain1_partial, domain2_partial]
      }
      else {
        var domainNameList = [domain1, domain1_partial]
      }
    }
  }

  data.forEach(function (d) {
    if (currentTypeDomain == "Discrete") {
      d.domainKey = d.dataset;
    }
    else {
      if (continuousDomain == "Noise") {
        d.domainKey = d.noise_level
      }
    }
  });

  // separate the data to domains
  var nestedData = d3.nest()
    .key(d => d.domainKey)
    .entries(data);

  if (filteredData) {
    // combine the filtered data with the overall data
    if (continuousValue == 0) {
      nestedData = nestedData.concat({
        key: "Selected",
        values: filteredData
      });
    }
    else{
      // Two seperate
      var noise0Data = filteredData.filter(function (d) {
        return d.noise_level == 0;
      })
      var noisyFilteredData = filteredData.filter(function (d) {
        return d.noise_level != 0;
      })
      nestedData = nestedData.concat({
        key: "Selected_1", // 1st domain with filtered data
        values: noise0Data
      });
      nestedData = nestedData.concat({
        key: "Selected_2", // 2nd domain with filtered data
        values: noisyFilteredData
      });
    }
    
  }

  // TODO: add the selected data to the groupData with data.concat
  var meanValues = new Map();
  var transformedData = [];
  // transform the data in order to generate the heatmap
  nestedData.forEach(group => {
    var meanObj = {};
    meanObj.domainKey = group.key;

    // Calculate mean for each column
    // ignore the images with no corresponding classes when calculating the average (this did not seem to change the results)
    meanObj.overall = d3.mean(group.values.filter(d => d.overall_iou !== 0), d => d.overall_iou);
    meanObj.other = d3.mean(group.values.filter(d => d.other_iou !== 0), d => d.other_iou);
    meanObj.road = d3.mean(group.values.filter(d => d.road_iou !== 0), d => d.road_iou);
    meanObj.sidewalk = d3.mean(group.values.filter(d => d.sidewalk_iou !== 0), d => d.sidewalk_iou);
    meanObj.vegetation = d3.mean(group.values.filter(d => d.vegetation_iou !== 0), d => d.vegetation_iou);
    meanObj.sky = d3.mean(group.values.filter(d => d.sky_iou !== 0), d => d.sky_iou);
    meanObj.car = d3.mean(group.values.filter(d => d.car_iou !== 0), d => d.car_iou);


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
    .range([0, heatmapWidth])
    .domain(HorizontalVars)
    .padding(0.05);
  heatmap_svg.append("g")
    .style("font-size", 10)
    .attr("transform", "translate(0," + heatmapHeight + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain").remove()

  // Build Y scales and axis:
  var y = d3.scaleBand()
    .range([heatmapHeight, 0])
    .domain(domainNameList)
    .padding(0.05);
  heatmap_svg.append("g")
    .style("font-size", 10)
    .call(
      d3.axisLeft(y)
        .tickSize(0)
        .tickFormat(
          d => d.split(" ").map(function (word) {
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
  // var heatmapColor = d3.scaleSequential()
  //   .domain([0,1])
  //   .interpolator(d3.interpolateGreens) //interpolate* is sequential single hue

  // Three function that change the tooltip when user hover / move / leave a cell
  var mouseover = function (d) {
    tooltip
      .style("opacity", 1)
    d3.select(this)
      .style("stroke", "black")
      .style("opacity", 1)
  }
  var mousemove = function (d) {
    tooltip
      .html("Performance (IoU): " + d.value.toFixed(3))
      .style("left", (d3.mouse(this)[0] + 15) + "px")
      .style("top", (d3.mouse(this)[1] + 15) + "px")
    // .style("left", (d3.event.pageX + 10) + "px") // Position relative to mouse coordinates
    // .style("top", (d3.event.pageY + 10) + "px")
  }
  var mouseleave = function (d) {
    tooltip
      .style("opacity", 0)
    d3.select(this)
      .style("stroke", "none")
      .style("opacity", 0.8)
  }
  const values = transformedData.map(item => item.value);

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  const heatmapColor = d3.scaleSequential()
  .domain([minValue, maxValue]) // Range of values for the color scale
  .interpolator(d3.interpolateGreys); // Color interpolation function (interpolate* is sequential single hue)

  createHeatmapLegend(minValue,maxValue)

  // add the squares
  heatmap_svg.selectAll()
    .data(transformedData, function (d) { return d.class + ':' + d.domainKey; })
    .enter()
    .append("rect")
    .attr("x", function (d) { return x(d.class) })
    .attr("y", function (d) { return y(getDataScope(d.domainKey)) })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) { return heatmapColor(d.value) })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)
}

function makeClassDist(data, filteredDataClass, specifiedClassName, setDomainColors) {
  d3.select("#classDistPlot").selectAll("*").remove();
  d3.select("#classCurrentColor").selectAll("*").remove();

  d3.select("#classCurrentColor")
    .append("svg") // need svg so that the circle could exist
    .attr("width", 20)
    .attr("height", 13)
    .append("circle") //center x-coordinate
    .attr("cx", "10") //center y-coordinate
    .attr("cy", "7")
    .attr("r", "5")
    .attr("fill", classColors(specifiedClassName.toLowerCase()));

  var violinPlot = d3.select("#classDistPlot")
    .append("svg")
    .attr("width", violinWidth + violinMargin.left + violinMargin.right)
    .attr("height", violinHeight + violinMargin.top + violinMargin.bottom)
    .append("g")
    .attr("transform",
      "translate(" + violinMargin.left + "," + violinMargin.top + ")");

  // className refer to the specific ratio of the semantic segmentation class
  var className = specifiedClassName.toLowerCase() + "_ratio";
  var maxClassRatio = d3.max(data, function (d) {
    return +d[className]; // need the "+" to make it number
  })

  // set y scale
  var y = d3.scaleLinear()
    .domain([0, maxClassRatio])          // Y scale is set manually (here it's [0,1] because of the ratio of classes)
    .range([violinHeight, 0])
  violinPlot.append("g").call(d3.axisLeft(y))

  // get the list of domains to put on the axis
  if (currentTypeDomain == "Discrete") {
    var domainNameList = ["Synthia (Overall)","Cityscapes (Overall)", "Selected (Partial)"]
  }
  else {
    if (continuousDomain == "Noise") {
      // no need to think about one domain case specifically, because it could be that one domain is empty in the graph
      var domain1 = "Noise: 0 " + "(Overall)"
      var domain2 = "Noise: " + continuousValue.toString() + " " + "(Overall)"
      // create a list
      if (continuousValue != 0) {
        var domainNameList = [domain1, domain2, "Selected (Partial)"]
      }
      else {
        var domainNameList = [domain1, "Selected (Partial)"]
      }
    }
  }

  // Build and Show the X scale. It is a band scale like for a boxplot: each group has an dedicated RANGE on the axis. This range has a length of x.bandwidth
  var x = d3.scaleBand()
    .range([0, violinWidth])
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

  data.forEach(function (d) {
    if (currentTypeDomain == "Discrete") {
      d.group = d.dataset;
    }
    else {
      if (continuousDomain == "Noise") {
        d.group = d.noise_level
      }
    }
  });


  if (filteredDataClass) {
    let selectedData = JSON.parse(JSON.stringify(filteredDataClass)) // deepcopy the filterData
    selectedData.forEach(function (d) {
      d.group = "Selected";
    });
    var violinData = data.concat(selectedData)
  }
  else {
    var violinData = data;
  }

  // note: synthetic vs real: have violinData generated, but no sumstat

  // sumstat has the calculated distribution for ratio values in each interval
  var sumstat = d3.nest()  // nest function allows to group the calculation per level of a factor
    .key(function (d) { return d.group; })
    .rollup(function (d) {   // For each key..
      input = d.map(function (g) { return g[className]; })    // use the current selected class
      bins = histogram(input)   // And compute the binning on it.
      return (bins)
    })
    .entries(violinData)
  
  // What is the biggest number of value in a bin for each group?
  // maxNum is the dictionary for maximum bandwith for each violin, and the range of each violin is defined by the plus and minus of the corresponding max number
  var maxNum = {};
  sumstat.forEach(function (d) {
    var allBins = d.value;
    var lengths = allBins.map(function (a) { return a.length; });
    allBins.map(function (bin) { bin.group = d.key })
    maxNum[d.key] = d3.max(lengths);
  });


  function calculateDomain(length, key) {
    let xNum = d3.scaleLinear()
      .range([0, x.bandwidth()])
      .domain([-maxNum[key], maxNum[key]])
    return xNum(length);
  }
  

  // Add the shape to this svg!
  violinPlot
    .selectAll("myViolin") // not sure why the "myViolin", but it works somehow (shrug)
    .data(sumstat)
    .enter()        // So now we are working group per group
    .append("g")
    .attr("transform", function (d) {
      return ("translate(" + x(getDataScope(d.key)) + " ,0)")
    }) // Translation on the right to be at the group position
    .style("fill", function (d) {
      return setDomainColors(d)
    })
    .append("path")
    .datum(function (d) { return (d.value) })     // So now we are working bin per bin
    .style("stroke", "none")
    .attr("d", d3.area()
      .x0(function (d) {
        // return(xNum(-d.length)) 
        return calculateDomain(-d.length, d.group)
      })
      .x1(function (d) {
        // return(xNum(d.length)) 
        return calculateDomain(d.length, d.group)
      })
      .y(function (d) { return (y(d.x0)) })
      .curve(d3.curveCatmullRom)    // This makes the line smoother to give the violin appearance. Try d3.curveStep to see the difference
    )
}

// return the corresponding name of a data key
function getDataScope(key) {
  // noise case
  if (key.includes("Selected")){
    if ((currentTypeDomain == "Continuous") && (continuousDomain=="Noise")){
      let dataScope = "(Partial)"
      if (key == "Selected_1") {
        // the scope of let is only this "if" function 
        return "Noise: 0 "+dataScope
      }
      else if (key == "Selected_2") {
        return "Noise: " + continuousValue.toString() + " " + dataScope
      }
      else if (key == "Selected") {
        return key + " " + dataScope
      }
    }
    // just return the whole selected region for discrete domain
    else{
      let dataScope = "(Partial)"
      return key + " " + dataScope
    }
  }
  // // this is for discrete domain for now
  // else if (key == "Selected") {
  //   return key + " " + dataScope
  // }
  else {
    var dataScope = "(Overall)"
    if (currentTypeDomain == "Discrete") {
      return key + " " + dataScope
    }
    else {
      if (continuousDomain == "Noise") {
        return "Noise: " + key.toString() + " " + dataScope
      }
    }
  }
}

function createHeatmapLegend(minValue,maxValue){
  d3.select("#heatmapLegend").selectAll("*").remove()

  const heatmapSliderColor = d3.scaleSequential()
  .domain([minValue, maxValue]) // Range of values for the color scale
  .interpolator(d3.interpolateGreys); // Color interpolation function (interpolate* is sequential single hue)

  legendContainer = d3.select("#heatmapLegend")
  .append("svg")
  .attr("width", legendWidth)
  .attr("height", legendHeight);

  // Add color stops to the gradient
  const numColorStops = 10; // Number of color stops (could be tuned)
  const colorStops = d3.range(numColorStops).map((d) => d / (numColorStops - 1));

  // Define the gradient
  gradient = legendContainer.append("defs")
    .append("linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "0%");

  gradient.selectAll("stop")
    .data(colorStops)
    .enter()
    .append("stop")
    .attr("offset", (d, i) => {
      return (i * 10) + "%"
    })
    .attr("stop-color", (d) => {
      return heatmapSliderColor(d);
    });

  // Add color rectangle
  legendContainer.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("fill", "url(#gradient)")
    .style("stroke", "black") // Add the stroke property (because outline does not work for "rect")
    .style("stroke-width", "1px") // Specify the width of the stroke
    // .style("margin-bottom", "px");

  // number for the legend
  legendText = d3.select("#heatmapLegend")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("margin-top", "2px");

  // Add text labels to the left and right ends
  legendText.append("text")
    .attr("x", 0)
    .attr("y", legendHeight / 2)
    .attr("text-anchor", "start")
    .attr("font-size","12px")
    .text(minValue.toFixed(2).toString());

  legendText.append("text")
    .attr("x", legendWidth)
    .attr("y", legendHeight / 2)
    .attr("text-anchor", "end")
    .attr("font-size","12px")
    .text(maxValue.toFixed(2).toString());
}

