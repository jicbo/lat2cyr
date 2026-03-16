browser.runtime.onInstalled.addListener(() => {
  browser.menus.create({
    id: "convert-to-cyrillic",
    title: "Convert selection",
    contexts: ["editable"] 
  });
});

browser.menus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "convert-to-cyrillic") {
    const converted = convertText(info.selectionText);

    browser.scripting.executeScript({
      target: { tabId: tab.id },
      func: (newText) => {
        const el = document.activeElement;
        if (el.tagName === "INPUT" || el.tagName === "TEXTAREA") {
          const start = el.selectionStart;
          const end = el.selectionEnd;
          el.value = el.value.slice(0, start) + newText + el.value.slice(end);
          el.selectionStart = el.selectionEnd = start + newText.length;
        } else if (el.isContentEditable) {
          const selection = window.getSelection();
          if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(newText));
          }
        }
      },
      args: [converted]
    });
  }
});