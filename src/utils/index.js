export const debounce = function(func, wait) {
	let startTime = Date.now();
	let timer;
  
	return (...args) => {
	  if (Date.now() - startTime < wait && timer) {
		clearTimeout(timer);
	  }
	  timer = setTimeout(() => {
		func(...args);
	  }, wait);
	  startTime = Date.now();
	}
  }

// convert base64 to blob URL
export const base64toBlob = function (base64) {
  const binStr = window.atob(base64);
  const uint8Array = Uint8Array.from(binStr, (x) => x.charCodeAt(0));
  const buff = uint8Array.buffer;
  const blobURL = window.URL.createObjectURL(new Blob([buff]));
  return blobURL;
};

export const checkIslegalURL = function (url) {
  return /^(http|https):\/\//.test(url);
};
