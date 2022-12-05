import { get } from "lodash";
import React, { useCallback, useState, useEffect } from "react";
import Box from "./atoms/box.atom";
import styled from "@emotion/styled";
import { ResizableButton } from "../styled_components";
import { ClickAwayListener } from "@mui/base";
import { axiosInstance } from "../api";

const FileInput = styled.input`
  display: none;
`;

const CrossWrapper = styled(Box)`
  position: relative;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  background-color: #b8b8b8;
  width: fit-content;
  top: 5px;
  left: 10px;
  z-index: 10;
`;

const ALLOWED_FILE_TYPES = ["image/jpg", "image/png", "image/jpeg"];

export const AddImageBox = ({ handleClose, type, callback }) => {
  console.log(handleClose);
  const acceptedFormats = ALLOWED_FILE_TYPES;
  const maxFileSize = 5; //in Megabytes
  const maxNumberOfFiles = 1;
  const id = 1;
  const filesList = [];

  const getFileSizeInMb = (file) => {
    const size = file && Math.abs(file["size"] / (1024 * 1024));
    return size;
  };
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [isUploadInProgress, setUploadInProgress] = useState(false);
  const [displayImageURL, setDisplayImageURL] = useState("");
  const [imageFile, setImageFile] = useState({});
  const [isUploadComplete, setIsUploadComplete] = useState(false);
  const uploadDisabled = filesList.length === maxNumberOfFiles;

  useEffect(() => {
    setDisplayImageURL("");
    setImageFile({});
  }, []);

  function urltoFile(url, filename, mimeType) {
    return fetch(url)
      .then(function (res) {
        return res.arrayBuffer();
      })
      .then(function (buf) {
        return new File([buf], filename, { type: mimeType });
      });
  }
  const uploadImage = () => {
    handleClose();
    const data = new FormData();
    data.append("file", imageFile);
    data.append("media_type", type);
    axiosInstance
      .post("user/media/", data)
      .then(function (response) {
        console.log(response, "image");
        const profile = response.data.media_url;
        callback(profile);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  const onFileChange = useCallback(
    (event) => {
      if (uploadDisabled || isUploadInProgress) {
        return;
      }
      let uploadedFiles = event.target.files;
      if (!uploadedFiles.length) {
        return;
      }
      let showSizeExceed = false;
      let showWrongFileType = false;
      let uploadedFilesList = [];
      let errorType = "";
      for (let i = 0; i < uploadedFiles.length; ++i) {
        const sizeOfFile = getFileSizeInMb(uploadedFiles[i]);
        if (sizeOfFile > maxFileSize) {
          showSizeExceed = true;
        }
        if (
          ALLOWED_FILE_TYPES.findIndex(
            (type) => type === get(uploadedFiles[i], "type", "")
          ) === -1
        ) {
          showWrongFileType = true;
        }
        uploadedFilesList.push(uploadedFiles[i]);
      }
      const listOfWarnings = [];
      if (uploadedFiles.length + filesList.length > maxNumberOfFiles) {
        const maxImagesToBeUploaded = maxNumberOfFiles - filesList.length;
        listOfWarnings.push(
          maxImagesToBeUploaded === 1
            ? "You can only upload 1 more image.Please try again"
            : "You can only upload upto " +
                maxImagesToBeUploaded +
                " images. Please try again"
        );
        errorType = "max_num_file";
      }

      if (showSizeExceed) {
        listOfWarnings.push(
          uploadedFiles.length === 1
            ? "File size is too large. Please try again with image of size upto " +
                maxFileSize +
                " MB"
            : "File size is too large.Please try again with all images having a size of upto " +
                maxFileSize +
                " MB each"
        );
        errorType = "size_exceeded";
      }

      if (showWrongFileType) {
        listOfWarnings.push(
          "You can only upload files with format " + acceptedFormats
        );
        errorType = "wrong_file_type";
      }
      if (listOfWarnings.length > 0) {
        console.log("err");
      } else {
        setFilesToUpload(uploadedFilesList);
        setUploadInProgress(true);
        setIsUploadComplete(true);
        let imageObj = URL.createObjectURL(uploadedFilesList[0]);
        setDisplayImageURL(imageObj);
        setImageFile(uploadedFilesList[0]);
        event.target.value = "";
      }
    },
    [
      filesList,
      maxNumberOfFiles,
      maxFileSize,
      uploadDisabled,
      isUploadInProgress,
    ]
  );

  const onClose = useCallback(() => {
    setDisplayImageURL("");
    setIsUploadComplete(false);
    setFilesToUpload([]);
    setUploadInProgress(false);
  }, [setDisplayImageURL, setIsUploadComplete, setFilesToUpload]);

  return (
    <ClickAwayListener onClickAway={handleClose}>
      <Box
        display="flex"
        ml="24px"
        height="600px"
        width="500px"
        background="#000"
        position="absolute"
        top="20%"
        left="500px"
        border="1px dashed #6D5CD3"
      >
        <label>
          <FileInput
            type="file"
            onChange={onFileChange}
            id={`upload_${id}`}
            accept={acceptedFormats}
            disabled={uploadDisabled || isUploadInProgress}
          />

          <Box background="#000" borderRadius="6px">
            <Box
              bgColor="#F5F5F5"
              display="flex"
              justifyContent="center"
              alignItems="center"
              flexDirection="column"
              style={{ cursor: "pointer" }}
              width="100%"
              height="500px"
              width="490px"
              py="40px"
              px="40px"
            >
              {isUploadComplete ? (
                <Box>
                  <img src={displayImageURL} height="400px" width="300px" />
                </Box>
              ) : (
                <Box
                  pt="16px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  color="#6D5CD3"
                  fontSize="16px"
                  pb="30px"
                  width="100%"
                >
                  {"Upload Image"}
                </Box>
              )}
            </Box>
          </Box>
        </label>
        <Box
          position="absolute"
          bottom="25px"
          width="100%"
          display="flex"
          align-items="center"
          justifyContent="center"
        >
          <ResizableButton
            borderRadius="20px"
            color="#fff"
            bgColor={displayImageURL ? "#6D5CD3" : "#9c9c9c"}
            border={displayImageURL ? "1px solid #6D5CD3" : "1px solid #9c9c9c"}
            hoverColor={displayImageURL ? "#6D5CD3" : "#9c9c9c"}
            height="44px"
            width="200px"
            onClick={displayImageURL && uploadImage}
          >
            <Box fontSize="16px" fontWeight="600">
              {"Upload"}
            </Box>
          </ResizableButton>
          <Box px="10px" />
          <ResizableButton
            borderRadius="20px"
            color="#fff"
            bgColor="#6D5CD3"
            border="1px solid  #6D5CD3"
            height="44px"
            width="200px"
            onClick={onClose}
          >
            <Box fontSize="16px" fontWeight="600">
              {"Change"}
            </Box>
          </ResizableButton>
        </Box>
      </Box>
    </ClickAwayListener>
  );
};

export default AddImageBox;
