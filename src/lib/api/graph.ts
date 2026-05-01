import apiClient from "./client";
import { GraphData, NodeDetail, NodeChain, ProgressSummary, ClaimResult } from '@/types'

//Public
export async function getGraph(): Promise<GraphData> {
    const res = await apiClient.get('/api/graph');
    return res.data.data;
}

export async function getNodeDetail(courseId: string): Promise<NodeDetail> {
    const res = await apiClient.get(`/api/graph/nodes/${courseId}`);
    return res.data.data;
}

export async function getNodeChain(courseId: string): Promise<NodeChain> {
    const res = await apiClient.get(`/api/graph/nodes/${courseId}/chain`);
    return res.data.data;
}

//Student
export async function getProgressGraph(): Promise<GraphData> {
    const res = await apiClient.get('/api/graph/progress');
    return res.data.data;
}

export async function getProgressSummary(): Promise<ProgressSummary> {
    const res = await apiClient.get('/api/graph/progress/summary');
    return res.data.data;
}

export async function claimCourse(courseId: string, grade?: string): Promise<ClaimResult> {
    const res = await apiClient.post(`/api/graph/progress/claim/${courseId}`, { grade });
    return res.data.data;
}

export async function unclaimCourse(courseId: string): Promise<ClaimResult> {
    const res = await apiClient.delete(`/api/graph/progress/claim/${courseId}`);
    return res.data.data;
}