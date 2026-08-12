export interface Mistake {
	error: string;
	corrected: string;
	explanation: string;
	rule: string;
	example: string;
}

export interface EnhancedText {
	text: string;
	meaning: string;
	mistakes?: Mistake[];
}

export interface FastModeResponse {
	text: string;
	meaning: string;
}

export interface ApiError {
	error: string;
}

export type ApiResponse = EnhancedText | FastModeResponse | ApiError;
