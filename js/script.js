document.addEventListener("DOMContentLoaded", function() {
    // Create an image object

    // we have to convert image into string because some browser doesn't allow
    // converting image to base64

    // Converting an image to Base64 means encoding the image into a string of characters using the Base64 algorithm. This process transforms the binary data of the image into a format that can be safely sent or stored as text.

    const canvas = document.querySelector('canvas');
    // canvas context - 2d
    const ctx = canvas.getContext('2d');

    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = "./image/s2.png";

    canvas.width = 400;
    canvas.height = 400;

    const inputSlider = document.getElementById('resolution');
    const inputLabel = document.getElementById('resolutionLabel');

    inputSlider.addEventListener('change', handleSlider);

    class Cell {
        constructor(x, y, symbol, color){
            this.x = x;
            this.y = y;
            this.symbol = symbol;
            this.color = color;
        }

        draw(ctx){
            ctx.fillStyle = this.color;
            ctx.fillText(this.symbol, this.x, this.y);
        }
    }


    class AsciiEffect {
        #imageCellArray = [];
        #pixels = [];
        #ctx;
        #width;
        #height;

        constructor(ctx, width, height){
            this.#ctx = ctx;
            this.#width = width;
            this.#height = height;
            this.#ctx.drawImage(image, 0, 0, this.#width, this.#height);
            this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);

        }

        #convertToSymbol(g){
                 if (g > 255) return '^';

                else if (g > 250) return '@';
                else if (g > 245) return '#';
                else if (g > 240) return '$';
                else if (g > 235) return '%';
                else if (g > 230) return '&';
                else if (g > 225) return '!';
                else if (g > 220) return '*';
                else if (g > 215) return '-';
                else if (g > 210) return '_';
                else if (g > 205) return '=';
                else if (g > 200) return '+';
                else if (g > 195) return '^';
                else if (g > 190) return '"';
                else if (g > 185) return '~';
                else if (g > 180) return '|';
                else if (g > 175) return '/';
                else if (g > 170) return '\\';
                else if (g > 165) return '?';
                else if (g > 160) return '(';
                else if (g > 155) return ')';
                else if (g > 150) return '[';
                else if (g > 145) return ']';
                else if (g > 140) return '{';
                else if (g > 135) return '}';
                else if (g > 130) return '<';
                else if (g > 125) return '>';
                else if (g > 120) return ';';
                else return ' '; // Default for other cases
            }


        #scanImage(cellSize){
            this.#imageCellArray = [];

            // verticle scan
            for(let y = 0; y < this.#pixels.height; y += cellSize){
                for( let x = 0; x < this.#pixels.width; x += cellSize){

                    const posX = x * 4;
                    const posY = y * 4;
                    const pos = (posY * this.#pixels.width) + posX;

                    if (this.#pixels.data[ pos + 3] > 128){
                        const red = this.#pixels.data[pos];
                        const green = this.#pixels.data[pos + 1];
                        const blue = this.#pixels.data[pos + 2];
                        const total = red + green + blue;
                        const averageColorValue = total/3;
                        const color = `rgb(${red}, ${green}, ${blue})`;
                        const symbol = this.#convertToSymbol(averageColorValue);

                        // don't convert the black cells
                        if (total > 255) this.#imageCellArray.push(new Cell(x, y, symbol, color));

                    }


                }
            }

            console.log(this.#imageCellArray);
        }

     #drawAscii() {
            this.#ctx.clearRect(0, 0, this.#width, this.#height);
            for (let i = 0; i < this.#imageCellArray.length; i++) {
                this.#imageCellArray[i].draw(this.#ctx);
            }
        }

        draw(cellSize) {
            this.#scanImage(cellSize);
            this.#drawAscii(); // Call drawAscii after scanImage
        }
    }




    let effect;

    function handleSlider(){
        if( inputSlider.value == 1){
            inputLabel.innerHTML = 'Original image';
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        } else {
            inputLabel.innerHTML = 'Resolution: ' + inputSlider.value + 'px';
            effect.draw(parseInt(inputSlider.value));
        }

    }

    image.onload = function() {
        // ctx.drawImage(image, 0, 0);

        canvas.width = 400;
        canvas.height = 400;

        effect = new AsciiEffect(ctx, 400, 400); // Set the canvas size to 400x400
        effect.draw(6);
    }

    // Set default value of slider to 1
    inputSlider.value = 1;
    inputLabel.innerHTML = 'Original image';
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
});
