import apiClient from "@/lib/api/client";
import type {
  FrsUploadAssetResponse,
  FrsUploadScheduleResponse,
  FrsSubmitRequest,
  AdminCourseGroupResponse,
  AdminCourseResponse,
  AdminCreateCourseRequest,
  AdminUpdateCourseRequest,
  AdminScheduleGroupResponse,
  AdminScheduleResponse,
  AdminCreateScheduleRequest,
  AdminUpdateScheduleRequest,
  AdminLabPathResponse,
  CreateLabPathRequest,
  UpdateLabPathRequest,
  AdminPrerequisiteResponse,
  CreatePrerequisiteRequest,
  AdminPathEdgeResponse,
  CreatePathEdgeRequest,
  AdminLectureResponse,
  CreateLectureRequest,
  UpdateLectureRequest,
} from "@/types/admin";

// COURSES

export async function listCourseGroups(): Promise<AdminCourseGroupResponse[]> {
  const res = await apiClient.get("/api/admin/courses");
  return res.data.data;
}

export async function listCoursesBySemester(
  semester: number,
  course_name?: string
): Promise<AdminCourseResponse[]> {
  const res = await apiClient.get(`/api/admin/courses/${semester}`, {
    params: course_name ? { course_name } : {},
  });
  return res.data.data;
}

export async function createCourse(
  data: AdminCreateCourseRequest
): Promise<void> {
  await apiClient.post("/api/admin/courses", data);
}

export async function updateCourse(
  courseId: string,
  data: AdminUpdateCourseRequest
): Promise<AdminCourseResponse> {
  const res = await apiClient.patch(`/api/admin/courses/${courseId}`, data);
  return res.data.data;
}

export async function deleteCourse(courseId: string): Promise<void> {
  await apiClient.delete(`/api/admin/courses/${courseId}`);
}

// SCHEDULES

export async function listScheduleGroups(): Promise<AdminScheduleGroupResponse[]> {
  const res = await apiClient.get("/api/admin/schedules");
  return res.data.data;
}

export async function listSchedulesByFilter(params: {
  academic_year: string;
  term: string;
  prodi: string;
  semester: string;
  course_name?: string;
}): Promise<AdminScheduleResponse[]> {
  const res = await apiClient.get("/api/admin/schedules", { params });
  return res.data.data;
}

export async function createSchedule(
  data: AdminCreateScheduleRequest
): Promise<void> {
  await apiClient.post("/api/admin/schedules", data);
}

export async function updateSchedule(
  scheduleId: string,
  data: AdminUpdateScheduleRequest
): Promise<AdminScheduleResponse> {
  const res = await apiClient.patch(`/api/admin/schedules/${scheduleId}`, data);
  return res.data.data;
}

export async function deleteSchedule(scheduleId: string): Promise<void> {
  await apiClient.delete(`/api/admin/schedules/${scheduleId}`);
}

// LAB PATHS

export async function getAllLabPaths(): Promise<AdminLabPathResponse[]> {
  const res = await apiClient.get("/api/admin/lab-paths");
  return res.data.data;
}

export async function createLabPath(
  data: CreateLabPathRequest
): Promise<AdminLabPathResponse> {
  const res = await apiClient.post("/api/admin/lab-paths", data);
  return res.data.data;
}

export async function updateLabPath(
  labPathId: string,
  data: UpdateLabPathRequest
): Promise<AdminLabPathResponse> {
  const res = await apiClient.patch(`/api/admin/lab-paths/${labPathId}`, data);
  return res.data.data;
}

export async function deleteLabPath(labPathId: string): Promise<void> {
  await apiClient.delete(`/api/admin/lab-paths/${labPathId}`);
}

// PREREQUISITES

export async function listPrerequisites(courseName?: string): Promise<AdminPrerequisiteResponse[]> {
  const res = await apiClient.get("/api/admin/prerequisites", {
    params: courseName ? { course_name: courseName } : {},
  });
  return res.data.data;
}

export async function createPrerequisite(
  data: CreatePrerequisiteRequest
): Promise<AdminPrerequisiteResponse> {
  const res = await apiClient.post("/api/admin/prerequisites", data);
  return res.data.data;
}

export async function deletePrerequisite(
  courseId: string,
  requireId: string
): Promise<void> {
  await apiClient.delete(`/api/admin/prerequisites/${courseId}/${requireId}`);
}

// PATH EDGES

export async function listPathEdges(params?: { to_course?: string; from_course?: string }): Promise<AdminPathEdgeResponse[]> {
  const res = await apiClient.get("/api/admin/path-edges", { params });
  return res.data.data;
}

export async function createPathEdge(
  data: CreatePathEdgeRequest
): Promise<AdminPathEdgeResponse> {
  const res = await apiClient.post("/api/admin/path-edges", data);
  return res.data.data;
}

export async function deletePathEdge(pathEdgeId: string): Promise<void> {
  await apiClient.delete(`/api/admin/path-edges/${pathEdgeId}`);
}

// LECTURES

export async function getAllLectures(): Promise<AdminLectureResponse[]> {
  const res = await apiClient.get("/api/admin/lectures");
  return res.data.data;
}

export async function createLecture(
  data: CreateLectureRequest
): Promise<AdminLectureResponse> {
  const res = await apiClient.post("/api/admin/lectures", data);
  return res.data.data;
}

export async function updateLecture(
  lectureId: string,
  data: UpdateLectureRequest
): Promise<AdminLectureResponse> {
  const res = await apiClient.patch(`/api/admin/lectures/${lectureId}`, data);
  return res.data.data;
}

export async function deleteLecture(lectureId: string): Promise<void> {
  await apiClient.delete(`/api/admin/lectures/${lectureId}`);
}

// FRS (UPLOAD JADWAL via EXCEL)

export async function uploadFrsFile(file: File): Promise<FrsUploadAssetResponse> {
  const form = new FormData();
  form.append("file", file);
  const res = await apiClient.post("/api/admin/assets/frs/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data.data;
}

export async function previewFrsSchedule(
  data: FrsSubmitRequest
): Promise<FrsUploadScheduleResponse> {
  const res = await apiClient.post("/api/admin/schedule/upload", data);
  return res.data.data;
}

export async function reviseFrsSchedule(data: FrsSubmitRequest): Promise<void> {
  await apiClient.post("/api/admin/schedule/revise", data);
}

export async function submitFrsSchedule(data: FrsSubmitRequest): Promise<void> {
  await apiClient.post("/api/admin/schedule/submit", data);
}
