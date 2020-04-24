// PDF welches sich im Ordner befindet
const url = "Hallo.pdf";

let pdfDoc = null,
    pageNum = 1,
    pageIsRendering = false,
    pageNumIsPending = null;

const scale = 1.5,
      canvas = document.querySelector('#pdf-render'),
      ctx = canvas.getContext('2d');



// Rendert die Seite
const renderPage = num => {
  pageIsRendering = true;

  // Nimm Seite
  pdfDoc.getPage(num).then(page => {
    // Skalierung einstellen
    const viewport = page.getViewport({ scale });
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    const renderCtx = {
      canvasContext: ctx,
      viewport
    };

    page.render(renderCtx).promise.then(() => {
      pageIsRendering = false;

      if (pageNumIsPending !== null) {
        renderPage(pageNumIsPending);
        pageNumIsPending = null;
      }
    });

    // Aktuelle Seite ausgeben
    document.querySelector('#page-num').textContent = num;
  });
};

// Überprüfen Sie, ob Seiten gerendert wurden
const queueRenderPage = num => {
  if (pageIsRendering) {
    pageNumIsPending = num;
  } else {
    renderPage(num);
  }
};

// Vorherige Seite anzeigen
const showPrevPage = () => {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
};

// Nächste Seite anzeigen
const showNextPage = () => {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
};

// Dokument abrufen
pdfjsLib
  .getDocument(url)
  .promise.then(pdfDoc_ => {
    pdfDoc = pdfDoc_;

    document.querySelector('#page-count').textContent = pdfDoc.numPages;

    renderPage(pageNum);
  })
  .catch(err => {
    // Anzeigefehler
    const div = document.createElement('div');
    div.className = 'error';
    div.appendChild(document.createTextNode(err.message));
    document.querySelector('body').insertBefore(div, canvas);
    // Entfernt die obere navigations bar
    document.querySelector('.top-bar').style.display = 'none';
  });

  //Aus der Websetie übernommen: https://www.heise.de/tipps-tricks/JavaScript-Sleep-und-setTimeout-4060840.html
  // Pausiert quasi den for-loop und wartet bis das setTimeout Promise aufgelöst ist.
  function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
 }

  async function startTimer() {
    for (let i = 1; i <= pdfDoc.numPages-1; i++){
      //Zufällige Nummer Zwischen 3s und 6s (Just for testing)
      let interval = Math.floor(Math.random() * (6000 - 3000 + 1)) + 3000
      //Timeout für Intervallzeit
      await Sleep(interval)
      //Es wartet bis der Button betätigt wurde und dann skipt es erst.
      //Wenn es direkt nach dem Button Press skipen soll und nachher warten, muss 'showNextPage' vor 'await Sleep(interval)' funktion
      showNextPage()
      //log waited time
      console.log('skiped after ', interval);
    }
  }

// Button Events
document.querySelector('#prev-page').addEventListener('click', showPrevPage);
document.querySelector('#next-page').addEventListener('click', showNextPage,);
document.querySelector('#start-pp').addEventListener('click', startTimer);