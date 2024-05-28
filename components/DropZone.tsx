// DropZone.tsx
import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
 
interface Props {
  onFileUpload: (file: File) => void;
}
 
const DropZone: React.FC<Props> = ({ onFileUpload }) => {
  const onDrop = useCallback((acceptedFiles: any) => {
    if (acceptedFiles.length > 0) {
      onFileUpload(acceptedFiles[0]);
    }
  }, []);
 
  const { getRootProps, getInputProps } = useDropzone({ onDrop });
 
  return (
    <div id="drop_area" {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag PDF to upload <br />to selected directory</p>
    </div>
  );
};
 
export default DropZone;
