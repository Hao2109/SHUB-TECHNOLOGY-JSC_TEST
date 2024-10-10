import { useState } from "react";
import { Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import * as XLSX from "xlsx";
import _ from "lodash";

import ExcelTable from "./ExcelTable.jsx";

const { Dragger } = Upload;

const TaskOnePage = () => {
  const [excelFile, setExcelFile] = useState();
  const [sheetName, setSheetName] = useState([]);

  const onHandlingExcelUpload = (excelFile) => {
    try {
      const reader = new FileReader();

      reader.onload = (event) => {
        const workbook = XLSX.read(event.target?.result, { type: "buffer" });

        const sheetName = workbook.SheetNames[0];

        const sheet = workbook.Sheets[sheetName];

        const sheetData = XLSX.utils.sheet_to_json(sheet);
        const sheetKey = Object.values(sheetData[4]).slice(1);
        const sheetValue = sheetData.slice(5);

        setSheetName(sheetKey);

        const customData = sheetValue.map((row) => {
          const newItem = {};

          sheetKey.forEach((key, index) => {
            const oldKey = `__EMPTY${index === 0 ? "" : `_${index}`}`;
            newItem[key] = _.has(row, oldKey) ? row[oldKey] : undefined;
          });

          return newItem;
        });

        setExcelFile(customData);
      };

      reader.readAsArrayBuffer(excelFile);
    } catch (error) {
      console.error(error);
    }
  };

  const customRequest = async (options) => {
    const { file, onSuccess, onError } = options;

    try {
      onHandlingExcelUpload(file);
      onSuccess?.();
    } catch (error) {
      onError(error);
    }
  };

  return (
    <>
      {!excelFile ? (
        <div className="flex flex-col items-center justify-center w-full h-screen">
          <Dragger
            customRequest={customRequest}
            className="p-4"
            name="file"
            accept=".xlsx"
            multiple={true}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Nhập dữ liệu từ excel</p>
            <p className="ant-upload-hint">
              Kéo thả hoặc chọn file excel từ máy bạn
            </p>
          </Dragger>
        </div>
      ) : (
        <ExcelTable
          excelFile={excelFile.map((item, index) => ({
            ...item,
            id: index + 1,
          }))}
          sheetName={sheetName}
        />
      )}
    </>
  );
};

export default TaskOnePage;
