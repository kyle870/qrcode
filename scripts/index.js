
async function takeScreenshot() {
    const canvas_item = await html2canvas(document.getElementById('div-imagen'),{backgroundColor: null});

    //canvas to data url
    const imgData = canvas_item.toDataURL('image/png');

    //save screenshot
    const link = document.createElement('a');
    link.href = imgData;
    link.download = 'QR-UCN.png';
    
    // Append the link to the body and trigger the download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

async function takeScreenshotAndConvertToSVG() {
    const canvas = await html2canvas(document.getElementById('div-imagen'),{backgroundColor: null});
    const imgData = canvas.toDataURL('image/png');

    // Create an SVG element
    const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svgElement.setAttribute('width', canvas.width);
    svgElement.setAttribute('height', canvas.height);
    svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
    svgElement.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');

    // Create an image element inside the SVG
    const imageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    imageElement.setAttributeNS('http://www.w3.org/1999/xlink', 'href', imgData);
    imageElement.setAttribute('width', canvas.width);
    imageElement.setAttribute('height', canvas.height);

    // Append the image to the SVG
    svgElement.appendChild(imageElement);

    // Serialize the SVG to a string
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement);

    // Convert the SVG string to a data URL
    const svgBlob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);

    // Download the SVG
    const link = document.createElement('a');
    link.href = svgUrl;
    link.download = 'QR-UCN.svg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//*Funcion para cambiar la resolucion de un canvas
function setCanvasResolution(canvas, width, height) {
    canvas.width = width;
    canvas.height = height;
    canvas.style.width = window.screen.width; //set width to full screen
    // canvas.style.height = height + 'px';
}

//*Funcion para dibujar un rectangulo redondeado
function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
    ctx.fill();
}

//*Funcion para generar un QR con logo
function generateQRCode(text, logoSrc, fgColor = '#000000', bgColor = '#ffffff', canvasSize = 256, cornerRadius = 2) {
    const qr = qrcode(0, 'H');
    qr.addData(text);
    qr.make();

    const canvas = document.getElementById('qrcode-canvas');
    setCanvasResolution(canvas, canvasSize, canvasSize);
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    const tileW = canvas.width  / qr.getModuleCount();
    const tileH = canvas.height / qr.getModuleCount();

    // Draw background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw QR code
    for (let row = 0; row < qr.getModuleCount(); row++) {
        for (let col = 0; col < qr.getModuleCount(); col++) {
            ctx.fillStyle = qr.isDark(row, col) ? fgColor : bgColor;
            if (qr.isDark(row, col)) {
                drawRoundedRect(ctx, col * tileW, row * tileH, tileW, tileH, cornerRadius);
            }
        }
    }

    //*Draw logo
    const logo = new Image();
    logo.src = logoSrc;
    logo.onload = () => {
        //set border white to logo
        const logoSize = canvas.width * 0.3; // ajustar el tamaño del logo, es recomebdable que sea el 40% del tamaño del canvas
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;
        const radius = logoSize / 2 + 10; // Radius for the circle

        //draw logo
        ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    };

    window.onload = function() {
        document.getElementById('qrcode-canvas').style.display = 'block';
    };

}