(function(imageproc) {
    "use strict";

    /*
     * Apply blur to the input data
     */
    imageproc.blur = function(inputData, outputData, kernelSize) {
        console.log("Applying blur...");

        // You are given a 3x3 kernel but you need to create a proper kernel
        // using the given kernel size
	
        var kernel = Array(kernelSize).fill(Array(kernelSize).fill(1))

        /**
         * DONE: You need to extend the blur effect to include different
         * kernel sizes and then apply the kernel to the entire image
         */

        // Apply the kernel to the whole image
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {
                // Use imageproc.getPixel() to get the pixel values
                // over the kernel
		let r = 0
		let g = 0
		let b = 0

		const d = parseInt(kernelSize / 2)

                for (var j = -d; j <= d; j++) {
		    for (var i = -d; i <= d; i++) {
			let pixel = imageproc.getPixel(inputData, x + i, y + j)
			r += (pixel.r) * kernel[i + d][j + d]
			g += (pixel.g) * kernel[i + d][j + d]
			b += (pixel.b) * kernel[i + d][j + d]
		    }
		}
                // Then set the blurred result to the output data
                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = r / (kernelSize * kernelSize)
                outputData.data[i + 1] = g / (kernelSize * kernelSize)
                outputData.data[i + 2] = b / (kernelSize * kernelSize)
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
