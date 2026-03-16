const latinInput = document.getElementById('latinInput');
const cyrillicOutput = document.getElementById('cyrillicOutput');
const copyBtn = document.getElementById('copyBtn');
const versionSpan = document.getElementById('app-version');

const manifestData = browser.runtime.getManifest();
versionSpan.textContent = manifestData.version;

latinInput.addEventListener('input', () => {
  cyrillicOutput.value = convertText(latinInput.value);
});

copyBtn.addEventListener('click', async () => {
  const textToCopy = cyrillicOutput.value;
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

latinInput.focus();