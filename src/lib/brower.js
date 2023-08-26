
export const openOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};

export const getURL = (resource) => {
  return chrome.runtime.getURL(resource);
};

export const sendMessage = async message => {
  return chrome.runtime.sendMessage(message);
};

export const queryTabs = async (query) => {
  if (typeof chrome === 'undefined' || !chrome.tabs) {
    return [];
  }

  return chrome.tabs.query(query || {});
};

export const sendMessageToTab = async (tabID, message) => {
  return chrome.tabs.sendMessage(tabID, message);
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
