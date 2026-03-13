import * as UC from '@uploadcare/file-uploader';

import './style.scss';

export const useFileUploader = (container) => {
    const MIN_PHOTOS = 3;
    const MAX_PHOTOS = 15;

    const fileUploadContainer = container.querySelector('.product__file__container');
    const fileUploadInput = container.querySelector('#pets-photos');
    const fileUploadCountInput = container.querySelector('#pets-photos-count');

    if (!fileUploadContainer || !fileUploadInput || !fileUploadCountInput) {
        console.error('File uploader: Required elements not found in the container.', {
            fileUploadContainerExists: !!fileUploadContainer,
            fileUploadInputExists: !!fileUploadInput,
            fileUploadCountInputExists: !!fileUploadCountInput,
        });
        return;
    }

    fileUploadCountInput.setAttribute('min', MIN_PHOTOS);
    fileUploadCountInput.setAttribute('max', MAX_PHOTOS);

    const triggerPlaceholder = container.querySelector('.product__file__trigger');
    const fileList = container.querySelector('.product__file__list');

    const files = {};

    const uploaderCtx = setUpUploader();
    const uploaderAPI = uploaderCtx.getAPI();

    uploaderCtx.addEventListener('file-upload-success', onFileAdded);
    uploaderCtx.addEventListener('file-removed', onFileRemoved);
    fileList.addEventListener('click', onPreviewClick);

    return () => {
        uploaderCtx.removeEventListener('file-upload-success', onFileAdded);
        uploaderCtx.removeEventListener('file-removed', onFileRemoved);
        fileList.removeEventListener('click', onPreviewClick);
    };

    function onFileAdded(event) {
        const { internalId, cdnUrl, name } = event.detail;
        files[internalId] = { internalId, cdnUrl, name };
        updateFileInput();
        renderPreviews();
    }

    function onFileRemoved(event) {
        const { internalId } = event.detail;
        const preview = fileList.querySelector(`[data-preview-id="${internalId}"]`);
        if (preview) {
            fileList.removeChild(preview);
            delete files[internalId];
            updateFileInput();
            renderPreviews();
        }
    }

    function renderPreviews() {
        fileList.innerHTML = '';

        Object.values(files).forEach(file => {
            const { internalId, cdnUrl, name } = file;
            const preview = createFIlePreview(internalId, cdnUrl, name);
            fileList.appendChild(preview);
        });
    }

    function updateFileInput() {
        const fileUrls = Object.values(files).map(file => file.cdnUrl);

        fileUploadCountInput.value = fileUrls.length;
        fileUploadInput.value = fileUrls.join(', ');
        fileUploadInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function onPreviewClick(event) {
        const target = event.target;
        if (target.closest('.product__file__preview__delete')) {
            const preview = target.closest('.product__file__preview');
            const internalId = preview.getAttribute('data-preview-id');
            uploaderAPI.removeFileByInternalId(internalId);
        }
    }

    function setUpUploader() {
        const existingContext = document.querySelector('uc-upload-ctx-provider');
        if (existingContext) {
            return existingContext;
        }

        const stylesheet = document.createElement('link');
        stylesheet.rel = 'stylesheet';
        stylesheet.href = 'https://cdn.jsdelivr.net/npm/@uploadcare/file-uploader@1/web/uc-file-uploader-regular.min.css';
        document.head.appendChild(stylesheet);

        UC.defineComponents(UC);

        const config = document.createElement('uc-config');
        config.setAttribute('ctx-name', 'my-uploader');
        config.setAttribute('pubkey', 'df9ac222f632ba196d17');
        config.setAttribute('source-list', 'local, camera');
        config.setAttribute('clearable', 'true');
        config.setAttribute('multiple', 'true');
        config.setAttribute('multiple-min', MIN_PHOTOS);
        config.setAttribute('multiple-max', MAX_PHOTOS);
        document.body.appendChild(config);

        const ctx = document.createElement('uc-upload-ctx-provider');
        ctx.setAttribute('ctx-name', 'my-uploader');
        document.body.appendChild(ctx);

        const uploadWidget = document.createElement('uc-file-uploader-regular');
        uploadWidget.setAttribute('ctx-name', 'my-uploader');
        uploadWidget.classList.add('uc-light');
        triggerPlaceholder.innerHTML = '';
        triggerPlaceholder.appendChild(uploadWidget);

        return ctx;
    }

    function createFIlePreview(internalId, cdnUrl, name) {
        const img = document.createElement('img');
        img.src = cdnUrl;
        img.alt = name;
        img.classList.add('product__file__preview__image');

        const deleteBtn = document.createElement('div');
        deleteBtn.setAttribute('role', 'button');
        deleteBtn.setAttribute('tabindex', '0');
        deleteBtn.setAttribute('aria-label', 'Delete file');
        deleteBtn.classList.add('product__file__preview__delete');
        deleteBtn.textContent = '×';

        const preview = document.createElement('div');
        preview.classList.add('product__file__preview');
        preview.appendChild(img);
        preview.appendChild(deleteBtn);
        preview.setAttribute('data-preview-id', internalId);

        return preview;
    }
};
