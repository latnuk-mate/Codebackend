// We are using Filepond library and Plugins to make the file upload easy.
//Filepond doesn't store file and multipart data rather a buffer object with encoded type of base64.

FilePond.registerPlugin(
FilePondPluginImagePreview, 
FilePondPluginImageResize, 
FilePondPluginFileEncode
);
FilePond.setOptions({
    stylePanelAspectRatio: 100/130,
    imageResizeTargetWidth : 100,
    imageResizeTargetHeight: 130
})
FilePond.parse(document.body);