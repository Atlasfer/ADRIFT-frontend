// ======== COURSES ========

export interface AdminCourseGroupResponse {
  semester: number;
  total_course: number;
}

export interface AdminCourseResponse {
  id: string;
  name: string;
  code: string;
  credit: number;
  semester: number;
  is_elective: boolean;
  description?: string | null;
  lab: string;
}

export interface AdminCreateCourseRequest {
  code: string;
  name: string;
  credit: number;
  semester: number;
  is_elective?: boolean;
  description?: string;
  lab: string;
}

export interface AdminUpdateCourseRequest {
  code?: string;
  name?: string;
  credit?: number;
  semester?: number;
  is_elective?: boolean;
  description?: string;
  lab?: string;
}

// ======== SCHEDULES ========

export interface AdminScheduleGroupResponse {
  academic_year: string;
  term: string;
  prodi: string;
  semester: number;
}

export interface AdminScheduleResponse {
  id: string;
  course_name: string;
  lecture_name: string;
  class: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  semester: number;
  academic_year: string;
  capacity: number;
  sks: number;
  prodi: string;
  term: string;
}

export interface AdminCreateScheduleRequest {
  course_name: string;
  lecture_id: string;
  class: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  semester: number;
  academic_year: string;
  capacity: number;
  sks: number;
  prodi: string;
  term: string;
}

export interface AdminUpdateScheduleRequest {
  course_name?: string;
  lecture_id?: string;
  class?: string;
  day?: string;
  start_time?: string;
  end_time?: string;
  room?: string;
  semester?: number;
  academic_year?: string;
  capacity?: number;
  sks?: number;
  prodi?: string;
  term?: string;
}

// ======== LAB PATHS ========

export interface AdminLabPathResponse {
  id: string;
  name: string;
  color: string;
}

export interface CreateLabPathRequest {
  name: string;
  color: string;
}

export interface UpdateLabPathRequest {
  name?: string;
  color?: string;
}

// ======== PREREQUISITES ========

export interface AdminPrerequisiteResponse {
  id: string;
  course_id: string;
  require_id: string;
}

export interface CreatePrerequisiteRequest {
  course_id: string;
  require_id: string;
}

// ======== PATH EDGES ========

export interface AdminPathEdgeResponse {
  id: string;
  from_course_id: string;
  to_course_id: string;
}

export interface CreatePathEdgeRequest {
  from_course_id: string;
  to_course_id: string;
}

// ======== LECTURES ========

export interface AdminLectureResponse {
  id: string;
  code: string;
  name: string;
}

export interface CreateLectureRequest {
  code: string;
  name: string;
}

export interface UpdateLectureRequest {
  code?: string;
  name?: string;
}

// ======== FRS (UPLOAD JADWAL) ========

export interface FrsUploadAssetResponse {
  object_key: string;
}

export interface FrsUploadScheduleRequest {
  object_key: string;
}

export interface FrsScheduleRow {
  id: string;
  course_name: string;
  lecture_code: string;
  class: string;
  day: string;
  start_time: string;
  end_time: string;
  room: string;
  semester: number | null;
  academic_year: string;
  capacity: number | null;
  sks: number | null;
  prodi: string;
  term: string;
}

export interface FrsUploadScheduleResponse {
  object_key: string;
  file_url: string;
  file_name: string;
  academic_year: string;
  term: string;
  null_records: FrsScheduleRow[] | null;
  missing_lecture_codes: string[] | null;
}

export interface FrsSubmitRequest {
  object_key: string;
  academic_year: string;
  term: string;
}
