import PropTypes from "prop-types";
import { message } from "antd";
import { Button, DatePicker, Space, Table, Typography } from "antd";
import { useState } from "react";

const { RangePicker } = DatePicker;

const ExcelTable = ({ excelFile, sheetName = [] }) => {
  const [timeRange, setTimeRange] = useState();
  const [totalAmount, setTotalAmount] = useState(0);

  const columns = [
    {
      title: "STT",
      dataIndex: "id",
    },
    ...sheetName.map((name) => ({
      title: name,
      dataIndex: `${name}`,
    })),
  ];

  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return hours * 3600 + minutes * 60 + seconds; // Chuyển đổi thành giây
  };

  const onCountTotalAmount = () => {
    // Kiểm tra xem đã chọn đủ 2 thời gian chưa
    if (!timeRange || timeRange.length !== 2) {
      message.warning("Vui lòng chọn khoảng thời gian bắt đầu và kết thúc.");
      return;
    }

    try {
      const startTimeInSeconds = parseTime(timeRange[0]);
      const endTimeInSeconds = parseTime(timeRange[1]);

      const total = excelFile.reduce((sum, row) => {
        const rowTimeInSeconds = parseTime(row.Giờ);
        const amount = row["Thành tiền (VNĐ)"] || 0;

        if (
          rowTimeInSeconds < startTimeInSeconds ||
          rowTimeInSeconds > endTimeInSeconds
        ) {
          return sum; // Không tính vào tổng nếu không nằm trong khoảng
        }

        return sum + amount; // Cộng vào tổng nếu nằm trong khoảng
      }, 0);

      // Kiểm tra nếu không có khoản tiền nào được tính
      if (total === 0) {
        message.warning(
          "Không có khoản tiền nào trong khoảng thời gian đã chọn."
        );
      } else {
        setTotalAmount(total);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat("en-US").format(num); // Định dạng theo kiểu Mỹ
  };

  return (
    <div className="mx-auto">
      <Space>
        <RangePicker
          picker="time"
          onChange={(_dates, dateStrings) => setTimeRange(dateStrings)}
          className="mx-10 my-5"
        />
        <Button onClick={onCountTotalAmount} type="primary">
          Tính tiền
        </Button>

        <Typography.Text>{`TỔNG: ${formatNumber(
          totalAmount
        )} VNĐ`}</Typography.Text>
      </Space>
      <Table columns={columns} dataSource={excelFile} className="mx-10 " />
    </div>
  );
};

// Xác thực props
ExcelTable.propTypes = {
  excelFile: PropTypes.array.isRequired,
  sheetName: PropTypes.array,
};

export default ExcelTable;
