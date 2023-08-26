
export const resizeProjectImages = async (file, targetWidth, targetHeight) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = function (e) {
      img.src = e.target.result;

      img.onload = async function () {
        const originalWidth = img.width;
        const originalHeight = img.height;

        const scaleFactorWidth = targetWidth / originalWidth;
        const scaleFactorHeight = targetHeight / originalHeight;
        const scaleFactor = Math.max(scaleFactorWidth, scaleFactorHeight);

        const newWidth = originalWidth * scaleFactor;
        const newHeight = originalHeight * scaleFactor;

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        canvas.width = targetWidth;
        canvas.height = targetHeight;

        const offsetX = (targetWidth - newWidth) / 2;
        const offsetY = (targetHeight - newHeight) / 2;

        ctx.drawImage(img, offsetX, offsetY, newWidth, newHeight);

        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg", 1.0);
      };

      img.onerror = function (error) {
        reject(error);
      };
    };

    reader.onerror = function (error) {
      reject(error);
    };

    reader.readAsDataURL(file);
  });
};
