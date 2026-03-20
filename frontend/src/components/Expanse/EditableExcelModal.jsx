import { useEffect, useState } from "react";
import { useAuth, useExpanse } from "../../contexts";
import { apiClient } from "../../lib/apiClient";
import { BULK_UPLOAD_EXPANSE } from "../../utils/constants";
import Toast from "../Templates/Toast";

const EditableExcelModal = ({ excelData, onClose }) => {
  const [selectedSheet, setSelectedSheet] = useState("");
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [generatedJSON, setGeneratedJSON] = useState([]);
  const [editingColumnIndex, setEditingColumnIndex] = useState(null);
  const { balance, refreshExpanses } = useExpanse();
  const { user } = useAuth();
  const userId = user?.user?.id || user?.id;
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const showToast = (message, type) => {
    setToast({ show: true, message, type });
    setTimeout(
      () => setToast((prevToast) => ({ ...prevToast, show: false })),
      3000,
    );
  };

  useEffect(() => {
    if (excelData?.sheetNames?.length) {
      loadSheet(excelData.sheetNames[0]);
    }
  }, [excelData]);

  const loadSheet = (sheetName) => {
    const sheet = excelData.sheets[sheetName];

    setSelectedSheet(sheetName);
    setColumns(sheet.headers || []);
    setRows(sheet.rows || []);
  };

  /* ---------------- AMOUNT PARSER ---------------- */

  const parseAmount = (value) => {
    if (!value) return 0;

    const cleaned = value.toString().replace(/,/g, "").trim();

    return Number(cleaned);
  };

  /* ---------------- DATE PARSER ---------------- */

  const parseDateToISO = (dateValue) => {
    if (!dateValue) return new Date().toISOString();

    const str = dateValue.toString().trim();

    if (str.includes("/")) {
      const [day, month, year] = str.split("/");

      if (day && month && year) {
        const isoDate = new Date(Number(year), Number(month) - 1, Number(day));

        return isoDate.toISOString();
      }
    }

    const parsed = new Date(str);

    if (isNaN(parsed.getTime())) {
      return new Date().toISOString();
    }

    return parsed.toISOString();
  };

  /* ---------------- BALANCE CALCULATION ---------------- */

  const calculateBalances = (dataRows) => {
    let runningBalance = Number(balance);

    return dataRows.map((row) => {
      const amount = parseAmount(row.amount);

      runningBalance += amount;

      runningBalance = Number(runningBalance.toFixed(2));

      return {
        ...row,
        balance: runningBalance,
      };
    });
  };

  /* ---------------- SORT DATASET ---------------- */

  const sortDataset = () => {
    const sortedRows = [...rows].sort((a, b) => {
      const dateA = new Date(parseDateToISO(a.date));
      const dateB = new Date(parseDateToISO(b.date));

      return dateA - dateB;
    });

    if (columns.includes("balance")) {
      setRows(calculateBalances(sortedRows));
    } else {
      setRows(sortedRows);
    }
  };

  /* ---------------- CELL EDIT ---------------- */

  const handleCellChange = (rowIndex, column, value) => {
    const updatedRows = [...rows];

    updatedRows[rowIndex] = {
      ...updatedRows[rowIndex],
      [column]: value,
    };

    if (columns.includes("balance")) {
      setRows(calculateBalances(updatedRows));
    } else {
      setRows(updatedRows);
    }
  };

  /* ---------------- ADD ROW ---------------- */

  const addRow = () => {
    const newRow = {};

    columns.forEach((col) => {
      newRow[col] = "";
    });

    const updatedRows = [...rows, newRow];

    if (columns.includes("balance")) {
      setRows(calculateBalances(updatedRows));
    } else {
      setRows(updatedRows);
    }
  };

  /* ---------------- REMOVE ROW ---------------- */

  const removeRow = (index) => {
    const updatedRows = rows.filter((_, i) => i !== index);

    if (columns.includes("balance")) {
      setRows(calculateBalances(updatedRows));
    } else {
      setRows(updatedRows);
    }
  };

  /* ---------------- ADD COLUMN ---------------- */

  const addColumn = () => {
    const name = prompt("Enter column name");

    if (!name || columns.includes(name)) return;

    const updatedColumns = [...columns, name];

    const updatedRows = rows.map((r) => ({
      ...r,
      [name]: "",
    }));

    setColumns(updatedColumns);
    setRows(updatedRows);
  };

  /* ---------------- REMOVE COLUMN ---------------- */

  const removeColumn = (index) => {
    const colName = columns[index];

    const updatedColumns = columns.filter((_, i) => i !== index);

    const updatedRows = rows.map((row) => {
      const updated = { ...row };

      delete updated[colName];

      return updated;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);
  };

  /* ---------------- RENAME COLUMN ---------------- */

  const renameColumn = (index, newName) => {
    if (!newName.trim()) return;

    const oldName = columns[index];

    const updatedColumns = [...columns];
    updatedColumns[index] = newName;

    const updatedRows = rows.map((row) => {
      const updated = { ...row };

      updated[newName] = updated[oldName];

      delete updated[oldName];

      return updated;
    });

    setColumns(updatedColumns);
    setRows(updatedRows);
    setEditingColumnIndex(null);
  };

  /* ---------------- ADD BALANCE COLUMN ---------------- */

  const addBalanceColumn = () => {
    if (columns.includes("balance")) return;

    const updatedColumns = [...columns, "balance"];

    const updatedRows = calculateBalances([...rows]);

    setColumns(updatedColumns);
    setRows(updatedRows);
  };

  /* ---------------- GENERATE JSON ---------------- */

  const buildPayload = () => {
    return rows.map((row) => {
      const rawAmount = row.amount || 0;

      const amount = parseAmount(rawAmount);

      const debit = amount < 0;
      const credit = amount > 0;

      return {
        user: userId,

        balance: Number(row.balance || 0),

        debit,

        credit,

        date: parseDateToISO(row.date),

        party: row.party || "",

        description: row.description || "",

        amount: Math.abs(amount),

        todoID: row.todoID || null,

        category: row.category || "",
      };
    });
  };

  const generateJSON = () => {
    setGeneratedJSON(buildPayload());
  };

  const handleSaveData = async () => {
    if (!userId) {
      showToast("User not found. Please login again.", "error");
      return;
    }

    const payload = generatedJSON.length ? generatedJSON : buildPayload();
    if (!payload.length) {
      showToast("No rows to upload.", "error");
      return;
    }

    try {
      await apiClient.post(BULK_UPLOAD_EXPANSE, payload, {
        headers: { "Content-Type": "application/json" },
      });

      showToast("Transactions saved successfully!", "success");
      await refreshExpanses();
      onClose?.();

    } catch (error) {
      showToast(
        error.response?.data?.message || "Transaction failed to save.",
        "error",
      );
    }
  };

  if (!excelData) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-[95%] h-[90%] overflow-scroll max-w-6xl rounded-lg p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-lg font-semibold">Excel Data Editor</h2>

          <button onClick={onClose} className="text-red-500 text-xl">
            ✕
          </button>
        </div>

        <div className="flex gap-3 mb-4 items-center">
          <label>Select Sheet:</label>

          <select
            value={selectedSheet}
            onChange={(e) => loadSheet(e.target.value)}
            className="border px-2 py-1"
          >
            {excelData.sheetNames.map((sheet) => (
              <option key={sheet}>{sheet}</option>
            ))}
          </select>

          <button
            onClick={addColumn}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            + Column
          </button>

          <button
            onClick={addRow}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            + Row
          </button>

          <button
            onClick={addBalanceColumn}
            className="bg-purple-600 text-white px-3 py-1 rounded"
          >
            Balance Column
          </button>

          <button
            onClick={sortDataset}
            className="bg-orange-500 text-white px-3 py-1 rounded"
          >
            Sort by Date
          </button>
        </div>

        <div className="overflow-auto max-h-[60vh] border">
          <table className="min-w-full text-xs border">
            <thead className="bg-gray-100">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className="border px-2 py-2">
                    <div className="flex gap-2 items-center">
                      {editingColumnIndex === index ? (
                        <input
                          autoFocus
                          defaultValue={col}
                          onBlur={(e) => renameColumn(index, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              renameColumn(index, e.target.value);
                            }
                          }}
                          className="border px-1"
                        />
                      ) : (
                        <span
                          onClick={() => setEditingColumnIndex(index)}
                          className="cursor-pointer"
                        >
                          {col}
                        </span>
                      )}

                      <button
                        onClick={() => removeColumn(index)}
                        className="text-red-500 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </th>
                ))}

                <th className="border px-2">Action</th>
              </tr>
            </thead>

            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col) => (
                    <td key={col} className="border px-2 py-1">
                      {col === "balance" ? (
                        <input
                          value={row[col] || ""}
                          readOnly
                          className="w-full bg-gray-100"
                        />
                      ) : (
                        <input
                          value={row[col] || ""}
                          onChange={(e) =>
                            handleCellChange(rowIndex, col, e.target.value)
                          }
                          className="w-full outline-none"
                        />
                      )}
                    </td>
                  ))}

                  <td className="border text-center">
                    <button
                      onClick={() => removeRow(rowIndex)}
                      className="text-red-500"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleSaveData}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>

          <button
            onClick={generateJSON}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Generate JSON
          </button>
        </div>

        {generatedJSON.length > 0 && (
          <div className="mt-6">
            {" "}
            <h3 className="font-semibold mb-2">Generated JSON</h3>{" "}
            <pre className="bg-gray-100 p-4 rounded text-sm max-h-[300px] overflow-auto">
              {" "}
              {JSON.stringify(generatedJSON, null, 2)}{" "}
            </pre>{" "}
          </div>
        )}
      </div>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          duration={3000}
          show={toast.show}
        />
      )}
    </div>
  );
};

export default EditableExcelModal;
