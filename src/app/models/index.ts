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

export interface ApiError {
	error: string;
}

export type ApiResponse = EnhancedText | ApiError;
