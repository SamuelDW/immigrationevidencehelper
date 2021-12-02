async function downloadPdf() {
    let dd = {
        content: [
            {
                text: [
                    'UKVI Immigration Evidence: ',
                    {text: 'Supporting Your Journey\n\n', fontSize: 15, bold: true, italics: true, color: '#808080'}
                ],
                style: 'header',
            },
            {
                text: [
                    {text: '100 Denison Road\n'},
                    {text: 'Pocklington\n'},
                    {text: 'East Yorkshire\n'},
                    {text: 'United Kingdom\n\n'},
                ],
            },
            {
                text: [
                    {text: 'Relationship Communication Logs\n\n', italics: true}
                ]
            },
            {
                text: [
                    {text: 'Dear Visa Officer,\n\n'},
                    {text: 'The UKVI Immigration Evidence Team can verify that the data you see before you '},
                    {text: 'was not created for the sole purpose of this letter, and that we hold no relation '},
                    {text: 'with the person submitting this document. The data seen was generated from a JSON File '},
                    {text: 'which the user will have downloaded from Skype Export History, Facebook export chats, '},
                    {text: 'or WhatsApp export chat feature.\n\n'}
                ]
            },
            {
                text: [
                    {text: 'We hope that this document will aid you in deciding the outcome of this visa application, '},
                    {text: 'and aids in showing sufficient evidence that the relationship is genuine and subsisting.\n\n'},
                ]
            },
            {
                text: [
                    {text: 'For futher information, you may contact us at: (+44) 07955 764747.\n'},
                    {text: 'Our source code can be viewed at https://github.com/SamuelDW/Conversation-Parser\n\n'}
                ]
            },
            {
                text: [
                    {text: 'Your faithfully,\n\n'},
                ]
            },
            {
                image: await getBase64Image('/assets/images/Signature.png'),
            	width: 250,
            	height: 100,
            },
            {
                text: [
                    {text: '\nSamuel Durrant-Walker\n\n'},
                    {text: 'CEO & Developer\n'},
                    {text: 'UKVI Immigration Evidence Team'},
                ]
            }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true
            },
            subheader: {
                fontSize: 15,
                bold: true
            },
        }
    }

    pdfMake.createPdf(dd).download('introduction.pdf');
}

/**
 * @see (@link https://www.ngdevelop.tech/insert-image-from-url-in-pdf-using-pdfmake/)
 * @param {String} url
 * @returns
 */
function getBase64Image(url) {
    return new Promise((resolve, reject) => {
        var img = new Image();
        img.setAttribute("crossOrigin", "anonymous");
        img.onload = () => {
          var canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          var ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0);
          var dataURL = canvas.toDataURL("image/png");
          resolve(dataURL);
        };
        img.onerror = error => {
          reject(error);
        };
        img.src = url;
      });
}

document.querySelector('#download-intro').addEventListener('click', function () {
    downloadPdf()
})
