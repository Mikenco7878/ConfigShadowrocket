BẢN GIẢI RỐI JAVASCRIPT LOCKET

Phạm vi
- Giải rối 4 file tải từ backend, lưu trong remote/decoded.
- Các file gốc trong remote/ được giữ nguyên và kiểm tra bằng SHA-256.
- Token cá nhân vẫn là <REDACTED>; không khôi phục token thật.
- fix/test.module tham chiếu 4 file JS trong remote/decoded qua link Raw
  kèm v=20261112. Các ghi chú "not connected to any module" trong header JS
  mô tả thời điểm giải mã ban đầu; hiện module test đã dùng các file này.

Phương pháp
- Đọc AST, tính hằng số và tìm vị trí xoay bảng chuỗi theo checksum.
- Giải Base64 tùy biến và thay 30.063 lời gọi tra chuỗi bằng chuỗi rõ.
- Bỏ bảng chuỗi, hàm decoder, alias và bảng chỉ số không còn được dùng.
- Rút gọn phép tính, đổi tên biến theo binding, tách biểu thức và định dạng mã.
- Tên biến được đặt lại để dễ đọc; không thể khôi phục tên do tác giả đặt trước
  khi làm rối. Chú thích tác giả được giữ lại.
- Không thay endpoint, điều kiện, schema, giá trị hay chức năng của script.
- Công cụ AST chỉ dùng local, không thêm dependency vào repository.

File
- deleteHeader.js: xóa các header conditional/ETag theo danh sách.
- Locket_minhhiep08.js: xử lý response RevenueCat.
- Locket_Unlocked.js: sửa Remote Config và tạo danh mục filter/caption.
- locket_filter_unlock.js: xử lý hồ sơ, bộ lọc, nhận diện người dùng, HTTP và
  persistent store.
- verify.test.cjs: đối chiếu bản gốc và bản giải rối bằng dữ liệu giả.
- decode-report.json: thống kê, SHA-256 input/output và kết quả kiểm tra.

Kiểm thử
Từ thư mục gốc repository:
  node --test remote/decoded/verify.test.cjs

Kết quả: PASS 35/35, gồm kiểm tra SHA-256 bản gốc và 34 ca đối chiếu hành vi.
Đã đối chiếu output $done, số lần gọi $done, HTTP mock và persistent store.
Dữ liệu gồm JSON hợp lệ, JSON hỏng, body rỗng, null/array/primitive, request và
response hook, JWT giả, cache giả và các API runtime tùy chọn.
Mọi HTTP request đều được chặn bởi stub trong bộ nhớ. Không gọi API thật,
không dùng token/cookie/Authorization hay tài khoản trên thiết bị thật.
Cả 4 file PASS node --check. Không còn định danh _0x... hoặc hàm decoder cũ.
Chưa kiểm thử trên iPhone/Shadowrocket; kết quả mock không chứng minh Gold/AI
hoạt động thật, khóa thiết bị, quyền lợi hợp lệ hay mọi payload đều được hỗ trợ.

CẢNH BÁO VỀ HÀNH VI ĐÃ CÓ TRONG MÃ GỐC
- locket_filter_unlock.js gửi UID/username qua /api/register-vip và tải danh
  sách /api/vip-users trên locket-vip.mhiep20077.workers.dev. Việc tải script
  từ Render không loại bỏ các kết nối tới Worker này.
- Script này cũng có lệnh POST changeProfileInfo sử dụng Authorization của
  request. Nhánh request changeProfileInfo trả response thành công cục bộ.
- Locket_minhhiep08.js tự tạo dữ liệu subscription/entitlement và transaction
  ID cố định, đặt hạn đến năm 9999 và trả HTTP 200, kể cả với JSON hỏng/rỗng.
  Đây không phải bằng chứng xác minh thanh toán hay quyền lợi hợp lệ.
- Locket_Unlocked.js cũng biến JSON hỏng/rỗng thành Remote Config mới; không
  có fallback giữ nguyên body trong các trường hợp đó.
- Các hành vi trên được giữ nguyên trong bản giải mã và được dùng khi bật
  fix/test.module. Kiểm thử Node.js không chạy traffic thật; cần đánh giá
  những hành vi này trước khi bật module trên thiết bị.
- Đổi link sang bản giải mã không bổ sung backend AI hay rule chuyển hướng
  generateFilteredImage. Token asset vẫn bị che, tài nguyên có thể không tải.

Rollback
Tắt Locket Test (decoded) trong Shadowrocket hoặc khôi phục script-path về
main/fix/ để dùng lại các bản đã rút gọn. Các file gốc trong remote/ không bị
sửa; không xóa remote/decoded khi module đang tham chiếu các đường dẫn đó.
