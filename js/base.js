import { initOrGetHistogram, updateHistogram } from './histogram_handler.js'

(function(imageproc) {
    "use strict";

    /*
     * Apply negation to the input data
     */
    imageproc.negation = function(inputData, outputData) {
        console.log("Applying negation...");

        for (var i = 0; i < inputData.data.length; i += 4) {
            outputData.data[i]     = 255 - inputData.data[i];
            outputData.data[i + 1] = 255 - inputData.data[i + 1];
            outputData.data[i + 2] = 255 - inputData.data[i + 2];
        }
    }

    /*
     * Convert the input data to grayscale
     */
    imageproc.grayscale = function(inputData, outputData) {
        console.log("Applying grayscale...");

        /**
         * DONE: You need to create the grayscale operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {

            // Find the grayscale value using simple averaging
	    let red = inputData.data[i]
	    let green = inputData.data[i+1]
	    let blue = inputData.data[i+2]
	    let value = (red + green + blue) / 3 
	    // let value = max(red, green, blue)
	    // let value = parseInt(0.2126 * red + 0.7152 * green + 0.0722 * blue)

            // Change the RGB components to the resulting value
            outputData.data[i]     = value
            outputData.data[i + 1] = value
            outputData.data[i + 2] = value
        }
    }

    /*
     * Applying brightness to the input data
     */
    imageproc.brightness = function(inputData, outputData, offset) {
        console.log("Applying brightness...");

        /**
         * DONE: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {

            // Change the RGB components by adding an offset
	    let red = Math.max(Math.min(inputData.data[i] + offset, 255), 0)
	    let green = Math.max(Math.min(inputData.data[i+1] + offset, 255), 0)
	    let blue = Math.max(Math.min(inputData.data[i+2] + offset, 255), 0)

            outputData.data[i]     = red
            outputData.data[i + 1] = green
            outputData.data[i + 2] = blue

            // Handle clipping of the RGB components
        }
    }

    /*
     * Applying contrast to the input data
     */
    imageproc.contrast = function(inputData, outputData, factor) {
        console.log("Applying contrast...");

        /**
         * DONE: You need to create the brightness operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Change the RGB components by multiplying a factor

            // Handle clipping of the RGB components
	    let red = Math.max(Math.min(inputData.data[i] * factor, 255), 0)
	    let green = Math.max(Math.min(inputData.data[i+1] * factor, 255), 0)
	    let blue = Math.max(Math.min(inputData.data[i+2] * factor, 255), 0)

            outputData.data[i]     = red
            outputData.data[i + 1] = green
            outputData.data[i + 2] = blue
        }
    }

    /*
     * Make a bit mask based on the number of MSB required
     */
    function makeBitMask(bits) {
        var mask = 0;
        for (var i = 0; i < bits; i++) {
            mask >>= 1;
            mask |= 128;
        }
        return mask;
    }

    /*
     * Apply posterization to the input data
     */
    imageproc.posterization = function(inputData, outputData,
                                       redBits, greenBits, blueBits) {
        console.log("Applying posterization...");

        /**
         * DONE: You need to create the posterization operation here
         */

        // Create the red, green and blue masks
        // A function makeBitMask() is already given

        for (var i = 0; i < inputData.data.length; i += 4) {
            // Apply the bitmasks onto the RGB channels

            outputData.data[i]     = inputData.data[i] & makeBitMask(redBits);
            outputData.data[i + 1] = inputData.data[i + 1] & makeBitMask(greenBits);
            outputData.data[i + 2] = inputData.data[i + 2] & makeBitMask(blueBits);
        }
    }

    /*
     * Apply threshold to the input data
     */
    imageproc.threshold = function(inputData, outputData, thresholdValue) {
        console.log("Applying thresholding...");

        /**
         * DONE: You need to create the thresholding operation here
         */

        for (var i = 0; i < inputData.data.length; i += 4) {

            // Find the grayscale value using simple averaging
	    let red = inputData.data[i]
	    let green = inputData.data[i+1]
	    let blue = inputData.data[i+2]
	    let value = (red + green + blue) / 3 
	    // let value = max(red, green, blue)
	    // let value = parseInt(0.2126 * red + 0.7152 * green + 0.0722 * blue)

            // You will apply thresholding on the grayscale value
	    value = (value < thresholdValue) ? 0 : 255;

            // Change the colour to black or white based on the given threshold
            outputData.data[i]     = value
            outputData.data[i + 1] = value
            outputData.data[i + 2] = value
        }
    }

    /*
     * Build the histogram of the image for a channel
     */
    function buildHistogram(inputData, channel) {
        var histogram = [];
        for (var i = 0; i < 256; i++)
            histogram[i] = 0;

        /**
         * DONE: You need to build the histogram here
         */

        // Accumulate the histogram based on the input channel
        // The input channel can be:
        // "red"   - building a histogram for the red component
        // "green" - building a histogram for the green component
        // "blue"  - building a histogram for the blue component
        // "gray"  - building a histogram for the intensity
        //           (using simple averaging)
	
	let c_r = 0
	let c_g = 0
	let c_b = 0
	switch (channel) {
	    case "red":
		c_r = 3
		c_g = 0
		c_b = 0
		break;
	    case "green":
		c_r = 0
		c_g = 3
		c_b = 0
		break;
	    case "blue":
		c_r = 0
		c_g = 0
		c_b = 3
		break;
	    case "gray":
		c_r = 1
		c_g = 1
		c_b = 1
		break;
	}

	for (let i = 0; i < inputData.data.length; i += 4) {
	    let red = inputData.data[i]
	    let green = inputData.data[i+1]
	    let blue = inputData.data[i+2]

	    histogram[(c_r * red + c_g * green + c_b * blue) / 3]++;
	}

        return histogram;
    }

    imageproc.buildHistogram = buildHistogram

    /**
     * helper for making cdf
     * @param {number[]} `histogram` - the source histogram
     * @returns {number[]} - a cdf that hv value in [0, range]
     */
    let cdf_maker = (histogram, range = 255) => {

	    let cum_histogram = [histogram[0]];

	    let sum_histogram = histogram[0];

	    // make cdf
	    for (let i = 1; i < 256; i++) {
		let tmp = (cum_histogram[i-1] + histogram[i])
		cum_histogram.push(tmp)
                sum_histogram += histogram[i]
	    }

	    // normalize cdf
            for (let i = 0; i < 256; i++) {
                cum_histogram[i] = parseInt(cum_histogram[i] / sum_histogram * range) 
            }

        return cum_histogram;
    }

    /**
     * find the 'inverse' of a cdf
     */
    let inverse_cdf = (cdf) => {

        let new_cdf = new Array(256).fill(-1)
            
        for (let i = 0; i < 256; i++) {
            for (let j = cdf[i]; j >= 0; j--) {
                if (new_cdf[j] == -1) {
                    new_cdf[j] = i
                } else {
                    break;
                }
            }
        }

        for (let j = 255; j >= 0; j--) {
            if (new_cdf[j] == -1) {
                new_cdf[j] = 255
            } else {
                break;
            }
        }

        return new_cdf;
    }
   
    /*
     * Find the min and max of the histogram
     */
    function findMinMax(histogram, pixelsToIgnore) {
        var min = 0, max = 255;

        /**
         * DONE: You need to build the histogram here
         */

        // Find the minimum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
	let tmp = pixelsToIgnore

	while (tmp >= 0) {
	    tmp -= histogram[min]
	    min++
	}
	min--

	tmp = pixelsToIgnore
	while (tmp >= 0) {
	    tmp -= histogram[max]
	    max--
	}
	max++
       
        // Find the maximum in the histogram with non-zero value by
        // ignoring the number of pixels given by pixelsToIgnore
        
        return {"min": min, "max": max};
    }

    /*
     * Apply automatic contrast to the input data
     */
    imageproc.autoContrast = function(inputData, outputData, type, percentage) {
        console.log("Applying automatic contrast...");

        // Find the number of pixels to ignore from the percentage
        var pixelsToIgnore = (inputData.data.length / 4) * percentage / 2;

        var histogram, minMax;

        let target_histogram  ;
        let target_histogram_r;
        let target_histogram_g;
        let target_histogram_b;

        let raw = $("#target-histogram").val().split(",")
        
        let tmp = raw.map(str => parseInt(str))
        if (tmp.length == 256 * 4) {
            target_histogram   = tmp.slice(0, 256)
            target_histogram_r = tmp.slice(256, 512)
            target_histogram_g = tmp.slice(512, 512 + 256)
            target_histogram_b = tmp.slice(512 + 256, 1024)
            console.log(tmp)
        } else {
            target_histogram   = new Array(256).fill(1)
            target_histogram_r = new Array(256).fill(1)
            target_histogram_g = new Array(256).fill(1)
            target_histogram_b = new Array(256).fill(1)
        }

        let target_cdf   = cdf_maker(target_histogram)
        let target_cdf_r = cdf_maker(target_histogram_r)
        let target_cdf_g = cdf_maker(target_histogram_g)
        let target_cdf_b = cdf_maker(target_histogram_b)

        let remap = inverse_cdf(target_cdf)
        let remap_r = inverse_cdf(target_cdf_r)
        let remap_g = inverse_cdf(target_cdf_g)
        let remap_b = inverse_cdf(target_cdf_b)

        console.log(remap, "remap")
        
	switch (type) {
	    case "gray":
                // Build the grayscale histogram
                histogram = buildHistogram(inputData, "gray");

                // Find the minimum and maximum grayscale values with non-zero pixels
                minMax = findMinMax(histogram, pixelsToIgnore);

                var min = minMax.min, max = minMax.max, range = max - min;

                /**
                 * DONE: You need to apply the correct adjustment to each pixel
                 */

                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Adjust each pixel based on the minimum and maximum values

                    outputData.data[i]     = (inputData.data[i] - min) / range * 255;
                    outputData.data[i + 1] = (inputData.data[i + 1] - min) / range * 255;
                    outputData.data[i + 2] = (inputData.data[i + 2] - min) / range * 255;
                }
		break;
            case "color":
          /**
           * DONE: You need to apply the same procedure for each RGB channel
           *       based on what you have done for the grayscale version
           */

	        let histo_r = buildHistogram(inputData, "red")
	        let histo_g = buildHistogram(inputData, "green")
	        let histo_b = buildHistogram(inputData, "blue")

	        let minMax_r = findMinMax(histo_r, pixelsToIgnore)
	        let minMax_g = findMinMax(histo_g, pixelsToIgnore)
	        let minMax_b = findMinMax(histo_b, pixelsToIgnore)
	        
	        let min_r = minMax_r.min, max_r = minMax_r.max, range_r = max_r - min_r
	        let min_g = minMax_g.min, max_g = minMax_g.max, range_g = max_g - min_g
	        let min_b = minMax_b.min, max_b = minMax_b.max, range_b = max_b - min_b

                for (var i = 0; i < inputData.data.length; i += 4) {
                    // Adjust each channel based on the histogram of each one

                    outputData.data[i]     = (inputData.data[i] - min_r) / range_r * 255;
                    outputData.data[i + 1] = (inputData.data[i + 1] - min_g) / range_g * 255;
                    outputData.data[i + 2] = (inputData.data[i + 2] - min_b) / range_b * 255;
                }
                break;

	    case "gray-equal": {
                histogram = buildHistogram(inputData, "gray");

                let cum_histogram = cdf_maker(histogram)

                for (let i = 0; i < inputData.data.length; i += 4) {
                    // Adjust each pixel based on the minimum and maximum values

		    let gray = (inputData.data[i] + inputData.data[i + 1] + inputData.data[i + 2]) / 3

		    let mult = remap[cum_histogram[Math.min(255, parseInt(gray))]] / gray

		    outputData.data[i]     = Math.min(255, inputData.data[i]     * mult)
                    outputData.data[i + 1] = Math.min(255, inputData.data[i + 1] * mult)
                    outputData.data[i + 2] = Math.min(255, inputData.data[i + 2] * mult)

                }
    
                const oldChart = initOrGetHistogram(document.getElementById("histogram-before"));
                const newChart = initOrGetHistogram(document.getElementById("histogram-after"));

                updateHistogram(oldChart, [{
                  data: histogram,
                  backgroundColor: "rgb(128, 128, 128)"
                }]);
                updateHistogram(newChart, [{
                  data: buildHistogram(outputData, "gray"),
                  backgroundColor: "rgb(128, 128, 128)"
                }]);
            }
		break;

	    case "color-equal": {

                histogram = {
                    r: buildHistogram(inputData, "red"),
                    g: buildHistogram(inputData, "green"),
                    b: buildHistogram(inputData, "blue")
                }

		let cum_histogram = {
                    r: cdf_maker(histogram.r),
                    g: cdf_maker(histogram.g),
                    b: cdf_maker(histogram.b)
                }

                for (let i = 0; i < inputData.data.length; i += 4) {

                    // Adjust each pixel based on the minimum and maximum values
		    outputData.data[i]     = Math.min(255, remap_r[cum_histogram.r[inputData.data[i]]    ])
                    outputData.data[i + 1] = Math.min(255, remap_g[cum_histogram.g[inputData.data[i + 1]]])
                    outputData.data[i + 2] = Math.min(255, remap_b[cum_histogram.b[inputData.data[i + 2]]])

                }

		const oldChart = initOrGetHistogram(document.getElementById("histogram-before"));
    		const newChart = initOrGetHistogram(document.getElementById("histogram-after"));

    		updateHistogram(oldChart, [{
    		  data: buildHistogram(inputData, "gray"),
    		  backgroundColor: "rgb(128, 128, 128)"
    		}]);
    		updateHistogram(newChart, [{
    		  data: buildHistogram(outputData, "gray"),
    		  backgroundColor: "rgb(128, 128, 128)"
    		}]);
            }
		break;
	}
    }

    imageproc._renderHistogram = function(inputData, outputData) {

        var isRenderingRed = $("#histogram-red").prop("checked");
        var isRenderingGreen = $("#histogram-green").prop("checked");
        var isRenderingBlue = $("#histogram-blue").prop("checked");
        var isRenderingGray = $("#histogram-gray").prop("checked");

        var   isRenderingRedCdf =   $("#histogram-red-cdf").prop("checked");
        var isRenderingGreenCdf = $("#histogram-green-cdf").prop("checked");
        var  isRenderingBlueCdf =  $("#histogram-blue-cdf").prop("checked");
        var  isRenderingGrayCdf =  $("#histogram-gray-cdf").prop("checked");

        var dataBefore = [];
        var dataAfter = [];

        if (isRenderingRed) {
            let histogramBeforeRed = buildHistogram(inputData, "red");
            let histogramAfterRed = buildHistogram(outputData, "red");
            dataBefore.push({
                type: "bar",
                label: "red-channel",
                data: histogramBeforeRed,
                backgroundColor: "rgba(255, 0, 0, 0.5)"
            });
            dataAfter.push({
                type: "bar",
                label: "red-channel",
                data: histogramAfterRed,
                backgroundColor: "rgba(255, 0, 0, 0.5)"
            });
        }
        if (isRenderingGreen) {
            let histogramGreenBefore = buildHistogram(inputData, "green");
            let histogramGreenAfter = buildHistogram(outputData, "green");
            dataBefore.push({
                type: "bar",
                label: "green-channel",
                data: histogramGreenBefore,
                backgroundColor: "rgba(0, 255, 0, 0.5)"
            });
            dataAfter.push({
                type: "bar",
                label: "green-channel",
                data: histogramGreenAfter,
                backgroundColor: "rgba(0, 255, 0, 0.5)"
            });
        }
        if (isRenderingBlue) {
            let histogramBlueBefore = buildHistogram(inputData, "blue");
            let histogramBlueAfter = buildHistogram(outputData, "blue");
            dataBefore.push({
                type: "bar",
                label: "blue-channel",
                data: histogramBlueBefore,
                backgroundColor: "rgba(0, 0, 255, 0.5)"
            });
            dataAfter.push({
                type: "bar",
                label: "blue-channel",
                data: histogramBlueAfter,
                backgroundColor: "rgba(0, 0, 255, 0.5)"
            });
        }
        if (isRenderingGray) {
            let histogramGrayBefore = buildHistogram(inputData, "gray");
            let histogramGrayAfter = buildHistogram(outputData, "gray");
            dataBefore.push({
                type: "bar",
                label: "gray-channel",
                data: histogramGrayBefore,
                backgroundColor: "rgba(128, 128, 128, 0.5)"
            });
            dataAfter.push({
                type: "bar",
                label: "gray-channel",
                data: histogramGrayAfter,
                backgroundColor: "rgba(128, 128, 128, 0.5)"
            });
        }

        if (isRenderingGrayCdf) {
            let histogram_before = buildHistogram(inputData, "gray");
            let histogram_after = buildHistogram(outputData, "gray");

            let cdf_before = cdf_maker(histogram_before, Math.max.apply(null, histogram_before));
            let cdf_after  = cdf_maker(histogram_after , Math.max.apply(null, histogram_after));

            dataBefore.push({
                type: "line",
                label: "gray-channel-cdf",
                data: cdf_before,
                borderColor: "rgb(128, 128, 128)"
            });
            dataAfter.push({
                type: "line",
                label: "gray-channel-cdf",
                data: cdf_after,
                borderColor: "rgb(128, 128, 128)"
            });
        }
        if (isRenderingRedCdf) {
            let histogram_before = buildHistogram(inputData, "red");
            let histogram_after = buildHistogram(outputData, "red");

            let cdf_before = cdf_maker(histogram_before, Math.max.apply(null, histogram_before));
            let cdf_after  = cdf_maker(histogram_after , Math.max.apply(null, histogram_after));

            dataBefore.push({
                type: "line",
                label: "red-channel-cdf",
                data: cdf_before,
                borderColor: "rgb(255, 0, 0)"
            });
            dataAfter.push({
                type: "line",
                label: "red-channel-cdf",
                data: cdf_after,
                borderColor: "rgb(255, 0, 0)"
            });
        }

        if (isRenderingBlueCdf) {
            let histogram_before = buildHistogram(inputData, "blue");
            let histogram_after = buildHistogram(outputData, "blue");

            let cdf_before = cdf_maker(histogram_before, Math.max.apply(null, histogram_before));
            let cdf_after  = cdf_maker(histogram_after , Math.max.apply(null, histogram_after));

            dataBefore.push({
                type: "line",
                label: "blue-channel-cdf",
                data: cdf_before,
                borderColor: "rgb(0, 0, 255)"
            });
            dataAfter.push({
                type: "line",
                label: "blue-channel-cdf",
                data: cdf_after,
                borderColor: "rgb(0, 0, 255)"
            });
        }

        if (isRenderingGreenCdf) {
            let histogram_before = buildHistogram(inputData, "green");
            let histogram_after = buildHistogram(outputData, "green");

            let cdf_before = cdf_maker(histogram_before, Math.max.apply(null, histogram_before));
            let cdf_after  = cdf_maker(histogram_after , Math.max.apply(null, histogram_after));

            dataBefore.push({
                type: "line",
                label: "green-channel-cdf",
                data: cdf_before,
                borderColor: "rgb(0, 255, 0)"
            });
            dataAfter.push({
                type: "line",
                label: "green-channel-cdf",
                data: cdf_after,
                borderColor: "rgb(0, 255, 0)"
            });
        }

        const oldChart = initOrGetHistogram(document.getElementById("histogram-before"));
        const newChart = initOrGetHistogram(document.getElementById("histogram-after"));

        updateHistogram(oldChart, dataBefore);
        updateHistogram(newChart, dataAfter);
    }


}(window.imageproc = window.imageproc || {}));
