import React, { useState, useEffect } from "react";
import { Share } from "@capacitor/share";
import { LocalNotifications } from "@capacitor/local-notifications";
import { Device } from "@capacitor/device";
import "./App.css";

function App() {
  const [birthDate, setBirthDate] = useState("");
  const [daysLeft, setDaysLeft] = useState(null);
  const [batteryInfo, setBatteryInfo] = useState("");

  // Lấy thông tin pin
  const getBatteryInfo = async () => {
    try {
      const info = await Device.getBatteryInfo();
      setBatteryInfo(`Pin hiện tại: ${Math.floor(info.batteryLevel * 100)}%`);
    } catch (error) {
      console.error("Lỗi lấy thông tin pin:", error);
      setBatteryInfo("Không thể lấy thông tin pin.");
    }
  };

  useEffect(() => {
    getBatteryInfo();
  }, []);

  const calculateDaysLeft = () => {
    if (!birthDate || !/^\d{1,2}\/\d{1,2}$/.test(birthDate)) {
      alert("Vui lòng nhập đúng định dạng: dd/mm");
      return;
    }
  
    const [day, month] = birthDate.split("/").map(Number);
  
    // Kiểm tra ngày tháng hợp lệ
    if (day < 1 || day > 31 || month < 1 || month > 12) {
      alert("Ngày hoặc tháng không hợp lệ!");
      return;
    }
  
    const today = new Date();
    const currentYear = today.getFullYear();
    let nextBirthday = new Date(currentYear, month - 1, day);
  
    if (today > nextBirthday) {
      nextBirthday.setFullYear(currentYear + 1);
    }
  
    const diffDays = Math.ceil((nextBirthday - today) / (1000 * 60 * 60 * 24));
    setDaysLeft(diffDays);
    showNotification(diffDays);
  };
  
  const showNotification = async (days) => {
    await LocalNotifications.requestPermissions();

    await LocalNotifications.schedule({
      notifications: [
        {
          title: "Đếm ngược sinh nhật",
          body: `Còn ${days} ngày nữa là sinh nhật bạn! 🎂`,
          id: 1,
          schedule: { at: new Date(Date.now() + 1000) }, // Hiện thông báo sau 1 giây
        },
      ],
    });
  };

  const shareResult = async () => {
    if (!daysLeft) return;

    await Share.share({
      title: "Đếm ngược sinh nhật",
      text: `Còn ${daysLeft} ngày nữa là sinh nhật của tôi! 🎉`,
      url: "https://example.com",
      dialogTitle: "Chia sẻ đếm ngược",
    });
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🎂 Đếm ngược sinh nhật 🎉</h1>
      </header>

      <div className="input-container">
        <input
          type="text"
          placeholder="Nhập ngày sinh (dd/mm)"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />
      </div>

      <button onClick={calculateDaysLeft} className="calculate-btn">
        Tính ngày còn lại
      </button>

      {daysLeft !== null && (
        <div className="result-container">
          <h2>Còn {daysLeft} ngày đến sinh nhật của bạn!</h2>
          <button onClick={shareResult} className="share-btn">
            📤 Chia sẻ kết quả
          </button>
        </div>
      )}

      <div className="battery-status">{batteryInfo}</div>
    </div>
  );
}

export default App;
