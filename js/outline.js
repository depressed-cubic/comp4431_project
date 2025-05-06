(function(imageproc) {
    "use strict";

    /*
     * Apply sobel edge to the input data
     */
    imageproc.sobelEdge = function(inputData, outputData, threshold) {
        console.log("Applying Sobel edge detection...");

        /* Initialize the two edge kernel Gx and Gy */
        var Gx = [
            [-1, 0, 1],
            [-2, 0, 2],
            [-1, 0, 1]
        ];
        var Gy = [
            [-1,-2,-1],
            [ 0, 0, 0],
            [ 1, 2, 1]
        ];

        /**
         * DONE: You need to write the code to apply
         * the two edge kernels appropriately
         */
        
        for (var y = 0; y < inputData.height; y++) {
            for (var x = 0; x < inputData.width; x++) {

		let r = 0
		let g = 0
		let b = 0

		const d = parseInt(3 / 2)

                for (var j = -d; j <= d; j++) {
		    for (var i = -d; i <= d; i++) {
			r += (imageproc.getPixel(inputData, x + i, y + j).r) * Gx[i + d][j + d]
			g += (imageproc.getPixel(inputData, x + i, y + j).g) * Gx[i + d][j + d]
			b += (imageproc.getPixel(inputData, x + i, y + j).b) * Gx[i + d][j + d]
		    }
		}

		let ry = 0
		let gy = 0
		let by = 0

                for (var j = -d; j <= d; j++) {
		    for (var i = -d; i <= d; i++) {
			ry += (imageproc.getPixel(inputData, x + i, y + j).r) * Gy[i + d][j + d]
			gy += (imageproc.getPixel(inputData, x + i, y + j).g) * Gy[i + d][j + d]
			by += (imageproc.getPixel(inputData, x + i, y + j).b) * Gy[i + d][j + d]
		    }
		}

                var i = (x + y * outputData.width) * 4;
                outputData.data[i]     = (Math.max(Math.min(Math.hypot(r, ry), 255), 0) < threshold) ? 0 : 255
                outputData.data[i + 1] = (Math.max(Math.min(Math.hypot(g, gy), 255), 0) < threshold) ? 0 : 255
                outputData.data[i + 2] = (Math.max(Math.min(Math.hypot(b, by), 255), 0) < threshold) ? 0 : 255
            }
        }
    } 

}(window.imageproc = window.imageproc || {}));
