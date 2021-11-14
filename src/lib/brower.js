
export const openOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};

export const getURL = (resource) => {
  return chrome.runtime.getURL(resource);
};

export const sendMessage = async message => {
  return new Promise(resolve => {
    chrome.runtime.sendMessage(message, response => {
      resolve(response);
    });
  });
};

export const queryTabs = async (query) => {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    return [];
  }

  return new Promise(resolve => {
    chrome.tabs.query(query || {}, tabs => {
      resolve(tabs);
    });
  });
};

export const sendMessageToTab = async (tabID, message) => {
  return new Promise(resolve => {
    chrome.tabs.sendMessage(tabID, message, response => {
      resolve(response);
    });
  });
}

export const sendMessageToTabs = async (query, message) => {
  const tabs = queryTabs(query);

  return Promise.all(tabs.map(tab => sendMessageToTab(tab.id, message)));
};

export const dispatchMessage = (message) => {
  chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    message.dispatch(req, sender, sendResponse);
  });
};
