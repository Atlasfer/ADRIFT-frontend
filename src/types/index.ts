export type NodeStatus = 'COMPLETED' | 'AVAILABLE' | 'LOCKED'
export type EdgeType = 'PREREQUISITE' | 'PATH'

export interface LabPath {
  id: string
  name: string
  color: string
}

export interface CourseNode {
  id: string
  code: string
  name: string
  credit: number
  semester: number
  is_elective: boolean
  description: string
  lab_paths: LabPath[]
  // Progress fields
  status?: NodeStatus
  grade?: string | null
  claimed_at?: string | null
}

export interface CourseEdge {
  id: string
  source: string
  target: string
  type: EdgeType
  color: string
}

export interface GraphData {
  nodes: CourseNode[]
  edges: CourseEdge[]
}

export interface Schedule {
  id: string
  class: string
  day: string
  start_time: string
  end_time: string
  lecture_name: string
  room: string
  capacity: number
}

export interface NodeDetail {
  id: string
  code: string
  name: string
  credit: number
  semester: number
  is_elective: boolean
  description: string
  lab_paths: LabPath[]
  prerequisites: Array<{
    id: string
    code: string
    name: string
    credit: number
    semester: number
  }>
  unlocks: Array<{
    id: string
    code: string
    name: string
    credit: number
    semester: number
    is_elective: boolean
  }>
  schedules_this_semester: Schedule[]
}

export interface NodeChain {
  upstream: string[]
  downstream: string[]
}

export interface ProgressSummary {
  total_courses: number
  completed: number
  available: number
  locked: number
  total_credits_completed: number
  total_credits_required: number
  current_semester_estimate: number
  enrollment_year: number
  progress_percentage: number
}

export interface ClaimResult {
  newly_available: Array<{
    course_id: string
    course_code: string
    course_name: string
    status: NodeStatus
  }>
}

export interface NodePosition {
  id: string
  x: number
  y: number
}
