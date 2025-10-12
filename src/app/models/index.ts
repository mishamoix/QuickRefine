export interface Mistake {
	error: string;
	corrected: string;
	explanation: string;
	rule: string;
	example: string;
}

export interface EnhancedText {
	text: string;
	mistakes?: Mistake[];
}

export interface FastModeResponse {
	text: string;
}

export interface ApiError {
	error: string;
}

export type ApiResponse = EnhancedText | FastModeResponse | ApiError;
