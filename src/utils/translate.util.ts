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
  EMAIL_IS_STRING: 'Email phải là chuỗi ký tự',
  EMAIL_IS_REQUIRED: 'Email không được để trống',
  EMAIL_INVALID: 'Email không đúng định dạng',
  EMAIL_LENGTH: 'Email phải từ 6 đến 100 ký tự',
  NAME_BETWEEN_1_100_CHARACTERS: 'Tên phải từ 1 đến 100 ký tự',
  CODE_BETWEEN_1_10_CHARACTERS: 'Mã phải từ 1 đến 10 ký tự',
  CODE_IS_NUMBER: 'mã phải là số',
  CODE_IS_STRING: 'mã phải là chuỗi ký tự',
  CODE_IS_REQUIRED: 'Mã không được để trống',
  CODE_BETWEEN_1_100_CHARACTERS: 'Mã phải từ 1 đến 100 ký tự',
  KEYWORDS_IS_STRING: 'Từ khóa phải là chuỗi ký tự',
  IMAGE_IS_STRING: 'url ảnh phải là chuỗi ký tự',

  // file
  FILE_NOT_FOUND: 'Không tìm thấy file',
  INVALID_FORMAT_IMAGE: 'Định dạng ảnh không hợp lệ',
  INVALID_FORMAT_VIDEO: 'Định dạng video không hợp lệ',
  MAX_SIZE_WARNING: 'Kích thước file quá lớn',

  ALL: 'Tất cả',
  PASSWORD_NEW_NOT_MATCH: 'Mật khẩu xác nhận không đúng.',

  // User 21-30
  UNAUTHORIZED: 'Không có quyền truy cập',
  INVALID_USERNAME_OR_PASSWORD: 'Tên đăng nhập hoặc mật khẩu không đúng.',
  INVALID_PHONE_NUMBER: 'Số điện thoại không đúng định dạng.',
  INVALID_EMAIL: 'Email không đúng định dạng.',
  USERNAME_ALREADY_EXIST: 'Tên đăng nhập đã tồn tại',
  USER_NOT_FOUND: 'Không tìm thấy tài khoản',
  USER_NOT_ACTIVE: 'Tài khoản chưa được kích hoạt hoặc đã bị khóa',
  EMAIL_ALREADY_EXIST: 'Email đã tồn tại',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_IS_STRING: 'Mật khẩu phải là chuỗi ký tự',
  PASSWORD_IS_MIN_LENGTH_6: 'Mật khẩu phải có ít nhất 6 ký tự',
  PASSWORD_IS_MAX_LENGTH_255: 'Mật khẩu có tối đa 255 ký tự',
  FULL_NAME_IS_REQUIRED: 'Họ và tên không được để trống',
  FULL_NAME_IS_STRING: 'Họ và tên phải là chuỗi ký tự',
  FULL_NAME_IS_MIN_LENGTH_1: 'Họ và tên phải có ít nhất 1 ký tự',
  FULL_NAME_IS_MAX_LENGTH_255: 'Họ và tên có tối đa 255 ký tự',
  BIRTHDAY_IS_REQUIRED: 'Ngày sinh không được để trống',
  BIRTHDAY_IS_DATE: 'Ngày sinh phải là ngày tháng',
  PHONE_ALREADY_EXIST: 'Số điện thoại đã tồn tại',
  PHONE_IS_REQUIRED: 'Số điện thoại không được để trống',
  PHONE_IS_STRING: 'Số điện thoại phải là chuỗi ký tự',
  GENDER_IS_REQUIRED: 'Giới tính không được để trống',
  GENDER_IS_STRING: 'Giới tính phảỉ là chuỗi ký tự',
  GENDER_IS_ENUM:
    'Giới tính chỉ nhận 1 trong 3 giá trị sau: MALE, FEMALE, OTHER',

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
  CUSTOMER_GROUP_CODE_EXIST: 'Mã nhóm khách hàng đã tồn tại',

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
  PROVINCE_TYPE_IS_STRING: 'loại tỉnh thành phải là chuỗi ký tự',
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
  DISTRICT_CODE_EXISTED: 'Mã quận/huyện đã tồn tại',

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
  SEAT_NOT_FOUND: 'Không tìm thấy thông tin ghế',
  SEAT_TYPE_IS_STRING: 'Loại ghế phải là chuỗi ký tự',
  SEAT_TYPE_IS_ENUM: 'Loại ghế không hợp lệ',
  FLOOR_IS_NUMBER: 'Số tầng phải là số',
  SEAT_CODE_ALREADY_EXIST: 'Mã ghế này đã tồn tại',
  SEAT_FLOOR_MIN_MAX: 'Số tầng chỉ nhận 1 trong 2 giá trị: 1, 2',
  SEAT_ID_IS_STRING: 'Id ghế phải là chuỗi ký tự',
  SEAT_ID_IS_REQUIRED: 'Id ghế không được để trống',
  SEAT_ID_IS_36_CHARACTERS: 'Id ghế phải có 36 ký tự',
  SEAT_IDS_IS_ARRAY: 'danh sách id ghế phải là mảng',
  SEAT_CODE_IS_STRING: 'Mã ghế phải là chuỗi ký tự',
  SEAT_CODE_IS_REQUIRED: 'Mã ghế không được để trống',
  SEAT_CODE_IS_36_CHARACTERS: 'Mã ghế phải có 36 ký tự',
  SEAT_CODES_IS_ARRAY: 'danh sách mã ghế phải là mảng',

  // trip
  TRIP_NOT_FOUND: 'Không tìm thấy tuyến xe',
  TRIP_ID_REQUIRED: 'Id của tuyến đi là không được để trống',
  TRIP_ID_IS_STRING: 'Id của tuyến đi phải là chuỗi ký tự',
  TRIP_ID_INVALID: 'Id của tuyến đi không hợp lệ',
  TRIP_START_DATE_INVALID: 'Ngày bắt đầu áp dụng tuyến không đúng định dạng',
  TRIP_CODE_EXIST: 'Mã tuyến đi đã tồn tại',
  TRIP_END_DATE_INVALID: 'Ngày kết trúc áp dụng tuyến không đúng định dạng',
  START_DATE_GREATER_THAN_NOW: 'Ngày bắt đầu phải lớn hơn ngày hiện tại',
  END_DATE_GREATER_THAN_NOW: 'Ngày kết thúc phải lớn hơn ngày hiện tại',
  END_DATE_GREATER_THAN_START_DATE: 'Ngày kết thúc phải lớn hơn ngày bắt đầu',
  OLD_END_DATE_GREATER_THAN_START_DATE:
    'Ngày kết thúc cũ phải lớn hơn ngày bắt đầu',
  NEW_END_DATE_GREATER_THAN_START_DATE:
    'Ngày kết thúc mới phải lớn hơn ngày bắt đầu',
  START_DATE_IS_REQUIRED: 'Ngày bắt đầu không được để trống',
  END_DATE_IS_REQUIRED: 'Ngày kết thúc không được để trống',
  FROM_STATION_ID_IS_REQUIRED: 'Mã bến xe đi không được để trống',
  FROM_STATION_ID_IS_STRING: 'Mã bến xe đi phải là chuỗi ký tự',
  FROM_STATION_ID_IS_36_CHARACTERS: 'Mã bến xe đi phải là 36 ký tự',
  TO_STATION_ID_IS_REQUIRED: 'Mã bến xe đi không được để trống',
  TO_STATION_ID_IS_STRING: 'Mã bến xe đi phải là chuỗi ký tự',
  TO_STATION_ID_IS_36_CHARACTERS: 'Mã bến xe đi phải là 36 ký tự',
  TRIP_IS_ACTIVE_IS_ACTIVE_IS_ENUM: 'Trạng thái tuyến đi không hợp lệ',
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
  TRIP_DETAIL_CODE_EXIST: 'Mã chuyến đi đã tồn tại',
  TRIP_DETAIL_ID_REQUIRED: 'Id của chuyến xe là không được để trống',
  TRIP_DETAIL_ID_IS_STRING: 'Id của chuyến xe phải là chuỗi ký tự',
  TRIP_DETAIL_ID_IS_36_CHARACTERS: 'Id của chuyến xe phải có 36 ký tự',

  // vehicle
  VEHICLE_NOT_FOUND: 'Không tìm thấy xe',
  VEHICLE_ID_REQUIRED: 'Id của xe là không được để trống',
  VEHICLE_ID_IS_STRING: 'Id của xe phải là chuỗi ký tự',
  VEHICLE_ID_INVALID: 'Id của xe không hợp lệ',
  LICENSE_PLATE_INVALID: 'Biển số xe không hợp lệ',
  LICENSE_PLATE_REQUIRED: 'Biển số xe không hợp lệ',
  LICENSE_PLATE_STRING: 'Biển số xe không hợp lệ',
  LICENSE_PLATE_BETWEEN_1_20_CHARACTERS: 'Biển số xe phải có 1 đến 20 ký tự',
  FLOOR_NUMBER_INVALID: 'Số tầng không hợp lệ',
  VEHICLE_TYPE_STRING: 'Loại xe phải là chuỗi',
  VEHICLE_TYPE_IS_ENUM:
    'Loại xe phải thuộc 1 trong cái loại sau: "xe limousine", "xe giường nằm", "xe ghế ngồi", "khác"',
  VEHICLE_FLOOR_NUMBER_IS_NUMBER: 'Số tầng của xe phải là số',
  VEHICLE_FLOOR_NUMBER_MIN_MAX: 'Số tầng của xe chỉ nhận 2 giá trị: 1, 2',
  VEHICLE_TOTAL_SEAT_IS_REQUIRE: 'Tổng số ghế của xe không được để trống',
  VEHICLE_TOTAL_SEAT_IS_NUMBER: 'Tổng số ghế của xe phải là số',
  VEHICLE_TOTAL_SEAT_IS_ENUM:
    'Tổng số ghế của xe phải thuộc 1 trong các giá trị sau: 34, 44, 28',

  // ticket group
  TICKET_GROUP_NOT_FOUND: 'Không tìm thấy nhóm vé',
  TICKET_GROUP_ID_IS_REQUIRED: 'Id của nhóm vé là không được để trống',
  TICKET_GROUP_ID_IS_STRING: 'Id của nhóm vé phải là chuỗi ký tự',
  TICKET_GROUP_ID_IS_36_CHARACTERS: 'Id của nhóm vé phải là 36 ký tự',

  // ticket
  TICKET_CODE_EXISTED: 'Mã vé đã tồn tại',
  TICKET_START_DATE_IS_REQUIRED: 'Ngày vé có hiệu lực không được để trống',
  TICKET_START_DATE_GREATER_THAN_CURRENT_DATE:
    'Ngày vé có hiệu lực phải lớn hơn hoặc bằng ngày hiện tại',
  TICKET_END_DATE_IS_REQUIRED: 'Ngày vé hết hiệu lực không được để trống',
  TICKET_END_DATE_GREATER_THAN_TICKET_START_DATE:
    'Ngày vé hết hiệu lực phải lớn hơn ngày vé có hiệu lực',
  TICKET_NOT_FOUND: 'Không tìm thấy thông tin vé',
  TICKET_DETAIL_STATUS_IS_ENUM: 'Trạng thái của vé không hợp lệ',
  TICKET_ID_IS_STRING: 'Id của vé phải là chuỗi ký tự',
  TICKET_ID_IS_REQUIRED: 'Id của vé là không được để trống',
  TICKET_CODE_IS_STRING: 'Id của vé phải là chuỗi ký tự',
  TICKET_STATUS_IS_STRING: 'trạng thái của vé phải là chuỗi',
  TICKET_ID_IS_36_CHARACTERS: 'Id của vé phải là 36 ký tự',

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
  PRICE_LIST_CODE_IS_EXIST: 'mã của bảng giá đã tồn tại',

  // price details
  PRICE_DETAIL_NOT_FOUND: 'Không tìm thấy chi tiết giá',
  PRICE_IS_NUMBER: 'Giá phải là số',
  PRICE_MUST_BE_GREATER_THAN_OR_EQUAL_TO_0: 'Giá phải lớn hơn hoặc bằng 0',
  PRICE_IS_TOO_BIG: 'Giá lớn hơn miền giá trị của double',
  PRICE_DETAIL_CODE_EXISTED: 'Mã chi tiết giá đã tồn tại',

  // promotion
  BUDGET_IS_REQUIRED: 'Ngân sách không được để trống',
  BUDGET_IS_NUMBER: 'Ngân sách phải là số',
  BUDGET_MIN_0: 'Ngân sách phải lớn hơn hoặc bằng 0',
  PROMOTION_CODE_EXISTED: 'Mã khuyến mãi đã tồn tại',
  PROMOTION_TYPE_IS_STRING: 'Loại chương trình khuyến mãi phải là chuỗi ký tự',
  PROMOTION_TYPE_IS_REQUIRED: 'Chương trình khuyến mãi không được để trống',
  PROMOTION_TYPE_IS_ENUM:
    'Chương trình khuyến mãi phải thuộc 1 trong các loại sau: "Tặng sản phẩm", "Giảm giá sản phẩm (bằng tiền trực tiếp)", "Giảm giá sản phẩm (bằng phần trăm)"',
  MAX_QUANTITY_MIN_1: 'Số lượng tối đa phải lớn hơn hoặc bằng 1',
  MAX_QUANTITY_IS_REQUIRED: 'Số lượng tối đa không được để trống',
  MAX_QUANTITY_IS_NUMBER: 'Số lượng tối đa phải là số',
  MAX_QUANTITY_PER_CUSTOMER_MIN_1:
    'Số lượng tối đa cho mỗi khách hàng phải lớn hơn hoặc bằng 1',
  MAX_QUANTITY_MUST_BE_GREATER_THAN_0: 'Số lượng tối đa phải lớn hơn 0',
  MAX_QUANTITY_PER_CUSTOMER_IS_REQUIRED:
    'Số lượng tối đa cho mỗi khách hàng không được để trống',
  MAX_QUANTITY_PER_CUSTOMER_IS_NUMBER:
    'Số lượng tối đa cho mỗi khách hàng phải là số',
  MAX_QUANTITY_PER_CUSTOMER_MUST_BE_GREATER_THAN_0:
    'Số lượng tối đa cho mỗi khách hàng phải lớn hơn 0',
  MAX_QUANTITY_PER_CUSTOMER_PER_DAY_IS_REQUIRED:
    'Số lượng tối đa cho mỗi khách hàng mỗi ngày không được để trống',
  MAX_QUANTITY_PER_CUSTOMER_PER_DAY_IS_NUMBER:
    'Số lượng tối đa cho mỗi khách hàng mỗi ngày phải là số',
  MAX_QUANTITY_PER_CUSTOMER_PER_DAY_MUST_BE_GREATER_THAN_0:
    'Số lượng tối đa cho mỗi khách hàng mỗi ngày phải lớn hơn 0',
  MAX_QUANTITY_PER_CUSTOMER_PER_DAY_MIN_1:
    'Số lượng tối đa cho mỗi khách hàng mỗi ngày phải lớn hơn hoặc bằng 1',

  // order
  ORDER_NOT_FOUND: 'Không tìm thấy đơn hàng',
  ORDER_STATUS_IS_STRING: 'Trạng thái của đơn hàng phải là chuỗi ký tự',
  ORDER_STATUS_IS_ENUM: 'Trạng thái của đơn hàng không hợp lệ',
  ORDER_ID_IS_36_CHARACTERS: 'Id của đơn hàng phải là 36 ký tự',
  ORDER_ID_IS_REQUIRED: 'Id của đơn hàng không được để trống',
  ORDER_ID_IS_STRING: 'Id của đơn hàng phải là chuỗi ký tự',
  ORDER_DETAIL_NOT_FOUND: 'Không tìm thấy chi tiết đơn hàng',
};
