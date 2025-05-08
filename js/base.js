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

		    let mult = cum_histogram[Math.min(255, parseInt(gray))] / gray

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
		    outputData.data[i]     = Math.min(255, cum_histogram.r[inputData.data[i]])
                    outputData.data[i + 1] = Math.min(255, cum_histogram.g[inputData.data[i + 1]])
                    outputData.data[i + 2] = Math.min(255, cum_histogram.b[inputData.data[i + 2]])

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

            case "gray-a-equal": {

                const TILE_ROW = 8
                const TILE_COL = 8
                const tile_width  = parseInt(inputData.width / TILE_ROW)
                const tile_height = parseInt(inputData.height / TILE_COL)

                /**
                 *  helper to access inputData.data in 2d
                 *  @param {number} `i` index in row
                 *  @param {number} `j` index in column
                 *  @returns {number[]} array of form [r, g, b, a]
                 */
                let input_data = (i, j) => {
                    return [0, 1, 2, 3].map(k => inputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + k])
                }

                /**
                 *  helper to set output
                 *  intentionally leaves alpha value unset
                 *  @param {number} `i` index in row
                 *  @param {number} `j` index in column
                 *  @returns {(val: number) => void} a function that takes the pixel in `[r, g, b, a]` form and set the output accordingly
                 */
                let set_output = (i, j) => ((val) => {
                    let [r, g, b, ] = val 
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 0] = r
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 1] = g
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 2] = b
                })

                /**
                 * make histogram of the (x,y)-th tile
                */
                let smol_hist_maker = (x, y) => {
                    let histogram = new Array(256).fill(0);
                    
                    for (let i = x * tile_width; i < (x+1) * tile_width; i++) {
                        for (let j = y * tile_height; j < (y+1) * tile_height; j++) {
                            histogram[parseInt((input_data(i, j)[0] + input_data(i, j)[1] + input_data(i, j)[2]) / 3)]++;
                        }
                    }

                    return histogram
                }

                // let cdfs = [...Array(TILE_ROW).keys()].map(i => [...Array(TILE_COL).keys()].map(j => [i, j]))

                /**
                 * A `TILE_ROW` x `TILE_COL` array of `number[]` cdf
                */
                let cdfs = new Array(TILE_ROW).fill(0)

                for (let i = 0; i < TILE_ROW; i++) {
                    cdfs[i] = new Array(TILE_COL)
                }

                // initialize cdf for each tile
                for (let i = 0; i < TILE_ROW; i++) {
                    for (let j = 0; j < TILE_COL; j++) {
                        cdfs[i][j] = cdf_maker(smol_hist_maker(i, j))
                    }
                }

                for (let i = 0; i < inputData.width; i++) {
                    for (let j = 0; j < inputData.height; j++) {
                        let tile_x = parseInt(i / tile_width)
                        let tile_y = parseInt(j / tile_height)
                        
                        let center_x = tile_x * tile_width
                        let center_y = tile_y * tile_height

                        let pixel = input_data(i, j)

                        let gray_val = parseInt((pixel[0] + pixel[1] + pixel[2]) / 3)

                        let mult = 0
                        /**
                         * linear interpolation
                        */
                        let lerp = (f_1, f_2, x_1, x_2) => (x) => {
                            return (f_1 * (x_2 - x)  + f_2 * (x - x_1) )/ (x_2 - x_1)
                        }

                        // left
                        if (i < center_x) {

                            // top
                            if (j < center_y) {

                                // top left corner
                                if (tile_x == 0 && tile_y == 0) {
                                    mult = cdfs[tile_x][tile_y][gray_val] / 255
                                }

                                // left edge
                                else if (tile_x == 0) {
                                    let f_1 = cdfs[tile_x][tile_y-1][gray_val] 
                                    let f_2 = cdfs[tile_x][tile_y  ][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, (tile_y-1) * tile_height, tile_y * tile_height)(j) / 255
                                }
                                
                                // top edge
                                else if (tile_y == 0) {
                                    let f_1 = cdfs[tile_x-1][tile_y][gray_val] 
                                    let f_2 = cdfs[tile_x  ][tile_y][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, (tile_x-1) * tile_width, tile_x * tile_width)(i) / 255
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = cdfs[tile_x-1][tile_y-1][gray_val] 
                                    let f_1_2 = cdfs[tile_x  ][tile_y-1][gray_val] 
                                    let f_2_1 = cdfs[tile_x-1][tile_y  ][gray_val] 
                                    let f_2_2 = cdfs[tile_x  ][tile_y  ][gray_val] 

                                    let f_1 = lerp(f_1_1, f_1_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    let f_2 = lerp(f_2_1, f_2_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)

                                    mult = lerp(f_1, f_2, (tile_y-1) * tile_height, tile_y * tile_height)(j) / 255
                                }

                            }
                            // bottom
                            else {

                                // bottom left corner
                                if (tile_x == 0 && tile_y == TILE_COL - 1) {
                                    mult = cdfs[tile_x][tile_y][gray_val] / 255
                                }

                                // left edge
                                else if (tile_x == 0) {
                                    let f_1 = cdfs[tile_x][tile_y-1][gray_val] 
                                    let f_2 = cdfs[tile_x][tile_y  ][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, (tile_y-1) * tile_height, tile_y * tile_height)(j) / 255
                                }
                                
                                // bottom edge
                                else if (tile_y == TILE_COL - 1) {
                                    let f_1 = cdfs[tile_x  ][tile_y][gray_val] 
                                    let f_2 = cdfs[tile_x+1][tile_y][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, tile_x * tile_width, (tile_x+1) * tile_width)(i) / 255
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = cdfs[tile_x  ][tile_y-1][gray_val] 
                                    let f_1_2 = cdfs[tile_x+1][tile_y-1][gray_val] 
                                    let f_2_1 = cdfs[tile_x  ][tile_y  ][gray_val] 
                                    let f_2_2 = cdfs[tile_x+1][tile_y  ][gray_val] 

                                    let f_1 = lerp(f_1_1, f_1_2, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    let f_2 = lerp(f_2_1, f_2_2, tile_x * tile_width, (tile_x+1) * tile_width)(i)

                                    mult = lerp(f_1, f_2, (tile_y-1) * tile_height, tile_y * tile_height)(j) / 255
                                }
                                
                            }
                            
                        }
                        // right
                        else {
                            
                            // top
                            if (j < center_y) {

                                // top right corner
                                if (tile_x == TILE_ROW - 1 && tile_y == 0) {
                                    mult = cdfs[tile_x][tile_y][gray_val] / 255
                                }

                                // right edge
                                else if (tile_x == TILE_ROW - 1) {
                                    let f_1 = cdfs[tile_x][tile_y  ][gray_val] 
                                    let f_2 = cdfs[tile_x][tile_y+1][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, tile_y * tile_height, (tile_y+1) * tile_height)(j) / 255
                                }
                                
                                // top edge
                                else if (tile_y == 0) {
                                    let f_1 = cdfs[tile_x-1][tile_y][gray_val] 
                                    let f_2 = cdfs[tile_x  ][tile_y][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, (tile_x-1) * tile_width, tile_x * tile_width)(i) / 255
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = cdfs[tile_x-1][tile_y  ][gray_val] 
                                    let f_1_2 = cdfs[tile_x  ][tile_y  ][gray_val] 
                                    let f_2_1 = cdfs[tile_x-1][tile_y+1][gray_val] 
                                    let f_2_2 = cdfs[tile_x  ][tile_y+1][gray_val] 

                                    let f_1 = lerp(f_1_1, f_1_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    let f_2 = lerp(f_2_1, f_2_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)

                                    mult = lerp(f_1, f_2, tile_y * tile_height, (tile_y+1) * tile_height)(j) / 255
                                }

                            }
                            // bottom
                            else {

                                // bottom right corner
                                if (tile_x == TILE_ROW - 1 && tile_y == TILE_COL - 1) {
                                    mult = cdfs[tile_x][tile_y][gray_val] / 255
                                }

                                // right edge
                                else if (tile_x == TILE_ROW - 1) {
                                    let f_1 = cdfs[tile_x][tile_y  ][gray_val] 
                                    let f_2 = cdfs[tile_x][tile_y+1][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, tile_y * tile_height, (tile_y+1) * tile_height)(j) / 255
                                }
                                
                                // bottom edge
                                else if (tile_y == TILE_COL - 1) {
                                    let f_1 = cdfs[tile_x  ][tile_y][gray_val] 
                                    let f_2 = cdfs[tile_x+1][tile_y][gray_val] 
                                    
                                    mult = lerp(f_1, f_2, tile_x * tile_width, (tile_x+1) * tile_width)(i) / 255
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = cdfs[tile_x  ][tile_y  ][gray_val] 
                                    let f_1_2 = cdfs[tile_x+1][tile_y  ][gray_val] 
                                    let f_2_1 = cdfs[tile_x  ][tile_y+1][gray_val] 
                                    let f_2_2 = cdfs[tile_x+1][tile_y+1][gray_val] 

                                    let f_1 = lerp(f_1_1, f_1_2, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    let f_2 = lerp(f_2_1, f_2_2, tile_x * tile_width, (tile_x+1) * tile_width)(i)

                                    mult = lerp(f_1, f_2, tile_y * tile_height, (tile_y+1) * tile_height)(j) / 255
                                }
                            }
                            
                        }

                        set_output(i, j)(pixel.map(x => x * mult))
                    }
                }
            }
                break;

            case "color-a-equal": {

                const TILE_ROW = 8
                const TILE_COL = 8
                const tile_width  = parseInt(inputData.width / TILE_ROW)
                const tile_height = parseInt(inputData.height / TILE_COL)

                /**
                 *  helper to access inputData.data in 2d
                 *  @param {number} `i` index in row
                 *  @param {number} `j` index in column
                 *  @returns {number[]} array of form [r, g, b, a]
                 */
                let input_data = (i, j) => {
                    return [0, 1, 2, 3].map(k => inputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + k])
                }

                /**
                 *  helper to set output
                 *  intentionally leaves alpha value unset
                 *  @param {number} `i` index in row
                 *  @param {number} `j` index in column
                 *  @returns {(val: number) => void} a function that takes the pixel in `[r, g, b, a]` form and set the output accordingly
                 */
                let set_output = (i, j) => ((val) => {
                    let [r, g, b, ] = val 
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 0] = r
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 1] = g
                    outputData.data[4 * (parseInt(j) * inputData.width + parseInt(i)) + 2] = b
                })

                /**
                 * make histogram of the (x,y)-th tile
                */
                let smol_hist_maker = (x, y) => {
                    let histogram = {
                        r: new Array(256).fill(0),
                        g: new Array(256).fill(0),
                        b: new Array(256).fill(0),
                    }
                    
                    for (let i = x * tile_width; i < (x+1) * tile_width; i++) {
                        for (let j = y * tile_height; j < (y+1) * tile_height; j++) {
                            histogram.r[input_data(i, j)[0]]++;
                            histogram.g[input_data(i, j)[1]]++;
                            histogram.b[input_data(i, j)[2]]++;
                        }
                    }

                    return histogram
                }

                /**
                 * A `TILE_ROW` x `TILE_COL` array of `number[]` cdf
                */
                let cdfs = {
                    r: new Array(TILE_ROW).fill(0),
                    g: new Array(TILE_ROW).fill(0),
                    b: new Array(TILE_ROW).fill(0),
                }

                for (let i = 0; i < TILE_ROW; i++) {
                    cdfs.r[i] = new Array(TILE_COL)
                    cdfs.g[i] = new Array(TILE_COL)
                    cdfs.b[i] = new Array(TILE_COL)
                }

                // initialize cdf for each tile
                for (let i = 0; i < TILE_ROW; i++) {
                    for (let j = 0; j < TILE_COL; j++) {
                        let hist = smol_hist_maker(i, j)
                        cdfs.r[i][j] = cdf_maker(hist.r)
                        cdfs.g[i][j] = cdf_maker(hist.g)
                        cdfs.b[i][j] = cdf_maker(hist.b)
                    }
                }

                for (let i = 0; i < inputData.width; i++) {
                    for (let j = 0; j < inputData.height; j++) {
                        let tile_x = parseInt(i / tile_width)
                        let tile_y = parseInt(j / tile_height)
                        
                        let center_x = tile_x * tile_width
                        let center_y = tile_y * tile_height

                        let [r, g, b, ] = input_data(i, j)

                        /**
                         * linear interpolation
                        */
                        let lerp = (f_1, f_2, x_1, x_2) => (x) => {
                            return (f_1 * (x_2 - x)  + f_2 * (x - x_1) )/ (x_2 - x_1)
                        }

                        let new_r, new_g, new_b;

                        // left
                        if (i < center_x) {

                            // top
                            if (j < center_y) {

                                // top left corner
                                if (tile_x == 0 && tile_y == 0) {
                                    new_r = cdfs.r[tile_x][tile_y][r] 
                                    new_g = cdfs.g[tile_x][tile_y][g] 
                                    new_b = cdfs.b[tile_x][tile_y][b] 
                                }

                                // left edge
                                else if (tile_x == 0) {
                                    let f_r_1 = cdfs.r[tile_x][tile_y-1][r] 
                                    let f_r_2 = cdfs.r[tile_x][tile_y  ][r] 
                                    let f_g_1 = cdfs.g[tile_x][tile_y-1][g] 
                                    let f_g_2 = cdfs.g[tile_x][tile_y  ][g] 
                                    let f_b_1 = cdfs.b[tile_x][tile_y-1][b] 
                                    let f_b_2 = cdfs.b[tile_x][tile_y  ][b] 
                                    
                                    new_r = lerp(f_r_1, f_r_2, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_g = lerp(f_g_1, f_g_2, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_b = lerp(f_b_1, f_b_2, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                }
                                
                                // top edge
                                else if (tile_y == 0) {
                                    let f_r_1 = cdfs.r[tile_x-1][tile_y][r] 
                                    let f_g_1 = cdfs.g[tile_x-1][tile_y][g] 
                                    let f_b_1 = cdfs.b[tile_x-1][tile_y][b] 
                                    let f_r_2 = cdfs.r[tile_x][tile_y][r] 
                                    let f_g_2 = cdfs.g[tile_x][tile_y][g] 
                                    let f_b_2 = cdfs.b[tile_x][tile_y][b] 
                                    
                                    new_r = lerp(f_r_1, f_r_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    new_g = lerp(f_g_1, f_g_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    new_b = lerp(f_b_1, f_b_2, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = {
                                        r: cdfs.r[tile_x-1][tile_y-1][r],
                                        g: cdfs.g[tile_x-1][tile_y-1][g],
                                        b: cdfs.b[tile_x-1][tile_y-1][b] 
                                    }
                                    let f_1_2 = {
                                        r: cdfs.r[tile_x  ][tile_y-1][r],
                                        g: cdfs.g[tile_x  ][tile_y-1][g],
                                        b: cdfs.b[tile_x  ][tile_y-1][b] 
                                    }
                                    let f_2_1 = {
                                        r: cdfs.r[tile_x-1][tile_y  ][r],
                                        g: cdfs.g[tile_x-1][tile_y  ][g],
                                        b: cdfs.b[tile_x-1][tile_y  ][b] 
                                    }
                                    let f_2_2 = {
                                        r: cdfs.r[tile_x  ][tile_y  ][r],
                                        g: cdfs.g[tile_x  ][tile_y  ][g],
                                        b: cdfs.b[tile_x  ][tile_y  ][b] 
                                    }

                                    let f_1 = {
                                        r: lerp(f_1_1.r, f_1_2.r, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        g: lerp(f_1_1.g, f_1_2.g, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        b: lerp(f_1_1.b, f_1_2.b, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    }
                                    let f_2 = {
                                        r: lerp(f_2_1.r, f_2_2.r, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        g: lerp(f_2_1.g, f_2_2.g, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        b: lerp(f_2_1.b, f_2_2.b, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    }

                                    new_r = lerp(f_1.r, f_2.r, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                }

                            }
                            // bottom
                            else {

                                // bottom left corner
                                if (tile_x == 0 && tile_y == TILE_COL - 1) {
                                    new_r = cdfs.r[tile_x][tile_y][r]
                                    new_g = cdfs.g[tile_x][tile_y][g]
                                    new_b = cdfs.b[tile_x][tile_y][b]
                                }

                                // left edge
                                else if (tile_x == 0) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x][tile_y-1][r],
                                        g: cdfs.g[tile_x][tile_y-1][g],
                                        b: cdfs.b[tile_x][tile_y-1][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x][tile_y  ][r],
                                        g: cdfs.g[tile_x][tile_y  ][g],
                                        b: cdfs.b[tile_x][tile_y  ][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, (tile_y-1) * tile_height, tile_y * tile_height)(j)
                                }
                                
                                // bottom edge
                                else if (tile_y == TILE_COL - 1) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x+1][tile_y  ][r],
                                        g: cdfs.g[tile_x+1][tile_y  ][g],
                                        b: cdfs.b[tile_x+1][tile_y  ][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, tile_x * tile_width, (tile_x+1) * tile_width)(i) 
                                    new_g = lerp(f_1.g, f_2.g, tile_x * tile_width, (tile_x+1) * tile_width)(i) 
                                    new_b = lerp(f_1.b, f_2.b, tile_x * tile_width, (tile_x+1) * tile_width)(i) 
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = {
                                        r: cdfs.r[tile_x][tile_y-1][r],
                                        g: cdfs.g[tile_x][tile_y-1][g],
                                        b: cdfs.b[tile_x][tile_y-1][b] 
                                    }
                                    let f_1_2 = {
                                        r: cdfs.r[tile_x+1][tile_y-1][r],
                                        g: cdfs.g[tile_x+1][tile_y-1][g],
                                        b: cdfs.b[tile_x+1][tile_y-1][b] 
                                    }
                                    let f_2_1 = {
                                        r: cdfs.r[tile_x][tile_y  ][r],
                                        g: cdfs.g[tile_x][tile_y  ][g],
                                        b: cdfs.b[tile_x][tile_y  ][b] 
                                    }
                                    let f_2_2 = {
                                        r: cdfs.r[tile_x+1][tile_y  ][r],
                                        g: cdfs.g[tile_x+1][tile_y  ][g],
                                        b: cdfs.b[tile_x+1][tile_y  ][b] 
                                    }

                                    let f_1 = {
                                        r: lerp(f_1_1.r, f_1_2.r, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        g: lerp(f_1_1.g, f_1_2.g, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        b: lerp(f_1_1.b, f_1_2.b, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    }
                                    let f_2 = {
                                        r: lerp(f_2_1.r, f_2_2.r, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        g: lerp(f_2_1.g, f_2_2.g, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        b: lerp(f_2_1.b, f_2_2.b, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    }

                                    new_r = lerp(f_1.r, f_2.r, (tile_y-1) * tile_height, tile_y * tile_height)(j) 
                                    new_g = lerp(f_1.g, f_2.g, (tile_y-1) * tile_height, tile_y * tile_height)(j) 
                                    new_b = lerp(f_1.b, f_2.b, (tile_y-1) * tile_height, tile_y * tile_height)(j) 
                                }
                                
                            }
                            
                        }
                        // right
                        else {
                            
                            // top
                            if (j < center_y) {

                                // top right corner
                                if (tile_x == TILE_ROW - 1 && tile_y == 0) {
                                    new_r = cdfs.r[tile_x][tile_y][r]
                                    new_g = cdfs.g[tile_x][tile_y][g]
                                    new_b = cdfs.b[tile_x][tile_y][b]
                                }

                                // right edge
                                else if (tile_x == TILE_ROW - 1) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x][tile_y+1][r],
                                        g: cdfs.g[tile_x][tile_y+1][g],
                                        b: cdfs.b[tile_x][tile_y+1][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                }
                                
                                // top edge
                                else if (tile_y == 0) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x-1][tile_y][r],
                                        g: cdfs.g[tile_x-1][tile_y][g],
                                        b: cdfs.b[tile_x-1][tile_y][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    new_g = lerp(f_1.g, f_2.g, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    new_b = lerp(f_1.b, f_2.b, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = {
                                        r: cdfs.r[tile_x-1][tile_y][r],
                                        g: cdfs.g[tile_x-1][tile_y][g],
                                        b: cdfs.b[tile_x-1][tile_y][b] 
                                    }
                                    let f_1_2 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_2_1 = {
                                        r: cdfs.r[tile_x-1][tile_y+1][r],
                                        g: cdfs.g[tile_x-1][tile_y+1][g],
                                        b: cdfs.b[tile_x-1][tile_y+1][b] 
                                    }
                                    let f_2_2 = {
                                        r: cdfs.r[tile_x][tile_y+1][r],
                                        g: cdfs.g[tile_x][tile_y+1][g],
                                        b: cdfs.b[tile_x][tile_y+1][b] 
                                    }

                                    let f_1 = {
                                        r: lerp(f_1_1.r, f_1_2.r, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        g: lerp(f_1_1.g, f_1_2.g, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        b: lerp(f_1_1.b, f_1_2.b, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    }
                                    let f_2 = {
                                        r: lerp(f_2_1.r, f_2_2.r, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        g: lerp(f_2_1.g, f_2_2.g, (tile_x-1) * tile_width, tile_x * tile_width)(i),
                                        b: lerp(f_2_1.b, f_2_2.b, (tile_x-1) * tile_width, tile_x * tile_width)(i)
                                    }

                                    new_r = lerp(f_1.r, f_2.r, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                }

                            }
                            // bottom
                            else {

                                // bottom right corner
                                if (tile_x == TILE_ROW - 1 && tile_y == TILE_COL - 1) {
                                    new_r = cdfs.r[tile_x][tile_y][r]
                                    new_g = cdfs.g[tile_x][tile_y][g]
                                    new_b = cdfs.b[tile_x][tile_y][b]
                                }

                                // right edge
                                else if (tile_x == TILE_ROW - 1) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x][tile_y+1][r],
                                        g: cdfs.g[tile_x][tile_y+1][g],
                                        b: cdfs.b[tile_x][tile_y+1][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                }
                                
                                // bottom edge
                                else if (tile_y == TILE_COL - 1) {
                                    let f_1 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_2 = {
                                        r: cdfs.r[tile_x+1][tile_y][r],
                                        g: cdfs.g[tile_x+1][tile_y][g],
                                        b: cdfs.b[tile_x+1][tile_y][b] 
                                    }
                                    
                                    new_r = lerp(f_1.r, f_2.r, (tile_x+1) * tile_width)(i)
                                    new_g = lerp(f_1.g, f_2.g, (tile_x+1) * tile_width)(i)
                                    new_b = lerp(f_1.b, f_2.b, (tile_x+1) * tile_width)(i)
                                    
                                }

                                // otherwise 
                                else {
                                    let f_1_1 = {
                                        r: cdfs.r[tile_x][tile_y][r],
                                        g: cdfs.g[tile_x][tile_y][g],
                                        b: cdfs.b[tile_x][tile_y][b] 
                                    }
                                    let f_1_2 = {
                                        r: cdfs.r[tile_x+1][tile_y][r],
                                        g: cdfs.g[tile_x+1][tile_y][g],
                                        b: cdfs.b[tile_x+1][tile_y][b] 
                                    }
                                    let f_2_1 = {
                                        r: cdfs.r[tile_x][tile_y+1][r],
                                        g: cdfs.g[tile_x][tile_y+1][g],
                                        b: cdfs.b[tile_x][tile_y+1][b] 
                                    }
                                    let f_2_2 = {
                                        r: cdfs.r[tile_x+1][tile_y+1][r],
                                        g: cdfs.g[tile_x+1][tile_y+1][g],
                                        b: cdfs.b[tile_x+1][tile_y+1][b] 
                                    }

                                    let f_1 = {
                                        r: lerp(f_1_1.r, f_1_2.r, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        g: lerp(f_1_1.g, f_1_2.g, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        b: lerp(f_1_1.b, f_1_2.b, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    }
                                    let f_2 = {
                                        r: lerp(f_2_1.r, f_2_2.r, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        g: lerp(f_2_1.g, f_2_2.g, tile_x * tile_width, (tile_x+1) * tile_width)(i),
                                        b: lerp(f_2_1.b, f_2_2.b, tile_x * tile_width, (tile_x+1) * tile_width)(i)
                                    }

                                    new_r = lerp(f_1.r, f_2.r, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_g = lerp(f_1.g, f_2.g, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                    new_b = lerp(f_1.b, f_2.b, tile_y * tile_height, (tile_y+1) * tile_height)(j)
                                }
                            }
                            
                        }

                        set_output(i, j)([new_r, new_g, new_b, 255])
                    }
                }
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
