export const mappingTranslate = {
  // Enum
  FEMALE: 'Nữ',
  MALE: 'Nam',
  INACTIVATE: 'Chưa kích hoạt',
  ACTIVE: 'Đã kích hoạt',
  SUSPENSION: 'Tạm ngưng/ Khóa tài khoản',

  // base
  IDS_REQUIRE: 'Danh sách id không được để trống',
  CODES_IS_REQUIRED: 'Danh sách code không được để trống',
  NAME_IS_REQUIRED: 'Tên không được để trống',
  NAME_IS_STRING: 'Tên phải là chuỗi ký tự',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',
  INVALID_STRING: 'Phải là chuỗi ký tự.',
  INVALID_DATE: 'Ngày không đúng định dạng.',
  DESCRIPTION_IS_STRING: 'Mô tả thông tin phải là chuỗi ký tự',
  NOTE_IS_STRING: 'Ghi chú phải là chuỗi ký tự',
  SORT_IS_STRING: 'Giá trị sắp xếp phải là chuỗi ký tự',
  GENDER_IS_STRING: 'Giới tính phảỉ là chuỗi ký tự',
  GENDER_IS_ENUM:
    'Giới tính chỉ nhận 1 trong 3 giá trị sau: MALE, FEMALE, NONE',
  SORT_IS_ENUM: 'Giá trị sắp xếp chỉ nhận 1 trong 2 giá trị: ASC, DESC',
  PHONE_IS_STRING: 'Số điện thoại phải là chuỗi ký tự',
  EMAIL_IS_STRING: 'Email phải là chuỗi ký tự',
  NAME_BETWEEN_1_100_CHARACTERS: 'Tên phải từ 1 đến 100 ký tự',

  // file
  FILE_NOT_FOUND: 'Không tìm thấy file',
  INVALID_FORMAT_IMAGE: 'Định dạng ảnh không hợp lệ',
  INVALID_FORMAT_VIDEO: 'Định dạng video không hợp lệ',
  MAX_SIZE_WARNING: 'Kích thước file quá lớn',

  ALL: 'Tất cả',
  PASSWORD_NEW_NOT_MATCH: 'Mật khẩu xác nhận không đúng.',

  // User 21-30
  INVALID_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  INVALID_PHONE_NUMBER: 'Số điện thoại không đúng định dạng.',
  INVALID_EMAIL: 'Email không đúng định dạng.',
  USERNAME_ALREADY_EXIST: 'Tên đăng nhập đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản',
  UNAUTHORIZED: 'Không có quyền truy cập',

  // customer
  CUSTOMER_NOT_FOUND: 'Không tìm thấy khách hàng',
  CUSTOMER_ID_IS_REQUIRED: 'Mã khách hàng không được để trống',
  CUSTOMER_NAME_IS_REQUIRED: 'Tên khách hàng không được để trống',
  CUSTOMER_ID_IS_STRING: 'Mã khách hàng phải là chuỗi ký tự',
  CUSTOMER_NAME_IS_STRING: 'Tên khách hàng phải là chuỗi ký tự',
  CUSTOMER_ID_MUST_BE_36_CHARACTERS: 'Mã khách hàng phải có 36 ký tự',
  CUSTOMER_ID_IS_ARRAY: 'Mã khách hàng phải là mảng',
  CUSTOMER_NOT_IN_GROUP: 'Khách hàng không thuộc nhóm khách hàng này',

  // customer group
  CUSTOMER_GROUP_NOT_FOUND: 'Không tìm thấy nhóm khách hàng',
  CUSTOMER_GROUP_ID_IS_REQUIRED: 'Mã nhóm khách hàng không được để trống',
  CUSTOMER_GROUP_ID_IS_STRING: 'Mã nhóm khách hàng phải là chuỗi ký tự',
  CUSTOMER_GROUP_NAME_IS_STRING: 'Tên nhóm khách hàng phải là chuỗi ký tự',
  CUSTOMER_GROUP_ID_MUST_BE_36_CHARACTERS:
    'Mã nhóm khách hàng phải có 36 ký tự',
  CUSTOMER_GROUP_HAS_CUSTOMER: 'Nhóm khách hàng vẫn còn khách hàng',

  // customer group detail
  CUSTOMER_ALREADY_IN_GROUP: 'Khách hàng đã tồn tại trong nhóm',

  // image resource
  INVALID_IMAGE_URL: 'url ảnh không đúng định dạng',
  INVALID_IMAGE_RESOURCE: 'Ảnh không đúng định dạng',

  // province
  PROVINCE_NOT_FOUND: 'Không tìm thấy tỉnh/thành phố',
  TO_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đi phải là số',
  FROM_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đến phải là số',
  CODENAME_IS_STRING: 'Mã tên phải là chuỗi ký tự',
  CODENAME_BETWEEN_1_255_CHARACTERS: 'Mã tên phải từ 1 đến 255 ký tự',
  PROVINCE_CODE_IS_NUMBER: 'mã tỉnh thành phải là số',

  // district
  DISTRICT_NOT_FOUND: 'Không tìm thấy quận/huyện',
  DISTRICT_TYPE_IS_STRING: 'Quận/huyện phải là chuỗi ký tự',
  DISTRICT_TYPE_LENGTH: 'Quận/huyện phải từ 1 đến 50 ký tự',
  DISTRICT_TYPE_REQUIRED: 'Quận/huyện không được để trống',

  // ward
  WARD_NOT_FOUND: 'Không tìm thấy phường/xã',

  // station
  STATION_NOT_FOUND: 'Không tìm thấy bến xe',
  FROM_STATION_NOT_FOUND: 'Không tìm thấy bến xe đi',
  TO_STATION_NOT_FOUND: 'Không tìm thấy bến xe đến',
  FROM_STATION_AND_TO_STATION_IS_SAME:
    'Bến xe đi và bến xe đến không được trùng nhau',

  // seat
  SEAT_NOT_FOUND: 'Không tìm thấy ghế',

  // trip
  TRIP_NOT_FOUND: 'Không tìm thấy chuyến xe',
  TRIP_ID_REQUIRED: 'Id của chuyến đi là không được để trống',
  TRIP_ID_IS_STRING: 'Id của chuyến đi phải là chuỗi ký tự',
  TRIP_ID_INVALID: 'Id của chuyến đi không hợp lệ',
  TRIP_START_DATE_INVALID: 'Ngày bắt đầu áp dụng chuyến không đúng định dạng',
  TRIP_END_DATE_INVALID: 'Ngày kết trúc áp dụng chuyến không đúng định dạng',
  TRIP_START_DATE_GREATER_THAN_NOW: 'Ngày bắt đầu phải lớn hơn ngày hiện tại',
  TRIP_END_DATE_GREATER_THAN_NOW: 'Ngày kết thúc phải lớn hơn ngày hiện tại',
  TRIP_END_DATE_GREATER_THAN_START_DATE:
    'Ngày kết thúc phải lớn hơn ngày bắt đầu',

  // trip detail
  DEPARTURE_DATE_REQUIRED: 'Thời gian khởi hành là không được để trống',
  DEPARTURE_DATE_INVALID: 'Thời gian khởi hành là không đúng định dạng',
  EXPECTED_DATE_REQUIRED: 'Thời gian đến là không được để trống',
  EXPECTED_DATE_GREATER_THAN_DEPARTURE_DATE:
    'Ngày đến phải lớn hơn hoặc bằng ngày khởi hành',
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
  LICENSE_PLATE_INVALID: 'Biển số xe không hợp lệ',
  FLOOR_NUMBER_INVALID: 'Số tầng không hợp lệ',
};
