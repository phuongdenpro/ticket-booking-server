export const mappingTranslate = {
  // Enum
  FEMALE: 'Nữ',
  MALE: 'Nam',
  INACTIVATE: 'Chưa kích hoạt',
  ACTIVE: 'Đã kích hoạt',
  SUSPENSION: 'Tạm ngưng/ Khóa tài khoản',

  // base
  IDS_REQUIRE: 'Danh sách id không được để trống',
  CODES_REQUIRE: 'Danh sách code không được để trống',
  NAME_REQUIRE: 'Tên không được để trống',
  NAME_IS_STRING: 'Tên phải là chuỗi ký tự',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',
  INVALID_STRING: 'Phải là chuỗi ký tự.',
  INVALID_DATE: 'Ngày không đúng định dạng.',

  ALL: 'Tất cả',
  PASSWORD_NEW_NOT_MATCH: 'Mật khẩu xác nhận không đúng.',

  // User 21-30
  INVALID_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  INVALID_PHONE_NUMBER: 'Số điện thoại không đúng định dạng.',
  INVALID_EMAIL: 'Email không đúng định dạng.',
  USERNAME_ALREADY_EXIST: 'Tên đăng nhập đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản',
  UNAUTHORIZED: 'Không có quyền truy cập',

  // province
  PROVINCE_NOT_FOUND: 'Không tìm thấy tỉnh/thành phố',
  TO_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đi phải là số',
  FROM_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đến phải là số',

  // district
  DISTRICT_NOT_FOUND: 'Không tìm thấy quận/huyện',
  DISTRICT_TYPE_IS_STRING: 'Quận/huyện phải là chuỗi ký tự',
  DISTRICT_TYPE_LENGTH: 'Quận/huyện phải từ 1 đến 50 ký tự',

  // ward
  WARD_NOT_FOUND: 'Không tìm thấy phường/xã',

  // trip
  TRIP_NOT_FOUND: 'Không tìm thấy chuyến xe',
  TRIP_ID_REQUIRED: 'Id của chuyến đi là không được để trống',
  TRIP_ID_IS_STRING: 'Id của chuyến đi phải là chuỗi ký tự',
  TRIP_ID_INVALID: 'Id của chuyến đi không hợp lệ',
  TRIP_START_DATE_INVALID: 'Ngày bắt đầu áp dụng chuyến không đúng định dạng',
  TRIP_END_DATE_INVALID: 'Ngày kết trúc áp dụng chuyến không đúng định dạng',

  // trip detail
  DEPARTURE_DATE_REQUIRED: 'Thời gian khởi hành là không được để trống',
  DEPARTURE_DATE_INVALID: 'Thời gian khởi hành là không đúng định dạng',
  EXPECTED_DATE_REQUIRED: 'Thời gian đến là không được để trống',
  EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE:
    'Ngày đến phải lớn hơn ngày khởi hành',
  DEPARTURE_DATE_GREATER_THAN_CURRENT_DATE:
    'Ngày khởi hành phải lớn hơn ngày hiện tại',
  INVALID_TRIP_DETAIL_STATUS: 'Trang thái của chi tiết chuyến đi không hợp lệ',
  TRIP_DETAIL_STATUS_REQUIRED: 'Trang thái của chi tiết chuyến đi không hợp lệ',
  TRIP_DETAIL_NOT_FOUND: 'Không tìm thấy thông tin chuyến đi',

  // vehicle
  VEHICLE_NOT_FOUND: 'Không tìm thấy xe',
  VEHICLE_ID_REQUIRED: 'Id của xe là không được để trống',
  VEHICLE_ID_IS_STRING: 'Id của xe phải là chuỗi ký tự',
  VEHICLE_ID_INVALID: 'Id của xe không hợp lệ',
};
