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
  DESCRIPTION_IS_REQUIRED: 'Mô tả thông tin không được để trống',
  DESCRIPTION_BETWEEN_1_1000_CHARACTERS:
    'Mô tả thông tin phải từ 1 đến 1000 ký tự',
  NOTE_BETWEEN_1_1000_CHARACTERS: 'Ghi chú phải từ 1 đến 1000 ký tự',
  NOTE_IS_STRING: 'Ghi chú phải là chuỗi ký tự',
  SORT_IS_STRING: 'Giá trị sắp xếp phải là chuỗi ký tự',
  SORT_IS_ENUM: 'Giá trị sắp xếp chỉ nhận 1 trong 2 giá trị: ASC, DESC',
  GENDER_IS_STRING: 'Giới tính phảỉ là chuỗi ký tự',
  GENDER_IS_ENUM:
    'Giới tính chỉ nhận 1 trong 3 giá trị sau: MALE, FEMALE, NONE',
  PHONE_IS_STRING: 'Số điện thoại phải là chuỗi ký tự',
  EMAIL_IS_STRING: 'Email phải là chuỗi ký tự',
  NAME_BETWEEN_1_100_CHARACTERS: 'Tên phải từ 1 đến 100 ký tự',
  CODE_BETWEEN_1_10_CHARACTERS: 'Mã phải từ 1 đến 10 ký tự',
  CODE_IS_NUMBER: 'mã phải là số',
  CODE_IS_STRING: 'mã phải là chuỗi ký tự',
  CODE_IS_REQUIRED: 'Mã không được để trống',
  KEYWORDS_IS_STRING: 'Từ khóa phải là chuỗi ký tự',

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
  CUSTOMER_STATUS_IS_ENUM: 'Trạng thái khách hàng không hợp lệ',

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
  TO_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đi phải là số',
  FROM_PROVINCE_CODE_INVALID_NUMBER: 'mã tỉnh thành đến phải là số',
  CODENAME_IS_STRING: 'Mã tên phải là chuỗi ký tự',
  CODENAME_BETWEEN_1_255_CHARACTERS: 'Mã tên phải từ 1 đến 255 ký tự',
  PROVINCE_NOT_FOUND: 'Không tìm thấy tỉnh/thành phố',
  CODENAME_IS_REQUIRED: 'Mã tên phải là chuỗi ký tự',
  PROVINCE_CODE_IS_NUMBER: 'mã tỉnh thành phải là số',
  PROVINCE_CODE_IS_REQUIRED: 'mã tỉnh thành phải là số',
  PROVINCE_TYPE_IS_STRING: 'tỉnh thành phải là chuỗi ký tự',
  PROVINCE_TYPE_IS_REQUIRED: 'loại tỉnh thành không được để trống',
  PROVINCE_TYPE_BETWEEN_1_50_CHARACTERS:
    'loại tỉnh thành phải từ 1 đến 50 ký tự',

  // district
  DISTRICT_NOT_FOUND: 'Không tìm thấy quận/huyện',
  DISTRICT_TYPE_IS_STRING: 'Loại quận/huyện phải là chuỗi ký tự',
  DISTRICT_TYPE_LENGTH: 'Loại quận/huyện phải từ 1 đến 50 ký tự',
  DISTRICT_TYPE_REQUIRED: 'Loại quận/huyện không được để trống',
  DISTRICT_CODE_ID_NUMBER: 'Mã quận/huyện phải là số',
  DISTRICT_CODE_ID_REQUIRED: 'Mã quận/huyện không được để trống',

  // ward
  WARD_NOT_FOUND: 'Không tìm thấy phường/xã',
  WARD_ID_IS_REQUIRED: 'Mã phường/xã không được để trống',
  WARD_ID_IS_NUMBER: 'Mã phường/xã phải là số',
  WARD_TYPE_IS_STRING: 'Loại phường/xã phải là chuỗi ký tự',
  WARD_TYPE_BETWEEN_1_50_CHARACTERS: 'loại phường/xã phải từ 1 đến 50 ký tự',
  WARD_TYPE_IS_REQUIRED: 'loại phường/xã không được để trống',

  // station
  STATION_CODE_EXISTED: 'Mã bến xe đã tồn tại ở một bến xe khác',
  FROM_STATION_NOT_FOUND: 'Không tìm thấy bến xe đi',
  FROM_STATION_AND_TO_STATION_IS_SAME:
    'Bến xe đi và bến xe đến không được trùng nhau',
  TO_STATION_NOT_FOUND: 'Không tìm thấy bến xe đến',
  STATION_NOT_FOUND: 'Không tìm thấy bến xe',
  ADDRESS_IS_REQUIRED: 'Địa chỉ không được để trống',
  ADDRESS_IS_STRING: 'Địa chỉ phải là chuỗi ký tự',
  ADDRESS_BETWEEN_1_255_CHARACTERS: 'Địa chỉ phải từ 1 đến 255 ký tự',

  // seat
  SEAT_NOT_FOUND: 'Không tìm thấy ghế',
  SEAT_TYPE_IS_STRING: 'Loại ghế phải là chuỗi ký tự',
  SEAT_TYPE_IS_ENUM: 'Loại ghế không hợp lệ',
  FLOOR_IS_NUMBER: 'Số tầng phải là số',

  // trip
  TRIP_NOT_FOUND: 'Không tìm thấy chuyến xe',
  TRIP_ID_REQUIRED: 'Id của chuyến đi là không được để trống',
  TRIP_ID_IS_STRING: 'Id của chuyến đi phải là chuỗi ký tự',
  TRIP_ID_INVALID: 'Id của chuyến đi không hợp lệ',
  TRIP_START_DATE_INVALID: 'Ngày bắt đầu áp dụng chuyến không đúng định dạng',
  TRIP_END_DATE_INVALID: 'Ngày kết trúc áp dụng chuyến không đúng định dạng',
  START_DATE_GREATER_THAN_NOW: 'Ngày bắt đầu phải lớn hơn ngày hiện tại',
  END_DATE_GREATER_THAN_NOW: 'Ngày kết thúc phải lớn hơn ngày hiện tại',
  END_DATE_GREATER_THAN_START_DATE: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
  START_DATE_IS_REQUIRED: 'Ngày bắt đầu không được để trống',
  END_DATE_IS_REQUIRED: 'Ngày kết thúc không được để trống',
  FROM_STATION_ID_IS_REQUIRED: 'Mã bến xe đi không được để trống',
  FROM_STATION_ID_IS_STRING: 'Mã bến xe đi phải là chuỗi ký tự',
  FROM_STATION_ID_IS_36_CHARACTERS: 'Mã bến xe đi phải là 36 ký tự',
  TO_STATION_ID_IS_REQUIRED: 'Mã bến xe đi không được để trống',
  TO_STATION_ID_IS_STRING: 'Mã bến xe đi phải là chuỗi ký tự',
  TO_STATION_ID_IS_36_CHARACTERS: 'Mã bến xe đi phải là 36 ký tự',
  TRIP_IS_ACTIVE_IS_ACTIVE_IS_ENUM: 'Trạng thái chuyến đi không hợp lệ',
  START_DATE_IS_DATE: 'Ngày bắt đầu phải là ngày',
  END_DATE_IS_DATE: 'Ngày kết thúc phải là ngày',

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

  // ticket group
  TICKET_GROUP_NOT_FOUND: 'Không tìm thấy nhóm vé',
  TICKET_GROUP_ID_IS_REQUIRED: 'Id của nhóm vé là không được để trống',
  TICKET_GROUP_ID_IS_STRING: 'Id của nhóm vé phải là chuỗi ký tự',
  TICKET_GROUP_ID_IS_36_CHARACTERS: 'Id của nhóm vé phải là 36 ký tự',

  // price list
  PRICE_LIST_STATUS_INVALID:
    'Trạng thái của bảng giá không hợp lệ. Chỉ nhận 1 trong 2 giá trị: "Kích hoạt", "Tạm ngưng"',
  PRICE_LIST_STATUS_IS_STRING: 'Trạng thái của bảng giá phải là chuỗi ký tự',
  START_DATE_MUST_BE_LESS_THAN_END_DATE:
    'Ngày bắt đầu phải nhỏ hơn ngày kết thúc',
  PRICE_LIST_NOT_FOUND: 'Không tìm thấy bảng giá',
  PRICE_LIST_ID_IS_STRING: 'Id của bảng giá phải là chuỗi ký tự',
  PRICE_LIST_ID_IS_REQUIRED: 'Id của bảng giá không được để trống',
  PRICE_LIST_ID_IS_36_CHARACTERS: 'Id của bảng giá phải là 36 ký tự',

  // price details
  PRICE_DETAIL_NOT_FOUND: 'Không tìm thấy chi tiết giá',
  PRICE_IS_NUMBER: 'Giá phải là số',
  PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0: 'Giá phải lớn hơn hoặc bằng 0',
  PRICE_IS_TOO_BIG: 'Giá lớn hơn miền giá trị của double',
};
