// src/services/adminService.ts
import apiClient from "@/lib/api/client";
import type {
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

// ======== COURSES ========

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

// ======== SCHEDULES ========

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

// ======== LAB PATHS ========

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

// ======== PREREQUISITES ========

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

// ======== PATH EDGES ========

export async function createPathEdge(
  data: CreatePathEdgeRequest
): Promise<AdminPathEdgeResponse> {
  const res = await apiClient.post("/api/admin/path-edges", data);
  return res.data.data;
}

export async function deletePathEdge(pathEdgeId: string): Promise<void> {
  await apiClient.delete(`/api/admin/path-edges/${pathEdgeId}`);
}

// ======== LECTURES ========

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
