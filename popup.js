document.addEventListener('DOMContentLoaded', function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.runtime.sendMessage({command: "runScript", tabId: tabs[0].id}, function(response) {
      if(chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError.message);
        return;
      }
      var div = document.createElement('div');
      div.textContent = 'H1: ' + response.h1;
      document.body.appendChild(div);
    });
  });
});
