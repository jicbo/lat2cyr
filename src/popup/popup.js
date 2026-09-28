const sourceInput = document.getElementById('sourceInput');
const resultOutput = document.getElementById('resultOutput');
const copyBtn = document.getElementById('copyBtn');
const tabLat2Cyr = document.getElementById('tabLat2Cyr');
const tabCyr2Lat = document.getElementById('tabCyr2Lat');
const sourceLabel = document.getElementById('sourceLabel');
const resultLabel = document.getElementById('resultLabel');
const letterRow = document.getElementById('letterRow');
const shiftKey = document.getElementById('shiftKey');
const letterKeys = letterRow.querySelectorAll('[data-letter]');

let mode = 'lat2cyr';
let uppercase = false;

function convert() {
  resultOutput.value = mode === 'lat2cyr'
    ? convertText(sourceInput.value)
    : convertToLatin(sourceInput.value);
}

function render() {
  const lat2cyr = mode === 'lat2cyr';
  tabLat2Cyr.classList.toggle('active', lat2cyr);
  tabCyr2Lat.classList.toggle('active', !lat2cyr);
  sourceLabel.textContent = lat2cyr ? 'Latinica' : 'Ћирилица';
  resultLabel.textContent = lat2cyr ? 'Ћирилица' : 'Latinica';
  sourceInput.placeholder = lat2cyr ? 'Unesite tekst...' : 'Унесите текст...';
  letterRow.hidden = !lat2cyr;
  convert();
}

tabLat2Cyr.addEventListener('click', () => {
  mode = 'lat2cyr';
  render();
});

tabCyr2Lat.addEventListener('click', () => {
  mode = 'cyr2lat';
  render();
});

sourceInput.addEventListener('input', convert);

letterKeys.forEach((btn) => {
  btn.addEventListener('click', () => {
    const ch = uppercase ? btn.dataset.letter.toUpperCase() : btn.dataset.letter;
    const start = sourceInput.selectionStart ?? sourceInput.value.length;
    const end = sourceInput.selectionEnd ?? start;
    sourceInput.value = sourceInput.value.slice(0, start) + ch + sourceInput.value.slice(end);
    const caret = start + ch.length;
    sourceInput.selectionStart = sourceInput.selectionEnd = caret;
    sourceInput.focus();
    convert();
  });
});

shiftKey.addEventListener('click', () => {
  uppercase = !uppercase;
  shiftKey.classList.toggle('active', uppercase);
  letterKeys.forEach((btn) => {
    btn.textContent = uppercase ? btn.dataset.letter.toUpperCase() : btn.dataset.letter;
  });
  sourceInput.focus();
});

copyBtn.addEventListener('click', async () => {
  const textToCopy = resultOutput.value;
  if (!textToCopy) return;

  try {
    await navigator.clipboard.writeText(textToCopy);
    
    const originalText = copyBtn.innerText;
    copyBtn.innerText = "Copied!";
    copyBtn.classList.add('success');

    setTimeout(() => {
      copyBtn.innerText = originalText;
      copyBtn.classList.remove('success');
    }, 1500);
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
});

render();
sourceInput.focus();
