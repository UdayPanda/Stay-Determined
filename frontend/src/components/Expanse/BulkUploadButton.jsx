import { useState, useRef } from "react";
import * as XLSX from "xlsx";
import EditableExcelModal from "./EditableExcelModal.jsx";

const BulkUploadButton = () => {

  const [excelData, setExcelData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fileInputRef = useRef(null);

  const handleExcelUpload = (e) => {

    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {

      const data = new Uint8Array(event.target.result);

      const workbook = XLSX.read(data, { type: "array" });

      const sheets = {};

      workbook.SheetNames.forEach((sheetName) => {

        const sheet = workbook.Sheets[sheetName];

        const json = XLSX.utils.sheet_to_json(sheet, {
          defval: ""
        });

        const headers = json.length ? Object.keys(json[0]) : [];

        sheets[sheetName] = {
          headers,
          rows: json
        };

      });

      setExcelData({
        sheetNames: workbook.SheetNames,
        sheets
      });

      setShowModal(true);

      // reset file input so same file can be uploaded again
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

    };

    reader.readAsArrayBuffer(file);
  };

  const handleCloseModal = () => {

    setShowModal(false);

    // reset data so modal loads fresh next time
    setTimeout(() => {
      setExcelData(null);
    }, 100);

  };

  return (

    <div>

      <label className="cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-md">
        Bulk Upload Excel

        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleExcelUpload}
          className="hidden"
        />

      </label>

      {showModal && excelData && (
        <EditableExcelModal
          excelData={excelData}
          onClose={handleCloseModal}
        />
      )}

    </div>
  );
};

export default BulkUploadButton;