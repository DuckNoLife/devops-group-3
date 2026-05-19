# Sử dụng Node.js bản nhẹ (alpine) làm môi trường chạy
FROM node:18-alpine

# Đặt thư mục làm việc bên trong container là /app
WORKDIR /app

# Copy các file package.json và package-lock.json vào trước
COPY package*.json ./

# Cài đặt tất cả các thư viện (bao gồm react-scripts và serve)
RUN npm install

# Copy toàn bộ code từ thư mục frontend ở máy vào trong container
COPY . .

# Chạy lệnh build để tạo ra thư mục "build" chứa các file tĩnh
RUN npm run build

# Mở cổng 3000 đúng như cấu hình trong package.json (-l 3000)
EXPOSE 3000

# Lệnh kích hoạt ứng dụng khi container khởi động
CMD ["npm", "start"]