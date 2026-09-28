browser.runtime.onInstalled.addListener(() => {
  browser.menus.create({
    id: "convert-to-cyrillic",
    title: "Convert selection",
    contexts: ["editable"] 
  });
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId !== "convert-to-cyrillic") return;

  const selected = info.selectionText;
  const tabId = tab?.id;
  if (!selected || tabId == null) return;

  const converted = convertText(selected);

  browser.scripting.executeScript({
      target: { tabId },
      func: (newText) => {
        const el = document.activeElement;
        if (!el) return;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          el.value = el.value.slice(0, start) + newText + el.value.slice(end);
          el.selectionStart = el.selectionEnd = start + newText.length;
          el.dispatchEvent(new InputEvent('input', { bubbles: true }));
        } else if (el.isContentEditable) {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
            el.dispatchEvent(new InputEvent('input', { bubbles: true }));
          }
        }
      },
      args: [converted]
    }).catch((err) => console.error('Failed to replace text: ', err));
});