async function generateQRCode(qrText, logoUrl, bgColor, fgColor, size, margin) {
    try {
        // Create a QR code with qrText and other parameters
        const qrCode = new QRCodeStyling({
            width: size,
            height: size,
            data: qrText,
            image: logoUrl,
            imageOptions: {
                crossOrigin: 'anonymous', // Ensure CORS support for the image
                margin: margin
            },
            dotsOptions: {
                color: fgColor,
                backgroundColor: bgColor
            }
        });

        // Apply the QR code styling to the div with id 'div-imagen'
        await qrCode.append(document.getElementById('div-imagen'));

    } catch (error) {
        console.error('Error generating QR code:', error);
    }
}
